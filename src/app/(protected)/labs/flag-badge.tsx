import type { LabResultFlag } from "@prisma/client";

const config: Record<
    LabResultFlag,
    { label: string; bg: string; fg: string; icon: React.ReactNode }
> = {
    low: {
        label: "Ниже нормы",
        bg: "var(--color-warning-bg)",
        fg: "var(--color-warning-fg)",
        icon: (
            <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M5 2v6M5 8L2 5M5 8l3-3"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    high: {
        label: "Выше нормы",
        bg: "var(--color-danger-bg)",
        fg: "var(--color-danger-fg)",
        icon: (
            <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M5 8V2M5 2L2 5M5 2l3 3"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    normal: {
        label: "В норме",
        bg: "var(--color-success-bg)",
        fg: "var(--color-success-fg)",
        icon: (
            <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M2 5.2l2 2 4-4.4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    unknown: {
        label: "Норма неизвестна",
        bg: "var(--color-bg)",
        fg: "var(--color-text-secondary)",
        icon: (
            <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
            >
                <circle
                    cx="5"
                    cy="5"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                />
                <path
                    d="M5 6.2v-.3c0-.5.9-.6.9-1.4 0-.5-.4-.9-.9-.9s-.9.4-.9.9"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                />
                <circle cx="5" cy="7.5" r="0.5" fill="currentColor" />
            </svg>
        ),
    },
};

export function FlagBadge({ flag }: { flag: LabResultFlag }) {
    const { label, bg, fg, icon } = config[flag];
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap"
            style={{ background: bg, color: fg }}
        >
            {icon}
            {label}
        </span>
    );
}
