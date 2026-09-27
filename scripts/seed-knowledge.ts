// Env vars are loaded via `node --env-file=.env.local` (see package.json) —
// not here, since ESM hoists imports above any top-level code in this file,
// which would run dotenv too late for the modules below to see the vars.
import { prisma } from "@/lib/prisma";
import { embedText } from "@/lib/embeddings";
import { insertKnowledgeChunk } from "@/lib/knowledge";
import { knowledgeCards } from "./knowledge-base-data";

async function main() {
    const existing = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count FROM "KnowledgeChunk"
    `;
    if (Number(existing[0]?.count ?? 0) > 0) {
        console.log(
            `В базе уже есть ${existing[0].count} карточек. Очищаю перед повторной загрузкой…`,
        );
        await prisma.$executeRaw`DELETE FROM "KnowledgeChunk"`;
    }

    console.log(`Загружаю ${knowledgeCards.length} карточек…`);

    for (const [index, card] of knowledgeCards.entries()) {
        const embedding = await embedText(card.content);
        await insertKnowledgeChunk(card.content, card.sourceLabel, embedding);
        console.log(
            `[${index + 1}/${knowledgeCards.length}] ${card.sourceLabel.slice(0, 60)}`,
        );
    }

    console.log("Готово.");
}

main()
    .catch((error) => {
        console.error("Seed завершился с ошибкой:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
