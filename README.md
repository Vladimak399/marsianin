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

## Деплой на Vercel

Если после подключения GitHub-репозитория Vercel показывает `404: NOT_FOUND`, проверьте:

- Root Directory указывает на корень проекта (где лежит `package.json`);
- Framework Preset = **Next.js**;
- в репозитории есть `vercel.json` с `framework: "nextjs"`.

В этом проекте `vercel.json` уже добавлен, чтобы Vercel не определял пресет как `Other`.

### Ошибка клонирования репозитория (`HTTP 500`)

Если в логах деплоя появляется сообщение вида:

- `There was a permanent problem cloning the repo.`
- `The git provider returned an HTTP 500 error.`

это обычно внешний временный сбой на стороне Git-провайдера (например, GitHub) или интеграции Vercel ↔ GitHub, а не ошибка кода проекта.

Что делать:

1. Нажать **Redeploy** через 1–5 минут.
2. Проверить статус GitHub: <https://www.githubstatus.com/>.
3. Проверить статус Vercel: <https://www.vercel-status.com/>.
4. Если не проходит несколько попыток подряд — переподключить Git-интеграцию Vercel к GitHub и повторить деплой.
