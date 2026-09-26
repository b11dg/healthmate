import { prisma } from "@/lib/prisma";

export function getLabReports(userId: string) {
    return prisma.labReport.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { results: true } } },
    });
}

export function getLabReportDetail(userId: string, reportId: string) {
    return prisma.labReport.findFirst({
        where: { id: reportId, userId },
        include: { results: { orderBy: { name: "asc" } } },
    });
}

export async function getIndicatorNames(userId: string) {
    const rows = await prisma.labResult.findMany({
        where: { labReport: { userId, status: "done" } },
        distinct: ["name"],
        select: { name: true },
        orderBy: { name: "asc" },
    });
    return rows.map((row) => row.name);
}

export type TrendPoint = {
    date: string;
    value: number;
    unit: string;
    refLow: number | null;
    refHigh: number | null;
};

export async function getIndicatorTrend(
    userId: string,
    name: string,
): Promise<TrendPoint[]> {
    const rows = await prisma.labResult.findMany({
        where: { name, labReport: { userId, status: "done" } },
        include: {
            labReport: { select: { createdAt: true, reportDate: true } },
        },
        orderBy: { labReport: { createdAt: "asc" } },
    });

    return rows.map((row) => ({
        date: (row.labReport.reportDate ?? row.labReport.createdAt)
            .toISOString()
            .slice(0, 10),
        value: row.value,
        unit: row.unit,
        refLow: row.refLow,
        refHigh: row.refHigh,
    }));
}
