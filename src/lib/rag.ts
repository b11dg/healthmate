import { prisma } from "@/lib/prisma";
import { searchKnowledge } from "@/lib/knowledge";
import { MEDICAL_DISCLAIMER, RECOMMENDATION_QUESTION } from "@/lib/chat-shared";

export { MEDICAL_DISCLAIMER, RECOMMENDATION_QUESTION };

async function getProfileSummary(userId: string): Promise<string> {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return "Профиль не заполнен.";

    const parts = [
        profile.goal && `цель: ${profile.goal}`,
        profile.heightCm && `рост: ${profile.heightCm} см`,
        profile.weightKg && `вес: ${profile.weightKg} кг`,
        profile.allergies && `аллергии: ${profile.allergies}`,
        profile.restrictions && `ограничения в питании: ${profile.restrictions}`,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Профиль заполнен частично.";
}

async function getLatestLabSummary(userId: string): Promise<string> {
    const latestReport = await prisma.labReport.findFirst({
        where: { userId, status: "done" },
        orderBy: { createdAt: "desc" },
        include: { results: true },
    });

    if (!latestReport || latestReport.results.length === 0) {
        return "Загруженных анализов пока нет.";
    }

    const date = (latestReport.reportDate ?? latestReport.createdAt)
        .toISOString()
        .slice(0, 10);
    const lines = latestReport.results.map(
        (result) =>
            `- ${result.name}: ${result.value} ${result.unit} (норма ${result.refLow ?? "?"}–${result.refHigh ?? "?"}, отклонение: ${result.flag})`,
    );

    return `Последний анализ от ${date}:\n${lines.join("\n")}`;
}

function formatKnowledgeSection(
    matches: Awaited<ReturnType<typeof searchKnowledge>>,
): string {
    if (matches.length === 0) {
        return "Релевантных справочных карточек не найдено.";
    }
    return matches
        .map((match, index) => `[${index + 1}] ${match.content}`)
        .join("\n\n");
}

export async function buildSystemPrompt(
    userId: string,
    question: string,
): Promise<string> {
    const [profileSummary, labSummary, knowledgeMatches] = await Promise.all([
        getProfileSummary(userId),
        getLatestLabSummary(userId),
        searchKnowledge(question),
    ]);

    return `Ты — ассистент HealthMate, персонального сервиса трекинга здоровья и анализов. Отвечай на русском языке, коротко и по делу, опираясь на данные пользователя и справочные карточки ниже. Если справочные карточки не покрывают вопрос — используй общие знания, но явно не выдавай их за подтверждённый медицинский факт. ${MEDICAL_DISCLAIMER}

Профиль пользователя: ${profileSummary}

${labSummary}

Справочные карточки по теме вопроса:
${formatKnowledgeSection(knowledgeMatches)}`;
}
