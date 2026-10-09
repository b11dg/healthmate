"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Пока отчёт в статусе processing — слушает SSE /api/labs/[id]/status
 * (сервер сам подписан на Supabase Realtime через service_role) и просит
 * Next.js перерисовать страницу, как только статус станет done/error.
 */
export function LabStatusWatcher({ reportId }: { reportId: string }) {
    const router = useRouter();

    useEffect(() => {
        const source = new EventSource(`/api/labs/${reportId}/status`);

        source.onmessage = (event) => {
            const data = JSON.parse(event.data) as { status: string };
            if (data.status === "processing") return;
            source.close();
            router.refresh();
        };
        source.onerror = () => {
            source.close();
        };

        return () => source.close();
    }, [reportId, router]);

    return null;
}
