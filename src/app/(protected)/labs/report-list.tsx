import Link from "next/link";
import type { LabReport } from "@prisma/client";
import { cardClassName } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { StatusPill } from "./status-pill";
import { LabStatusWatcher } from "./status-watcher";

type ReportWithCount = LabReport & { _count: { results: number } };

export function ReportList({ reports }: { reports: ReportWithCount[] }) {
    if (reports.length === 0) {
        return (
            <p className="text-sm text-[var(--color-text-secondary)]">
                Пока нет загруженных анализов — загрузите первый PDF выше.
            </p>
        );
    }

    return (
        <div
            className={`${cardClassName} flex flex-col divide-y divide-[var(--color-border)] p-0`}
        >
            {reports.map((report) => (
                <div
                    key={report.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                >
                    <div className="flex flex-col gap-0.5">
                        {report.status === "done" ? (
                            <Link
                                href={`/labs/${report.id}`}
                                className="text-sm font-medium hover:underline"
                            >
                                {report.fileName}
                            </Link>
                        ) : (
                            <span className="text-sm font-medium">
                                {report.fileName}
                            </span>
                        )}
                        <span className="text-xs text-[var(--color-text-secondary)]">
                            {report.createdAt.toLocaleDateString("ru-RU")}
                            {report.status === "done"
                                ? ` · ${report._count.results} показателей`
                                : ""}
                        </span>
                        {report.status === "error" && report.errorMessage ? (
                            <FormError message={report.errorMessage} />
                        ) : null}
                    </div>
                    <StatusPill status={report.status} />
                    {report.status === "processing" && (
                        <LabStatusWatcher reportId={report.id} />
                    )}
                </div>
            ))}
        </div>
    );
}
