import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildSystemPrompt } from "@/lib/rag";
import { EmbeddingError } from "@/lib/embeddings";

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";

function extractText(message: UIMessage): string {
    return message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("\n")
        .trim();
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    const body = (await req.json()) as {
        messages: UIMessage[];
        conversationId?: string;
    };
    const { messages, conversationId } = body;

    if (!conversationId) {
        return new Response("Не передан идентификатор разговора", {
            status: 400,
        });
    }

    const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId },
    });
    if (!conversation) {
        return new Response("Разговор не найден", { status: 404 });
    }

    const lastMessage = messages[messages.length - 1];
    const question = lastMessage ? extractText(lastMessage) : "";
    if (!question) {
        return new Response("Пустое сообщение", { status: 400 });
    }

    await prisma.chatMessage.create({
        data: { conversationId, role: "user", content: question },
    });

    let systemPrompt: string;
    try {
        systemPrompt = await buildSystemPrompt(userId, question);
    } catch (error) {
        console.error("RAG context assembly failed", error);
        const message =
            error instanceof EmbeddingError
                ? "Не удалось подготовить ответ — сервис эмбеддингов временно недоступен. Попробуйте позже."
                : "Не удалось подготовить ответ — сервис временно недоступен. Попробуйте позже.";
        return Response.json({ error: message }, { status: 502 });
    }

    const result = streamText({
        model: google(MODEL),
        system: systemPrompt,
        messages: await convertToModelMessages(messages),
        onEnd: async ({ text }) => {
            if (!text) return;
            await prisma.chatMessage.create({
                data: { conversationId, role: "assistant", content: text },
            });
        },
    });

    return result.toUIMessageStreamResponse({
        onError: (error) => {
            console.error("Chat stream error", error);
            return "Gemini временно недоступен или превышен лимит бесплатного тира. Попробуйте позже.";
        },
    });
}
