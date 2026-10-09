"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadLabReportFile } from "@/lib/lab-storage";
import { parseLabReportPdf, LabParseError } from "@/lib/gemini";
import { computeFlag } from "@/lib/lab-flag";
import { normalizeLabResultName } from "@/lib/lab-name";
import { checkAndAwardAchievements } from "@/lib/badges";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function processLabReport(
    userId: string,
    reportId: string,
    buffer: Buffer,
    fileName: string,
) {
    try {
        const filePath = await uploadLabReportFile(
            userId,
            reportId,
            buffer,
            fileName,
        );
        await prisma.labReport.update({
            where: { id: reportId },
            data: { filePath },
        });
    } catch (error) {
        console.error("lab report upload failed", error);
        await prisma.labReport.update({
            where: { id: reportId },
            data: {
                status: "error",
                errorMessage:
                    "Не удалось сохранить файл — сервис временно недоступен.",
            },
        });
        return;
    }

    try {
        const { reportDate, results } = await parseLabReportPdf(buffer);

        if (results.length === 0) {
            await prisma.labReport.update({
                where: { id: reportId },
                data: {
                    status: "error",
                    errorMessage:
                        "Не удалось найти показатели в файле — убедитесь, что это анализ крови.",
                },
            });
            return;
        }

        await prisma.labResult.createMany({
            data: results.map((result) => ({
                labReportId: reportId,
                name: normalizeLabResultName(result.name),
                value: result.value,
                unit: result.unit,
                refLow: result.refLow,
                refHigh: result.refHigh,
                flag: computeFlag(result.value, result.refLow, result.refHigh),
            })),
        });
        await prisma.labReport.update({
            where: { id: reportId },
            data: {
                status: "done",
                reportDate: reportDate ? new Date(reportDate) : null,
            },
        });
        await checkAndAwardAchievements(userId);
    } catch (error) {
        const message =
            error instanceof LabParseError
                ? error.message
                : "Не удалось распознать анализ — сервис временно недоступен. Попробуйте позже.";
        console.error("lab report parsing failed", error);
        await prisma.labReport.update({
            where: { id: reportId },
            data: { status: "error", errorMessage: message },
        });
    }
}

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

    const userId = session.user.id;
    const buffer = Buffer.from(await file.arrayBuffer());

    const report = await prisma.labReport.create({
        data: {
            userId,
            fileName: file.name,
            filePath: "",
            status: "processing",
        },
    });

    // Загрузка в Storage и разбор PDF через Gemini могут занимать десятки
    // секунд — after() откладывает их до момента, когда ответ уже ушёл
    // браузеру, чтобы это действие не держало навигацию по сайту.
    after(() => processLabReport(userId, report.id, buffer, file.name));

    revalidatePath("/labs");
    return null;
}
