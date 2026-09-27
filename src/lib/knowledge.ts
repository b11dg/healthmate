import { prisma } from "@/lib/prisma";
import { embedText, toVectorLiteral } from "@/lib/embeddings";

export type KnowledgeMatch = {
    id: string;
    content: string;
    sourceLabel: string | null;
};

const TOP_K = 5;

export async function searchKnowledge(question: string): Promise<KnowledgeMatch[]> {
    const embedding = await embedText(question);
    const vectorLiteral = toVectorLiteral(embedding);

    return prisma.$queryRaw<KnowledgeMatch[]>`
        SELECT id, content, "sourceLabel"
        FROM "KnowledgeChunk"
        ORDER BY embedding <=> ${vectorLiteral}::vector
        LIMIT ${TOP_K}
    `;
}

export async function insertKnowledgeChunk(
    content: string,
    sourceLabel: string | null,
    embedding: number[],
) {
    const id = crypto.randomUUID();
    const vectorLiteral = toVectorLiteral(embedding);
    await prisma.$executeRaw`
        INSERT INTO "KnowledgeChunk" (id, content, "sourceLabel", embedding)
        VALUES (${id}, ${content}, ${sourceLabel}, ${vectorLiteral}::vector)
    `;
}
