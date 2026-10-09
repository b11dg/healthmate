import { cardClassName } from "@/components/ui/card";
import { BADGES, type BadgeKey } from "@/lib/badges";

type EarnedBadge = {
    key: BadgeKey;
    title: string;
    description: string;
    earnedAt: Date;
};

export function AchievementsCard({
    currentStreak,
    earned,
}: {
    currentStreak: number;
    earned: EarnedBadge[];
}) {
    const earnedByKey = new Map(earned.map((badge) => [badge.key, badge]));

    return (
        <section>
            <div className="mb-4 flex items-baseline justify-between">
                <h2 className="font-heading text-xl font-bold">Достижения</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Серия:{" "}
                    <span className="font-heading font-bold tabular-nums text-[var(--color-text)]">
                        {currentStreak}
                    </span>{" "}
                    {currentStreak === 1 ? "день" : "дней"} подряд
                </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BADGES.map((badge) => {
                    const won = earnedByKey.get(badge.key);
                    return (
                        <div
                            key={badge.key}
                            className={cardClassName}
                            style={!won ? { opacity: 0.45 } : undefined}
                        >
                            <p className="text-sm font-medium">
                                {badge.title}
                            </p>
                            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                                {won
                                    ? `Получено ${won.earnedAt.toLocaleDateString("ru-RU")}`
                                    : badge.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
