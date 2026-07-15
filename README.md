# Jack — 3D Creator

Технологичное 3D-портфолио: React + TypeScript + Tailwind CSS + Framer Motion + Lucide React (Vite).

Тёмная тема `#0C0C0C`, шрифт Kanit, скролл-анимации, магнитный портрет, marquee-строки, посимвольный ревил текста и стек липких карточек проектов.

## Секции
HeroSection · MarqueeSection · AboutSection · ServicesSection · ProjectsSection

## Локальный запуск
Нужен **Node.js 18+** (сейчас на машине он не установлен).

```bash
# 1. Установить Node (вариант через Homebrew)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node

# 2. Зависимости и dev-сервер
npm install
cp .env.example .env    # при желании поменять контактный email
npm run dev             # http://localhost:5173
```

Прод-сборка: `npm run build` → `npm run preview`.

## Переменные окружения
Vite «запекает» `VITE_*` на этапе **build**, поэтому после их изменения нужен **redeploy**.

| Переменная            | Обязательна | Назначение                                  |
| --------------------- | ----------- | ------------------------------------------- |
| `VITE_CONTACT_EMAIL`  | нет         | Адрес для кнопки «Contact Me» (mailto)      |
| `PORT`                | Railway задаёт сам | Порт для `vite preview` в проде      |

## Деплой на Railway
См. блок инструкций в чате / раздел ниже.

1. Запушить репозиторий на GitHub.
2. Railway → **New Project → Deploy from GitHub repo** → выбрать этот репо.
3. Build (Nixpacks) и Start-команда берутся из `railway.json` / `nixpacks.toml` автоматически:
   - build: `npm ci && npm run build`
   - start: `npm run start` (`vite preview` слушает `$PORT`).
4. **Variables** → добавить `VITE_CONTACT_EMAIL` (по желанию). `PORT` Railway подставит сам.
5. **Settings → Networking → Generate Domain** — получите `*.up.railway.app` (или подключите свой домен).
