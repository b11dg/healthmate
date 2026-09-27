import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import type { UIMessage } from "ai";
import { getConversationWithMessages } from "../data";
import { ChatThread } from "../chat-thread";

export default async function ChatConversationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const userId = session!.user.id;
    const { id } = await params;

    const conversation = await getConversationWithMessages(userId, id);
    if (!conversation) notFound();

    const initialMessages: UIMessage[] = conversation.messages.map((message) => ({
        id: message.id,
        role: message.role,
        parts: [{ type: "text", text: message.content }],
    }));

    return (
        <ChatThread conversationId={conversation.id} initialMessages={initialMessages} />
    );
}
