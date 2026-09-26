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
};

const PROMPT = `Ты извлекаешь показатели из PDF с результатами анализа крови (бланк лаборатории).
Верни массив всех найденных показателей: название (как написано в бланке), числовое значение, единица измерения, и нижняя/верхняя граница нормы, если они указаны (иначе null).
Если документ не похож на анализ крови или показателей не найдено — верни пустой массив.`;

export type ParsedLabResult = {
    name: string;
    value: number;
    unit: string;
    refLow: number | null;
    refHigh: number | null;
};

export class LabParseError extends Error {}

export async function parseLabReportPdf(
    pdfBuffer: Buffer,
): Promise<ParsedLabResult[]> {
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

    if (!Array.isArray(parsed)) {
        throw new LabParseError("Gemini вернул неожиданный формат ответа");
    }

    return parsed.filter(isRawResult).map(normalizeResult);
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
