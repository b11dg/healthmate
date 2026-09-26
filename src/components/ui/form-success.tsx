export function FormSuccess({ message }: { message?: string | null }) {
    if (!message) return null;

    return (
        <p
            role="status"
            className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]"
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
                    d="M4.5 7.2l1.7 1.7 3.3-4.2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {message}
        </p>
    );
}
