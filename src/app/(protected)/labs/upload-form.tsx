"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { cardClassName } from "@/components/ui/card";
import { uploadLabReport } from "./actions";

export function UploadForm() {
    const [error, formAction, pending] = useActionState(uploadLabReport, null);

    return (
        <form
            action={formAction}
            className={`${cardClassName} flex flex-col gap-3`}
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                <div className="flex flex-1 flex-col gap-1.5">
                    <Label htmlFor="file">PDF с результатами анализа</Label>
                    <input
                        id="file"
                        name="file"
                        type="file"
                        accept="application/pdf"
                        required
                        className="text-sm text-[var(--color-text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-bg)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--color-text)]"
                    />
                </div>
                <Button type="submit" disabled={pending} className="shrink-0">
                    {pending ? "Обрабатываем…" : "Загрузить"}
                </Button>
            </div>
            <FormError message={error} />
        </form>
    );
}
