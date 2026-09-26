# HealthMate

Персональный веб-трекер здоровья: привычки, вес и питание, AI-разбор медицинских анализов, чат с опорой на личные данные (RAG). Pet-проект для практики Next.js, баз данных и Spec-Driven Development.

Полная спека и модель данных — в [`context/SPEC.md`](context/SPEC.md). Ход разработки по фазам — в [`context/PROGRESS.md`](context/PROGRESS.md). Мини-спеки по фазам — в `context/specs/`.

## Стек

Next.js (App Router, TypeScript) · Tailwind CSS · Prisma · Postgres/pgvector через Supabase · Auth.js · Claude API

## Разработка

```bash
npm install
cp .env.example .env.local   # заполнить DATABASE_URL и AUTH_SECRET
npx prisma migrate dev
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000). Проверка соединения с БД — `/api/health`.
