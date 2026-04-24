# Марсианин — landing для кофейни

Production-ready проект на **Next.js (App Router) + TypeScript + TailwindCSS**.

## Стек

- Next.js 14
- React 18
- TypeScript
- TailwindCSS

## Структура

```bash
/app
  layout.tsx
  page.tsx
/components
  /ui
    PrimaryButton.tsx
  /menu
    MenuSection.tsx
    MenuCard.tsx
    NutritionTable.tsx
/data
  menu.ts
/styles
  globals.css
/public
  favicon.svg
  /images
```

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).
Админ-кабинет меню доступен по адресу [http://localhost:3000/admin](http://localhost:3000/admin).
Демо-авторизация админки: `admin / mars2026` (только базовая клиентская защита для локального стенда).

## Дополнительно

- SEO metadata добавлены в `app/layout.tsx`
- favicon добавлен в `public/favicon.svg`
- изображения оптимизируются через `next/image` и современные форматы (`avif`, `webp`) в `next.config.mjs`

## Деплой на Vercel

Если после подключения GitHub-репозитория Vercel показывает `404: NOT_FOUND`, проверьте:

- Root Directory указывает на корень проекта (где лежит `package.json`);
- Framework Preset = **Next.js**;
- в репозитории есть `vercel.json` с `framework: "nextjs"`.

В этом проекте `vercel.json` уже добавлен, чтобы Vercel не определял пресет как `Other`.
