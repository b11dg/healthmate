import { auth } from "@/lib/auth";
import { cardClassName } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { MEDICAL_DISCLAIMER } from "@/lib/rag";
import { getRecommendation } from "./data";

export default async function RecommendationsPage() {
    const session = await auth();
    const userId = session!.user.id;

    const result = await getRecommendation(userId);

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <div>
                <h1 className="font-heading text-2xl font-bold">
                    Рекомендации по питанию
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Персональные рекомендации на основе профиля и последних анализов.
                </p>
            </div>

            {result.ok ? (
                <div className={`${cardClassName} whitespace-pre-wrap text-sm leading-relaxed`}>
                    {result.text}
                </div>
            ) : (
                <div className={cardClassName}>
                    <FormError message={result.message} />
                </div>
            )}

            <p className="text-xs text-[var(--color-text-secondary)]">
                {MEDICAL_DISCLAIMER}
            </p>
        </div>
    );
}
