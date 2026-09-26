"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { cardClassName } from "@/components/ui/card";
import { logWeight, logHabit, logMeal } from "./actions";

export function QuickLogForms() {
    const [weightError, weightFormAction, weightPending] = useActionState(
        logWeight,
        null,
    );
    const [habitError, habitFormAction, habitPending] = useActionState(
        logHabit,
        null,
    );
    const [mealError, mealFormAction, mealPending] = useActionState(
        logMeal,
        null,
    );

    return (
        <section className="grid gap-4 sm:grid-cols-3">
            <form
                action={weightFormAction}
                className={`${cardClassName} flex flex-col gap-3`}
            >
                <h3 className="font-heading text-sm font-bold">Вес сегодня</h3>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="weightKg">Вес, кг</Label>
                    <Input
                        id="weightKg"
                        name="weightKg"
                        type="number"
                        step="0.1"
                        min={0}
                        required
                    />
                </div>
                <FormError message={weightError} />
                <Button
                    type="submit"
                    variant="secondary"
                    disabled={weightPending}
                >
                    {weightPending ? "Сохраняем…" : "Записать"}
                </Button>
            </form>

            <form
                action={habitFormAction}
                className={`${cardClassName} flex flex-col gap-3`}
            >
                <h3 className="font-heading text-sm font-bold">
                    Вода и сон сегодня
                </h3>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="waterMl">Вода, мл</Label>
                    <Input
                        id="waterMl"
                        name="waterMl"
                        type="number"
                        min={0}
                        step={50}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sleepHours">Сон, ч</Label>
                    <Input
                        id="sleepHours"
                        name="sleepHours"
                        type="number"
                        min={0}
                        max={24}
                        step={0.5}
                    />
                </div>
                <FormError message={habitError} />
                <Button
                    type="submit"
                    variant="secondary"
                    disabled={habitPending}
                >
                    {habitPending ? "Сохраняем…" : "Записать"}
                </Button>
            </form>

            <form
                action={mealFormAction}
                className={`${cardClassName} flex flex-col gap-3`}
            >
                <h3 className="font-heading text-sm font-bold">Приём пищи</h3>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Название</Label>
                    <Input id="name" name="name" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="calories">Калории</Label>
                        <Input
                            id="calories"
                            name="calories"
                            type="number"
                            min={0}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="proteinG">Белки, г</Label>
                        <Input
                            id="proteinG"
                            name="proteinG"
                            type="number"
                            min={0}
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="fatG">Жиры, г</Label>
                        <Input
                            id="fatG"
                            name="fatG"
                            type="number"
                            min={0}
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="carbsG">Углеводы, г</Label>
                        <Input
                            id="carbsG"
                            name="carbsG"
                            type="number"
                            min={0}
                            step="0.1"
                        />
                    </div>
                </div>
                <FormError message={mealError} />
                <Button
                    type="submit"
                    variant="secondary"
                    disabled={mealPending}
                >
                    {mealPending ? "Сохраняем…" : "Записать"}
                </Button>
            </form>
        </section>
    );
}
