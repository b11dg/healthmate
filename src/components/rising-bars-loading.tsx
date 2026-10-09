type RisingBarsLoadingProps = {
    size?: number;
    className?: string;
};

/**
 * Анимированные столбики логотипа — индикатор фоновой обработки
 * (сейчас используется для статуса "processing" у LabReport).
 * Та же геометрия/цвета, что в Logo, но с "дышащей" высотой через CSS
 * (@keyframes rising-bars-N в globals.css) — не scale, чтобы не искажать
 * скруглённые углы столбиков.
 */
export function RisingBarsLoading({
    size = 20,
    className,
}: RisingBarsLoadingProps) {
    return (
        <svg
            viewBox="0 0 48 48"
            width={size}
            height={size}
            aria-hidden="true"
            className={`rising-bars-loading ${className ?? ""}`}
        >
            <rect
                x="9"
                width="7"
                y="26"
                height="12"
                rx="3"
                fill="var(--color-text-secondary)"
                opacity="0.5"
            />
            <rect
                x="20"
                width="7"
                y="18"
                height="20"
                rx="3"
                fill="var(--color-text-secondary)"
                opacity="0.8"
            />
            <rect
                x="31"
                width="7"
                y="9"
                height="29"
                rx="3"
                fill="var(--color-accent-strong)"
            />
        </svg>
    );
}
