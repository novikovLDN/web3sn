# Максим Новиков — 3D-креатор

Технологичное 3D-портфолио: React + TypeScript + Tailwind CSS + Framer Motion + Lucide React (Vite).

Тёмная тема `#0C0C0C`, шрифт **MTS Wide** (self-hosted), полностью русскоязычный контент, скролл-анимации, магнитный портрет, marquee-строки, посимвольный ревил текста и стек липких карточек проектов. Все интерактивные анимации (marquee, магнит) переписаны на `requestAnimationFrame` с прямой записью в `transform` — без ре-рендеров React, движение идёт на композиторе браузера максимально плавно.

## Секции
HeroSection · MarqueeSection · AboutSection · ServicesSection · ProjectsSection

## Шрифт MTS Wide
Начертания лежат в `public/fonts/` (Light 300, Regular 400, Medium 500, Bold 700), подключены через `@font-face` в `src/index.css`. Начертание Black (900) в свободном доступе отсутствует — крупные заголовки используют Bold (700).

## Локальный запуск
Нужен **Node.js 18+**.

```bash
npm install
cp .env.example .env
npm run dev             # http://localhost:5173
```

Прод-сборка: `npm run build` → `npm run preview`.

## Переменные окружения
Vite «запекает» `VITE_*` на этапе **build**, поэтому после их изменения нужен **redeploy**.

| Переменная            | Обязательна | Назначение                                  |
| --------------------- | ----------- | ------------------------------------------- |
| `VITE_CONTACT_EMAIL`  | нет         | Почта для кнопки «Связаться» (mailto), по умолчанию `founder@atlassecure.uk` |
| `PORT`                | Railway задаёт сам | Порт для `vite preview` в проде      |

## Деплой на Railway
1. Запушить репозиторий на GitHub.
2. Railway → **New Project → Deploy from GitHub repo** → выбрать репо.
3. Build (Nixpacks) и Start берутся из `railway.json` / `nixpacks.toml`:
   - install: `npm install`
   - build: `npm run build`
   - start: `npm run start` (`vite preview` слушает `$PORT`).
4. **Variables** → при желании `VITE_CONTACT_EMAIL`. `PORT` Railway подставит сам.
5. **Settings → Networking → Generate Domain**.
