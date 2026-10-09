import { prisma } from "@/lib/prisma";

export type BadgeKey =
    | "STREAK_7"
    | "FIRST_LAB_REPORT"
    | "TRACKING_30_DAYS"
    | "FIRST_CHAT_MESSAGE";

export type Stats = {
    currentStreak: number;
    trackedDays: number;
    doneLabReports: number;
    userChatMessages: number;
};

type Badge = {
    key: BadgeKey;
    title: string;
    description: string;
    check: (stats: Stats) => boolean;
};

export const BADGES: Badge[] = [
    {
        key: "STREAK_7",
        title: "7 дней подряд",
        description: "Трекинг привычек 7 дней подряд без пропуска",
        check: (stats) => stats.currentStreak >= 7,
    },
    {
        key: "FIRST_LAB_REPORT",
        title: "Первый анализ загружен",
        description: "Загружен и обработан первый анализ крови",
        check: (stats) => stats.doneLabReports >= 1,
    },
    {
        key: "TRACKING_30_DAYS",
        title: "30 дней трекинга",
        description: "Всего 30 дней с хотя бы одной записью",
        check: (stats) => stats.trackedDays >= 30,
    },
    {
        key: "FIRST_CHAT_MESSAGE",
        title: "Первый вопрос в чате",
        description: "Задан первый вопрос AI-чату",
        check: (stats) => stats.userChatMessages >= 1,
    },
];

function dayKey(date: Date) {
    return date.toISOString().slice(0, 10);
}

export async function computeStats(userId: string): Promise<Stats> {
    const [habitDates, mealDates, doneLabReports, userChatMessages] =
        await Promise.all([
            prisma.habitLog.findMany({
                where: { userId },
                select: { date: true },
            }),
            prisma.mealLog.findMany({
                where: { userId },
                select: { eatenAt: true },
            }),
            prisma.labReport.count({ where: { userId, status: "done" } }),
            prisma.chatMessage.count({
                where: { role: "user", conversation: { userId } },
            }),
        ]);

    const activeDays = new Set<string>();
    for (const row of habitDates) activeDays.add(dayKey(row.date));
    for (const row of mealDates) activeDays.add(dayKey(row.eatenAt));

    const cursor = new Date();
    cursor.setUTCHours(0, 0, 0, 0);
    if (!activeDays.has(dayKey(cursor))) {
        // Сегодняшний день ещё не закрыт — не считаем его обрывом серии,
        // просто начинаем отсчёт со вчера.
        cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    let currentStreak = 0;
    while (activeDays.has(dayKey(cursor))) {
        currentStreak++;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    return {
        currentStreak,
        trackedDays: activeDays.size,
        doneLabReports,
        userChatMessages,
    };
}

export async function checkAndAwardAchievements(
    userId: string,
): Promise<BadgeKey[]> {
    const [stats, earned] = await Promise.all([
        computeStats(userId),
        prisma.achievement.findMany({
            where: { userId },
            select: { badgeKey: true },
        }),
    ]);
    const earnedKeys = new Set(earned.map((row) => row.badgeKey));

    const newlyEarned = BADGES.filter(
        (badge) => !earnedKeys.has(badge.key) && badge.check(stats),
    ).map((badge) => badge.key);

    if (newlyEarned.length > 0) {
        await prisma.achievement.createMany({
            data: newlyEarned.map((badgeKey) => ({ userId, badgeKey })),
            skipDuplicates: true,
        });
    }

    return newlyEarned;
}

export type AchievementsSummary = {
    currentStreak: number;
    earned: { key: BadgeKey; title: string; description: string; earnedAt: Date }[];
};

export async function getAchievementsSummary(
    userId: string,
): Promise<AchievementsSummary> {
    const [stats, rows] = await Promise.all([
        computeStats(userId),
        prisma.achievement.findMany({
            where: { userId },
            orderBy: { earnedAt: "asc" },
        }),
    ]);

    const byKey = new Map(BADGES.map((badge) => [badge.key, badge]));
    const earned = rows.flatMap((row) => {
        const badge = byKey.get(row.badgeKey as BadgeKey);
        if (!badge) return [];
        return [
            {
                key: badge.key,
                title: badge.title,
                description: badge.description,
                earnedAt: row.earnedAt,
            },
        ];
    });

    return { currentStreak: stats.currentStreak, earned };
}
