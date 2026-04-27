# Vercel deploy notes

## Текущая схема

Проект деплоится через Vercel Git integration.

Основной production deploy должен идти из ветки `main`.

В `vercel.json` используется `ignoreCommand`, чтобы не запускать лишние preview deploys для каждой рабочей ветки:

```json
"ignoreCommand": "if [ \"$VERCEL_GIT_COMMIT_REF\" != \"main\" ]; then exit 0; else exit 1; fi"
```

Логика:

- если ветка не `main`, Vercel пропускает build;
- если ветка `main`, Vercel запускает production build.

## Build rate limit

Если GitHub check ведёт на страницу вида:

```txt
upgradeToPro=build-rate-limit
```

это означает лимит Vercel по сборкам. Это не равно ошибке кода.

Перед выводом о проблеме в коде нужно локально проверить:

```bash
npm run typecheck
npm run lint
npm run build
```

## Дублирующиеся Vercel projects

Если в GitHub checks появляются несколько Vercel contexts, например:

```txt
Vercel – marsianin
Vercel – marsianin-d4is
```

значит один GitHub repo может быть подключён к нескольким Vercel projects.

Чтобы не тратить build quota:

1. Открыть Vercel Dashboard.
2. Найти лишний проект.
3. Проверить, что на нём нет production domain.
4. Отключить Git integration:

```txt
Project Settings → Git → Connected Git Repository → Disconnect
```

Удалять проект необязательно. Обычно достаточно отключить Git repository.

## Production env

Для production должны быть заданы:

```bash
ADMIN_LOGIN
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

Без этих env админка не должна работать на публичных fallback credentials.

## Рекомендуемый release flow

1. Создать ветку от свежего `main`.
2. Сделать маленькие коммиты внутри одного batch PR.
3. Проверить локально:

```bash
npm run typecheck
npm run lint
npm run build
```

4. Проверить preview, если Vercel не пропустил deploy.
5. Merge в `main` только после ручной проверки.
6. Проверить production deploy.
