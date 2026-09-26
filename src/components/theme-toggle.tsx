"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

function emptySubscribe() {
    return () => {};
}

// Theme is only known once mounted on the client — this mirrors that without
// setState-in-effect, so the SSR pass and the first client render agree.
function useMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
}

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useMounted();

    if (!mounted) {
        return <div className="h-11 w-11" aria-hidden="true" />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={
                isDark ? "Включить светлую тему" : "Включить тёмную тему"
            }
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)]"
        >
            {isDark ? (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle
                        cx="9"
                        cy="9"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                    />
                    <path
                        d="M9 1.5v2M9 14.5v2M16.5 9h-2M3.5 9h-2M14.5 3.5l-1.4 1.4M4.9 12.6l-1.4 1.4M14.5 14.5l-1.4-1.4M4.9 5.4L3.5 4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                    />
                </svg>
            ) : (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M15.5 10.6A6.5 6.5 0 017.4 2.5a6.5 6.5 0 108.1 8.1z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </button>
    );
}
