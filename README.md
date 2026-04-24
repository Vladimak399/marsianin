# Марсианин — сайт и админка меню

Проект на **Next.js 14 + TypeScript + TailwindCSS + Supabase**.

## Что реализовано

- Публичное меню по точкам:
  - `/menu/o12`
  - `/menu/k10`
  - `/menu/p7`
- Закрытая админка:
  - `/admin/login`
  - `/admin`
  - `/admin/products`
  - `/admin/products/new`
  - `/admin/products/[id]`
  - `/admin/categories`
  - `/admin/locations`
- CRUD для меню, категорий и точек.
- Цены/видимость/наличие отдельно по O12/K10/P7.
- Загрузка фото в Supabase Storage bucket `menu-images`.
- После сохранения вызывается revalidate для публичных страниц меню.

## Переменные окружения

Создайте `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

ADMIN_EMAIL=owner@example.com
ADMIN_PASSWORD=strong-password
ADMIN_SESSION_SECRET=change-me-please
```

## Supabase SQL

Выполните SQL из файла:

- `supabase/schema.sql`

Также создайте публичный bucket `menu-images` в Supabase Storage.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).
