"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Button } from "@/components/ui/button";
import { MEDICAL_DISCLAIMER, RECOMMENDATION_QUESTION } from "@/lib/chat-shared";

const QUICK_HINTS = [
    {
        label: "Объясни последний анализ",
        text: "Объясни мой последний анализ простыми словами и на что стоит обратить внимание.",
    },
    { label: "Дай рекомендации по питанию", text: RECOMMENDATION_QUESTION },
];

function messageText(message: UIMessage): string {
    return message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");
}

export function ChatThread({
    conversationId,
    initialMessages,
}: {
    conversationId: string;
    initialMessages: UIMessage[];
}) {
    const [input, setInput] = useState("");
    const { messages, sendMessage, status, error } = useChat({
        id: conversationId,
        messages: initialMessages,
        transport: new DefaultChatTransport({
            api: "/api/chat",
            body: { conversationId },
        }),
    });

    const isBusy = status === "submitted" || status === "streaming";

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const text = input.trim();
        if (!text || isBusy) return;
        sendMessage({ text });
        setInput("");
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
                {messages.length === 0 && (
                    <div className="flex flex-wrap gap-2">
                        {QUICK_HINTS.map((hint) => (
                            <button
                                key={hint.label}
                                type="button"
                                onClick={() => sendMessage({ text: hint.text })}
                                className="cursor-pointer rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
                            >
                                {hint.label}
                            </button>
                        ))}
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                                message.role === "user"
                                    ? "bg-[var(--color-accent-strong)] text-white"
                                    : "border border-[var(--color-border)] bg-[var(--color-surface)]"
                            }`}
                        >
                            {messageText(message)}
                        </div>
                    </div>
                ))}

                {isBusy && (
                    <p className="text-xs text-[var(--color-text-secondary)]">
                        Печатает…
                    </p>
                )}
                {error && (
                    <p className="text-sm text-[var(--color-accent-strong)]">
                        {error.message}
                    </p>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex gap-2 border-t border-[var(--color-border)] pt-3"
            >
                <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Спросите про анализы, питание, привычки…"
                    className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)]"
                />
                <Button type="submit" disabled={isBusy || !input.trim()}>
                    Отправить
                </Button>
            </form>
            <p className="pt-2 text-xs text-[var(--color-text-secondary)]">
                {MEDICAL_DISCLAIMER}
            </p>
        </div>
    );
}
