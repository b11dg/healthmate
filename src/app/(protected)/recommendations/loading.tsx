import { cardClassName } from "@/components/ui/card";

export default function RecommendationsLoading() {
    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <div>
                <h1 className="font-heading text-2xl font-bold">
                    Рекомендации по питанию
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Собираем рекомендации на основе профиля и анализов…
                </p>
            </div>
            <div className={`${cardClassName} animate-pulse space-y-3`}>
                <div className="h-3.5 w-3/4 rounded bg-[var(--color-bg)]" />
                <div className="h-3.5 w-full rounded bg-[var(--color-bg)]" />
                <div className="h-3.5 w-5/6 rounded bg-[var(--color-bg)]" />
                <div className="h-3.5 w-2/3 rounded bg-[var(--color-bg)]" />
            </div>
        </div>
    );
}
