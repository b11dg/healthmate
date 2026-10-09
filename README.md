# HealthMate

Персональный веб-трекер здоровья: привычки, вес и питание, AI-разбор медицинских анализов, чат с опорой на личные данные (RAG). Pet-проект для практики Next.js, баз данных и Spec-Driven Development.

Описание продукта и архитектура — [`context/project-overview.md`](context/project-overview.md) и [`context/architecture.md`](context/architecture.md). Активная задача и история фаз — [`context/current-feature.md`](context/current-feature.md). Архив мини-спек по фазам — `context/feature/`.

## Стек

Next.js (App Router, TypeScript) · Tailwind CSS · Prisma · Postgres/pgvector через Supabase · Auth.js · Google Gemini API

## Разработка

```bash
npm install
cp .env.example .env.local   # заполнить DATABASE_URL и AUTH_SECRET
npx prisma migrate dev
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000). Проверка соединения с БД — `/api/health`.
