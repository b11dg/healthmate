"use client";

import Link from "next/link";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { cardClassName } from "@/components/ui/card";
import type { DashboardSeriesPoint } from "./data";

function formatDay(value: unknown) {
    const str = typeof value === "string" ? value : String(value ?? "");
    const [, month, day] = str.split("-");
    return month && day ? `${day}.${month}` : str;
}

const axisTick = { fill: "var(--color-text-secondary)", fontSize: 12 };
const tooltipStyle = {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    fontSize: 13,
    color: "var(--color-text)",
};

function ChartCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cardClassName}>
            <h3 className="mb-3 font-heading text-sm font-bold">{title}</h3>
            {children}
        </div>
    );
}

export function DashboardCharts({
    series,
    days,
}: {
    series: DashboardSeriesPoint[];
    days: number;
}) {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold">Динамика</h2>
                <div className="flex gap-2 text-sm">
                    <PeriodLink days={7} active={days === 7} />
                    <PeriodLink days={30} active={days === 30} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <ChartCard title="Вес, кг">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart
                            data={series}
                            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                        >
                            <CartesianGrid
                                stroke="var(--color-border)"
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDay}
                                tick={axisTick}
                            />
                            <YAxis
                                tick={axisTick}
                                domain={["auto", "auto"]}
                                width={44}
                            />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                labelFormatter={(value) => formatDay(value)}
                                formatter={(value) => [`${value} кг`, "Вес"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="weightKg"
                                stroke="var(--color-accent-strong)"
                                strokeWidth={2}
                                dot={false}
                                connectNulls
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Вода, мл">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                            data={series}
                            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                        >
                            <CartesianGrid
                                stroke="var(--color-border)"
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDay}
                                tick={axisTick}
                            />
                            <YAxis tick={axisTick} width={44} />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                labelFormatter={(value) => formatDay(value)}
                                formatter={(value) => [`${value} мл`, "Вода"]}
                            />
                            <Bar
                                dataKey="waterMl"
                                fill="var(--color-accent)"
                                radius={[3, 3, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Калории, ккал">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                            data={series}
                            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                        >
                            <CartesianGrid
                                stroke="var(--color-border)"
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDay}
                                tick={axisTick}
                            />
                            <YAxis tick={axisTick} width={44} />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                labelFormatter={(value) => formatDay(value)}
                                formatter={(value) => [
                                    `${value} ккал`,
                                    "Калории",
                                ]}
                            />
                            <Bar
                                dataKey="calories"
                                fill="var(--color-accent-strong)"
                                radius={[3, 3, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </section>
    );
}

function PeriodLink({ days, active }: { days: 7 | 30; active: boolean }) {
    return (
        <Link
            href={`?days=${days}`}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                active
                    ? "bg-[var(--color-accent-strong)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
        >
            {days} дней
        </Link>
    );
}
