"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadLabReportFile } from "@/lib/lab-storage";
import { parseLabReportPdf, LabParseError } from "@/lib/gemini";
import { computeFlag } from "@/lib/lab-flag";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function uploadLabReport(
    _prevState: string | null,
    formData: FormData,
) {
    const session = await auth();
    if (!session?.user?.id) return "Нужно войти в систему";

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
        return "Выберите PDF-файл";
    }
    if (file.type !== "application/pdf") {
        return "Поддерживаются только PDF-файлы";
    }
    if (file.size > MAX_FILE_SIZE) {
        return "Файл больше 10 МБ";
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const report = await prisma.labReport.create({
        data: {
            userId: session.user.id,
            fileName: file.name,
            filePath: "",
            status: "processing",
        },
    });

    try {
        const filePath = await uploadLabReportFile(
            session.user.id,
            report.id,
            buffer,
            file.name,
        );
        await prisma.labReport.update({
            where: { id: report.id },
            data: { filePath },
        });
    } catch (error) {
        console.error("lab report upload failed", error);
        await prisma.labReport.update({
            where: { id: report.id },
            data: {
                status: "error",
                errorMessage:
                    "Не удалось сохранить файл — сервис временно недоступен.",
            },
        });
        revalidatePath("/labs");
        return null;
    }

    try {
        const results = await parseLabReportPdf(buffer);

        if (results.length === 0) {
            await prisma.labReport.update({
                where: { id: report.id },
                data: {
                    status: "error",
                    errorMessage:
                        "Не удалось найти показатели в файле — убедитесь, что это анализ крови.",
                },
            });
        } else {
            await prisma.labResult.createMany({
                data: results.map((result) => ({
                    labReportId: report.id,
                    name: result.name,
                    value: result.value,
                    unit: result.unit,
                    refLow: result.refLow,
                    refHigh: result.refHigh,
                    flag: computeFlag(
                        result.value,
                        result.refLow,
                        result.refHigh,
                    ),
                })),
            });
            await prisma.labReport.update({
                where: { id: report.id },
                data: { status: "done" },
            });
        }
    } catch (error) {
        const message =
            error instanceof LabParseError
                ? error.message
                : "Не удалось распознать анализ — сервис временно недоступен. Попробуйте позже.";
        console.error("lab report parsing failed", error);
        await prisma.labReport.update({
            where: { id: report.id },
            data: { status: "error", errorMessage: message },
        });
    }

    revalidatePath("/labs");
    return null;
}
