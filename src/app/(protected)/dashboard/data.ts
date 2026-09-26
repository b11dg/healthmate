import { prisma } from "@/lib/prisma";

function startOfDay(date: Date) {
    return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
}

function dayKey(date: Date) {
    return date.toISOString().slice(0, 10);
}

export type DashboardSeriesPoint = {
    date: string;
    weightKg: number | null;
    waterMl: number | null;
    calories: number;
};

export async function getDashboardData(userId: string, days: number) {
    const today = startOfDay(new Date());
    const rangeStart = new Date(today);
    rangeStart.setUTCDate(rangeStart.getUTCDate() - (days - 1));

    const [weightLogs, habitLogs, mealLogs] = await Promise.all([
        prisma.weightLog.findMany({
            where: { userId, date: { gte: rangeStart } },
            orderBy: { date: "asc" },
        }),
        prisma.habitLog.findMany({
            where: { userId, date: { gte: rangeStart } },
            orderBy: { date: "asc" },
        }),
        prisma.mealLog.findMany({
            where: { userId, eatenAt: { gte: rangeStart } },
            orderBy: { eatenAt: "asc" },
        }),
    ]);

    const weightByDay = new Map(
        weightLogs.map((log) => [dayKey(log.date), log.weightKg]),
    );
    const habitByDay = new Map(habitLogs.map((log) => [dayKey(log.date), log]));
    const caloriesByDay = new Map<string, number>();
    for (const meal of mealLogs) {
        const key = dayKey(meal.eatenAt);
        caloriesByDay.set(key, (caloriesByDay.get(key) ?? 0) + meal.calories);
    }

    const series: DashboardSeriesPoint[] = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(rangeStart);
        d.setUTCDate(d.getUTCDate() + i);
        const key = dayKey(d);
        series.push({
            date: key,
            weightKg: weightByDay.get(key) ?? null,
            waterMl: habitByDay.get(key)?.waterMl ?? null,
            calories: caloriesByDay.get(key) ?? 0,
        });
    }

    const todayKey = dayKey(today);
    const todayHabit = habitByDay.get(todayKey);
    const todayMeals = mealLogs.filter(
        (meal) => dayKey(meal.eatenAt) === todayKey,
    );
    const todayTotals = todayMeals.reduce(
        (acc, meal) => ({
            calories: acc.calories + meal.calories,
            proteinG: acc.proteinG + (meal.proteinG ?? 0),
            fatG: acc.fatG + (meal.fatG ?? 0),
            carbsG: acc.carbsG + (meal.carbsG ?? 0),
        }),
        { calories: 0, proteinG: 0, fatG: 0, carbsG: 0 },
    );

    return {
        series,
        today: {
            ...todayTotals,
            waterMl: todayHabit?.waterMl ?? null,
            sleepHours: todayHabit?.sleepHours ?? null,
            weightKg: weightByDay.get(todayKey) ?? null,
        },
        todayMeals,
    };
}
