import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-[var(--color-accent-strong)] text-white hover:opacity-90",
    secondary:
        "border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]",
    ghost: "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
};

export function Button({
    variant = "primary",
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)] disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className ?? ""}`}
            {...props}
        />
    );
}
