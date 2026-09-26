import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
    const session = await auth();
    const profile = await prisma.profile.findUnique({
        where: { userId: session!.user.id },
    });

    return (
        <div className="mx-auto flex max-w-lg flex-col gap-6">
            <div>
                <h1 className="font-heading text-2xl font-bold">Профиль</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Цель, параметры и ограничения — используются для
                    рекомендаций в будущих фазах.
                </p>
            </div>
            <ProfileForm
                initial={{
                    goal: profile?.goal ?? null,
                    heightCm: profile?.heightCm ?? null,
                    weightKg: profile?.weightKg ?? null,
                    allergies: profile?.allergies ?? null,
                    restrictions: profile?.restrictions ?? null,
                }}
            />
        </div>
    );
}
