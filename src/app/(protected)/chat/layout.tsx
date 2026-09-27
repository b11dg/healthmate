import { auth } from "@/lib/auth";
import { getConversations } from "./data";
import { ConversationSidebar } from "./conversation-sidebar";

export default async function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const userId = session!.user.id;
    const conversations = await getConversations(userId);

    return (
        <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-4xl gap-6">
            <ConversationSidebar conversations={conversations} />
            <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
    );
}
