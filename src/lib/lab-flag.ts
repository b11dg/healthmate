import type { LabResultFlag } from "@prisma/client";

export function computeFlag(
    value: number,
    refLow: number | null,
    refHigh: number | null,
): LabResultFlag {
    if (refLow === null && refHigh === null) return "unknown";
    if (refLow !== null && value < refLow) return "low";
    if (refHigh !== null && value > refHigh) return "high";
    return "normal";
}
