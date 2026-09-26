import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { cardClassName } from "@/components/ui/card";
import { getLabReportDetail } from "../data";
import { FlagBadge } from "../flag-badge";
import { StatusPill } from "../status-pill";

export default async function LabReportPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const { id } = await params;
    const report = await getLabReportDetail(session!.user.id, id);

    if (!report) notFound();

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <Link
                        href="/labs"
                        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                    >
                        ← Все анализы
                    </Link>
                    <h1 className="mt-1 font-heading text-2xl font-bold">
                        {report.fileName}
                    </h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        {report.createdAt.toLocaleDateString("ru-RU")}
                    </p>
                </div>
                <StatusPill status={report.status} />
            </div>

            {report.status === "error" && (
                <div
                    className={`${cardClassName} text-sm text-[var(--color-danger-fg)]`}
                >
                    {report.errorMessage ?? "Не удалось обработать файл."}
                </div>
            )}

            {report.status === "done" && report.results.length > 0 && (
                <div className={`${cardClassName} overflow-x-auto p-0`}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                                <th className="px-5 py-3 font-medium">
                                    Показатель
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Значение
                                </th>
                                <th className="px-5 py-3 font-medium">Норма</th>
                                <th className="px-5 py-3 font-medium">
                                    Отклонение
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.results.map((result) => (
                                <tr
                                    key={result.id}
                                    className="border-b border-[var(--color-border)] last:border-none"
                                >
                                    <td className="px-5 py-3 font-medium">
                                        {result.name}
                                    </td>
                                    <td className="px-5 py-3 tabular-nums">
                                        {result.value} {result.unit}
                                    </td>
                                    <td className="px-5 py-3 tabular-nums text-[var(--color-text-secondary)]">
                                        {result.refLow != null ||
                                        result.refHigh != null
                                            ? `${result.refLow ?? "–"} – ${result.refHigh ?? "–"}`
                                            : "—"}
                                    </td>
                                    <td className="px-5 py-3">
                                        <FlagBadge flag={result.flag} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
