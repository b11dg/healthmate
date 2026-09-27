import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getConversations, createConversation } from "./data";

export default async function ChatIndexPage() {
    const session = await auth();
    const userId = session!.user.id;

    const conversations = await getConversations(userId);
    const target =
        conversations[0] ?? (await createConversation(userId));

    redirect(`/chat/${target.id}`);
}
