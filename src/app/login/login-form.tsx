"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { cardClassName } from "@/components/ui/card";
import { loginAction } from "./actions";

export function LoginForm() {
    const [error, formAction, pending] = useActionState(loginAction, null);

    return (
        <form
            action={formAction}
            className={`${cardClassName} flex w-full max-w-sm flex-col gap-5`}
        >
            <div className="flex flex-col gap-1">
                <h1 className="font-heading text-xl font-bold">Вход</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Ещё нет аккаунта?{" "}
                    <Link
                        href="/register"
                        className="text-[var(--color-accent-strong)] hover:underline"
                    >
                        Зарегистрироваться
                    </Link>
                </p>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Пароль</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                />
            </div>

            <FormError message={error} />

            <Button type="submit" disabled={pending}>
                {pending ? "Входим…" : "Войти"}
            </Button>
        </form>
    );
}
