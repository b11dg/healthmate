import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

export class EmbeddingError extends Error {}

export async function embedText(text: string): Promise<number[]> {
    let values: number[] | undefined;
    try {
        const response = await ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: [text],
            config: { outputDimensionality: EMBEDDING_DIMENSIONS },
        });
        values = response.embeddings?.[0]?.values;
    } catch (error) {
        throw new EmbeddingError(
            error instanceof Error
                ? `Gemini embedding API: ${error.message}`
                : "Gemini embedding API: неизвестная ошибка",
        );
    }

    if (!values || values.length !== EMBEDDING_DIMENSIONS) {
        throw new EmbeddingError("Gemini не вернул эмбеддинг ожидаемой размерности");
    }

    return values;
}

export function toVectorLiteral(embedding: number[]): string {
    return `[${embedding.join(",")}]`;
}
