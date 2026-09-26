"use server";

import { AuthError } from "next-auth";
import { unstable_rethrow } from "next/navigation";
import { signIn } from "@/lib/auth";
import { createUser, UserAlreadyExistsError } from "@/lib/users";

export async function registerAction(
    _prevState: string | null,
    formData: FormData,
) {
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email ||
        !password
    ) {
        return "Введите email и пароль";
    }
    if (password.length < 8) {
        return "Пароль должен быть не короче 8 символов";
    }
    if (password !== confirmPassword) {
        return "Пароли не совпадают";
    }

    try {
        await createUser(email, password);
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return "Пользователь с таким email уже существует";
        }
        console.error("registerAction: createUser failed", error);
        return "Не удалось зарегистрироваться — сервис временно недоступен. Попробуйте позже.";
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/profile",
        });
    } catch (error) {
        unstable_rethrow(error);
        if (error instanceof AuthError) {
            return "Регистрация прошла, но вход не удался — попробуйте войти вручную";
        }
        console.error("registerAction: signIn failed", error);
        return "Регистрация прошла, но вход не удался — попробуйте войти вручную";
    }

    return null;
}
