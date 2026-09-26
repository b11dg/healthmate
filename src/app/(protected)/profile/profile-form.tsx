"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { cardClassName } from "@/components/ui/card";
import { updateProfile } from "./actions";

type ProfileFormProps = {
    initial: {
        goal: string | null;
        heightCm: number | null;
        weightKg: number | null;
        allergies: string | null;
        restrictions: string | null;
    };
};

const goalOptions = [
    { value: "", label: "Не выбрано" },
    { value: "lose", label: "Похудение" },
    { value: "gain", label: "Набор массы" },
    { value: "maintain", label: "Поддержание" },
];

export function ProfileForm({ initial }: ProfileFormProps) {
    const [message, formAction, pending] = useActionState(updateProfile, null);
    const isError = message !== null && message !== "Профиль сохранён";

    return (
        <form
            action={formAction}
            className={`${cardClassName} flex max-w-lg flex-col gap-5`}
        >
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="goal">Цель</Label>
                <Select id="goal" name="goal" defaultValue={initial.goal ?? ""}>
                    {goalOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="heightCm">Рост, см</Label>
                    <Input
                        id="heightCm"
                        name="heightCm"
                        type="number"
                        min={0}
                        defaultValue={initial.heightCm ?? ""}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="weightKg">Вес, кг</Label>
                    <Input
                        id="weightKg"
                        name="weightKg"
                        type="number"
                        step="0.1"
                        min={0}
                        defaultValue={initial.weightKg ?? ""}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="allergies">Аллергии</Label>
                <Input
                    id="allergies"
                    name="allergies"
                    defaultValue={initial.allergies ?? ""}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="restrictions">Ограничения в питании</Label>
                <Input
                    id="restrictions"
                    name="restrictions"
                    defaultValue={initial.restrictions ?? ""}
                />
            </div>

            {isError ? (
                <FormError message={message} />
            ) : (
                <FormSuccess message={message} />
            )}

            <Button type="submit" disabled={pending} className="self-start">
                {pending ? "Сохраняем…" : "Сохранить"}
            </Button>
        </form>
    );
}
