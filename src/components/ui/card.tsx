import type { HTMLAttributes } from "react";

export const cardClassName =
    "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={`${cardClassName} ${className ?? ""}`} {...props} />;
}
