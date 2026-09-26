import { auth } from "@/lib/auth";
import { getLabReports, getIndicatorNames, getIndicatorTrend } from "./data";
import { UploadForm } from "./upload-form";
import { ReportList } from "./report-list";
import { IndicatorTrend } from "./indicator-trend";

export default async function LabsPage({
    searchParams,
}: {
    searchParams: Promise<{ indicator?: string }>;
}) {
    const session = await auth();
    const userId = session!.user.id;

    const [reports, indicatorNames] = await Promise.all([
        getLabReports(userId),
        getIndicatorNames(userId),
    ]);

    const requested = (await searchParams).indicator;
    const selectedIndicator =
        requested && indicatorNames.includes(requested)
            ? requested
            : (indicatorNames[0] ?? null);
    const trend = selectedIndicator
        ? await getIndicatorTrend(userId, selectedIndicator)
        : [];

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <div>
                <h1 className="font-heading text-2xl font-bold">Анализы</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Загрузите PDF с результатами анализа крови — покажем
                    показатели и отклонения от нормы.
                </p>
            </div>

            <UploadForm />

            <ReportList reports={reports} />

            {selectedIndicator && (
                <IndicatorTrend
                    indicatorNames={indicatorNames}
                    selected={selectedIndicator}
                    data={trend}
                />
            )}
        </div>
    );
}
