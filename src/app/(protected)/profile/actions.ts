"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function optionalString(value: FormDataEntryValue | null) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
}

function optionalNumber(value: FormDataEntryValue | null) {
    if (typeof value !== "string" || !value.trim()) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function optionalInt(value: FormDataEntryValue | null) {
    const parsed = optionalNumber(value);
    return parsed === null ? null : Math.round(parsed);
}

export async function updateProfile(
    _prevState: string | null,
    formData: FormData,
) {
    const session = await auth();
    if (!session?.user?.id) return "Нужно войти в систему";

    const data = {
        goal: optionalString(formData.get("goal")),
        heightCm: optionalInt(formData.get("heightCm")),
        weightKg: optionalNumber(formData.get("weightKg")),
        allergies: optionalString(formData.get("allergies")),
        restrictions: optionalString(formData.get("restrictions")),
    };

    try {
        await prisma.profile.upsert({
            where: { userId: session.user.id },
            create: { userId: session.user.id, ...data },
            update: data,
        });
    } catch (error) {
        console.error("updateProfile failed", error);
        return "Не удалось сохранить профиль — сервис временно недоступен. Попробуйте позже.";
    }

    revalidatePath("/profile");
    return "Профиль сохранён";
}
