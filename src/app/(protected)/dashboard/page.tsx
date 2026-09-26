import { auth } from "@/lib/auth";
import { cardClassName } from "@/components/ui/card";
import { getDashboardData } from "./data";
import { QuickLogForms } from "./quick-log-forms";
import { DashboardCharts } from "./dashboard-charts";

function StatTile({ label, value }: { label: string; value: string }) {
    return (
        <div className={cardClassName}>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                {label}
            </p>
            <p className="mt-1 font-heading text-2xl font-bold tabular-nums">
                {value}
            </p>
        </div>
    );
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ days?: string }>;
}) {
    const session = await auth();
    const days = (await searchParams).days === "30" ? 30 : 7;
    const data = await getDashboardData(session!.user.id, days);

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <section>
                <h1 className="font-heading text-2xl font-bold">Сегодня</h1>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatTile
                        label="Калории"
                        value={`${data.today.calories} ккал`}
                    />
                    <StatTile
                        label="Вода"
                        value={
                            data.today.waterMl
                                ? `${data.today.waterMl} мл`
                                : "—"
                        }
                    />
                    <StatTile
                        label="Вес"
                        value={
                            data.today.weightKg
                                ? `${data.today.weightKg} кг`
                                : "—"
                        }
                    />
                    <StatTile
                        label="Сон"
                        value={
                            data.today.sleepHours
                                ? `${data.today.sleepHours} ч`
                                : "—"
                        }
                    />
                </div>
            </section>

            <section>
                <h2 className="mb-4 font-heading text-xl font-bold">
                    Записать за сегодня
                </h2>
                <QuickLogForms />
            </section>

            <DashboardCharts series={data.series} days={days} />
        </div>
    );
}
