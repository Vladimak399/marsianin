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

## Дополнительно

- SEO metadata добавлены в `app/layout.tsx`
- favicon добавлен в `public/favicon.svg`
- изображения оптимизируются через `next/image` и современные форматы (`avif`, `webp`) в `next.config.mjs`
