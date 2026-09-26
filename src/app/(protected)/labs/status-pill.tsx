import type { LabReportStatus } from "@prisma/client";

const config: Record<
    LabReportStatus,
    { label: string; bg: string; fg: string }
> = {
    processing: {
        label: "Обрабатывается",
        bg: "var(--color-warning-bg)",
        fg: "var(--color-warning-fg)",
    },
    done: {
        label: "Готово",
        bg: "var(--color-success-bg)",
        fg: "var(--color-success-fg)",
    },
    error: {
        label: "Ошибка",
        bg: "var(--color-danger-bg)",
        fg: "var(--color-danger-fg)",
    },
};

export function StatusPill({ status }: { status: LabReportStatus }) {
    const { label, bg, fg } = config[status];
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap"
            style={{ background: bg, color: fg }}
        >
            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: fg }}
            />
            {label}
        </span>
    );
}
