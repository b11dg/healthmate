type LogoProps = {
    className?: string;
    iconSize?: number;
};

export function Logo({ className, iconSize = 28 }: LogoProps) {
    return (
        <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
            <svg
                viewBox="0 0 48 48"
                width={iconSize}
                height={iconSize}
                aria-hidden="true"
            >
                <rect
                    x="9"
                    y="26"
                    width="7"
                    height="12"
                    rx="3"
                    fill="var(--color-text-secondary)"
                    opacity="0.5"
                />
                <rect
                    x="20"
                    y="18"
                    width="7"
                    height="20"
                    rx="3"
                    fill="var(--color-text-secondary)"
                    opacity="0.8"
                />
                <rect
                    x="31"
                    y="9"
                    width="7"
                    height="29"
                    rx="3"
                    fill="var(--color-accent-strong)"
                />
            </svg>
            <span className="font-heading text-xl font-extrabold tracking-tight text-[var(--color-text)]">
                healthmate
                <span className="text-[var(--color-accent-strong)]">.</span>
            </span>
        </span>
    );
}
