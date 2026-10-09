import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

// Долгоживущее SSE-соединение (ждём, пока Gemini доразберёт PDF) —
// дефолтного лимита в 10с на Vercel не хватит.
export const maxDuration = 60;

type ReportRow = { status: string; errorMessage: string | null };

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const report = await prisma.labReport.findFirst({
        where: { id, userId: session.user.id },
        select: { status: true, errorMessage: true },
    });
    if (!report) {
        return new Response("Не найдено", { status: 404 });
    }

    const encoder = new TextEncoder();
    let channel: ReturnType<typeof supabaseAdmin.channel> | null = null;

    const stream = new ReadableStream({
        start(controller) {
            function send(row: ReportRow) {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(row)}\n\n`),
                );
            }

            // Отчёт мог завершиться быстрее, чем клиент успел подписаться —
            // проверяем сразу, не дожидаясь события изменения.
            if (report.status !== "processing") {
                send(report);
                controller.close();
                return;
            }

            // Подписываемся через service_role — ключ никогда не уходит в
            // браузер, RLS (deny-all для anon/authenticated) не затронут.
            channel = supabaseAdmin
                .channel(`lab-report-${id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "LabReport",
                        filter: `id=eq.${id}`,
                    },
                    (payload) => {
                        const next = payload.new as ReportRow;
                        if (next.status === "processing") return;
                        send(next);
                        controller.close();
                    },
                )
                .subscribe();
        },
        cancel() {
            channel?.unsubscribe();
        },
    });

    req.signal.addEventListener("abort", () => {
        channel?.unsubscribe();
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
