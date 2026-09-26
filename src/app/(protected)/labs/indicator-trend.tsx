"use client";

import { useRouter } from "next/navigation";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    ReferenceLine,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { Select } from "@/components/ui/select";
import { cardClassName } from "@/components/ui/card";
import type { TrendPoint } from "./data";

const axisTick = { fill: "var(--color-text-secondary)", fontSize: 12 };
const tooltipStyle = {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    fontSize: 13,
    color: "var(--color-text)",
};

function formatDay(value: unknown) {
    const str = typeof value === "string" ? value : String(value ?? "");
    const [, month, day] = str.split("-");
    return month && day ? `${day}.${month}` : str;
}

export function IndicatorTrend({
    indicatorNames,
    selected,
    data,
}: {
    indicatorNames: string[];
    selected: string | null;
    data: TrendPoint[];
}) {
    const router = useRouter();
    const latest = data[data.length - 1];

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <h2 className="font-heading text-xl font-bold">
                    Динамика показателя
                </h2>
                <Select
                    value={selected ?? ""}
                    onChange={(event) =>
                        router.push(
                            `?indicator=${encodeURIComponent(event.target.value)}`,
                        )
                    }
                    className="max-w-[220px]"
                >
                    {indicatorNames.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </Select>
            </div>

            {data.length < 2 ? (
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Нужно хотя бы два анализа с этим показателем, чтобы
                    построить график.
                    {latest
                        ? ` Сейчас есть один: ${latest.value} ${latest.unit}.`
                        : ""}
                </p>
            ) : (
                <div className={cardClassName}>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart
                            data={data}
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
                                formatter={(value) => [
                                    `${value} ${latest?.unit ?? ""}`,
                                    "Значение",
                                ]}
                            />
                            {latest?.refLow != null && (
                                <ReferenceLine
                                    y={latest.refLow}
                                    ifOverflow="extendDomain"
                                    stroke="var(--color-warning-fg)"
                                    strokeDasharray="4 4"
                                    label={{
                                        value: `норма от ${latest.refLow}`,
                                        position: "insideBottomLeft",
                                        fill: "var(--color-warning-fg)",
                                        fontSize: 11,
                                    }}
                                />
                            )}
                            {latest?.refHigh != null && (
                                <ReferenceLine
                                    y={latest.refHigh}
                                    ifOverflow="extendDomain"
                                    stroke="var(--color-danger-fg)"
                                    strokeDasharray="4 4"
                                    label={{
                                        value: `норма до ${latest.refHigh}`,
                                        position: "insideTopLeft",
                                        fill: "var(--color-danger-fg)",
                                        fontSize: 11,
                                    }}
                                />
                            )}
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="var(--color-accent-strong)"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}
