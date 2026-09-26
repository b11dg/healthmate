"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function todayDate() {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

async function requireUserId() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user.id;
}

export async function logWeight(_prevState: string | null, formData: FormData) {
    const userId = await requireUserId();
    const weightKg = Number(formData.get("weightKg"));
    if (!weightKg || weightKg <= 0) return "Введите вес в кг";

    try {
        await prisma.weightLog.upsert({
            where: { userId_date: { userId, date: todayDate() } },
            create: { userId, date: todayDate(), weightKg },
            update: { weightKg },
        });
    } catch (error) {
        console.error("logWeight failed", error);
        return "Не удалось сохранить вес — сервис временно недоступен. Попробуйте позже.";
    }

    revalidatePath("/dashboard");
    return null;
}

export async function logHabit(_prevState: string | null, formData: FormData) {
    const userId = await requireUserId();
    const waterRaw = formData.get("waterMl");
    const sleepRaw = formData.get("sleepHours");
    const waterMl =
        typeof waterRaw === "string" && waterRaw ? Number(waterRaw) : undefined;
    const sleepHours =
        typeof sleepRaw === "string" && sleepRaw ? Number(sleepRaw) : undefined;

    if (waterMl === undefined && sleepHours === undefined) {
        return "Укажите воду или сон";
    }

    try {
        await prisma.habitLog.upsert({
            where: { userId_date: { userId, date: todayDate() } },
            create: { userId, date: todayDate(), waterMl, sleepHours },
            update: {
                ...(waterMl !== undefined ? { waterMl } : {}),
                ...(sleepHours !== undefined ? { sleepHours } : {}),
            },
        });
    } catch (error) {
        console.error("logHabit failed", error);
        return "Не удалось сохранить — сервис временно недоступен. Попробуйте позже.";
    }

    revalidatePath("/dashboard");
    return null;
}

export async function logMeal(_prevState: string | null, formData: FormData) {
    const userId = await requireUserId();
    const name = formData.get("name");
    const calories = Number(formData.get("calories"));
    const proteinG = formData.get("proteinG")
        ? Number(formData.get("proteinG"))
        : null;
    const fatG = formData.get("fatG") ? Number(formData.get("fatG")) : null;
    const carbsG = formData.get("carbsG")
        ? Number(formData.get("carbsG"))
        : null;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        !calories ||
        calories <= 0
    ) {
        return "Укажите название и калории";
    }

    try {
        await prisma.mealLog.create({
            data: {
                userId,
                name: name.trim(),
                calories,
                proteinG,
                fatG,
                carbsG,
            },
        });
    } catch (error) {
        console.error("logMeal failed", error);
        return "Не удалось сохранить приём пищи — сервис временно недоступен. Попробуйте позже.";
    }

    revalidatePath("/dashboard");
    return null;
}
