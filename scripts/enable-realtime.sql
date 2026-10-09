-- Включает Postgres-репликацию для LabReport в публикацию Supabase Realtime.
-- Используется только сервером (/api/labs/[id]/status route через
-- service_role) — anon key на клиенте не выдаётся, RLS не обходится.

ALTER PUBLICATION supabase_realtime ADD TABLE "LabReport";
