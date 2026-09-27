"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { startNewConversation } from "./actions";

type ConversationSummary = {
    id: string;
    title: string | null;
    createdAt: Date;
    messages: { content: string }[];
};

export function ConversationSidebar({
    conversations,
}: {
    conversations: ConversationSummary[];
}) {
    const pathname = usePathname();

    return (
        <aside className="flex w-64 shrink-0 flex-col gap-3 border-r border-[var(--color-border)] pr-4">
            <form action={startNewConversation}>
                <Button type="submit" variant="secondary" className="w-full">
                    + Новый разговор
                </Button>
            </form>
            <nav className="flex flex-col gap-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <p className="px-2 py-3 text-sm text-[var(--color-text-secondary)]">
                        Разговоров пока нет
                    </p>
                ) : (
                    conversations.map((conversation) => {
                        const active = pathname === `/chat/${conversation.id}`;
                        const preview =
                            conversation.title ??
                            conversation.messages[0]?.content.slice(0, 40) ??
                            "Новый разговор";
                        return (
                            <Link
                                key={conversation.id}
                                href={`/chat/${conversation.id}`}
                                className={`truncate rounded-lg px-3 py-2 text-sm transition-colors ${
                                    active
                                        ? "bg-[var(--color-bg)] font-medium text-[var(--color-text)]"
                                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
                                }`}
                            >
                                {preview}
                            </Link>
                        );
                    })
                )}
            </nav>
        </aside>
    );
}
