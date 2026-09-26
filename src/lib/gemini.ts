import {
    GoogleGenAI,
    Type,
    createPartFromBase64,
    createUserContent,
    type Schema,
} from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-2.5-flash";

const labResultSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        reportDate: {
            type: Type.STRING,
            nullable: true,
            description:
                "Дата забора анализа/выдачи результатов в формате YYYY-MM-DD, если указана в документе, иначе null",
        },
        results: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "Название показателя, как в бланке",
                    },
                    value: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    refLow: { type: Type.NUMBER, nullable: true },
                    refHigh: { type: Type.NUMBER, nullable: true },
                },
                required: ["name", "value", "unit"],
            },
        },
    },
    required: ["results"],
};

const PROMPT = `Ты извлекаешь показатели из PDF с результатами анализа крови (бланк лаборатории).
Верни объект с двумя полями:
- reportDate: дата забора анализа или выдачи результатов в формате YYYY-MM-DD, если она указана в документе, иначе null
- results: массив всех найденных показателей — название (как написано в бланке), числовое значение, единица измерения, нижняя/верхняя граница нормы (иначе null)

Важно про названия показателей: если в скобках указана аббревиатура (например (HCT), (E2), (MCHC)) — всегда пиши её латинскими ASCII-буквами, даже если в оригинале она набрана похожими кириллическими символами (Н, Е, М, С, Т, Х и т.п. вместо H, E, M, C, T, X). Один и тот же показатель на разных бланках должен получать абсолютно одинаковое название символ-в-символ, чтобы его можно было сопоставить между анализами.

Если документ не похож на анализ крови или показателей не найдено — верни results: [].`;

export type ParsedLabResult = {
    name: string;
    value: number;
    unit: string;
    refLow: number | null;
    refHigh: number | null;
};

export type ParsedLabReport = {
    reportDate: string | null;
    results: ParsedLabResult[];
};

export class LabParseError extends Error {}

export async function parseLabReportPdf(
    pdfBuffer: Buffer,
): Promise<ParsedLabReport> {
    const pdfPart = createPartFromBase64(
        pdfBuffer.toString("base64"),
        "application/pdf",
    );

    let text: string | undefined;
    try {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: createUserContent([PROMPT, pdfPart]),
            config: {
                responseMimeType: "application/json",
                responseSchema: labResultSchema,
            },
        });
        text = response.text;
    } catch (error) {
        throw new LabParseError(
            error instanceof Error
                ? `Gemini API: ${error.message}`
                : "Gemini API: неизвестная ошибка",
        );
    }

    if (!text) {
        throw new LabParseError("Gemini не вернул ответ");
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new LabParseError("Gemini вернул невалидный JSON");
    }

    if (
        typeof parsed !== "object" ||
        parsed === null ||
        !Array.isArray((parsed as { results?: unknown }).results)
    ) {
        throw new LabParseError("Gemini вернул неожиданный формат ответа");
    }

    const { reportDate, results } = parsed as {
        reportDate?: unknown;
        results: unknown[];
    };

    return {
        reportDate: isValidDateString(reportDate) ? reportDate : null,
        results: results.filter(isRawResult).map(normalizeResult),
    };
}

function isValidDateString(value: unknown): value is string {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isRawResult(item: unknown): item is Record<string, unknown> {
    if (typeof item !== "object" || item === null) return false;
    const candidate = item as Record<string, unknown>;
    return (
        typeof candidate.name === "string" &&
        typeof candidate.value === "number" &&
        typeof candidate.unit === "string"
    );
}

function normalizeResult(item: Record<string, unknown>): ParsedLabResult {
    return {
        name: item.name as string,
        value: item.value as number,
        unit: item.unit as string,
        refLow: typeof item.refLow === "number" ? item.refLow : null,
        refHigh: typeof item.refHigh === "number" ? item.refHigh : null,
    };
}
