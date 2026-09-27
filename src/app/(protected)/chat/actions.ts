"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createConversation } from "./data";

export async function startNewConversation() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const conversation = await createConversation(session.user.id);
    redirect(`/chat/${conversation.id}`);
}
