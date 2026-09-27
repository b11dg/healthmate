import { prisma } from "@/lib/prisma";

export function getConversations(userId: string) {
    return prisma.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { messages: { orderBy: { createdAt: "asc" }, take: 1 } },
    });
}

export function getConversationWithMessages(userId: string, id: string) {
    return prisma.conversation.findFirst({
        where: { id, userId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
    });
}

export async function createConversation(userId: string) {
    return prisma.conversation.create({ data: { userId } });
}
