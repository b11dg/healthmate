-- Закрывает публичный REST API Supabase (PostgREST) для всех таблиц проекта.
-- Prisma подключается ролью-владельцем (postgres.<project-ref>), supabaseAdmin —
-- service_role: обе роли RLS обходят, так что приложение не затронуто.
-- Anon key в проекте не используется — политики не нужны, достаточно включить RLS.

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WeightLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HabitLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MealLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LabReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LabResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KnowledgeChunk" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Achievement" ENABLE ROW LEVEL SECURITY;
