export function FormError({ message }: { message?: string | null }) {
    if (!message) return null;

    return (
        <p
            role="alert"
            className="flex items-center gap-1.5 text-sm text-[var(--color-accent-strong)]"
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                className="flex-shrink-0"
            >
                <circle
                    cx="7"
                    cy="7"
                    r="6.25"
                    stroke="currentColor"
                    strokeWidth="1.3"
                />
                <path
                    d="M7 4v4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                />
                <circle cx="7" cy="10" r="0.75" fill="currentColor" />
            </svg>
            {message}
        </p>
    );
}
