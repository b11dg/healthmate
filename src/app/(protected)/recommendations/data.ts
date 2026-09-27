import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { buildSystemPrompt, RECOMMENDATION_QUESTION } from "@/lib/rag";
import { EmbeddingError } from "@/lib/embeddings";

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";

export type RecommendationResult =
    | { ok: true; text: string }
    | { ok: false; message: string };

export async function getRecommendation(userId: string): Promise<RecommendationResult> {
    try {
        const system = await buildSystemPrompt(userId, RECOMMENDATION_QUESTION);
        const { text } = await generateText({
            model: google(MODEL),
            system,
            prompt: RECOMMENDATION_QUESTION,
        });
        return { ok: true, text };
    } catch (error) {
        console.error("recommendation generation failed", error);
        const message =
            error instanceof EmbeddingError
                ? "Не удалось подготовить рекомендации — сервис эмбеддингов временно недоступен. Попробуйте позже."
                : "Не удалось подготовить рекомендации — сервис временно недоступен. Попробуйте позже.";
        return { ok: false, message };
    }
}
