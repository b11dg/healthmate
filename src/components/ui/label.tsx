import type { LabelHTMLAttributes } from "react";

export function Label({
    className,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={`text-sm font-medium text-[var(--color-text)] ${className ?? ""}`}
            {...props}
        />
    );
}
