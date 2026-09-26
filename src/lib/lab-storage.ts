import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "lab-reports";

export async function uploadLabReportFile(
    userId: string,
    reportId: string,
    buffer: Buffer,
    fileName: string,
) {
    const path = `${userId}/${reportId}-${fileName}`;
    const { error } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, buffer, {
            contentType: "application/pdf",
            upsert: false,
        });
    if (error) throw error;
    return path;
}
