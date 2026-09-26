"use server";

import { AuthError } from "next-auth";
import { unstable_rethrow } from "next/navigation";
import { signIn } from "@/lib/auth";

export async function loginAction(
    _prevState: string | null,
    formData: FormData,
) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email ||
        !password
    ) {
        return "Введите email и пароль";
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        unstable_rethrow(error);
        if (error instanceof AuthError) {
            return "Неверный email или пароль";
        }
        console.error("loginAction failed", error);
        return "Не удалось войти — сервис временно недоступен. Попробуйте позже.";
    }

    return null;
}
