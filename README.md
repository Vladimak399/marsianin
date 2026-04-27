# марсианин — сайт кофейни

Production-ready проект для кофейни «марсианин»: выбор точки, меню по точкам, координатная навигация, быстрые действия для маршрута, доставки, звонка и отзывов.

## Стек

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- framer-motion
- Vercel

## Основные сценарии

- Главная страница показывает координатную карту точек `о12`, `к10`, `п7`.
- Пользователь выбирает точку и попадает в open-state выбранной точки.
- Кнопка `открыть меню` ведёт на `/menu/{location}`.
- Для каждой точки доступны быстрые действия: маршрут, доставка, звонок, яндекс карты, 2гис, отзыв.
- Если пользователь разрешил геолокацию, ближайшая точка подсвечивается.
- Если пользователь отказал в геолокации, сайт не использует demo-координаты как реальные и предлагает выбрать точку вручную.

## Важное правило навигации

Переход из hero/open-state в меню сейчас сделан через hard navigation:

```ts
window.location.assign(href);
```

Это рабочий фикс против бага, когда после клика `открыть меню` сайт визуально возвращался на hero вместо меню. Не заменять на `router.push()` без отдельной проверки всего transition-flow.

## Запуск

```bash
npm install
npm run dev
```

Открыть локально:

```txt
http://localhost:3000
```

Админ-кабинет меню:

```txt
http://localhost:3000/admin
```

## Проверки перед PR или merge

```bash
npm run typecheck
npm run lint
npm run build
```

Если production start падает из-за занятого порта `3000`, можно запустить на другом порту:

```powershell
$env:PORT=3005; npm run start
```

## Админка и env

В production должны быть заданы env variables:

```bash
ADMIN_LOGIN
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

В development fallback-значения могут использоваться только для локальной разработки. В production публичные дефолтные credentials не должны работать.

## Vercel

Проект деплоится через Vercel Git integration.

В `vercel.json` включён `ignoreCommand`, который пропускает preview deploys не из `main`, чтобы снизить расход build quota. Production deploy запускается при merge в `main`.

Если GitHub показывает `build-rate-limit`, это лимит Vercel, а не обязательно ошибка кода. Перед merge всё равно нужно проверить локально:

```bash
npm run typecheck
npm run lint
npm run build
```

## Релизный принцип

- `main` не трогать напрямую.
- Работать маленькими PR от свежего `main`.
- Несколько связанных безопасных правок можно объединять в один batch PR, чтобы не тратить лишние Vercel deploys.
- После каждого batch обязательно проверять сценарии из `CHECKLIST.md`.
