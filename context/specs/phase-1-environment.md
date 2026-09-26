# Фаза 1 — Окружение

Мини-спека к `context/SPEC.md` (Дорожная карта, Фаза 1). Цель фазы — рабочее окружение: база данных, авторизация, деплой. Экранов пользователю ещё не показываем.

## Решения

- Авторизация через Auth.js, провайдер **Credentials (email + пароль)**, пароли хешируются (bcrypt)
- Сессии — JWT-стратегия (без таблицы Session), чтобы не тащить лишние модели на этом этапе
- База данных — Postgres через Supabase, ORM — Prisma
- Деплой — через сайт Vercel (Import Git Repository), не через CLI

## Что делает агент (в коде)

1. Установить зависимости: `prisma`, `@prisma/client`, `next-auth`, `bcryptjs`
2. `prisma/schema.prisma`: модели `User` (id, email, hashedPassword, createdAt) и `Profile` (userId, goal, heightCm, weightKg, allergies, restrictions) — 1:1 связь
3. Настроить Auth.js (`src/lib/auth.ts` + route handler `src/app/api/auth/[...nextauth]/route.ts`) с Credentials-провайдером, проверкой пароля через bcrypt
4. `.env.example` с плейсхолдерами: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
5. Простая страница `/api/health` — проверяет соединение с БД (`SELECT 1` через Prisma), чтобы после деплоя можно было убедиться, что всё подключено

## Что делает пользователь (вне кода, руками)

1. Создать проект в Supabase (supabase.com) → включить расширение `pgvector` → скопировать connection string в `DATABASE_URL` в свой `.env.local` (файл уже в `.gitignore`, в репозиторий не попадёт)
2. Сгенерировать `NEXTAUTH_SECRET` (`openssl rand -base64 32`) и добавить в `.env.local`
3. Импортировать репозиторий `b11dg/healthmate` на vercel.com → добавить те же переменные окружения в настройках проекта на Vercel → задеплоить
4. Прогнать `npx prisma migrate dev` локально один раз, чтобы создать таблицы в Supabase

## Критерии приёмки

- [x] `npx prisma db push` проходит без ошибок против реальной Supabase БД (`migrate dev` не используется — см. заметку ниже)
- [ ] Проект задеплоен на Vercel и открывается по публичной ссылке
- [ ] `/api/health` на деплое возвращает успешный ответ (БД доступна)
- [x] Регистрация через email/пароль работает локально (`npm run dev`)

**Заметка по ходу работы:** `prisma migrate dev` зависает — Supabase отдаёт `DATABASE_URL` через PgBouncer в transaction-mode (порт 6543), который не поддерживает advisory locks/prepared statements, нужные для shadow-базы миграций. Решение: CLI-операции со схемой (`prisma.config.ts`) используют `DIRECT_URL` (порт 5432, session-mode), а само приложение (`src/lib/prisma.ts`) по-прежнему ходит через пуленный `DATABASE_URL`. Рабочий процесс — `prisma db push` вместо `migrate dev` (без истории миграций, что нормально для сольного pet-проекта).
