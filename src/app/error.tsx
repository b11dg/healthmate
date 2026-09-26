"use client";

import { useEffect } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-16 text-center">
            <Logo iconSize={32} />
            <div className="flex flex-col gap-1">
                <h1 className="font-heading text-xl font-bold">
                    Что-то пошло не так
                </h1>
                <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">
                    Произошла непредвиденная ошибка. Попробуйте ещё раз — если
                    не поможет, вернитесь немного позже.
                </p>
            </div>
            <Button onClick={reset}>Попробовать снова</Button>
        </main>
    );
}
