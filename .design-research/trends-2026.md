# Премиальный веб-дизайн и моушн: 2026–2027

Исследовательская база для портфолио senior/lead разработчика.
Дата сборки: июль 2026.

Формат: русский для выводов и рекомендаций, оригинальные термины/названия шрифтов/hex/cubic-bezier/библиотеки — без перевода.

---

## РАЗДЕЛ 1. Award-winning сайты 2025–2026: что именно читается как «дорого»

### 1.1 Ключевые победители, на которые надо смотреть

**Awwwards Annual Awards 2025:**

| Награда | Победитель | URL |
|---|---|---|
| Site of the Year 2025 | Lando Norris (official site), студия OFF+BRAND | https://www.awwwards.com/annual-awards-2025/ |
| Site of the Year (WebGL-претендент) | Messenger — WebGL-планета с физикой и доставкой | https://www.awwwards.com/annual-awards-2025/ |
| Agency of the Year 2025 | **Immersive Garden** (Париж) | https://www.awwwards.com/annual-awards-2025/agency-of-the-year |
| Studio of the Year 2025 | **Malvah Studio** (27 из 192 голосов жюри) | https://www.awwwards.com/annual-awards-2025/studio-of-the-year |
| E-commerce of the Year 2025 | Scout Motors | https://www.awwwards.com/annual-awards-2025/ecommerce-site-of-the-year |

**Свежие Awwwards Sites of the Day (июль 2026, с Developer Award):**
источник — https://www.awwwards.com/websites/sites_of_the_day/

- **IZANAMI** — baqemono.inc. (Developer Award)
- **Hiroto Sato** — личное портфолио, Developer Award ← прямой референс для тебя
- **CoffeeTech®** — Or Halevi (Developer Award)
- **RISK** — FLOT NOIR (Developer Award)
- **House of Honey** — Edoardo Lunardi (Developer Award)
- **PP Neue Montreal** — Demande Spéciale (Developer Award) — сайт-промо шрифта, эталон типографики
- **Vectr** — Utsubo (Developer Award)
- **Brunello Cucinelli — AI E-com** — makemepulse (Developer Award) ← люкс-бренд + AI, эталон «дорого»
- **Julien Calot** — FLOT NOIR — личное портфолио
- **Depo Luxe** — Cuchillo (Developer Award)
- **MONOLOG** — Huy Nguyen (Typography Honors + Developer Award)
- **Hildén & Kaira** — Dylan Brouwer (No-code Honors + Developer Award)
- **Radian** — UNCOMMON (Developer Award)
- **Bucks Sauce** — Buzzworthy (E-commerce Honors + Developer Award)
- **21 Hrs On The Moon** — Studio 28K
- **NRG | Build Your Data Center** — Rogue Studio (Developer Award)
- **Longbow** — Digital Butlers
- **Wembi** — ET Studio
- **Units** — Big Horror Athens

### 1.2 Пять сайтов, разобранных подробно

Источник разборов: https://www.hontran.dev/blog/best-award-winning-websites-2026

#### By-Kin — https://by-kin.com/
Stack: **Next.js + GSAP + Strapi**. Награды: Awwwards SOTD + Developer Award + FWA + CSS Design Awards Web of the Day (4 награды).

Почему читается дорого: **мастер-класс сдержанности**. Уверенная editorial-типографика, weighted smooth scroll, переходы, которые *не привлекают к себе внимания*, но делают сайт единой непрерывной поверхностью.

Вербатим-копия с сайта (фетч by-kin.com):
- Hero: `'kin are a creative commercial interiors, branding and graphic design studio.`
- Навигация: `About` / `Work` / `Journal` / `Contact`
- Секции по порядку: nav → «Get to know us» (image carousel, нумерация `01/`) → team image → featured works → footer
- Footer: `sayhi@by-kin.com`, Instagram `@friends_of_kin`, LinkedIn `kinonline`
- **Наград на сайте не показано вообще** ← важный сигнал: топ-студии часто НЕ вешают бейджи Awwwards

Урок: одно предложение в hero, описывающее что ты есть. Без слогана. Без «We craft digital experiences».

#### Uncommon Studio — https://uncommonstudio.com.au/
Stack: GSAP (+ предположительно Next.js). Awwwards SOTD + Developer Award + FWA.

Почему дорого: **ритм**. Уверенная сетка, которая ломается ровно в нужных местах. GSAP-переходы между секциями ощущаются как *движения камеры*, а не как анимация элементов. На главной — динамическая сетка, где превью проектов появляются со staggered timing.

#### Iventions — https://iventions.com/
Stack: **Three.js + GSAP**. CSS Design Awards Website of the Month (окт 2025), финалист Website of the Year 2025, Awwwards SOTD + Developer Award.

Почему дорого: **свет как основной элемент дизайна**. Каждый проект подан как объект под точечным светом (spotlit installation). WebGL используется не для «вау», а для атмосферы.

#### Mat Voyce — https://matvoyce.tv
Stack: GSAP. Awwwards SOTD + номинация GSAP Site of the Year 2025.
Кинетическая типографика: буквы растягиваются, схлопываются и пересобираются на скролле, всё на timeline.

#### Minh Pham — https://minhpham.design/
Stack: Three.js + WebGL + GSAP. Developer score **7.77**.
Ключ: **3D никогда не перекрывает контент**. GSAP-система моушна поверх Three.js.

#### Dennis Snellenberg — https://dennissnellenberg.com/
Эталон *разработческого* портфолио. Awwwards SOTD → позже Honourable Mention.
Stack (по реверс-инжинирингу репо-клона https://github.com/AliBagheri2079/dennis-snellenberg-portfolio): **Next.js, Framer Motion, GSAP, Lenis, Styled Components, Tailwind, Next Cloudinary, React Wrap Balancer**.
Оригинально описан как GSAP + Barba.js + Locomotive Scroll — то есть стек эволюционировал Locomotive → Lenis, Barba → Next/Framer.
Профиль Awwwards: https://www.awwwards.com/dennissnellenberg/

### 1.3 Что конкретно создаёт ощущение «дорого» — механика

**Типографика (по данным Typewolf, 3000+ сайтов):**
Топ-шрифты премиального веба: **Apercu, GT America, Futura, Founders Grotesk, Neue Haas Grotesk**, далее **Canela, Graphik, Proxima Nova**.
Источник: https://www.typewolf.com/ и https://www.typewolf.com/recommendations

Реальные пары со свежих Typewolf SOTD (дек 2025):
- Daylight — **Grenette + Styrene**
- Heart & Soil — **Cardinal + Sweet Sans + Baskerville**
- Dirty Vine — **Swear + DM Mono**
- Muse — **DaVinci + Suisse Int'l**
- Board — **Kabel + Neue Haas Grotesk**
- Elena Scott — **Editorial Old + Neue Montreal**
- Speakeasy — **Tobias + Diatype + Diatype Mono**
- Every — **Signifier + Switzer**
- TR Studio — **Arizona Flare + Dia**

Пары с топ-40 студийных сайтов (https://www.typewolf.com/design-studios) — это готовая библиотека решений:
- Common Office — **Heldane Display + Heldane Text + Founders Grotesk**
- Studio HMVD — **Louize Display + Relative Mono + Relative**
- Foreign Policy — **Suisse International + Input Mono + Caslon**
- Without — **Portrait + Apercu + Apercu Mono**
- Oak — **Tiempos Headline + Input Mono**
- Output — **Tiempos Headline + Messina Sans + Messina Sans Mono**
- Outline — **Saol Display + Styrene**
- Fictive Kin — **GT Sectra + GT Pressura Mono**
- OTHER — **Ogg + Maison Neue + Maison Mono**
- Ransom Ltd — **Saol Display + Saol Text + Theinhardt**
- Wade and Leta — **Söhne** (один шрифт на весь сайт)
- Morrow — **Untitled Sans** (один шрифт)
- Cast Iron Design — **Unica77** (один шрифт)
- XXIX — **Replica + Times New Roman** ← намеренно «дешёвый» системный шрифт как статусный жест
- Datagif — **Lausanne**
- MetaLab — **Larsseit**

**Паттерн, который виден в данных:** 12 из 40 топ-студий используют РОВНО ОДИН шрифт. Ещё ~20 — ровно два (display serif + neo-grotesque, либо grotesque + mono). Три шрифта — почти всегда третий это mono для метаданных/лейблов.

**Формула «дорогой» типопары для dev-портфолио:**
`editorial serif (display) + neo-grotesque (body) + mono (метаданные, номера, лейблы, техстек)`
Mono здесь — это код-сигнал: он говорит «я разработчик» без единого слова.

**Whitespace:**
Исследование: whitespace повышает воспринимаемую ценность до +300% в digital-среде (https://www.flux-academy.com/blog/the-importance-of-whitespace-in-design-with-examples). Правило премиума: контент занимает 45–60% ширины вьюпорта, остальное — воздух. Вертикальные отступы между секциями 12–20vh, не 80px.

**Цветовая сдержанность:**
Премиальные бренды работают с 3–5 цветами максимум: 1–2 primary, 1–2 secondary, нейтральные (https://hookagency.com/blog/luxury-website-colors/). Для dev-портфолио оптимум — **2 цвета + один акцент**.

**Зерно / grain:**
Техника: inline SVG `feTurbulence` как background через `::before` с `inset: 0`, `feColorMatrix` для регулировки альфы. Без дополнительного HTTP-запроса, resolution-independent (в отличие от PNG-текстуры — не пикселит на retina).
**Рабочие значения opacity: 0.02–0.08 (2–8%)** — «чувствуется, но не видно». 0.05–0.15 — для явного editorial/vintage-эффекта. Выше 0.15 — уже читается как дешёвый пресет.
Источники: https://css-tricks.com/grainy-gradients/ , https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/ , https://ibelick.com/blog/create-grainy-backgrounds-with-css

```css
/* базовый премиальный grain */
.grain::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.045;                 /* рабочий диапазон 0.02–0.08 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  /* baseFrequency 0.65–0.9 = мелкое плотное зерно; 0.2–0.4 = крупное, «плёночное» */
}
```
Важно: `position: fixed` + `pointer-events: none` + не анимировать зерно (анимированный grain = постоянная перерисовка всего экрана, убивает 120fps). Если нужен «живой» grain — анимировать только `background-position` шагами по 8–12 fps, не 60.

### 1.4 Трендовая реальность 2026 — что реально выстрелило, а что нет

Источник: https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check

**ВЫСТРЕЛИЛО:**
- **Bento grid** — +23% scroll depth против классической 12-колоночной сетки. Стал дефолтом (Apple, Google, Spotify, ~половина YC demo day весной).
- **Dark mode по умолчанию** — 82%+ пользователей смартфонов держат хотя бы одно приложение в тёмной теме; +18% длительности сессий на dark-aware сайтах. Ключ — token-based цветовая система, а не просто CSS-переменные.
- **Design systems как фундамент** — токены, компонентные библиотеки, автоматический visual regression, design-to-code пайплайны.

**ПЕРЕОБЕЩАЛИ:**
- **Kinetic typography** — конфликтует со скринридерами и краулерами, вызывает layout shift → бьёт по Core Web Vitals. Реально живёт только в hero-заголовках и переходах.
- **Glassmorphism 2.0** — `backdrop-filter: blur()` даёт **падение FPS на 15–30% на реальных устройствах**. Осталось в навбарах, модалках и feature-карточках.
- **Organic blob shapes** — самый большой разрыв между трендовыми статьями и реальным продакшном. Почти не доезжает до B2B/конверсионных флоу.

**НЕДОДАЛИ:**
- **3D/WebGL** — цена **800kB–2MB JS-рантайма до первого пикселя**. Оправдано только когда бренд-опыт окупает штраф. ← критично для твоего портфолио: WebGL должен быть **прогрессивно подгружаемым**, не блокирующим.
- AI-персонализация — упирается в GDPR.
- Sustainable web design — обсуждают, но не приоритизируют.

**НЕОЖИДАННО ВОЗНИКЛО В СЕРЕДИНЕ 2026:**
- **AI Readability Layer** — Schema.org разметка, `llms.txt`, `agents.json`, JSON-LD. Замер: 2300 цитирований в Bing Copilot за 3 месяца к началу мая 2026. Сайты без этого слоя выпадают из AI Overviews. ← **обязательно для портфолио senior-разработчика: рекрутеры и AI-агенты будут читать твой сайт машинно.**
- **Anti-grid brutalism** — намеренно сломанные лейауты, raw HTML эстетика, monospace типографика. Возникло как контр-позиционирование против вездесущего bento.

Плюс (https://www.topcssgallery.com/blog/web-design-trends-dominating-award-galleries/ и др.): асимметричные лейауты с негативным пространством как активным элементом; структурная сетка + стратегическое нарушение правил.

---

## РАЗДЕЛ 2. Маркетинговая психология премиального позиционирования

Выборка: 24 студии/портфолио, копия снята с живых сайтов (WebFetch/raw HTML/JS payload), июль 2026.
Пометка **[thin]** — сайт на canvas/WebGL без DOM-текста, извлечено только из head и loader-разметки.

**Корректировки URL (важно, старые ссылки битые):** `offandbrand.com` и `buzzworthy.studio` не резолвятся — реальные домены `itsoffbrand.com` и `buzzworthystudio.com`. `malvah.studio` делает 301 на `malvah.co`.

### 2.1 Above-the-fold: длина hero — главная находка

| Сайт | Вербатим hero | Слов |
|---|---|---|
| Studio Freight | `Moving Missions Forward` | **3** |
| Active Theory | `Creative Digital Experiences` (в WebGL-конфиге как `"Creative\nDigital\nExperiences"`) | **3** |
| Dogstudio | `We Make Good Shit` | **4** |
| OFF+BRAND | `A Different creative approach` | **4** |
| Malvah | `Crafting distinctive brand experiences.` | **4** |
| Olivier Larose | `Independent Front End ☼Developer☀` | **4** |
| Buzzworthy | `Turn Vision into Value` | **4** |
| Cuberto | `Digital design & development agency` | **5** |
| Locomotive | `Locomotive® Digital-first Design Agency` | **5** |
| Hello Monday | `We make digital (and magical)…` | **5** |
| Vev | `Interactive content, finally moving at full speed` | 7 |
| Antinomy | `Antinomy is an independent creative studio shaping contemporary brands.` | 9 |
| makemepulse | `We turn aesthetics into experiences tech that's light as air` | 10 |
| basement.studio | `A digital studio & branding powerhouse making cool shit that performs` | 11 |
| Immersive Garden | `Transcend anything seen or felt before by crafting unparalleled experiences for ambitious brands.` | 14 |
| Lusion | `We create 3D visual storytelling and interactive web experiences that help brands stand out` | 15 |
| Exo Ape | `Global digital design studio partnering with brands and businesses that create exceptional experiences where people live, work, and unwind.` | 21 |

**Медиана ~5 слов. Мода 3–4.** Распределение бимодальное: либо 3–5 слов абстрактного заявления (студии, за которых говорит работа), либо 10–21 слово функционального определения (студии, которым надо установить категорию). Корреляция прямая: **самые короткие hero принадлежат студиям с самым сильным узнаванием имени. Краткость hero сама по себе — статусный сигнал**, она предполагает, что ты уже знаешь, кто они.

Выброс Exo Ape (21 слово) поучителен: это не хайп, это **спецификация типа клиента**. Длина, потраченная на квалификацию клиента, читается дорого; длина, потраченная на прилагательные — дёшево.

### 2.2 Прелоадеры: ~45% выборки, и они не декоративные

- **Locomotive** — не спиннер, а **пофразовая сборка предложения**: `"Digital"` → `"Digital-First"` → `"Digital-First Design"` → `"Digital-First Design Agency"` → `"Digital-First Design Agency Based"` → `"Digital-First Design Agency Based in Montreal"` → `"Digital-First Design Agency Based in Montreal, Canada"`. **Время загрузки САМО является заявлением о позиционировании.** Лучший прелоадер выборки — превращает мёртвое время в предложение, которое нельзя пропустить.
- **Dennis Snellenberg** — цикл `"Hello"` → `"Bonjour"` → `"Guten tag"` → `"Hallo"`. Сигнализирует международную клиентуру за ~1.2s без единого утверждения. **НО: это самый скопированный прелоадер в вебе.** Сам Snellenberg публично об этом писал (https://www.linkedin.com/posts/dennissnellenberg_now-that-my-2022-portfolio-website-has-been-activity-7012001668347092992-_9mC). **В 2026 использование этого паттерна сигнализирует junior, а не senior.**
- **Resn** — `.bar-progress` / `.bar-background`: 1px белая полоса на всю ширину внизу, на фоне `rgb(40,40,40)`, плюс анимированный `.loader__drop` SVG. Волосяная линия, не проценты.
- **Exo Ape** — `"Digital Design Experience"` (3 слова)
- **makemepulse** — `"Global Creative Studio__"` (обрати внимание на трейлинг-курсор из подчёркиваний)
- **Unseen Studio** — `"(Loading)"` в скобках + **аудиогейт**: `"Enter"` / `"Enter without audio"`
- **Aristide Benoist** — чистый счётчик, raw text `"0 0 1"`, вообще без слов
- **OFF+BRAND** — полное заявление: `"With EMOTION + INNOVATION, We push THE BOUNDARIES OF DIGITAL CREATIVITY."`

Без прелоадера: basement.studio, Cuberto, Studio Freight, Obys, Rally, Hello Monday, Buzzworthy, Vev, Olivier Larose, Tom Hermans, Dogstudio.

**Ключевой вывод:** сплит не случайный. **Прелоадеры кластеризуются на WebGL/canvas-сайтах, где ассеты действительно должны грузиться.** На обычных DOM-сайтах их нет. Студии, которые делают быстрые сайты (basement, Studio Freight, Obys), считают ОТСУТСТВИЕ прелоадера понтом.

Две легитимные премиальные стратегии, противоположная тактика:
- **Ceremony** — «это тяжёлое, оно того стоит», гейт на входе, аудио-промпт
- **Instant** — «мы те, кто делает быстро», контент читается за <1s

**Провальный третий вариант: фейковый прелоадер на лёгком сайте. Это junior-tell** — издержка без актива за ней.

Active Theory — крайний случай: hero **вообще не DOM-текст**. `"Creative\nDigital\nExperiences"` лежит в WebGL-конфиге с типографическими директивами (`font: NBArchitektStd-Regular, size: 0.5, lineHeight: 1.1, align: left`). Заголовок — 3D-объект. Максимальный cost-signalling, оправдан только если 3D — это то, что ты продаёшь.

### 2.3 Нарративная последовательность секций

Реальные порядки:

- **Locomotive**: nav → hero → **featured work (5 named clients)** → philosophy → services → articles → culture → store → footer contact
- **basement.studio**: hero → **Selected Work** → What We Do → **Clients (стена из 32 имён)**
- **OFF+BRAND**: nav → hero → about → **"Trusted by Leaders" (логотипы)** → work (11 проектов) → services → **Recognitions + Awards** → closing CTA → footer
- **Exo Ape**: hero → studio intro → featured work → work-in-motion reel → **"In the Media"** → Our Story → footer
- **makemepulse**: hero + featured projects → "We also do games" → philosophy → **team** → news → newsletter
- **Buzzworthy**: hero → latest project → about → projects → "Attitude (5 Rules)" → "True Partnership" → **client logos → statistics → awards → testimonials** → footer
- **Cuberto**: hero → 12 featured projects → services → blog → contact
- **Dogstudio**: hero + showreel → studio description → 7 case studies → манифест → values → footer

**Каноническая премиальная последовательность:**

```
hero (3–5 слов)
  → WORK, немедленно (named clients, без преамбулы)
  → who we are / philosophy
  → services (только теперь, и коротко)
  → social proof консолидированно (логотипы, награды, пресса)
  → [team / culture — опционально, коррелирует с намерением нанимать]
  → footer-as-CTA
```

**Work перед services — практически универсально.** Locomotive, basement, Cuberto, Dogstudio, OFF+BRAND, Exo Ape, makemepulse — все ставят кейсы выше услуг. Только Vev (SaaS, не студия) начинает с problem-statement.

**Почему это конвертит на этом ценнике:** покупатель на $50k+ не оценивает заявления о компетенциях, он оценивает **риск**. Work-first отвечает на «делал ли ты это раньше, для таких как я» в первом скролле — единственный вопрос, который имеет значение. Services-first — паттерн низкого чека: он подразумевает, что покупателю надо объяснить, что можно купить, что фреймит его как неискушённого, а тебя — как commodity.

**Buzzworthy — показательный контрпример.** Самый конвенциональный маркетинговый стек в выборке: logos → statistics → awards → testimonials, четыре подряд идущие секции пруфов. Их опубликованный ценовой диапазон — **$10,000–$50,000** (https://clutch.co/profile/buzzworthy-studio). У Obys вообще НЕТ секции с отзывами.

**Плотность пруфов обратно коррелирует с ценой.** Чем больше ты штабелируешь убеждение, тем сильнее сигналишь, что ожидаешь сопротивления. Уверенность структурно тиха.

### 2.4 Social proof: размещение и стилизация

**Клиентские имена как сама сетка работ (максимальный статус):** basement.studio — клиенты И ЕСТЬ кейсы: Vercel, Next.js, Linear, Cursor, Scale, World Labs, Eleven Labs, Mintlify, Harvey, Baseten, Together.ai, Black Forest Labs, Profound, Rox, Factory, Until Labs, Speakeasy, Xbow, Krea, Apollo GraphQL, Cal.com, Trunk, Replicate, Graphite, Spiral, Applied Compute, Solana, Flox, MrBeast, Daylight Computer Company, EDGLRD, KidSuper Studios. Никакого «as seen in», никакой карусели логотипов. Имена набраны тем же шрифтом, что и всё остальное. **Высший доступный статусный приём: отказ упаковывать клиентов в proof-виджет.**

**Награды отложены на About/Info** — доминирующий премиальный паттерн: Lusion, Obys, Locomotive держат счётчики наград НЕ на главной.

**Награда в hero** — только Malvah: `"AWWWARDS Studio of the Year '25. Crafting distinctive brand experiences."` Оправдано ТОЛЬКО потому, что Studio of the Year — топовая награда. Site of the Day в hero читался бы как отчаяние.

**Награды инлайн с кейсом, к которому относятся — ЛУЧШИЙ ПАТТЕРН ВЫБОРКИ.** Antinomy привязывает награды к проектам: «30th Annual Webby Awards (Vast, Science category)», «Awwwards Site of The Day (Jitter)», «Communication Arts Best in Show (ChainZoku)». Rally так же: `"Apple Design Award winning iOS app"` привязано к проекту National Parks. **Награда становится свидетельством о работе, а не украшением о студии.**

**Вербатим-счётчики наград:**
- **Locomotive** (https://locomotive.ca/en/agency): `"Awards & Recognitions (295)"` — голое число в скобках, без логотипов
- **Lusion** (https://lusion.co/about): Awwwards **58**, FWA Site of the Year **1**, Webby Winners **2**, Lovie Awards **1**, Drum Awards **1**
- **Obys** (https://obys.agency/about): «Studio of the Year (Awwwards 2023)», «4x Studio of the Year (CSSDA)», «30+ Site of the Day (Awwwards)», «35+ Website of the Day (CSSDA)», «3x Award of Excellence (Communication Arts)», «60+ additional awards»
- **OFF+BRAND**: Awwwards 50 total (1 SOTY, 1 Month, 1 Day, 7 Developer, 6 Honors); FWA 8; CSSDA 12; Orpetron 9. *Их профиль Awwwards показывает 8 SOTD / 8 HM / 5 DEV — расхождение с самозаявленными «50» указывает на агрегированный подсчёт по под-наградам за всё время.*
- **Cuberto** (https://cuberto.com/about/): «Agency of the Year according to Awwwards», **40+** сотрудников, **300+** проектов, **15** лет
- **makemepulse**: `"makemepulse inducted into the FWA Hall of Fame"` — подано как **новость с датой**, не как бейдж
- **Buzzworthy**: Awwwards (8), CSSDA (9), FWA (3)

**Пять техник, как не выглядеть дёшево:**
1. **Цифры, а не бейджи.** `(295)` и `58` набраны собственным шрифтом сайта. **Никто в топ-тире не использует официальный PNG-бейдж Awwwards.** Бейдж — это чужой брендинг на твоей странице, читается как заимствованный авторитет.
2. **Агрегируй, не перечисляй.** «295» и «60+ additional awards» сжимают, а не перечисляют. Перечисление каждого SOTD читается как подсчёт.
3. **Привязывай к работе, а не к себе** (Antinomy, Rally).
4. **Уводи ниже фолда или на /about** (Lusion, Obys, Locomotive).
5. **Тот же шрифт, та же сетка, без цвета.** Как только пруф получает собственный визуальный язык — золото, звёзды, ленты, карусели — он читается как купленный.

**Отзывы: почти полностью отсутствуют наверху рынка.** Их нет у Locomotive, Obys, Studio Freight, Active Theory, Resn, Exo Ape, Antinomy, Lusion, basement.studio. Есть только у Buzzworthy (10 именных цитат) и Vev (SaaS, с хедшотами + `"How Pfizer achieved a 50x increase in engagement with Vev"`). **На высоком чеке отзыв подразумевает, что за тебя нужно было поручиться — логотип клиента И ЕСТЬ отзыв.**

### 2.5 CTA: психология и вербатим-строки

**Основные контактные CTA (кнопка денег):**
- `"Let's talk"` — Locomotive, Lusion, Tom Hermans (как `"Let's talk →"`)
- `"LET'S TALK"` — Buzzworthy
- `"Get in touch"` — Cuberto, Dennis Snellenberg; OFF+BRAND как `"Get in touch →"`
- `"Work with us →"` — Studio Freight (https://studiofreight.com/info)
- `"Work with us"` — Hello Monday
- `"Hire us"` — Rally Interactive
- `"Tell us"` — Cuberto, привязано к `"Have an idea?"`
- `"Drop us a mail"` — Malvah
- `"New Business"` / `"General"` — Unseen Studio, два отдельных маршрута
- `"Contact →"` — OFF+BRAND
- `"Join the Buzzworthy Family"` — Buzzworthy

**Мягкие/приглашающие:**
- `"Want to collaborate?"` — Hello Monday
- `"Let's work together!"` — Lusion
- `"Let's work together"` — Dennis Snellenberg
- `"let's make great things"` — Tom Hermans
- `"Is Your Big Idea Ready to Go Wild?"` — Lusion (/about)
- `"How about we do a thing or two"` — OFF+BRAND (/about-us)
- `"I work at the intersection of design and code. Interested? Hit me up."` — Tom Hermans
- `"we look forward to hearing from you"` — Unseen Studio

**CTA просмотра работ:**
`"See all projects"` (Locomotive, Lusion, Immersive Garden) · `"View all projects"` (Cuberto, Hello Monday) · `"See all our projects"` (makemepulse) · `"Browse all work"` / `"Browse all news"` (Exo Ape) · `"View all work"` (Buzzworthy) · `"View All"` (Malvah) · `"More work"` (Snellenberg) · `"Discover"` (Dogstudio, Antinomy) · `"See website"` (Olivier Larose, на каждой карточке) · `"Read more about this project"` (Locomotive) · `"Case Study"` / `"View"` (Antinomy) · `"Watch our Showreel"` (Dogstudio) · `"Play reel"` (Malvah) · `"Get More Info →"` (basement.studio)

**Заголовки контактных страниц (самая high-intent копия на любом студийном сайте):**
- `"Let's start a project together"` — Snellenberg (/contact)
- `"Hey! Tell us all the things"` — Cuberto (/contacts/)
- `"Contact us"` — basement.studio (/contact)

**Разбор:**

`"Let's talk"` — победитель по частоте (5+ вхождений). Самый низкообязывающий фрейминг: никакой формы, никакого брифа, никакого бюджета — и главное, он **симметричен**. «Let's» делает студию и клиента равноправными сторонами.

- `"Hire us"` (Rally) — асимметрично, ставит клиента работодателем. Rally может себе позволить прямоту, потому что Spotify, Nike, ESPN, PayPal, National Geographic, Toyota Connected, Mapbox, InVision, Ikon Pass уже установили статус — CTA не должен этого делать.
- `"Get in touch"` — нейтрально, транзакционно, пассивнее. У коммерчески позиционированных (Cuberto, OFF+BRAND).
- `"Work with us"` (Studio Freight, Hello Monday) — **самый уверенный фрейминг**: пресуппонирует отношения и ставит студию первой в предложении. Studio Freight пара со стрелкой `→` и БЕЗ кнопочного хрома.
- `"Join the Buzzworthy Family"` — выброс, и снова из самого низкого ценового диапазона. Семейный язык на высоком чеке читается как нужда.

**Ховер:** реально в проде — **magnetic button** (кнопка тянется к курсору при приближении) + кастомные состояния курсора. Cuberto фактически продуктизировал этот look, и он разошёлся по тиру. Studio Freight и basement.studio предпочитают более сухое: текстовая ссылка с трейлинг-`→`, которая транслируется на ховере, вообще без залитой кнопки.

**Направление движения: на вершине рынка CTA теряет кнопку.** Залитая, высококонтрастная, скруглённая CTA-кнопка теперь mid-market tell.

**Два email-адреса = сигнал сеньорности** (подразумевает объём входящих, требующий триажа):
- Lusion: `hello@lusion.co` / `business@lusion.co`
- Unseen: `⮡ projects@unseen.co` / `⮡ hello@unseen.co`, помечены `"New Business"` / `"General"`
- Hello Monday: `newbusiness@hellomonday.com` / `hello@hellomonday.com`
- Dogstudio: `biz@dogstudio.be` · Immersive Garden: `inquiries@immersive-g.com` · Antinomy: `hi@antinomy.studio`

**Footer-as-CTA — практически универсален.** Структура:
1. Огромный приглашающий заголовок в display-шрифте
2. **Email как крупный текст, а не mailto-кнопка** — часто самый большой шрифт на странице после hero
3. **Локальное время.** Snellenberg показывает `"09:41 PM CET"` рядом с `"Located in the Netherlands"`. Olivier Larose так же.
4. Copy-to-clipboard микроинтеракция — у Malvah подтверждение вербатим `"Email copied! ✌️"`
5. Соцсети, легал, версия/кредит последними. У Snellenberg: `"© Code by Dennis Snellenberg"` и `"2022 © Edition"` — обрати внимание на **«Code by»**, намеренное заявление авторства.

**Почему локальное время работает:** это proof-of-liveness и ответ на вопрос совместимости таймзон примерно в восьми символах, плюс тихий сигнал «я работаю с клиентами в разных таймзонах». Стоит ноль и является одной из самых высокорычажных деталей всей выборки.

**Механика footer-as-CTA:** футер — единственная секция, до которой доходит каждый скроллящий, и он ловит читателя на пике убеждённости, сразу после работ. Делая его full-viewport-height с контактом как героем этого вьюпорта, ты превращаешь терминальное состояние страницы в основную конверсионную поверхность.

### 2.6 Дефицит и авторитет

**Лучшая строка дефицита в выборке — Obys** (https://obys.agency/about):

> `"Obys takes on a limited number of projects each year, partnering with marketing leaders and founders who value authorship, clarity and long-term brand impact"`

Разбор:
- `"a limited number of projects each year"` — **дефицит без обратного отсчёта, даты и числа. Нефальсифицируемо, не истекает, не требует поддержки.**
- `"partnering with"` — не «working for»
- `"marketing leaders and founders"` — называет **сеньорность покупателя**, отфильтровывая тех, кто не может подписать
- `"who value authorship, clarity and long-term brand impact"` — квалифицирует **по ценностям, а не по бюджету**. Говорит «если тебе нужно дёшево и быстро — это не для тебя», ни разу не сказав «дорого»

В паре с: `"Our team remains intentionally small, under 10 people, which allows creative direction to stay personal and decisions to stay sharp"` — **малость переформулирована как фича.** Obys превращает стандартное возражение к бутику («потянут ли?») в причину их нанять.

**САМАЯ СИЛЬНАЯ НЕГАТИВНАЯ НАХОДКА ИССЛЕДОВАНИЯ: ни один сайт выборки не использует «currently booking Q3» или любую датированную доступность. Ноль.** Ни Locomotive, ни Lusion, ни Obys, ни Active Theory, ни Exo Ape, ни Antinomy.

Причина: датированный дефицит **фальсифицируем и распадается**. «Booking Q3 2026» протухает в октябре, а вернувшийся посетитель, увидевший те же «limited slots» дважды, узнаёт, что ты врал. Недатированная избирательность («a limited number of projects each year») никогда не истекает и не проверяется. **Премиальный дефицит структурен, а не темпорален.**

Аналогично — **ни одной «точки доступности» (зелёный кружок «Available for work») ни на одном студийном сайте.** Этот паттерн есть только в *личных* профилях на сторонних платформах: у Snellenberg на Dribbble написано «Available for work», а на Awwwards — `"I'm looking for a freelance job in a great agency!"`, **но НЕ на dennissnellenberg.com.** Он держит job-seeking сигналы на job-seeking платформах и вне своего домена. Это намеренно и правильно.

Исключение — **Tom Hermans**: `"Currently open to new projects and collaborations."` Честно и работает для соло-консультанта, где доступность действительно является ограничением покупки. Но это **не дефицит, а инверсия**: «я свободен» — мягко негативный сигнал, против «ты можешь не получить слот» — позитивного. **Соло-разработчик должен выбрать: прозрачность доступности (конвертит быстрее, цена ниже) ИЛИ избирательность (конвертит медленнее, цена выше). Оба сигнала одновременно невозможны.**

**Сигналы авторитета в реальном использовании:**

*Год основания* — доминирующий долговечный сигнал, дешёвый, вечный, нефальсифицируемый:
- Active Theory: `"Founded in 2012"` — буквально первые два слова их about
- Antinomy: `"Founded in 2019 with a goal: create the best work where strategy and craft hold the same line."`
- Obys: `"founded by Olha Olianishyna and Viacheslav Olianishyn in 2018"`
- Cuberto: `"Since 2010"` в футере
- Locomotive: основана 2008; `"Over the 15 years"` в meta description

*Длительность практики:*
- Locomotive: `"We're a small, nimble team, and we've been punching above our weight for more than a decade."`
- Tom Hermans: `"25+ Years of (Not) Breaking Things"` и `"I've been building for the web since before 'full-stack' was a job title."`

*Размер команды (работает в обе стороны):*
- Cuberto: `40+` / `300+` / `15 лет` — масштаб как авторитет
- OFF+BRAND: 39 именованных сотрудников с должностями на /about-us
- Obys: `"under 10 people"` — дефицит как авторитет
- **Locomotive: 30 человек с разбивкой Design 9 / Development 11 / Operations 10. РАЗБИВКА И ЕСТЬ СИГНАЛ** — 11 разработчиков против 9 дизайнеров публично доказывают инженерную глубину. Именно то заявление, которое нужно dev-led студии.

*Судейские/институциональные роли — сильнейший доступный сигнал авторитета для индивида:*
- Snellenberg: `"Awwwards judge '19-25"` и `"I am a proud member of the Awwwards International Jury, where I judge the best websites in the world"`

**Судейство инвертирует статусное отношение — ты больше не конкурируешь за награду, ты её присуждаешь. Для индивидуального разработчика это перевешивает любое количество SOTD.**

*Именованные основатели* — Obys и Antinomy оба называют основателей. Анонимные студии читаются как агентства; именованные основатели — как авторство, а именно это покупает премиальный покупатель.

**Квалификация по бюджету как механика дефицита** — форма Cuberto (https://cuberto.com/contacts/) требует `"Project budget (USD)"` с фиксированными опциями: `"10-20k"`, `"30-40k"`, `"40-50k"`, `"50-100k"`, `"> 100k"`. **Сообщение — это пол:** минимальная выбираемая опция $10k, поэтому все с бюджетом $3k самоотсеиваются до контакта. Форма делает квалификацию, чтобы студии никогда не пришлось говорить «мы дорогие». *(Заметь дыру: нет диапазона 20–30k — либо ошибка, либо нудж.)*
Их пикер услуг тоже структурен: `"Site from scratch"`, `"UX/UI design"`, `"Product design"`, `"Webflow site"`, `"Motion design"`, `"Branding"`, `"Mobile development"`.

Сравни с basement.studio: простая форма, `"Submit Message"`, без поля бюджета. Две валидные философии — **Cuberto фильтрует на форме, basement фильтрует стеной клиентов** (если Vercel и Linear на странице, маленькие бюджеты не пишут).

### 2.7 Копирайтинг «дорого»: корпус из 34 вербатим-строк

1. `"Moving Missions Forward"` — Studio Freight
2. `"Studio Freight delivers brands, digital experiences, campaigns, and special projects."` — /info
3. `"We work across categories, continents, and capabilities to move missions forward."` — Studio Freight /info
4. `"Our clients see us as trusted partners who care as much as they do but it's a ruse because we actually care more."` — Studio Freight /info
5. `"We Practice The Art of Brutal Elegance"` — Studio Freight /info
6. `"We transport our partners from where they are to where they want to be."` — Studio Freight /info
7. `"Creative Digital Experiences"` — Active Theory
8. `"Founded in 2012. We blend story, art & technology as an in-house team of passionate makers. Our industry-leading web toolset consistently delivers award-winning work through quality & performance."` — Active Theory
9. `"A digital studio & branding powerhouse making cool shit that performs"` — basement.studio
10. `"We craft digital experiences and brands that inspire action, turn heads, and bring communities together for companies that move fast, think big, and expect results."` — basement.studio /about
11. `"We Make Good Shit"` — Dogstudio
12. `"Dogstudio is a multidisciplinary creative studio at the intersection of art, design and technology."` — Dogstudio
13. `"We're crafting emotional experiences aimed at improving results"` — Dogstudio
14. `"We are an independent agency with a deep skill set, big ideas, lots of heart and a global reputation."` — Locomotive /en/agency
15. `"Digital-first Design™ Made in Montréal"` — Locomotive
16. `"We exist at the intersection of design thinking and technical know-how. As a digital-first design agency with off-the-charts dev skills, Locomotive® is an uncommon kind of studio."` — Locomotive
17. `"Antinomy is an independent creative studio shaping contemporary brands."` — Antinomy
18. `"Founded in 2019 with a goal: create the best work where strategy and craft hold the same line."` — Antinomy /about
19. `"A brand, digital and motion studio creating refreshingly unexpected ideas and striking visuals that help bold brands cut through the noise."` — Unseen Studio
20. `"Transcend anything seen or felt before by crafting unparalleled experiences for ambitious brands."` — Immersive Garden
21. `"Global digital design studio partnering with brands and businesses that create exceptional experiences where people live, work, and unwind."` — Exo Ape
22. `"True wonderers look up at the sky."` — Exo Ape /story
23. `"Simply put, we dare what others don't"` — Cuberto /about
24. `"We make things, and we're awesome at it."` — Cuberto /about
25. `"Concept-driven design studio based in the EU. Crafting award-winning brand and web experiences shaped by storytelling and strong visual systems."` — Obys
26. `"Hi, I'm Tom. I design, architect, and build digital systems."` — Tom Hermans
27. `"That's a lot of fancy words for: I design it, build it, and make sure it actually works."` — Tom Hermans
28. `"Independent Front End ☼Developer☀"` — Olivier Larose
29. `"Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge."` — Dennis Snellenberg
30. `"The combination of my passion for design, code & interaction positions me in a unique place in the web design world."` — Snellenberg
31. `"Aristide Benoist — Independent developer"` — aristidebenoist.com
32. `"Born through Passion / fixated on progress"` — Malvah
33. `"We are OFF+BRAND."` / `"People with dreams + methods to do better"` — OFF+BRAND /about-us
34. `"We make digital (and magical)…"` — Hello Monday

**Извлечённые правила:**

**Лицо: «we» для студий, «I» для индивидов — и НИКОГДА третье лицо.** Каждая студия в выборке — первое лицо мн.ч. Каждое соло-портфолио — первое лицо ед.ч. Единственное нарушение поучительно: **Tom Hermans смешивает намеренно** — на сайте есть и `"Tom Hermans is a full-stack developer and UX/UI designer who blends design thinking with solid engineering"` (третье лицо), и `"That's a lot of fancy words for: I design it, build it, and make sure it actually works"` (первое). Он использует третье лицо как **сетап**, первое — как **панчлайн**, подрывая собственное био. Это изощрённый ход.
**Ненамеренное третье лицо («Иван — увлечённый разработчик…») — один из самых явных junior-tell'ов**: читается как резюме, написанное для HR-фильтра.

Olivier Larose — заметное исключение: его описания проектов в третьем лице и глагольные («Developed», «Led», «Collaborated»), первого лица нет вообще. Это грамматика резюме, и она делает его сайт **индексом, а не питчем** — уместно для контрактора, чьи покупатели — другие студии, менее уместно для прямых продаж брендам.

**Длина предложения: короткая, и структурно.** Hero 3–5 слов. Предложения тела — обычно одна клауза. Самые длинные конструкции выборки — у Studio Freight, и они длинные по **ритму**, а не по плотности: `"We work across categories, continents, and capabilities to move missions forward"` — это триколон, ораторский приём, а не информационный дамп.

**Мат как сигнал уверенности, применяется узко.** `"We Make Good Shit"` (Dogstudio) и `"making cool shit that performs"` (basement.studio) — оба в hero. **Работает ТОЛЬКО при наличии клиентского ростера за спиной**: basement может так говорить, потому что Vercel и Linear на странице. Без логотипов это позёрство. Оба хеджируют мат содержательным заявлением в том же вдохе: `"that performs"` и `"aimed at improving results"`. **Формула: irreverence + результатное заявление в одном дыхании.** Ни один не делает это ради шока; оба сигналят «мы достаточно senior, чтобы не разыгрывать профессионализм».

**Преуменьшение вместо хайпа.** Сравнение по ценовым тирам:
- Obys: `"a limited number of projects each year"`
- Locomotive: `"punching above our weight"`
- Tom Hermans: `"25+ Years of (Not) Breaking Things"`
- **против** Buzzworthy: `"Turn Vision into Value"`, `"Are A Gateway to Success"`, `"Unlock Potential"`, `"Amplify Your Message"` — четыре ротирующиеся аспирационные абстракции, и самый низкий опубликованный ценовой диапазон выборки.

**Самоирония как статусный ход.** Studio Freight: `"our clients see us as trusted partners who care as much as they do but it's a ruse because we actually care more"`. Tom Hermans: `"(Not) Breaking Things"`. Оба работают через отказ воспринимать питч всерьёз. **Только тот, кому не нужна работа, может шутить про работу.**

**Жаргон: избегается, с одним лицензированным исключением.** Нет «synergy», «leverage», «holistic», «best-in-class», «solutions», «cutting-edge» (кроме `"always on the cutting edge"` у Snellenberg — слегка устаревшая строка). Лицензированное исключение — **проприетарная чеканка терминов**: `"Digital-first Design™"` у Locomotive и их `"We make it all happen using our own brand of Triforce. That's when operations, design and development come together seamlessly"`; `"Mettle"` у Studio Freight как названный четвёртый столп услуг рядом со Strategy, Design, Experience.
**Изобретение собственного термина сигнализирует, что у тебя есть метод; заимствование отраслевых терминов сигнализирует, что метода нет.**

**География как провенанс.** `"Made in Montréal"` (Locomotive), `"Based in Montreal"` (Larose), `"Located in the Netherlands"` (Snellenberg), `"A scottish born, global digital..."` (OFF+BRAND), `"based in the EU"` (Obys). Место работает ровно как в люксовых товарах — это ход «Made in Italy». Плюс тихо отвечает на вопросы таймзоны и юрлица.

**Юрлицо как сигнал доверия.** Snellenberg публикует `"Dennis Snellenberg B.V."`, `"CoC: 92411711"`, `"VAT: NL866034080B01"` на контактной странице. **Для соло-разработчика это непропорционально мощно: VAT-номер говорит «я могу выставить счёт вашему отделу закупок», а это и есть реальный блокер на enterprise-сделках.**

### 2.8 Senior vs junior именно на DEVELOPER-портфолио

Здесь dev-портфолио сильнее всего расходится с дизайнерским. **Дизайнерское портфолио оценивается по артефакту; разработческое — по свидетельствам суждения.** Сайт является рабочим образцом дважды — как контент и как артефакт.

**Сигналы SENIOR:**

1. **Собственный инжиниринг сайта — доказательство, и оно читаемо.** У Snellenberg в футере `"© Code by Dennis Snellenberg"` — не «designed by», а **code by**. У Larose hero: `"Independent Front End ☼Developer☀"`, дисциплина заявлена вторым словом. **Senior dev-портфолио делает заявление об авторстве кода явным, потому что красивый сайт без такого заявления считается шаблоном.**

2. **Названные ограничения и компромиссы, а не названные инструменты.** Hermans: `"I use tools because they solve problems, not because they're trending"` и `"Tools Are Means, Not Ends"`. Против junior-портфолио, которое является логосеткой React/Node/Mongo. Hermans ПЕРЕЧИСЛЯЕТ стек (`"HTML CSS JavaScript Vue Svelte React Astro PHP WordPress"`), но хеджирует его `"among others"` и подчиняет заявленной философии. **Списки инструментов ранжируют тебя среди других джунов; заявленные компромиссы вынимают тебя из сравнения.**

3. **Системная и инфраструктурная работа вместо экранов.** Hermans: `"Design Systems That Don't Suck"` — «Built component libraries and design systems for teams who were tired…». Дизайн-система по определению senior-работа: подразумевает множество потребителей, версионирование и проблемы внедрения.

4. **Open-source артефакты — СИЛЬНЕЙШИЙ СИГНАЛ ВСЕЙ ВЫБОРКИ, и он неочевиден.** **Studio Freight — авторы Lenis**, библиотеки smooth-scroll, которая сейчас практически повсеместна на сайтах Awwwards-уровня. Snellenberg — сооснователь osmo.supply. Rally выпустили `"Apple Design Award winning iOS app"`. **Выпуск инструмента, которым строят другие разработчики — категориальный статусный скачок: он делает тебя инфраструктурой, а не подрядчиком. Для разработчика это перевешивает любую награду: SOTD говорит, что ты сделал один хороший сайт; широко принятая библиотека говорит, что тысячи людей сделали хорошие сайты твоим кодом.**

5. **Менторство и командный язык.** Hermans: `"Mentored Humans, Not 'Resources'"` — «Spent years working in teams, teaching juniors…». **Заявление ответственности за output ДРУГИХ людей — определяющая граница между senior и mid. Ничто другое в портфолио это не заменяет.**

6. **Честность о своей позиции.** Hermans: `"Across agencies, product teams, and enterprise — always somewhere between design and engineering, never fully in either camp. Still curious."` Называть, чем ты НЕ являешься, можно позволить только будучи уверенным в том, чем являешься.

7. **Стаж, поданный как перспектива, а не как срок.** `"I've been building for the web since before 'full-stack' was a job title"` бьёт «25 лет опыта», потому что демонстрирует перспективу вместо утверждения длительности. (Он даёт оба — `"25+ Years of (Not) Breaking Things"`: число плюс шутка.)

8. **Бизнес-инфраструктура.** VAT-номер, зарегистрированное юрлицо, телефон, отдельный new-business email. Snellenberg публикует все четыре.

9. **Судейские роли.** `"Awwwards judge '19-25"`.

10. **Performance и accessibility заявлены как ценности, а не фичи.** Hermans: `"Web standards fan. Accessibility advocate. Performance nerd."` Active Theory: `"Our industry-leading web toolset consistently delivers award-winning work through quality & performance"` — заметь **toolset**, т.е. они построили свой движок. Заявление проприетарного тулчейна — студийная версия open-source сигнала.

11. **Клиентские ИМЕНА вместо скриншотов проектов.** Snellenberg перечисляет TWICE, The Damai, FABRIC™, Base Create, AVVR, GraphicHunters, Atypikal, One:Nil, Andy Hardy. Larose даёт реальные отгруженные сайты со ссылками `"See website"`. **Живой URL фальсифицируем, Dribbble-шот — нет. Каждый проект должен вести на что-то работающее в проде.**

12. **Датированная честная поддержка.** Hermans: `"This site is my digital garden — a living document, updated as I learn, build, and occasionally change my mind."` Snellenberg даёт версионированный футер (`"2022 © Edition"`) и локальное время. Оба превращают вопрос «это протухло?» в свидетельство продолжающейся практики.

**Сигналы JUNIOR:**

1. **Склонированный прелоадер.** Цикл `"Hello / Bonjour / Guten tag / Hallo"` скопирован настолько широко, что автор публично это прокомментировал. **В 2026 он идентифицирует тебя как последователя того самого портфолио, которое ты скопировал.**
2. **Био в третьем лице без иронии.**
3. **Логосетки техстека** без заявленного обоснования.
4. **Проекты формы туториала** — todo, погода, калькулятор, клоны. Множественные разборы со стороны найма сходятся на этом как на главном провале портфолио (https://dev.to/charliemorrison/how-to-actually-get-hired-as-a-junior-dev-in-2026-when-nobody-is-hiring-juniors-1ehh).
5. **Генералистское позиционирование** — «понемногу обо всём» теперь активно читается как негатив; специализация — базовый дифференциатор.
6. **Нет продакшн-ссылок.** Скриншоты и GitHub-репо без задеплоенного URL.
7. **Полоски процентов навыков** («React ████░ 80%») — нефальсифицируемо, самооценочно, универсально читается как junior.
8. **Отчаяние по доступности на собственном домене.** Держи «hire me» энергию на платформах, «here's the work» — на своём домене.
9. **Эффекты без нагрузки за ними** — фейковый прелоадер на 200kb-сайте, скроллджекинг, кастомный курсор, ухудшающий юзабилити. **Senior оценивают по сдержанности; каждый эффект должен быть заработан контентом.**
10. **Бейджи наград как графика**, а не как типографика.
11. **Отзывы от не-лиц-принимающих-решения**, или отзывы вообще, если логотипы клиентов сильные.
12. **CTA-кнопка в стиле SaaS trial button.**

**Ключевая асимметрия:**

Дизайнерское портфолио оценивается по скриншотам — артефакт и есть свидетельство. Разработческое — нет, и это создаёт центральную проблему: **любой может заказать красивое портфолио.** Поэтому сайт senior-разработчика должен содержать доказательства, которые переживают предположение, что визуал был куплен. В выборке таких доказательств четыре:

1. **Авторство инструментов, которыми пользуются другие разработчики** (Studio Freight/Lenis; собственный тулсет Active Theory; Snellenberg/osmo.supply)
2. **Живые продакшн-URL у реальных именованных компаний** (Larose, Snellenberg, Rally)
3. **Артикулированные компромиссы и ограничения** (Hermans)
4. **Ответственность за output других людей** — менторство, дизайн-системы, лидерство (Hermans; Locomotive, публикующая 11 dev против 9 дизайнеров)

**Ничто другое не проходит тест «а ты правда это построил». Dev-портфолио, которое только красивое — структурно является дизайнерским портфолио с чужим именем.**

### 2.9 Прямые дефолты для сборки

1. **Hero: 3–5 слов.** Не value proposition, а позиция.
2. **Пропусти прелоадер, если нет реальных ассетов.** ~45% используют, и все они WebGL/canvas. На DOM-сайте first paint — это понт.
3. **Работы в первом скролле, именованные клиенты, без преамбулы.** Услуги позже и коротко.
4. **Счётчики наград типографикой, никогда бейджами.** Лучше — привязка наград к отдельным проектам.
5. **Пропусти отзывы, если есть логотипы.**
6. **CTA: `"Let's talk"` или `"Work with us →"`.** Текст со стрелкой, не залитая кнопка.
7. **Футер = полный вьюпорт, огромный email, локальное время, copy-to-clipboard.**
8. **Дефицит недатированный и структурный.** `"a limited number of projects each year"`. Никогда «booking Q3».
9. **Квалифицируй на форме**, если не можешь квалифицировать логотипами (пол бюджета Cuberto делает работу прайс-страницы без прайс-страницы).
10. **Два email-адреса** (general + new business).
11. **Первое лицо всегда.**
12. **Для разработчика конкретно:** выпусти то, чем пользуются другие разработчики; связывай каждый проект с живым продакшн-URL; заяви хотя бы один компромисс, который ты сделал, и почему.

**Оговорки по достоверности:** Resn и Aristide Benoist рендерятся на canvas — извлечена только loader-разметка и meta description, их внутристраничная копия здесь не представлена. Ценовые корреляции в 2.3/2.7 опираются на один опубликованный ценовой диапазон (Buzzworthy на Clutch); направление согласовано по выборке, но твёрдая цена есть только для одной студии — это выводимый паттерн, не измеренная зависимость.

---

## РАЗДЕЛ 4-Б. Ландшафт библиотек: реальные версии, лицензии, вес (июль 2026)

Все значения — из npm registry, GitHub commit history и bundlephobia (не из пересказов страниц).

| Package | Latest | Published | License | min+gzip | Статус |
|---|---|---|---|---|---|
| `gsap` | **3.15.0** | 2026-04-13 | Custom «no charge» — **НЕ MIT** | **26.7 kB** | Активен, но см. риск |
| `motion` | **12.42.2** | 2026-06-30 | MIT | 44.3 kB barrel / **2.3 kB mini** / 18 kB hybrid | Очень активен |
| `framer-motion` | 12.42.2 | 2026-06-30 | MIT | 60.6 kB | Legacy-алиас, залочен по версии |
| `lenis` | **1.3.25** | 2026-06-26 | MIT | **5.2 kB** | Активен |
| `animejs` | **4.5.0** | 2026-06-22 | MIT | 39.3 kB | Активен |
| `three` | **0.185.1** (= r185) | 2026-07-01 | MIT | 178.1 kB | Очень активен |
| `@react-three/fiber` | **9.6.1** | 2026-04-28 | MIT | — | Активен (v10 alpha) |
| `@react-three/drei` | **10.7.7** | 2025-11-13 | MIT | — | ⚠️ 8 месяцев без обновлений |
| `ogl` | 1.0.11 | 2025-01-27 | **Unlicense** | **33.4 kB** | Спящий |
| `splitting` | 1.1.0 | 2024-05-31 | MIT | **1.8 kB** | Спящий |
| `@theatre/core` | 0.7.2 | 2024-05-19 | Apache-2.0 | — | **ЗАБРОШЕН** |
| `@rive-app/canvas` | **2.38.5** | 2026-07-08 | MIT (runtime) | 42.6 / 35.2 kB lite | Очень активен |
| `lottie-web` | 5.13.0 | 2025-05-21 | MIT | 75.0 kB | Только поддержка |
| `@lottiefiles/dotlottie-web` | **0.78.0** | 2026-07-17 | MIT | **28.4 kB** | Очень активен |
| `@react-spring/web` | **10.1.2** | 2026-06-24 | MIT | 19.6 kB | Активен — теперь v10 |
| `matter-js` | 0.20.0 | 2024-06-23 | MIT | 25.3 kB | Спящий, feature-complete |
| `popmotion` | 11.0.5 | 2022-08-15 | MIT | — | **МЁРТВ** → Motion |
| `tempus` | 1.0.0-dev.18 | 2026-06-12 | MIT | **1.9 kB** | Активен, вечный `-dev` |
| `hamo` | 1.0.0-dev.10 | 2026-03-05 | MIT | — | Активен, вечный `-dev` |
| `split-type` | 0.3.4 | 2023-10-22 | ISC | 4.2 kB | **УСТАРЕЛ** |
| `motion-v` (Vue) | **2.3.0** | 2026-06-08 | MIT | — | Production-ready |
| `@threlte/core` | **8.5.16** | 2026-05-25 | MIT | — | Активен |
| `@tresjs/core` | **5.8.3** | 2026-06-18 | MIT | — | Активен |
| `vaul` | 1.1.2 | 2024-12-14 | MIT | — | ⚠️ 18 месяцев |
| `@number-flow/react` | **0.6.2** | 2026-07-18 | MIT | — | Очень активен |
| `velocity-animate` | 1.5.2 | 2018-07-31 | MIT | — | Мёртв (8 лет) |

### Критичные поправки к расхожим представлениям

**Theatre.js ЗАБРОШЕН, а не «медленный».** Последний коммит **2024-04-11**, сообщение `"Add the 1.0 notice"`, где написано, что разработка *«временно переехала в приватный репозиторий… мы скоро вернём наработки»*. Это было два года назад. Ни публикации, ни 1.0. **Не начинай новую работу на нём.**

**react-spring НЕ угасает** — v10.1.2, активно поддерживается.

**Лицензия GSAP — кастомная «no charge», НЕ OSI open-source.** Бесплатно для коммерческого использования, но нельзя перепродавать сам GSAP или поставлять его там, где анимационная способность И ЕСТЬ продукт. На enterprise-работе стоит юридической вычитки.

**Риск поддержки GSAP — планируй вокруг него.** ⚠️ Подтверждено: **Webflow уволил ~140 человек 2026-05-27**, оформлено как пивот в AI/«agentic web». Затронула ли команда GSAP — не подтверждено, заявлений нет. Твёрдый сигнал: **последний коммит 3.15.0 от 2026-04-13, за шесть недель до увольнений, и ничего за ~3 месяца после.** Каденс GSAP исторически рваный (3.12.5 янв 2024 → 3.12.6 янв 2025), поэтому это **жёлтый, не красный**.

Отгружать 3.15 сегодня — риска нет, лицензия неотзывна для опубликованных версий. Экспозиция — будущие багфиксы и браузерная совместимость. **Практический вывод: если GSAP встанет, самописный lerp/RAF-подход к курсору имеет нулевой библиотечный риск — аргумент в его пользу помимо ощущения. По той же логике `splitting` (1.8 kB, чистые CSS-переменные) — хедж для разбиения текста.**

### Версионные заметки, на которые стоит действовать

- **GSAP 3.13→3.15:** 3.13.0 (2025-04-30) — тот самый бесплатный релиз. 3.14.x (дек 2025) — MorphSVG `smooth`. **3.15.0 — adaptive directional easing через `easeReverse`**: реверснутые анимации теперь ощущаются правильно, а не зеркально. Прямо релевантно проблеме «симметричных enter/exit».
- **Motion+ — совсем не старый GSAP Club.** £299 пожизненно персонально. **Весь код Motion+ под MIT, ядро полностью бесплатно** — это платный контент-тир (примеры, визуальный редактор переходов, туториалы), а не запейволленная библиотека.
- **anime.js v4 — НЕ sponsorware.** MIT, и был MIT раньше — **смены лицензии не было никогда.** Путаница пошла от того, что доки были закрыты для спонсоров до релиза. Утверждения, что коммерческое использование требует спонсорства — неверны.
- **dotLottie решительно бьёт lottie-web: 28.4 kB против 75.0 kB (в 2.6 раза меньше)** при БОЛЬШЕМ функционале — Rust+WASM через ThorVG, Software/WebGL2/экспериментальный WebGPU бэкенды, поддержка Web Worker. Читает и `.json`, и `.lottie`, миграция бесплатна. **Пинуй версию, 0.78.0 — pre-1.0.**
- **Rive, цены 2026:** Free · Cadet **$9**/место/мес · Voyager **$32** · Enterprise **$120**, везде с позициями AI agent-credits. Реальная разница с Lottie: Lottie — односторонний неинтерактивный экспорт из AE; файлы Rive несут **state machine**, принимающую рантайм-входы и биндящуюся к состоянию приложения. Цена — лок-ин в проприетарный редактор с оплатой за место.
- **Three.js r185:** примерно одна ревизия в два месяца. **WebGPURenderer теперь центр тяжести** (r184 — неблокирующий `compileAsync()`, r183 — реверснутый depth buffer), и **TSL получил формальную спецификацию в r183** как предполагаемый путь написания шейдеров, компилируясь и в WGSL, и в GLSL. Заметь: **у OGL нет пути к WebGPU** — растущая проблема.
- **Определяющее изменение R3F v9 — поддержка React 19** (19.0–19.2 включая Activity), что потребовало вбандлить reconciler в R3F. `flushSync` теперь работает, что открывает экспорт скриншотов/видео. **Слабое звено — drei, 8 месяцев без обновлений**, v11 alpha тихая с февраля. Закладывай бюджет на пиннинг версий.
- **Разбиение текста: SplitText победил.** `split-type` существовал только как бесплатная альтернатива SplitText; эта миссия закончилась в апреле 2025. Все три альтернативы спящие.

**Не исследовано:** Spline и Unicorn Studio — проприетарные хостед-платформы без сигнала в npm/GitHub.

**Методологическая заметка:** суммаризатор страниц дважды переврал ГОДЫ (датировал three.js r185 и R3F 9.6.1 2024-м годом) и был исправлен по данным реестра. **Пересказы фетченных страниц ненадёжны для фактов о версиях и датах; запросы к реестру — надёжны.**

---

## РАЗДЕЛ 5. 120fps / performance craft

> Технический раздел сохранён в оригинале — точность значений критична.
> Конвенция достоверности: **[primary]** = vendor/spec doc, **[secondary]** = practitioner writeup, **[derived]** = вычислено. Несколько широко повторяемых «фактов» не прошли верификацию — они вынесены в §12.

# 120FPS / High-Refresh Performance Craft for Animation-Heavy Premium Sites (2025–2026)

Compiled July 2026 across four parallel research passes. **Reliability convention used throughout:** claims are marked **[primary]** (vendor/spec doc), **[secondary]** (practitioner writeup), or **[derived]** (arithmetic I or a research pass computed). Several widely-repeated "facts" did not survive verification — those are called out in the final section rather than quietly dropped.

---

## 1. The 120Hz reality

### 1.1 Frame budget

| Refresh | Frame interval | Realistic budget for *your* work |
|---|---|---|
| 60Hz | 16.67ms | **10ms** [primary] |
| 90Hz | 11.11ms | ~6.7ms [derived] |
| 120Hz | **8.33ms** | **~5ms** [derived] |
| 144Hz | 6.94ms | ~4.2ms [derived] |
| 240Hz | 4.17ms | ~2.5ms [derived] |

The 10ms figure is web.dev's: the browser "has 16.66 milliseconds to produce each frame," and "all of your work needs to be completed inside 10 milliseconds." <https://web.dev/articles/rendering-performance>

**Important honesty flag:** no primary source publishes a 120Hz equivalent. The ~6.6ms of overhead is not a fixed constant you can subtract — it bundles style, layout, paint, compositing, and GPU submission, some of which scales per-frame and some of which doesn't. Treat ~5ms as a working assumption, and measure rather than trust it.

The stage you land in dominates everything else. web.dev's measured comparison of the same motion: `top`/`left` animation cost **37ms rendering + 79ms painting and dropped 50% of frames**; the `transform` equivalent showed **zero for both and dropped 1%**. <https://web.dev/articles/animations-guide>

### 1.2 Who actually runs rAF at 120Hz

**Apple — the story most teams get wrong.** WebKit bug 173434 ("Support for 120Hz requestAnimationFrame") was filed June 2017 and resolved through iOS 18 (Sept 2024). <https://bugs.webkit.org/show_bug.cgi?id=173434>

But there is a live catch. Safari ships a feature flag **"Prefer Page Rendering Updates near 60fps," ON by default** on iOS/iPadOS/macOS. While on, CSS/JS/rAF animation is held near 60fps even on ProMotion hardware. Path: Settings → Apps → Safari → Advanced → Feature Flags. <https://www.macrumors.com/how-to/enable-smoother-120hz-browsing-in-safari/> [secondary]

The distinction that resolves the common bug report: **native scrolling in Safari is already 120Hz by default; the flag governs animations.** A user saying "scroll is smooth but the animation isn't" is describing exactly this split. Additionally, **PWAs (home-screen standalone apps) cannot reach the higher rate** under default flag settings.

**Practical consequence:** on Apple, design for 60fps correctness and treat 120Hz as a bonus. Virtually no user has touched Feature Flags.

- **Chrome desktop:** rAF "will generally match the display refresh rate" — 60/75/120/144/240Hz all work, no flag. <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame> [primary]
- **Android Chrome:** follows the panel's *active* rate, but Android's dynamic refresh system drops the panel based on content, thermals, and battery — an OS decision your page does not control.
- **Lenis README** notes Safari is capped at 60fps in its own scroll loop. <https://github.com/darkroomengineering/lenis>

### 1.3 Detecting refresh rate — and why you mostly shouldn't

```js
/**
 * Estimate display refresh rate from rAF deltas.
 * MEDIAN, not mean — one GC pause skews a mean badly.
 */
function detectRefreshRate({ samples = 60 } = {}) {
  return new Promise((resolve) => {
    const times = [];
    let last = null;
    function tick(now) {
      if (last !== null) times.push(now - last);
      last = now;
      if (times.length < samples) return requestAnimationFrame(tick);
      times.sort((a, b) => a - b);
      const median = times[times.length >> 1];
      const hz = 1000 / median;
      const known = [60, 75, 90, 100, 120, 144, 165, 240];
      resolve({
        raw: hz,
        hz: known.reduce((b, r) => Math.abs(r - hz) < Math.abs(b - hz) ? r : b),
        medianFrameMs: median,
      });
    }
    requestAnimationFrame(tick);
  });
}
```

Caveats that make this unreliable as a decision input:

1. **You measure achieved rate, not panel capability.** A janky page reports 45Hz on a 120Hz panel.
2. **iOS Low Power Mode throttles rAF to ~30fps**, effective immediately on toggle. <https://motion.dev/blog/when-browsers-throttle-requestanimationframe> [secondary]
3. **VRR/ProMotion/adaptive sync** means there is no stable number to detect.
4. **Firefox `privacy.resistFingerprinting`** reduces timer accuracy to 100ms — "enough to swallow six whole frames." Restore precision with `COOP: same-origin` + `COEP: require-corp`.

**The correct answer is not to detect.** MDN: always use the timestamp argument, "otherwise, the animation will run faster on high refresh-rate screens." Go delta-time (§7.2) and the question disappears.

### 1.4 Is rAF capped?

- **Chrome background tabs:** rAF is **not called at all** — fully paused, not throttled. Behavior since 2011. <https://developer.chrome.com/blog/background_tabs> [primary]
- **Firefox background tabs:** throttled to **1Hz** since Firefox 40.
- **The "1Hz" figure people misattribute to rAF is actually `setTimeout`** — one run per second per timer in background tabs since Chrome 11; Chrome 88 added heavy throttling (1-minute intervals) for chained timers after 5 minutes backgrounded. <https://developer.chrome.com/blog/timer-throttling-in-chrome-88>
- **Cross-origin iframes (Chromium):** non-visible/`display:none` cross-process frames get partial layout only — **rAF and ResizeObserver do not run.** <https://learn.microsoft.com/en-us/deployedge/edge-learnmore-iframe-throttling-display>
- **Cross-origin iframes (Safari):** throttled until user interaction; "uncapped on click/tap (but *not* mouse/touchstart)."
- Chromium also throttles rAF by viewport visibility. <https://groups.google.com/a/chromium.org/g/blink-dev/c/_SRHebxivJs>

---

## 2. Compositor-only properties

### 2.1 The two lists, and why they differ

**web.dev (safe, cross-browser):** `transform` and `opacity` only — "the element on which you change these properties should be on its own compositor layer." <https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count>

**Chromium engine capability:** "A subset of style properties (currently **transform, opacity, filter, and backdrop-filter**) can be mutated on the compositor thread." <https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/core/animation/README.md> [primary]

Reconciling: web.dev's is the portable list; Chromium's is the engine list. **Compositor-threaded ≠ cheap.** `filter`/`backdrop-filter` don't block the main thread but are GPU-expensive.

### 2.2 Property-by-property

| Property | Chrome compositor? | Notes |
|---|---|---|
| `transform` / `translate` / `rotate` / `scale` | **Yes** | Gold standard |
| `opacity` | **Yes** | Needs own layer |
| `filter` | **Yes** (Chromium) | Off main thread, still GPU-costly |
| `backdrop-filter` | **Yes** (Chromium) | Worst cost profile — forces backdrop readback |
| `background-color` | **Partial** | Via native paint worklet — repaints per frame |
| `clip-path` | **Partial** | Same mechanism |
| `box-shadow` | **No** | Paint. Animate a shadow pseudo-element's `opacity` instead |
| `border-radius` | **No** (animated) | Paint; static is fine |
| `width`/`height`/`top`/`left`/`margin` | **No** | Layout — the 50%-frame-drop path |

**The `background-color`/`clip-path` nuance is important and widely misreported.** Chrome's post lists hardware-accelerated properties as "`opacity`, `filter`, and `transform` for now," with `background-color` and `clip-path` joining. <https://developer.chrome.com/blog/hardware-accelerated-animations> But the mechanism differs: Chromium implemented it via a **native paint worklet** — "the compositor animates a simple float progress which is then passed into blink code to interpolate." <https://groups.google.com/a/chromium.org/g/blink-reviews-style/c/6l7enY1Yfus> **Timing is off-main-thread; repainting still happens every frame.** Jank-resistant, not free. Do not treat it as equivalent to `opacity`.

Two other Chromium 89 wins: **SVG animations are hardware-accelerated by default**, and **percentage-based transforms** get automatic acceleration (as long as layout size isn't changing per frame).

**Prefer the independent transform properties** — they compose instead of clobbering:

```css
/* Old: the second wins entirely, translate is lost */
.a { transform: translateX(10px); }
.a:hover { transform: scale(1.1); }

/* New: independent, composable, equally compositor-friendly */
.a { translate: 10px 0; scale: 1; }
.a:hover { scale: 1.1; }
```

**Do not cite csstriggers.com.** It predates CompositeAfterPaint, the independent transform properties, accelerated SVG, and accelerated `background-color`/`clip-path`. It is stale in 2026.

### 2.3 The real cost of blur

**Why radius scales cost:** a Gaussian samples a neighborhood per output pixel. Separable two-pass kernels make it O(r) per pixel per pass — so **cost ≈ area × radius**. Large *areas* are the killer, not blur itself.

**A measured figure, with a source-quality caveat:** eight stacked layers at radii 1→128px "will happily take **200ms per frame** over a 1920×1080 region on mid-tier GPUs" — ~24 frames of a 120Hz budget in one frame. Source is a practitioner guide, not a vendor doc: <https://hyperframes.heygen.com/guides/performance> [secondary — treat as directional]. Its recommendation (2–3 stacked blur layers max) is sound regardless.

**Why `backdrop-filter` is categorically worse:** `filter: blur()` blurs the element's own content — self-contained. `backdrop-filter` blurs everything painted *behind*, forcing the compositor to **read back pixels, run the kernel, re-composite**. Consequences:

- **Layer explosion** — each instance needs its backdrop isolated.
- **Video backdrops are the worst case** — the backdrop changes every frame, so the blur can never be cached and re-runs at full cost. Documented choppiness: <https://medium.com/@JTCreateim/backdrop-filter-property-in-css-leads-to-choppiness-in-streaming-video-45fa83f3521b> [secondary]
- **Real Chrome/macOS bug:** the IOSurface transfer for backdrop capture fails on Intel HD 630 / macOS 13, producing transparent pixels. <https://github.com/openai/codex/issues/23458>
- Tracking: <https://bugs.chromium.org/p/chromium/issues/detail?id=497522>

```css
/* 1. NEVER animate blur radius — invalidates the cached blur every frame */
.bad  { transition: backdrop-filter 300ms; }
.good { backdrop-filter: blur(12px); transition: opacity 300ms; }

/* 2. Constrain the area. A 300px panel is cheap; a full-viewport overlay is not */
.panel { backdrop-filter: blur(12px); contain: paint; }

/* 3. Honor the opt-out */
@media (prefers-reduced-transparency: reduce) {
  .panel { backdrop-filter: none; background: rgb(20 20 20 / 0.92); }
}
```

---

## 3. will-change discipline, layers, and containment

### 3.1 MDN's warnings, verbatim

<https://developer.mozilla.org/en-US/docs/Web/CSS/will-change> carries three, all routinely ignored:

> "Some of the stronger optimizations that are likely to be tied to `will-change` end up using a lot of a machine's resources. Overusing the property can cause the page to slow down instead of improving it's performance."

> "So it is a good practice to switch `will-change` on and off using script code before and after the change occurs."

> "`will-change` is intended to be used as a last resort to try to deal with existing performance problems. It should not be used to anticipate performance problems. Excessive use of `will-change` will result in excessive memory use and will cause more complex rendering to occur."

The crux: **`will-change` is a debugging tool, not a design pattern.** `* { will-change: transform }` is strictly worse than nothing.

### 3.2 GPU memory per layer

```
layer bytes ≈ CSS_width × CSS_height × devicePixelRatio² × 4
```

iPhone 15 Pro (393×852 CSS, DPR 3): `393 × 852 × 9 × 4 = ~12.05 MB` **for one layer** [derived]. Ten such layers ≈ **120MB of GPU memory** on a phone.

**Flag:** I could not find a Chromium doc publishing this formula or a "layer budget" number. It follows from the physics (a layer is an RGBA8 texture at device resolution) but Chromium *tiles* large layers rather than allocating monolithically, so real allocation is more nuanced. Treat as sound reasoning, not spec.

What *is* cited: web.dev warns "every layer you create requires memory and management," naming GPU texture upload overhead, CPU→GPU bandwidth, and degradation on memory-limited devices — and gives a target of **4–5ms compositing time** during scroll/transition. <https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count>

### 3.3 Layer explosion and the z-order fix

Promotion triggers: 3D transforms, `will-change: transform|opacity`, video/canvas/WebGL, accelerated filters, sometimes `position: fixed`, and **overlap testing** — anything visually overlapping a composited layer may itself need promotion to preserve paint order. One `will-change` on a low-z element can silently cascade into dozens of layers. Chromium mitigates with **layer squashing** (merging overlapping elements into a shared layer).

The lever you control is z-order:

```css
/* Bad: overlay sits under content that must then be promoted too */
.animating-backdrop { will-change: transform; z-index: 1; }

/* Better: animating element is topmost — nothing cascades */
.animating-overlay { will-change: transform; z-index: 9999; }
```

### 3.4 Inspecting layers in DevTools

**Layers panel** — 3D view; selecting a layer shows **the reason it was created**, which is how you find accidental promotions. <https://developer.chrome.com/docs/devtools/layers>

**Rendering drawer** (Cmd/Ctrl+Shift+P → "Show Rendering") <https://developer.chrome.com/docs/devtools/rendering/performance>:

| Tool | Behavior |
|---|---|
| **Paint flashing** | "Flashes the screen green whenever repainting happens" |
| **Layer borders** | **Orange/olive** = layer borders; **cyan** = tiles (Chromium `debug_colors.cc`) |
| **Frame Rendering Stats** | FPS, GPU raster state, memory; timeline **blue = rendered, yellow = partially presented, red = dropped** |
| **Scrolling performance issues** | Highlights elements with scroll listeners that harm performance |

Reading them: green paint flash on a `transform` animation means **it is not composited** — find out why. Orange borders you never asked for mean layer explosion.

### 3.5 The correct lifecycle

```js
/**
 * Promote just before animating, demote as soon as it settles.
 * Hint on pointerenter/focus so the layer exists BEFORE the animation —
 * setting will-change in the same frame you animate is too late to help.
 */
function withLayerHint(el, hint = 'transform') {
  const on  = () => { el.style.willChange = hint; };
  const off = () => { el.style.willChange = 'auto'; };
  el.addEventListener('pointerenter', on);
  el.addEventListener('focusin', on);
  el.addEventListener('pointerleave', off);
  el.addEventListener('focusout', off);
  el.addEventListener('transitionend', off);
  el.addEventListener('animationend', off);   // note: MDN's example typos this as "animationEnd"
  return () => { off(); /* ...removeEventListener for each... */ };
}

// For WAAPI, the finished promise is cleaner:
el.style.willChange = 'transform';
const anim = el.animate(
  [{ transform: 'translateY(0)' }, { transform: 'translateY(-100px)' }],
  { duration: 300, easing: 'cubic-bezier(.2,0,0,1)' }
);
anim.finished.finally(() => { el.style.willChange = 'auto'; });
```

The one legitimate stylesheet use: a small, bounded, always-animating set (a single scroll-progress bar). A rule matching 200 list items is exactly the antipattern.

### 3.6 `contain` — complementary, not an alternative

<https://developer.mozilla.org/en-US/docs/Web/CSS/contain>

| Value | Effect |
|---|---|
| `layout` | Internal layout isolated both ways; becomes containing block for abs/fixed descendants |
| `paint` | Descendants never paint outside bounds; **offscreen contained elements can be skipped entirely** |
| `size` | Size computed ignoring children |
| `inline-size` | Size containment inline-direction only |
| `style` | Scopes counters/quotes to the subtree |
| `content` | = `layout paint style` |
| `strict` | = `size layout paint style` |

| | `contain` | `will-change` |
|---|---|---|
| Says | "changes here **cannot escape**" | "this is **about to change**" |
| Cost | ~free; a scoping guarantee | allocates GPU memory / layers |
| Lifetime | **permanent in stylesheet is correct** | **temporary; toggle via JS** |
| Visual side effects | yes (`paint` clips, `size` ignores children) | generally none |

`contain` reduces the *scope* of work; `will-change` pre-allocates *resources*. `contain: paint` on a card plus toggled `will-change` during its animation is coherent.

### 3.7 `translateZ(0)` / `backface-visibility: hidden` in 2026

**As a performance hack: obsolete.** web.dev presents `translateZ(0)` explicitly as the fallback "for older browser support," with `will-change: transform` as the modern form. `will-change` is superior because it's declarative intent — the browser may decline or promote earlier — whereas `translateZ(0)` unconditionally forces a 3D rendering context and can alter stacking context and text rasterization.

**As an iOS Safari bug workaround: still alive.** Flicker during momentum scroll; `border-radius` + `overflow: hidden` failing to clip a composited child (<https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0>); `position: fixed` under transformed ancestors.

**Minifier hazard worth knowing:** esbuild and others rewrite `translate3d(0,0,0)` → `translate(0)`, **breaking Safari layouts**, because the 2D form does not create a 3D rendering context. <https://github.com/evanw/esbuild/issues/2057> `will-change` cannot be minified into a different meaning — another reason to prefer it.

Rule: never reach for `translateZ(0)` for speed. Reach for it only against a reproduced iOS bug, prefer `will-change: transform` even then, and comment it so it doesn't get "cleaned up."

---

## 4. Layout thrashing

### 4.1 The mechanism

Layout is normally deferred and batched. A **forced synchronous layout** happens when JS reads a geometric property *after invalidating style/layout in the same task*. Paul Irish's key nuance:

> "Reflow only has a cost if the document has changed and invalidated the style or layout."

<https://gist.github.com/paulirish/5d52fb081b3570c81e3a>

So `offsetWidth` on a clean frame is nearly free; `offsetWidth` after one `style.width =` is a full synchronous layout. **Thrashing** is doing that in a loop.

Chrome DevTools flags it above **30ms** — the stated goal is literally "Have no forced reflows that take longer than 30 milliseconds." <https://developer.chrome.com/docs/performance/insights/forced-reflow> Forced reflow degrades both LCP and INP.

### 4.2 Read/write batching

```js
// BEFORE — N forced layouts (web.dev's canonical example)
function resizeAll() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = `${box.offsetWidth}px`;  // read after write, per iteration
  }
}

// AFTER — 1 layout
const width = box.offsetWidth;                            // READ phase, hoisted
function resizeAll() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = `${width}px`;             // WRITE phase only
  }
}
```

Generalized:

```js
// PHASE 1 — read everything, mutate nothing.
// Only the FIRST read forces layout; the rest are free because nothing invalidated.
const measured = elements.map(el => ({ el, rect: el.getBoundingClientRect() }));

// PHASE 2 — write everything, read nothing. Coalesced into one layout.
for (const { el, rect } of measured) {
  el.style.transform = `translateY(${rect.top * 0.5}px)`;
}
```

<https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing>

### 4.3 The trigger list

From Paul Irish's gist:

- **Box metrics:** `offsetLeft/Top/Width/Height/Parent`, `clientLeft/Top/Width/Height`, `getClientRects()`, `getBoundingClientRect()`
- **Scrolling:** `scrollWidth/Height`, `scrollLeft/Top` (**read *and* write**), `scrollBy()`, `scrollTo()`, `scrollIntoView()`, `scrollIntoViewIfNeeded()`
- **Focus/selection:** `element.focus()`, `input.select()`, `textarea.select()`
- **Other:** `innerText` (getter), `computedRole`, `computedName`
- **Window:** `window.scrollX/scrollY`, `visualViewport.height/width/offsetTop/offsetLeft`
- **Document:** `elementFromPoint()`; `document.scrollingElement` forces **style recalc only**
- **Mouse events:** `layerX/layerY/offsetX/offsetY`
- **Range:** `getClientRects()`, `getBoundingClientRect()`
- **SVG:** `computeCTM()`, `getBBox()`, and the whole `SVGTextContent` family (`getComputedTextLength()`, `getExtentOfChar()`, `getNumberOfChars()`, `getSubStringLength()`, …)
- **Canvas 2D (surprising):** setting `fillStyle`/`strokeStyle`/`shadowColor`/`filter`, getting `direction`, calling `fillText()`/`strokeText()` — because these resolve `currentColor` and text directionality
- **contenteditable:** many operations

**`getComputedStyle()` is conditional — this correction matters.** It forces layout only when **any** of these hold:
1. The element is in a **shadow tree**
2. **Viewport-dependent media queries** exist in the page (`min/max-width`, `height`, `aspect-ratio`, `device-pixel-ratio`, `resolution`, `orientation`)
3. The **requested property** is box/position (`height`, `width`, `top`/`right`/`bottom`/`left`), a fixed `margin*`/`padding*`, transform-ish (`transform`, `transform-origin`, `perspective-origin`, `translate`, `rotate`, `scale`), or grid (`grid`, `grid-template*`)

Reading `getComputedStyle(el).color` on a light-DOM element in a page with no viewport MQs is cheap. "Never call getComputedStyle" is folklore.

**Second correction:** `window.innerHeight`/`innerWidth` **no longer force reflow** in recent Chrome (133+), contradicting most existing documentation.

### 4.4 fastdom in 2026

<https://github.com/wilsonpage/fastdom> — ~600 bytes min+gzip, MIT.

```js
fastdom.measure(fn)   // queue a READ
fastdom.mutate(fn)    // queue a WRITE
fastdom.clear(id)
// Both flushed at the next rAF: ALL reads first, then ALL writes, regardless of call order.
```

**Status: last release v1.0.4, August 2016.** Effectively feature-frozen. The rAF batching contract hasn't changed so it still works, but you're adopting an unmaintained dependency for 20 lines of logic.

Modern practice, in order of leverage:
1. **`ResizeObserver`/`IntersectionObserver` instead of measuring in handlers** — the observer *hands you* the measurement (`entry.contentRect`), eliminating the read entirely. Biggest structural fix.
2. **CSS scroll-driven animations** — removes the JS read/write loop from scroll effects altogether.
3. **Hand-roll the two queues.** 
4. FT's maintained fork: <https://github.com/Financial-Times/fastdom>

### 4.5 ResizeObserver vs `resize`

1. **Element-level, not window-level** — fires on content changes, flex/grid reflow, font loading, sibling mutations. `resize` misses all of these.
2. **Hands you the measurement** (`contentRect`, `borderBoxSize`, `contentBoxSize`, `devicePixelContentBoxSize`) so **you never force a reflow.**
3. **Correct timing:** delivered *after layout, before paint*, inside the frame. Mutating styles in an RO callback folds into the same frame's paint — no flash, no extra forced layout. `resize` handlers run as ordinary tasks, so any measurement there forces layout.
4. Naturally frame-aligned — no debounce wrappers.

**"ResizeObserver loop completed with undelivered notifications"** (formerly "loop limit exceeded") is an `error` event on `window`, not an exception. Your callback resized something, generating new notifications in the same frame; the spec only re-runs for observations at a *deeper depth*, so the browser defers the rest and fires the error. It prevents UA lockup; it does not fix your logical loop.

```js
const ro = new ResizeObserver(entries => {
  requestAnimationFrame(() => {           // defer past paint, breaking the feedback loop
    for (const e of entries) e.target.style.setProperty('--w', `${e.contentRect.width}px`);
  });
});
```

Better: don't write a property that feeds back into the observed box; observe the *parent*, size the *child*. This error is extremely common and usually benign framework churn (react-virtuoso, radix-ui, CodeMirror all hit it) — filter it from error reporting only after confirming it isn't masking real jank.

### 4.6 Field attribution

LoAF exposes `forcedStyleAndLayoutDuration` per script — layout-thrash detection in production, not just locally:

```js
new PerformanceObserver(list => {
  for (const frame of list.getEntries())
    for (const script of frame.scripts)
      if (script.forcedStyleAndLayoutDuration > 10)
        console.warn('forced layout', script.sourceURL, script.forcedStyleAndLayoutDuration);
}).observe({ type: 'long-animation-frame', buffered: true });
```

---

## 5. `content-visibility: auto` + `contain-intrinsic-size`

### 5.1 Syntax and semantics

```css
.story {
  content-visibility: auto;
  contain-intrinsic-size: auto 1000px;
}
```

- **`visible`** — no effect
- **`auto`** — always applies `layout`, `style`, `paint` containment. While **not relevant to the user** (offscreen, unfocused, nothing selected), *additionally* applies `size` containment and **skips subtree rendering entirely**. Content stays available to find-in-page, tab order, focus, selection, and the a11y tree.
- **`hidden`** — skips unconditionally, **not** findable/focusable/selectable. Close to `display: none` but **caches rendering state**, making the toggle back dramatically cheaper. The right primitive for virtualized lists, tab panels, offscreen route caching.

Relationship to `contain: content` (= `layout paint style`): `auto` applies exactly that set as its baseline, then **dynamically adds `size`** when offscreen. That addition is why `contain-intrinsic-size` is not optional.

### 5.2 Measured gains

**The headline:** chunking a long travel-blog article dropped initial-load **rendering time from 232ms to 30ms — roughly 7×**. <https://web.dev/articles/content-visibility> [primary]

Read the scope carefully: that is *rendering* time (style+layout+paint), not page load, not TTI. Big win on long, section-heavy documents — articles, docs, feeds, comment threads, long marketing pages. Near-zero on a short viewport-sized page.

**INP evidence:** NitroPack reports auto-applying it moved **INP from 272ms into the good band**, halved a **69.87ms long task**, and cut style-recalc scope **from 1,139 elements to under half**. <https://nitropack.io/blog/content-visibility-inp/> [secondary — bundles their other optimizations; directional only]. I could not find an isolated, well-controlled 2024–2026 field case study.

### 5.3 `contain-intrinsic-size` and the `auto` keyword

When size containment engages, contents no longer contribute to size — **an unsized div collapses to zero height**. `contain-intrinsic-size` supplies the placeholder.

```css
contain-intrinsic-size: 500px;        /* both axes */
contain-intrinsic-size: auto 500px;   /* ← use this one */
```

**The `auto` keyword is the important part.** Before first render, the browser uses 500px. Once rendered at least once, it **remembers the last actually-rendered size** and uses that when the element scrolls away. This converts "guess a number" into "guess once, then be exact," and is what makes the property usable for infinite scrollers and heterogeneous lists. Always prefer `auto <length>` unless items are uniform.

### 5.4 Pitfalls

1. **Scrollbar jumping / scroll instability** — the #1 complaint. Without good estimates, document height is fiction; as elements render, real heights replace estimates and the thumb jumps. **Scrolling upward is worse** because content above you resizes. Mitigate: always set `contain-intrinsic-size`, use `auto`, estimate high rather than low.
2. **Find-in-page** — by spec and in Chromium, `auto` content **is** findable (the browser renders it on demand). But **Safari's Cmd+F does not reliably find text inside `content-visibility: auto` subtrees.** <https://adactio.com/journal/21498> This is a genuine 2026 cross-browser gap; I found no official WebKit statement on whether it's intended or a defect. If in-page search is load-bearing, test it.
3. **Accessibility** — content stays in the DOM and a11y tree. This is the central advantage over `display: none`.
4. **Focus/selection/anchors force rendering** — `:target`, `.focus()`, and text selection all mark the element relevant.
5. **Geometry APIs undo the optimization.** Calling `getBoundingClientRect()`/`offsetHeight` on a skipped subtree forces it to render. **Chromium logs a console warning.** This is §4 colliding with §5 — your measuring code can silently negate the win.
6. **`contentvisibilityautostatechange`** is the escape hatch:

```js
canvasContainer.addEventListener('contentvisibilityautostatechange', e => {
  e.skipped ? stopDrawing() : startDrawing();
});
```

### 5.5 Relation to `hidden=until-found`

Same machinery, different problem. `hidden=until-found` applies **`content-visibility: hidden`** internally — *not* `display: none`, which is what the plain `hidden` attribute applies. Because of that the browser **can** search the text; on a match it fires **`beforematch`**, removes the attribute, and scrolls to it. Shipped Chrome/Edge 102 (May 2022). Feature-detect: `'onbeforematch' in document.body`. <https://developer.chrome.com/docs/css-ui/hidden-until-found>

Mental model: **`auto` = performance, stays findable. `hidden` = manual control, not findable. `hidden=until-found` = `hidden` plus browser-driven reveal.**

### 5.6 Support

| Browser | Support |
|---|---|
| Chrome / Edge | 85+ (Aug 2020) |
| Firefox | 125+ (Apr 2024) |
| Safari | 18+ (Sept 2024) |

**Baseline: Newly available, September 2024.** <https://web.dev/blog/css-content-visibility-baseline> By mid-2026 that's ~2 years of universal modern support, and unsupported browsers simply render everything normally — degradation is automatic. Ship it unprefixed.

---

## 6. Smooth scroll tradeoffs

### 6.1 Two architectures — the distinction most posts miss

**Transform hijacking** (Locomotive v3/v4 smooth mode, GSAP ScrollSmoother, most 2018-era libs): the page is collapsed to viewport height, a JS listener maintains a virtual position, a wrapper moves via `translate3d`. **The document does not actually scroll.** Consequences: `position: sticky` is meaningless; the scrollbar is fake; find-in-page scrolls a non-scrolling document; `scrollIntoView()`, `:target`, and scroll restoration break; keyboard nav does nothing unless reimplemented; screen readers are confused.

**Native scroll interpolation** (Lenis): explicitly **"no CSS transforms, no hijacked scrollbars, no accessibility trade-offs."** <https://www.lenis.dev/> It `preventDefault()`s the gesture, computes an eased target, and drives the **browser's real scroll position** each rAF tick. `scrollTop` is real. This is why sticky, anchors, find-in-page, keyboard nav, and screen readers survive — and why Lenis displaced Locomotive.

### 6.2 What still breaks with Lenis

1. **`position: sticky`, indirectly and near-universally.** Not architectural, but ubiquitous: `overflow-x: hidden` on `html`/`body` creates a **new scroll container**, silently killing sticky downstream. Fix is one word: **`overflow-x: clip`** (Chrome 90+, FF 81+, Safari 16+ — safe everywhere). This is the single highest-leverage fix for "my sticky broke."
2. **CSS scroll-driven animations — genuinely conflicting.** `animation-timeline: scroll()`/`view()` are evaluated by the compositor against the **real** scroll offset, which Lenis deliberately lags behind the visual position. The CSS animation tracks a position that isn't on screen. **No clean fix — pick one system.** <https://raoulcoutard.com/posts/2026-02-03-lenis-scrollsnap-conflict-en/>
3. **CSS `scroll-snap` — officially unsupported.** Lenis's README states **"no support for CSS scroll-snap"** and ships `lenis/snap` as a replacement. Mobile breaks first.
4. **iOS momentum.** With `syncTouch: false` (default) touch stays native — you keep momentum and rubber-banding but get a desktop/mobile inconsistency. Setting `syncTouch: true` **replaces Apple's tuned physics** with Lenis's, losing rubber-band feel and often adding lag. README also notes Safari's 60fps cap and that scrolling over iframes malfunctions.
5. **Latency is an accessibility issue.** WCAG 2.1 **2.3.3 Animation from Interactions (AAA)** asks that interaction-triggered motion be disableable. Nothing at A/AA forbids it, but `prefers-reduced-motion` is the expected accommodation.
6. **`prefers-reduced-motion` is NOT handled for you.** Reviewing the README, there is **no built-in handling**. Every "Lenis respects reduced motion" claim describes code *you* must write. This is the most-skipped step in real deployments.
7. **`scroll-behavior: smooth` conflicts** — both animate the same scroll. Lenis's own CSS sets `scroll-behavior: auto !important` on `html.lenis`.

### 6.3 Minimum-harm configuration

Current version **v1.3.25** (June 2026). Packages: `lenis`, `lenis/react`, `lenis/vue`, `lenis/framer`, `lenis/snap`.

Key defaults: `lerp: 0.1`, `duration: 1.2`, `smoothWheel: true`, **`syncTouch: false`**, `autoRaf: false`, `anchors: false`.

```js
import Lenis from 'lenis';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lenis = null;

function setup() {
  // 1. HARD REQUIREMENT: never run at all under reduced-motion.
  if (reduceMotion.matches) { lenis?.destroy(); lenis = null; return; }

  lenis = new Lenis({
    lerp: 0.15,          // 2. 0.1 feels laggy on trackpads; 0.15–0.2 keeps character, cuts latency
    syncTouch: false,    // 3. Leave touch NATIVE — preserves iOS momentum. Already default; don't flip.
    smoothWheel: true,
    anchors: true,       // 4. Let Lenis own #hash so anchors land correctly
    prevent: (node) =>   // 5. Opt out anything with its own scroll context
      node.closest?.('[data-lenis-prevent], dialog, .overflow-auto') != null,
  });

  (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
}
setup();
reduceMotion.addEventListener('change', setup);  // 6. users toggle mid-session
```

```css
html, body { overflow-x: clip; }              /* 7. NOT hidden — preserves sticky */
html.lenis { scroll-behavior: auto !important; }  /* 8. stop the two fighting */

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto !important; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Ranked by impact: **(1) reduced-motion bailout**, **(3) native touch**, **(7) `overflow-x: clip`**, **(2) raise lerp**, **(5) `prevent`**.

### 6.4 The native counter-argument

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;  /* offset for sticky header */
}
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
```

This smooths **programmatic and anchor** scrolls only — **not wheel input**. That gap is precisely what Lenis fills, and it's worth asking whether the gap justifies the dependency.

**Scroll-driven animations are the real replacement for scroll-JS.** <https://developer.chrome.com/docs/css-ui/scroll-driven-animations>, <https://scroll-driven-animations.style/>

```css
/* Anonymous scroll progress timeline — a progress bar, zero JS */
@keyframes grow-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.progress-bar {
  transform-origin: 0 50%;
  animation: grow-progress linear;
  animation-timeline: scroll(root block);   /* animation-duration must be auto/omitted */
}

/* Anonymous view progress — classic reveal-on-scroll, no IntersectionObserver */
@keyframes reveal { from { opacity: 0; translate: 0 2rem; } to { opacity: 1; } }
img { animation: reveal linear both; animation-timeline: view(); }

/* Named, with an explicit range */
.revealing-image {
  view-timeline: --revealing-image block;
  animation: reveal auto linear both;
  animation-timeline: --revealing-image;
  animation-range: entry 25% cover 50%;
}
```

Ranges: `cover`, `contain`, `entry`, `exit`, `entry-crossing`, `exit-crossing`.

JS equivalents (`ScrollTimeline`/`ViewTimeline`) exist but MDN flags them **"Limited Availability — not Baseline."** <https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline> Prefer the CSS form, which degrades through the cascade.

**Support:** Chrome/Edge **115+** (July 2023), Safari **26+**, Firefox **behind a flag** (`layout.css.scroll-driven-animations.enabled`). Firefox is the blocker, but these degrade to "no animation," not "broken layout":

```css
@supports (animation-timeline: view()) {
  .card { animation: reveal linear both; animation-timeline: view(); }
}
```

**The decisive advantage:** scroll-driven animations run **off the main thread**. A Lenis + GSAP ScrollTrigger stack reads scroll and writes styles on the main thread at 60–120Hz — precisely the §4 read/write pattern. Scroll-driven animations have zero main-thread cost, so they don't degrade INP and don't jank under load.

### 6.5 Do studios still use Lenis in 2026?

**Yes, still dominant.** Described as dominating smooth scroll in 2026 as Locomotive's successor, routinely paired with 3D scenes in Awwwards SOTD listings <https://svilenkovic.com/3d/scrollytelling-trends-2026>. Lenis itself won Awwwards SOTD. Codrops is still publishing Lenis tutorials as of **May 2026** <https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/>.

**But the cracks are visible.** Codrops's **March 2026** "Sticky Grid Scroll" builds its effect on **CSS scroll-driven animations + `position: sticky` with no smooth-scroll library** <https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/> — the same publication now demonstrates both. The February 2026 "Why Lenis Broke My Scroll-Snap" concludes that removing Lenis for CSS scroll-snap + native smooth scroll is a legitimate resolution.

**Synthesis:** Lenis remains the standard in the Awwwards/FWA tier because that tier *wants* the weighted wheel feel, and Lenis delivers it at far lower a11y cost than anything before it. But its value has narrowed to **exactly one thing — smoothing wheel input** — because everything it used to be bundled with (reveals, parallax, progress, pinning) is now native, compositor-driven CSS that's faster and doesn't conflict with the platform. If you don't specifically need wheel smoothing, it's no longer load-bearing, and keeping it actively costs you scroll-snap and scroll-driven animations.

---

## 7. rAF patterns

### 7.1 One global loop

Why it wins: **deterministic ordering** (GSAP: a single ticker prevents animations "spewing out in clumps," ensuring "perfect synchronization across staggers"); **one read/write phase → one style recalc** (N loops interleave read/write/read/write, forcing a synchronous layout per loop); **one pause switch**; **one `dt`**, so a scroll smoother and a WebGL camera can't drift apart by a frame.

```js
const subscribers = new Set();
let last = performance.now(), rafId = null;

function tick(now) {
  rafId = requestAnimationFrame(tick);
  let dt = (now - last) / 1000;
  last = now;
  dt = Math.min(dt, 1 / 30);          // clamp — see 7.3
  for (const fn of subscribers) fn(dt, now);
}
export const ticker = {
  add: (fn) => (subscribers.add(fn), () => subscribers.delete(fn)),
  start() { if (!rafId) { last = performance.now(); rafId = requestAnimationFrame(tick); } },
  stop()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } },
};
```

- **GSAP:** `gsap.ticker.add(fn)` → `(time_seconds, deltaTime_ms, frame)`. <https://gsap.com/docs/v3/GSAP/gsap.ticker/>
- **Lenis:** `autoRaf` **defaults to `false`** — hand it your loop.
- **Three.js:** `renderer.setAnimationLoop(fn)`, not raw rAF — in a WebXR session the frame source is the headset's `XRSession.requestAnimationFrame`, and raw rAF simply will not drive an immersive session.

Combined:
```js
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));   // seconds → ms
gsap.ticker.lagSmoothing(0);
```

**`gsap.ticker.lagSmoothing()`** defaults to threshold **500ms / adjustedLag 33ms**: when a frame exceeds 500ms (GC, tab return), the engine pretends only 33ms elapsed so animations don't teleport. The Lenis recipe disables it because scroll must track the *real* offset, not a smoothed fiction, or the smoother desyncs from the scrollbar.

### 7.2 Delta-time normalization — the #1 high-refresh bug

```js
x += (target - x) * 0.1;   // ❌ frame-rate dependent
```

Rory Driscoll: "This code is broken because it takes a chunk out between a and b each frame and we know that the frame rate is variable, so the smoothing will also be variable." <https://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/>

**Why it's exactly 2× faster at 120Hz [derived]:** remaining error after one second is `(1-t)^fps`.
- 60Hz, t=0.1 → `0.9^60 = 1.80e-3` (0.18% of gap remains)
- 120Hz, t=0.1 → `0.9^120 = 3.24e-6` (0.0003% remains) — the *square*

Time constant τ (decay to 1/e): τ₆₀ = `-1/(60·ln0.9)` = **0.158s**; τ₁₂₀ = **0.079s**. Exactly half. Your carefully tuned "buttery" smoothing becomes twice as snappy on a 120Hz iPhone, and twice as mushy on a thermally-throttled 30Hz device.

**Both candidate fixes are correct and algebraically identical [derived]:**

```js
// Form 1 — "keep my 60fps-tuned t"
x = target + (x - target) * Math.pow(1 - t, dt * 60);

// Form 2 — same thing as a corrected lerp factor
const factor = 1 - Math.pow(1 - t, dt * 60);
x = x + (target - x) * factor;
```

Proof: `x + (target-x)(1-k)` = `target - (target-x)k` = `target + (x-target)k`, with `k = (1-t)^(dt·60)`. Sanity check: at 60Hz, `dt·60 = 1`, so `k = 1-t` and `factor = t` — your original tuning returns exactly. This is the **migration-friendly** form.

```js
/** Frame-rate-independent damp. `t` = the fraction you'd use per frame at 60fps. */
export const damp60 = (x, target, t, dt) =>
  target + (x - target) * Math.pow(1 - t, dt * 60);

/** Lambda form (Freya Holmér / Driscoll). λ ≈ 6.32 ≡ t=0.1@60fps. */
export const damp = (x, target, lambda, dt) =>
  target + (x - target) * Math.exp(-lambda * dt);
```

λ equivalence: `λ = -60·ln(1-t)` [derived]. The `exp` form is marginally cheaper than `pow` and numerically better-behaved for large `dt` (it decays smoothly to 0). **Prefer `exp` for new code; use `damp60` when retrofitting hand-tuned values.**

For rotations, use quaternion slerp with the same `1 - exp(-λ·dt)` interpolant — component-wise damping then renormalizing is not equivalent.

### 7.3 Clamping and fixed timestep

Two reasons to clamp: **tab-switch spikes** (`now - last` can be minutes; velocity integration launches objects into the void) and **long tasks** (a 400ms GC or sync image decode).

Gaffer's canonical clamp is **0.25s**; GSAP's is more aggressive (>500ms → 33ms). For web UI I'd clamp tighter than Gaffer — `Math.min(dt, 1/30)` — because 0.25s of catch-up in a scroll smoother is a visible lurch. Pair with an explicit reset:

```js
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') last = performance.now(); // dt ≈ 0
});
```

Fixed-timestep accumulator for physics (<https://gafferongames.com/post/fix_your_timestep/>):

```js
const FIXED = 1 / 120;           // physics rate, independent of display rate
let acc = 0, prev = snapshot(state);

ticker.add((dt) => {
  acc += Math.min(dt, 0.25);
  let steps = 0;
  while (acc >= FIXED && steps++ < 5) {   // cap iterations — guards the "spiral of death"
    prev = snapshot(state);
    integrate(state, FIXED);
    acc -= FIXED;
  }
  render(lerpState(prev, state, acc / FIXED));   // ← alpha interpolation
});
```

The **alpha interpolation is the part people skip**, and it's what removes temporal aliasing when 120Hz physics meets a 165Hz or 60Hz display. Without it you get visible stutter at any refresh that isn't an integer multiple of your step.

### 7.4 Why throttling rAF is usually wrong

`gsap.ticker.fps(30)` exists, and manual accumulator throttles are easy. But rAF fires at the *display's* rate — throttling to 30fps on a 120Hz panel means presenting every 4th vsync, except accumulator drift makes it sometimes the 3rd or 5th. **That's judder, and irregular pacing reads as worse than consistent 30fps.** The only clean ratios are integer divisors of the actual refresh rate, which you don't know at author time and which changes when the window moves to another monitor.

Better, in order: **do less work** → **render on demand** → **lower resolution, not frame rate** (the eye tolerates soft pixels far better than uneven motion) → throttle only genuinely low-frequency subsystems (stats HUDs, network sync, LOD), never the visual frame.

### 7.5 Passive listeners

MDN, on defaults — note **two things people get wrong**:

> "If this option is not specified it defaults to `false` – except that in browsers other than Safari, it defaults to `true` for `wheel`, `mousewheel`, `touchstart` and `touchmove` events on the document-level nodes."

(a) `wheel`/`mousewheel` are in that list too, not just touch; (b) **Safari is excluded**, so your unannotated `touchmove` handler is still scroll-blocking there. Always annotate explicitly:

```js
el.addEventListener('wheel', onWheel, { passive: true });
el.addEventListener('touchmove', onTouch, { passive: true });
el.addEventListener('wheel', blocker, { passive: false });  // be explicit when you DO block
```

**Chrome 56's measured payoff:** "roughly 80% of touch listeners registered to root targets were conceptually passive but not coded that way." Result — **"Before the intervention was enabled 1% of scrolls took just over 400ms. That has now been reduced to just over 250ms in Chrome 56 Beta; a reduction of about 38%."** <https://developer.chrome.com/blog/scrolling-intervention>

Mechanism: a non-passive listener means the compositor cannot start scrolling until the main thread runs your JS and reports whether it called `preventDefault()`. If the main thread is busy with your animation loop, scroll input queues behind it. **This is the single highest-leverage one-line change for scroll jank on a page running a heavy rAF loop.** To block scroll without a non-passive listener, use `touch-action: none` / `pan-y pinch-zoom` in CSS.

### 7.6 `scrollend`

**Baseline since December 2025.** <https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollend_event>

```js
// ❌ Old: fires early mid-fling, and fires while a finger is still down on a paused drag
let t; el.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(done, 150); });

// ✅ New
el.addEventListener('scrollend', done);
```

The old hack was genuinely broken, not merely ugly: a 150ms debounce fires *during* iOS momentum whenever the fling briefly slows. `scrollend` knows about pointer state and scroll-snap settling; a timer cannot. Fires only if position actually changed. Document-level counterpart exists.

### 7.7 WAAPI off the main thread

A compositor-driven `element.animate()` on `transform`/`opacity` **keeps running at full display rate even while the main thread is blocked**. A rAF-driven animation stalls with it. For any motion not needing per-frame JS decisions, WAAPI is strictly more robust:

```js
el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100px)' }],
           { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
```

---

## 8. WebGL / canvas performance

### 8.1 DPR clamping — the quadratic trap

Fragment shaders run once per *physical* pixel (minimum — more with overdraw/MSAA). iPhone 14 Pro, 393×852 CSS [derived]:

| DPR | Backbuffer | Pixels | Relative fragment work |
|---|---|---|---|
| 1 | 393×852 | 334,836 | 1.00× |
| 2 | 786×1704 | 1,339,344 | **4.00×** |
| 3 | 1179×2556 | 3,013,524 | **9.00×** |

Capping 3→2 removes **55.6% of all fragment work** (a 2.25× reduction) for a difference most eyes cannot resolve at phone distance. Capping to 1.5 removes 75% relative to DPR 3.

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

The community rationale: "many phones report a 3x pixel ratio, and rendering at 3x means nine times the pixel fill compared to 1x… negligible visual difference between 2x and 3x, but massive performance difference." <https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/> [secondary]

Two gotchas: **`devicePixelRatio` changes at runtime** (window moved to another monitor, zoom) — don't read it once at boot; and **postprocessing multiplies this**, since each fullscreen pass re-reads and re-writes the whole backbuffer. Composite low-frequency effects (bloom, DOF) at half resolution.

### 8.2 Dynamic resolution scaling

Keep frame *rate* pinned, let resolution float:

```js
let scale = 1, samples = [], lastAdjust = 0;
const TARGET = 1000 / 60;

ticker.add((dt, now) => {
  samples.push(dt * 1000);
  if (samples.length < 30) return;
  const med = samples.sort((a, b) => a - b)[15];   // MEDIAN — one GC pause shouldn't drop resolution
  samples.length = 0;
  if (now - lastAdjust < 500) return;              // hysteresis
  if (med > TARGET * 1.25 && scale > 0.5) { scale -= 0.1; lastAdjust = now; }
  else if (med < TARGET * 0.8 && scale < 1) { scale += 0.1; lastAdjust = now; }
  else return;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2) * scale);
});
```

Clamp the floor at ~0.5 — below that the image visibly disintegrates and users prefer the frame drop.

### 8.3 Render on demand

Three.js's manual is direct: for static scenes a continuous loop "wastes device power and battery life on portable devices." <https://threejs.org/manual/en/rendering-on-demand.html>

```js
// The damping trap: controls.enableDamping needs continuous update(), which
// naively reintroduces an infinite loop. The manual's coalescing fix:
let renderRequested = false;
function requestRenderIfNotRequested() {
  if (!renderRequested) { renderRequested = true; requestAnimationFrame(render); }
}
controls.addEventListener('change', requestRenderIfNotRequested);
window.addEventListener('resize', requestRenderIfNotRequested);
```

(`render` resets the flag on entry.) The flag also de-dupes multiple redraw requests within one frame.

Good fit: map viewers, editors, product configurators, dataviz. Poor fit: games, ambient animated art.

**The thermal argument matters more than battery:** mobile GPUs throttle under sustained load — "what runs at 60 FPS initially may drop to 20 FPS after 30 seconds" <https://threejsroadmap.com/blog/draw-calls-the-silent-killer> [secondary]. On-demand rendering keeps the SoC out of its thermal ceiling, so the *interactive* moments are faster than in an always-on app.

### 8.4 OffscreenCanvas + workers

**Baseline: widely available since March 2023** (Safari landed it in 16.4). <https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas>

```js
// main.js
const offscreen = document.getElementById('canvas').transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);   // note the transfer list

// worker.js
onmessage = (evt) => {
  const gl = evt.data.canvas.getContext('webgl');
  (function render(t) { /* draw */ requestAnimationFrame(render); })();  // rAF exists in workers
};
```

**Gain:** rendering survives main-thread jank entirely. A 200ms React reconciliation, a sync layout, a long GC — none of it drops a WebGL frame. On a 120Hz display this is the difference between "occasionally hitches" and "never hitches."

**Lose:** no DOM (anything layout-driven must be measured on the main thread and posted across); **all events must be forwarded**, adding a message-hop of latency — for cursor-tracked effects that hop is perceptible, so consider keeping input state on the main thread and posting coarse targets; `transferControlToOffscreen` is **one-way and once-only**; worse debugging; library support varies (Three.js works, but loaders/controls touching `document` need shims). `contextlost`/`contextrestored` still fire — still handle them.

### 8.5 Draw calls and instancing

"Every Mesh in three.js represents one or more draw requests… Drawing 2 things has more overhead than drawing 1 even if the results are the same." <https://threejs.org/manual/en/optimize-lots-of-objects.html>

**Measured, from the manual's own example** (~19,000 boxes): **under 20fps** before; **60fps** after `BufferGeometryUtils.mergeGeometries()` — **18,999 fewer draw operations**. Tradeoff: merged geometry shares one material (the manual recovers per-box color via vertex colors) and objects become individually immovable.

`InstancedMesh` is strictly better when geometry repeats — one copy, one draw call, per-instance matrix:

```js
const mesh = new THREE.InstancedMesh(geometry, material, 10000);
mesh.setMatrixAt(i, m);
mesh.instanceMatrix.needsUpdate = true;                  // required after mutation
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);    // for frequently-updated instances
```

**Budgets [secondary]:** desktop ~100 draw calls, mobile under ~50, above ~500 any GPU struggles. Caveat: InstancedMesh is not free at low counts — reported slower than plain meshes with shared attributes at small instance counts (<https://github.com/mrdoob/three.js/issues/30352>).

**Measure, don't guess:**
```js
renderer.info.render.calls;      // draw calls this frame — ground truth
renderer.info.render.triangles;
renderer.info.memory.textures;
renderer.info.programs.length;   // shader compilations
```

### 8.6 Shader cost

**The vertex/fragment asymmetry:** a 2-triangle fullscreen quad runs the vertex shader **4 times** and the fragment shader **1,339,344 times** at DPR 2 on that iPhone [derived]. Fragment cost dominates nearly every real scene — which is why DPR clamping is the highest-leverage single knob.

**Overdraw** multiplies it. Opaque front-to-back sorting lets early-Z reject occluded fragments (Three.js does this by default). **Transparency defeats early-Z entirely** — transparent surfaces sort back-to-front and blend, so every layer shades. N overlapping transparent quads = N× fragment cost, unconditionally. A 1000-sprite alpha particle system covering the screen shades tens of millions of fragments per frame. Prefer `alphaTest`/cutout where the visual permits — it restores early-Z.

**Mobile GPUs are tile-based deferred** (Apple, Mali, Adreno). Blending is on-tile and relatively cheap, but framebuffer readback, render-target changes, and MSAA resolves force tile flushes that are very expensive. **Minimize render-target switches on mobile above all else.**

**Why fullscreen blur is expensive [derived]:** a naive Gaussian with radius r is r² texture reads per pixel — a 9×9 kernel is 81 reads × 1.34M pixels = **108M texture reads per frame** at DPR 2. Fixes: (1) **separate the kernel** — two 1-D passes, 18 reads not 81, **4.5× cheaper**; (2) **downsample first** — blur at ¼ resolution, 16× fewer pixels, and the radius shrinks proportionally for the same look (combined with separation, ~72× off naive); (3) exploit bilinear filtering for 2 taps per read; (4) **count your passes** — each is a full backbuffer read+write; a 5-pass chain at DPR 2 moves ~54M pixel-touches of pure bandwidth before any shading.

### 8.7 Texture memory

```
bytes = width × height × 4
bytes_with_mips = width × height × 4 × 1.333    (1 + ¼ + ¹⁄₁₆ + … = 4/3)
```

| Texture | No mips | With mips |
|---|---|---|
| 1024² RGBA8 | 4.0 MB | 5.3 MB |
| 2048² RGBA8 | 16.0 MB | 21.3 MB |
| 4096² RGBA8 | 64.0 MB | 85.3 MB |

**The killer insight: source file size is irrelevant.** A 400KB JPEG at 2048² decompresses to **16MB in VRAM** — 40× expansion. A PBR material with albedo+normal+roughness+metalness+AO at 2048² is **~107MB with mipmaps** [derived]. Five such materials exceed most phones' GPU budget.

**KTX2/Basis Universal is the fix** — it stays compressed *in VRAM*, transcoding at load to the device's native format (BC desktop, ASTC/ETC2 mobile), "typically cuts texture memory 4× to 8×" [secondary]. 2048² at ASTC 4×4 = **4MB** vs 16MB; at ETC2/BC1 = **2MB** [derived].

```js
const ktx2 = new KTX2Loader()
  .setTranscoderPath('/basis/')
  .detectSupport(renderer);   // MANDATORY — picks the target GPU format
gltfLoader.setKTX2Loader(ktx2);
```

Caveats: block compression is **lossy** — poor for normal maps (use UASTC) and hard-edged detail; **if the device supports no compressed format, the transcoder falls back to RGBA8 and you get *more* memory than the original plus transcode CPU cost** (<https://discourse.threejs.org/t/compressed-textures-using-more-memory-than-uncompressed-textures/30077>).

Mobile GPU memory is shared with system RAM with no queryable limit; WebGL contexts are **killed** rather than gracefully degraded. Practical budget: **under ~100MB texture VRAM on mobile**, ~500MB desktop, and always handle `webglcontextlost`.

### 8.8 Pausing — two conditions, ANDed

The naive version has a bug: returning to the tab restarts a loop whose canvas is off-screen.

```js
let visible = !document.hidden, onScreen = false, running = false;
const sync = () => {
  const should = visible && onScreen;
  if (should && !running) { last = performance.now(); ticker.start(); running = true; }
  else if (!should && running) { ticker.stop(); running = false; }
};
document.addEventListener('visibilitychange', () => { visible = !document.hidden; sync(); });
new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); },
                         { rootMargin: '200px' }).observe(canvas);
```

The off-screen case is the one people forget, and on a long scrolling page it's the **dominant** waste — the tab is visible, rAF runs at full rate, and you're burning GPU on pixels nobody can see.

### 8.9 WebGPU status

**[All of §8.9 is secondary — verify against <https://github.com/gpuweb/gpuweb/wiki/Implementation-Status> and <https://caniuse.com/webgpu> before relying on version numbers.]**

- **Chrome/Edge:** default since 113 (Apr 2023); Android since Chrome 121 (Android 12+, Qualcomm/ARM GPUs)
- **Safari 26.0** (Sept 2025) — enabled by default on macOS Tahoe 26, iOS/iPadOS/visionOS 26; 26.2 added WebXR+WebGPU on Vision Pro
- **Firefox:** 141 Windows; 145 macOS Tahoe 26 (ARM64 only); Linux during 2026
- **~84.7% global support as of March 2026**

What it changes for animation work: **compute shaders** (particle sim, physics, culling, skinning move to GPU — removes the per-frame JS cost that caps particle counts today); **much lower CPU draw-call overhead** via render bundles, relaxing the §8.5 budgets; **explicit pipeline state**, eliminating the WebGL "first frame using this material stutters" problem.

**2026 stance:** ship `WebGPURenderer` with a `WebGLRenderer` fallback. Three.js's TSL targets both backends from one source, making the dual path far cheaper than hand-writing WGSL and GLSL.

---

## 9. Reduced motion (and transparency)

### 9.1 `prefers-reduced-motion` done well

Values `reduce` / `no-preference`. Support: Chrome 74+, Edge 79+, Firefox 63+, Safari 10.1+. Fully mature — no support-based excuse.

**The strategy that separates good from lazy.** web.dev is explicit the goal is *not* to nuke all animation. **Remove:** parallax, reveal-on-scroll, autoplay video. **Keep:** loading indicators, action confirmations, progress feedback. <https://web.dev/articles/prefers-reduced-motion>

The article specifically warns against overly aggressive tactics — **some sites depend on animation events firing to function**, so blanket `animation: none !important` can break the page outright. This is why the popular "nuclear" snippet uses `animation-duration: 0.01ms !important` rather than `none`: setting `none` prevents `animationend` from firing, breaking state machines that await it.

**Descending preference hierarchy:**
1. **Replace motion with a fade** — opacity conveys the same state change without vestibular trigger
2. **Reduce distance** — keep the animation, cut translation to a few pixels
3. **Remove parallax and autoplay entirely** — highest-risk patterns
4. Only then disable

**Reduce-first / additive default.** Write animations *inside* `@media (prefers-reduced-motion: no-preference)` rather than writing overrides inside `reduce`. It fails safe: any animation you forget to guard simply doesn't exist for reduce-preference users, instead of shipping unguarded.

```js
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
mq.addEventListener('change', () => { /* stop or restart JS animations */ });
```

**The parentheses around the condition are required** — `matchMedia('prefers-reduced-motion: reduce')` without them yields a query that never matches. Common silent bug.

The `change` listener matters more than it looks: **users toggle this mid-session, often precisely because your page made them ill.** A canvas loop reading the preference once at init keeps animating after the user asks it to stop.

**Canvas/WebGL:** no CSS hook into a render loop, so `matchMedia` is the only mechanism. Hold the MediaQueryList as module state; branch to either (a) render one static representative frame and stop scheduling rAF, or (b) keep the loop but zero out camera movement, parallax offsets, and particle velocities. **(b) is usually better for WebGL** — tearing down and restarting a context is expensive and visually jarring.

Origin, and still the best conceptual writeup: <https://webkit.org/blog/7551/responsive-design-for-motion/>

### 9.2 GSAP `gsap.matchMedia()`

Places setup code in a function that only runs when a query matches; when it stops matching, **all GSAP animations and ScrollTriggers created during that function are reverted automatically**. That teardown is the entire value proposition — hand-rolling ScrollTrigger cleanup on media-query changes is where most implementations break. <https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>

You can register separate handlers for `no-preference` and `reduce` to supply genuinely different setups rather than a degraded one. Gotchas: **do not nest `gsap.context()` inside matchMedia** (it creates a context internally — use `mm.revert()`); use `gsap.matchMediaRefresh()` to re-run handlers after toggling an in-page control.

### 9.3 `prefers-reduced-transparency` — worse support than assumed

- **Chrome/Edge: 118+** ✅
- **Firefox: behind a flag**
- **Safari: not supported** ❌

<https://developer.chrome.com/blog/css-prefers-reduced-transparency>, <https://chromestatus.com/feature/5191066147356672>

**This is the key planning finding.** Three-plus years old and still effectively **Chromium-only** — and Safari, on the platform whose "Reduce Transparency" setting popularized the concept, does not implement it. Claims that "most major browsers have adopted" it are wrong. Treat as progressive enhancement, **never as the sole guarantee of legibility**. On iOS you can detect motion preference but not transparency preference, so glassmorphism must be unconditionally legible in Safari.

OS mapping: macOS Reduce Transparency, Windows Transparency effects, iOS Reduce Transparency.

```css
.card {
  background: hsl(none none 100% / 20%);
  @media (prefers-reduced-transparency: reduce) {
    background: hsl(none none 0% / 80%);
  }
}
```

Note the recommended frosted-glass fallback **keeps the blur and raises opacity** rather than dropping `backdrop-filter`. Deliberate: the accessibility problem is text legibility over varying backdrops, not blur per se. It's also cheaper — if you're already paying for the blur, raising opacity costs nothing.

### 9.4 Related media features

- **`prefers-contrast`** — Baseline May 2022. `no-preference` / `more` / `less` / `custom` (matches when `forced-colors: active`).
- **`forced-colors`** — Baseline Sept 2022. Maps to Windows High Contrast. **Critically for animation-heavy design: `box-shadow`, `text-shadow`, and non-URL `background-image` are forced to `none`.** If your visual hierarchy rests on shadows, it vanishes entirely:

```css
@media (forced-colors: active) {
  .button { border: 2px ButtonText solid; }  /* shadow is gone; restore the affordance */
}
```

- **`update`** — Baseline Sept 2023, and underused. `none` (print) / `slow` (e-readers, underpowered — "cannot render fast enough for smooth animation") / `fast` (screens). Gating on `(update: fast)` is a cheap, well-supported guard excluding e-ink and print from animation work. Pair with `prefers-reduced-motion: no-preference` as a combined enhancement gate.

### 9.5 Safari/iOS specifics

Setting: **Settings → Accessibility → Motion → Reduce Motion**. <https://support.apple.com/en-us/111781>

**What iOS itself does is the best available design brief:** transitions switch to a **dissolve/cross-fade** rather than zoom or slide. Apple's own answer to "reduce motion" is not "no transition" — it is "**replace spatial motion with a fade**." That's precisely web.dev's recommendation, and it means a cross-fade is the platform-idiomatic substitute for nearly any slide/zoom/parallax.

Corollary: **fades are acceptable; scaling is not.** Opacity doesn't trigger vestibular responses; scale and translate do.

Two things the research did **not** settle (worth on-device testing rather than guessing): whether iOS's separate "Prefer Cross-Fade Transitions" sub-toggle affects the media query independently of Reduce Motion, and whether Low Power Mode influences it.

---

## 10. Measurement

### 10.1 DevTools Performance panel

**Frames track color code** <https://developer.chrome.com/docs/devtools/performance/reference>:

| Appearance | Meaning |
|---|---|
| White | Idle frame — no visual change |
| Green | Rendered as expected, on time |
| Yellow, sparse dash | **Partially presented** — *some* visual updates made it |
| Red, dense solid | **Dropped** |

The "partially presented" category is the one to internalize: **the compositor produced an update on time (scrolling stayed smooth) but the main thread missed the deadline (your canvas/JS animation did not advance).** Chromium's rationale is that frame updates "are not boolean."

**Practical read for an animation-heavy site: a band of yellow means your main-thread animation is the bottleneck while compositing is fine** — the signal to move work off-main-thread or onto compositor-only properties. Red means the whole pipeline missed.

**Performance Insights panel — confirmed gone.** Deprecated **Chrome 131**, removed **Chrome 132**. <https://developer.chrome.com/blog/insights-panel-deprecation> Not deleted — folded back into the main Performance panel and combined with the Lighthouse audit engine, surfacing as **Live metrics**, the **Insights sidebar tab**, and the **Layout shifts track**. The 2026 answer to "which panel" is: **Performance panel → Insights tab.**

**Live Metrics.** Opening the Performance panel lands on Live Metrics — local CWV plus, once you click "Set up" in Field data, **CrUX field data (28-day aggregation)** matched to your device class, plus **a summary of notable local-vs-field differences** (the single most useful feature — it tells you when your dev machine is lying). An Interactions section logs eligible interactions color-coded by INP thresholds. <https://developer.chrome.com/blog/devtools-realtime-cwv>

**Correction:** this is **Chrome 129** (announced Sept 17, 2024), not Chrome 120.

**CPU throttling.** Fixed presets are **4×, 6×, 20×**. Mechanically, throttling suspends the tab's main thread in frequent short bursts — at 4× it's suspended ~75% of the time. A 50ms task at 6× becomes 300ms.

Fixed multipliers mislead across machines — 4× on an M4 is not 4× on a 2019 laptop. **Chrome 134 added CPU throttling calibration**: Performance → CPU dropdown → Calibrate… → generates **"low-tier mobile"** and **"mid-tier mobile"** presets specific to *your* machine. <https://developer.chrome.com/blog/new-in-devtools-134> **For an animation-heavy site, calibrated low-tier is the honest test.**

### 10.2 INP

| Rating | Value |
|---|---|
| Good | **≤ 200ms** |
| Needs improvement | 201–500ms |
| Poor | **> 500ms** |

**Became a Core Web Vital, replacing FID, on March 12, 2024.** <https://web.dev/blog/inp-cwv-launch> FID left Search Console immediately; PSI/CrUX ran a six-month window, with FID not guaranteed after Sept 9, 2024.

**There is no Chrome version associated with this** — it was a measurement-policy change across Google's tools, not a browser release. Citing one would be fabrication.

**What it measures:** the **longest interaction latency** on the page, with outlier removal — **ignore one highest interaction for every 50 interactions**. Note the precise mechanic: it's "drop the worst N," not literally a 98th-percentile computation, though it approximates one.

**The three sub-parts**, with genuinely different remedies:
1. **Input delay** — input until handlers begin. → break up long tasks, defer third-party JS
2. **Processing duration** — all event callbacks running to completion. → do less in handlers
3. **Presentation delay** — callbacks finishing to next paint. → shrink DOM, avoid layout thrash and huge style recalcs

**Yield so render-critical work paints first** <https://web.dev/articles/optimize-inp>:

```js
textBox.addEventListener('input', (e) => {
  updateTextBox(e);                     // render-critical: now
  requestAnimationFrame(() => {
    setTimeout(() => {                  // runs AFTER the next paint is committed
      updateWordCount(textBox.textContent);
      checkSpelling(textBox.textContent);
      saveChanges(textBox.textContent);
    }, 0);
  });
});
```

The `rAF` + `setTimeout(0)` sandwich is the portable trick: rAF schedules just before the next paint, the nested timeout pushes into a fresh task after that paint commits.

A non-obvious one from the same article: **rendering HTML client-side skips the browser's implicit yielding** that occurs naturally when parsing a streamed server response — so large client-rendered payloads delay frame presentation in ways the equivalent SSR page would not.

### 10.3 Long Animation Frames (LoAF)

**A long animation frame is one where a rendering update is delayed beyond 50ms.** The conceptual shift from Long Tasks: it measures *the frame*, not the task. **Chrome 123+, Edge 123+. Not in Firefox or Safari.** <https://developer.chrome.com/docs/web-platform/long-animation-frames>

```js
new PerformanceObserver((list) => console.log(list.getEntries()))
  .observe({ type: 'long-animation-frame', buffered: true });
```

`buffered: true` is essential — the worst frames are often during startup.

**Frame fields:** `startTime`, `duration` (excludes presentation), `renderStart`, `styleAndLayoutStart`, `firstUIEventTimestamp`, **`blockingDuration`** (ms blocking input — the field correlating most directly with felt unresponsiveness).

`renderStart` and `styleAndLayoutStart` let you split a frame into script vs style/layout without guessing: script ≈ `renderStart - startTime`.

**`scripts[]`**, populated for scripts exceeding **5ms**: `invoker` (e.g. `"IMG#id.onload"`), `invokerType` (`user-callback` | `event-listener` | `resolve-promise` | `reject-promise` | `classic-script` | `module-script`), `sourceURL`, `sourceFunctionName`, `sourceCharPosition`, `duration`, **`forcedStyleAndLayoutDuration`** (your field layout-thrash detector), `pauseDuration`.

**How it beats `longtask`:** measures complete frames; **includes rendering work** (a frame can blow budget purely in style/layout with no 50ms task); catches **many small tasks that collectively** block a frame (the classic Long Tasks blind spot — twenty 30ms tasks report nothing while the frame is catastrophically late); phase breakdown; vastly better attribution.

**The practical corollary:** `sourceURL` + `sourceCharPosition` means you can map a janky frame back to a specific line in a specific bundle **from real-user data**. Third-party analytics blame becomes provable rather than suspected.

### 10.4 Long Tasks — legacy fallback

```js
new PerformanceObserver((list) => list.getEntries().forEach(e => console.log(e)))
  .observe({ type: 'longtask', buffered: true });
```

Any uninterrupted period where the main UI thread is busy **≥50ms**. Limitations: **attribution is nearly useless** (`name` gives a browsing-context category — you learn "some same-origin code was slow"); **1ms granularity**; **no rendering work**; **blind to accumulated small tasks** — the dominant real-world jank pattern. MDN marks it Experimental, limited availability, not Baseline.

Use LoAF where available; treat `longtask` as fallback, not primary signal.

### 10.5 Lighthouse limits

**Lighthouse cannot measure INP. Structurally.** INP requires real interaction. Lighthouse substitutes **Total Blocking Time**, weighted at **30% of the performance score**. This is the most important thing to know when someone waves a green Lighthouse score at an animation-heavy site: **the score contains no measurement of how the site feels when you touch it.** TBT correlates with INP but is not it. Use field data (CrUX/RUM).

Audits that do exist:
- **"Avoid non-composited animations"** — Chrome writes composite-failure reasons into the DevTools trace; Lighthouse reads it and lists offending nodes with per-animation reasons. **The highest-value Lighthouse audit for an animation-heavy site** — it tells you which animations are on the main thread. <https://developer.chrome.com/docs/lighthouse/performance/non-composited-animations>
- **Layout shift / unsized-images** — deliberately kept as *separate diagnostics* precisely to surface issues that do not directly cause CLS. **A passing CLS does not imply passing these.**

Direction of travel: **Lighthouse is moving to performance insight audits**, aligning with the DevTools Insights model; Lighthouse 13 launched with insight-based audits. Expect further convergence.

### 10.6 `web-vitals` — the attribution build

Current major is **v5**. The attribution build is the one that matters:

```js
import { onINP } from 'web-vitals/attribution';

onINP(({ value, attribution }) => {
  const {
    interactionTarget,          // element first interacted with
    inputDelay,                 // ms before event processing begins
    processingDuration,         // ms of listener processing
    presentationDelay,          // ms until next frame appears
    longAnimationFrameEntries,  // intersecting LoAF entries
  } = attribution;
});
```

**~1.5KB brotli'd over the standard build.** A trivially good trade: without it you learn INP is 340ms; with it you learn *which of the three phases* is 300 of those ms, on *which element*, with **intersecting LoAF entries attached** giving `sourceURL` and `sourceCharPosition` for the responsible script. This is the closest thing to a production stack trace for jank. <https://github.com/GoogleChrome/web-vitals>

---

## 11. Image and video

### 11.1 Format status, 2026

| Format | Global support | Notes |
|---|---|---|
| **WebP** | **96.39%** full | Every modern browser, no flags |
| **AVIF** | **94.9%** full | Chrome 85+, FF 93+, Safari 16.1+, Edge 121+ |
| **JPEG XL** | **16.15%** partial | Safari 17+ native; **Chrome 145 (Feb 2026) behind a flag** |

**JPEG XL, resolving the question:** Chrome shipped it behind a flag, **removed** it, and has now partially reversed — Chrome 145 shipped decoding in Feb 2026, still flag-gated, with default enablement expected later. **The honest summary: JXL remains effectively a Safari-only format on the open web. Flag-gated Chrome support is not deployable support.** A `<picture>` source is harmless if you already have the encodes, but it will serve almost nobody outside Safari.

**Compression:** AVIF is **20–30% smaller than WebP** at matched perceptual quality on photographs; JXL beats AVIF by 10–30% in some scenarios.

**Encode cost — the real AVIF tradeoff:** **5–10× slower than JPEG**, and at default encoder speeds **up to 47× slower than WebP**.

- **AVIF wins:** photographic content, large heroes, gradients and smooth tones (far better banding than WebP), anywhere bytes dominate and encoding is a one-time build cost.
- **AVIF loses:** on-the-fly encoding (47× encode = origin CPU and cache-miss latency), very small images, and **image sequences** — where you may decode dozens of frames per second on the client and *decode* cost, not just encode, becomes the constraint.

**2026 recommendation:** AVIF + WebP fallback via `<picture>` for heroes and photos; for scroll-driven sequences, **benchmark decode time per frame** rather than assuming smallest wins.

### 11.2 Why scroll-scrubbed `<video>` janks

Four independent causes:

1. **Keyframe/delta structure.** Displaying an arbitrary frame requires seeking to the preceding keyframe and decoding forward. Unless keyframe density is very high, seeking is slow and choppy. <https://muffinman.io/blog/scrubbing-videos-using-javascript/>
2. **Decoder latency — measured at 250–500ms** between setting `currentTime` and the frame appearing. <https://blog.yoanngueny.com/the-secrets-for-an-optimized-scroll-based-html5-video/> At scroll rates that's a quarter-second of visible lag. No easing hides it.
3. **No frame-accurate seek guarantee.** `currentTime` is a *time* request, not a *frame* request. The browser may present the nearest decodable frame; two nearby seeks may show the same frame.
4. **iOS restricts programmatic playback** — requires `playsinline` and user-gesture gating, breaking naive implementations.

The summarized tradeoff: **smooth scrolling with terrible video performance, or smooth video with janky scroll.** The naive approach cannot deliver both.

Mitigation if you must use `<video>`: re-encode with a drastically increased keyframe interval (approaching all-intra), trading often-several-fold file size for seek speed.

### 11.3 Image sequence + canvas (the Apple technique)

Export every frame (FFmpeg) → preload → map scroll progress to frame index → `drawImage` to canvas. Because each frame is an independent still, **seeking is O(1) and exact** — precisely what video cannot guarantee. That's why the technique persists despite bandwidth cost. <https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/>

**Apple's actual numbers:** the AirPods animation is **65 PNGs totaling 15.2MB**. Brute-force preload with a loading state — but with one smart optimization: **prioritize frames at major checkpoints first**, so a degraded version can start before the full set arrives.

**The memory constraint people miss.** The expensive operation is **decoding**. Holding N *decoded* frames costs `w × h × 4` each regardless of compressed size. A 1920×1080 frame is ~8.3MB decoded. **65 such frames held decoded is ~540MB** [derived] — infeasible on mobile, against a 15.2MB download. This is why you cannot naively `createImageBitmap()` the whole sequence.

Strategy that follows:
- Keep frames as `HTMLImageElement`s (compressed in memory, browser manages decode) rather than eagerly-decoded `ImageBitmap`s — **except a small sliding window** around the current index.
- Use `createImageBitmap()` for the window only.
- Size frames to actual display size; render the sequence at DPR 1 if needed. **Halving dimensions quarters decoded memory.**
- Consider a CSS-only variant using `steps()` on a sprite sheet driven by scroll-driven animations <https://geyer.dev/blog/css-image-sequence-animations/> — pushes the work off the main thread entirely.

### 11.4 WebCodecs — frame-accurate scrubbing

**Support in 2026 is the headline change** <https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API>:

- Chrome 94+ desktop; **Chrome for Android from 147**
- Edge 94+, Opera 80+, Samsung Internet 17+
- Firefox 130+ desktop
- **Safari 26.0+** full; **Safari 16.4–18.7 partial — video interfaces only** (`VideoDecoder`, `VideoEncoder`, `EncodedVideoChunk`, `VideoFrame`)

**For scrubbing you only need the video interfaces, so the effective Safari floor is 16.4, not 26.0** — a meaningful distinction. Combined with Chrome for Android 147, WebCodecs became broadly viable for this very recently.

```js
const decoder = new VideoDecoder({
  output: (frame) => {
    ctx.drawImage(frame, 0, 0);
    frame.close();               // MANDATORY — VideoFrames hold non-GC'd GPU/system memory
  },
  error: (e) => console.error(e),
});
decoder.configure({ codec: 'avc1.42E01E', codedWidth: 1920, codedHeight: 1080 });
// You must demux the container yourself (mp4box.js) — WebCodecs decodes, it does not parse MP4.
decoder.decode(new EncodedVideoChunk({ type: 'key', timestamp: micros, data: bytes }));
```

Three things the sketch makes visible: **you demux yourself**; **`frame.close()` is mandatory** (leaking exhausts the decoder within seconds); and **seeking still requires feeding from the preceding keyframe forward** — WebCodecs removes the latency and unpredictability, not the GOP structure.

Real implementations use binary search for frame lookup, explicit memory management, and **bidirectional playback optimization** — bidirectional matters because scroll goes both ways and decoding backward means repeatedly re-decoding forward from a keyframe. Reference implementation: <https://github.com/diffusionstudio/webcodecs-scroll-sync>

**Recommendation: WebCodecs for the modern path, image-sequence-on-canvas as fallback.** Frame accuracy everywhere, bandwidth cost only on older browsers.

### 11.5 `requestVideoFrameCallback`

```js
const onFrame = (now, metadata) => { /* … */ video.requestVideoFrameCallback(onFrame); };
video.requestVideoFrameCallback(onFrame);
```

Metadata: `presentationTime`, `expectedDisplayTime`, `mediaTime`, **`presentedFrames`** (dropped-frame detection), `processingDuration`, `width`/`height`.

**Difference from rAF:** rAF fires at display rate; rVFC **syncs to the actual video frame rate** — "the effective rate is the lesser of the video's rate and the browser's rate." For 24fps video on a 60Hz display, rAF does 60 redundant calls/s; rVFC does 24, only when there's genuinely a new frame. Support: Chrome/Edge 83+, Firefox 132+, Safari 15.4+.

For scrubbing it does **not** fix seek latency, but it's the correct way to know *when a seek has landed*, and gives a dropped-frame counter free.

### 11.6 Hero media

**`fetchpriority="high"`.** In-viewport images start at **Low** priority; only after layout does Chrome discover they're in-viewport and boost them. <https://web.dev/articles/fetch-priority>, <https://addyosmani.com/blog/fetch-priority/>

**The critical nuance: `fetchpriority` does not change *when* the browser discovers a resource — only how urgently it fetches once discovered.** For a hero referenced from CSS or injected by JS, `fetchpriority` alone is insufficient; you need `<link rel="preload">` to fix discovery.

Measured impact: Priority Hints improved Etsy's LCP by **4%**; some sites see **20–30%** in lab tests.

```html
<picture>
  <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w, hero-2400.avif 2400w" sizes="100vw">
  <source type="image/webp" srcset="hero-800.webp 800w, hero-1600.webp 1600w, hero-2400.webp 2400w" sizes="100vw">
  <img src="hero-1600.jpg" width="1600" height="900"
       fetchpriority="high" decoding="async" alt="…">
</picture>
```

`decoding="async"` moves decode off the main thread, avoiding a decode-induced block at paint. **Never `loading="lazy"` the LCP image** — it delays discovery until layout, directly regressing LCP. Always set `width`/`height` (or `aspect-ratio`) — this interacts with the Lighthouse `unsized-images` diagnostic.

---

## 12. Corrections to widely-repeated claims

Eight premises did not survive verification. Each changes a decision:

1. **Live Metrics is Chrome 129 (Sept 2024), not Chrome 120.**
2. **The Performance Insights panel was deprecated in Chrome 131 and removed in 132** — folded into the Performance panel's Live metrics / Insights tab / Layout shifts track. Use **Performance → Insights**.
3. **`prefers-reduced-transparency` is Chromium-only** (Chrome/Edge 118+, Firefox flagged, **Safari unsupported**) despite iOS owning the Reduce Transparency setting. It cannot be your only legibility guarantee.
4. **INP's replacement of FID has no Chrome version** — it was a March 12, 2024 measurement-policy change across Google's tools.
5. **INP's "98th percentile" framing is more precisely "drop one worst interaction per 50."**
6. **JPEG XL remains effectively Safari-only.** Chrome 145 ships decoding *behind a flag* — not deployable.
7. **`getComputedStyle()` is not unconditionally a reflow trigger** — three precise conditions (shadow tree / viewport MQs present / specific property). And **`window.innerHeight`/`innerWidth` no longer force reflow in Chrome 133+**, contradicting most existing documentation.
8. **csstriggers.com is stale** — predates CompositeAfterPaint, independent transform properties, accelerated SVG (Chromium 89), and accelerated `background-color`/`clip-path`. Do not cite it.

**Two gaps I could not close, flagged rather than guessed:** no isolated, well-controlled 2024–2026 field case study for `content-visibility` (the NitroPack INP numbers bundle other optimizations); and Safari's find-in-page inconsistency with `content-visibility: auto` is documented in caniuse support notes and practitioner writeups but has no official WebKit bug or statement confirming whether it's intended or a defect.

**Numbers marked [derived] that carry the most weight**, in case you want to re-verify them: the ~5ms 120Hz budget (extrapolated, no primary source), the ~12MB/layer GPU memory formula (physically sound, not in any Chromium doc, and complicated by tiling), and the ~540MB decoded-frame figure for Apple's 65-frame sequence (straightforward arithmetic, but it's the constraint that should drive any sequence implementation toward a sliding decode window rather than full bitmap preload).
---

## РАЗДЕЛ 3. Визуальный forecast 2026–2027

> Сохранено в оригинале — точность hex, названий шрифтов и CSS-значений критична.
> **Заметка о качестве источников:** поле «2026 trends» сильно засорено SEO-фермами, выдумывающими статистику («+340% с 2022», «на 67% выше вовлечённость») без прослеживаемого исследования. Всё ниже — либо из первичного источника (страницы словолитен, данные Typewolf, соскобленный продакшн-CSS, Pantone, доки Apple/Vercel), либо явно помечено как ненадёжное.

Reasonable request — the report body was my first final message, and only the addendum survived the relay. Re-emitting in full, no new research, addendum omitted as asked.

---

# 2026–2027 Visual Trend Forecast — Premium / Luxury Web

**Research note on evidence quality.** The "2026 trends" search space is heavily polluted by SEO content farms inventing statistics ("340% increase since 2022", "67% higher engagement") with no traceable study. Everything below is either from a primary source (foundry pages, Typewolf usage data, scraped production CSS, Pantone, Apple/Vercel docs) or explicitly flagged as thin. Where sources contradict each other, I say so rather than pick.

---

## 1. TYPOGRAPHY

### 1.1 The actual usage data

Typewolf's font-usage index (3,000+ curated sites, 2013→2026) is the only hard popularity dataset. Top ranks by cumulative usage: [typewolf.com/all-fonts](https://www.typewolf.com/all-fonts)

| # | Face | Foundry |
|---|---|---|
| 1 | Apercu (101) | Colophon |
| 2 | GT America (97) | Grilli Type |
| 3 | Futura (89) | — |
| 4 | Founders Grotesk (87) | Klim |
| 5 | Neue Haas Grotesk (80) | Monotype |
| 6 | Canela (77) | Commercial Type |
| 7 | Graphik (68) | Commercial Type |
| 14 | Ogg (50) | Sharp Type |
| 25 | Suisse Int'l (41) | Swiss Typefaces |
| 28 | Editorial New (41) | Pangram Pangram |
| 32 | Druk (38) | Commercial Type |
| 33/34 | Tiempos Headline / Text (37) | Klim |
| 36 | Söhne (35) | Klim |
| 39 | Inter (34) | rsms |
| 44 | GT Sectra (33) | Grilli Type |
| 45 | Domaine Display (32) | Klim |

Typewolf's own read on the curve: *"Inter led 2023's rankings before declining, suggesting brief adoption peaks followed by exploration of alternatives."* That single line is the most load-bearing typography fact in this whole report — **Inter has peaked and is now in decline among curated premium work.** More on why in §5.

Current Site-of-the-Day picks skew away from the workhorse grotesques entirely: Grenette + Styrene, Cardinal + Sweet Sans + Baskerville, Swear + DM Mono, DaVinci + Suisse Int'l, Kabel + Neue Haas Grotesk. ([typewolf.com](https://www.typewolf.com/))

### 1.2 Neo-grotesques — what each one signals

Foundry data from [Creative Boom's 50 fonts for 2026](https://www.creativeboom.com/resources/top-50-fonts-in-2026/), which is a real editorial roundup with per-face commentary.

**ABC Diatype** — ABC Dinamo. *"Warm yet sharp grotesque optimized for screen reading, capturing Swiss Neo-grotesque tradition for digital platforms."* Signals: contemporary art institution, design-literate, expensive-but-not-shouting. Usage: works at both hero and body, which is rare. This is the single most "if you know, you know" grotesque in the set. Free sub: **Switzer** (Fontshare) — closest in warmth and screen tuning. Google fallback: Inter Tight.

**Söhne** — Klim. Klim's own framing: *"the memory of Akzidenz-Grotesk framed through the reality of Helvetica"*, derived from the Standard Medium of Unimark's NYC Subway wayfinding. Released 2019, Red Dot Best of the Best 2020. ([klim.co.nz/retail-fonts/soehne](https://klim.co.nz/retail-fonts/soehne/)) 16 styles: Extraleicht → Extrafett, roman + italic. Signals: editorial authority, institutional calm. Söhne is the OpenAI/Substack-tier default. Its siblings matter more than the base face right now — **Söhne Breit** (wide) is the luxury all-caps workhorse and **Söhne Schmal** (condensed) the expressive-display one. Free sub: **Inter Display** at tight tracking, or **Archivo** for the Breit role.

**Neue Haas Grotesk** — Monotype. Christian Schwartz's restoration of Helvetica's 1957 original drawings. Signals: you paid for the real thing instead of using Helvetica. Usage: hero display, Display 55/65 optical cut specifically. Free sub: **Inter** (weak), **Nimbus Sans** (URW, closer).

**Aeonik** — CoType. *"Neo-grotesque with geometric foundations achieving mechanical precision through strict perpendicular terminals while maintaining warmth."* Signals: modern SaaS with taste; the "we're not using Inter" move of 2023–24 — now itself slightly common. Free sub: **General Sans** (Fontshare), **Space Grotesk**.

**Suisse Int'l** — Swiss Typefaces. *"Definitive digital Swiss Grotesk embodying the International Typographic Style from Basel and Zürich in the 1950s."* Signals: gallery, architecture practice, fashion. Currently appearing in Typewolf SOTD (Muse). Free sub: **Helvetica Now alternatives** are weak; use **Neue Haas Unica** if you can pay, or **Inter** stripped of its quirks via `font-feature-settings`.

**Helvetica Now** — Monotype. Three optical sizes: Micro / Text / Display. The Display cut at Thin/Extralight with negative tracking is genuinely premium; the Text cut is invisible-neutral. Free sub: none honest.

**Inter / Inter Display** — Rasmus Andersson, OFL, free. 2,000+ glyphs, 147 languages. Still the best free UI face technically. But see §5 — Inter-as-only-typeface is now a documented AI tell.

**General Sans** — Fontshare (Indian Type Foundry), free. Grouped in 2026 commentary under the **"bouba grotesk"** movement — soft, rounded, friendly neo-grotesks replacing clinical tech sans, associated with the Stripe and Notion rebrands, projecting *"approachability and slight human touch."* ([madegooddesigns.com/font-trends-2026](https://madegooddesigns.com/font-trends-2026/)) Companions in that movement: Switzer, Cabinet Grotesk, Söhne Breit, Hanken Grotesk, Mona Sans (GitHub, free), PolySans.

Also worth naming from the Creative Boom set: **Favorit** (ABC Dinamo) — *"geometric rigidity with subtle oddities and humorous touches"*, 46 uses on Typewolf, the quiet-cool choice; **Basis Grotesque** (Colophon), built for photo magazine Hotshoe; **Replica** (Lineto) on a deliberately reduced 70-unit grid with bevelled corners as negative ink traps; **Akkurat** (Lineto, 2004) — *"technical precision, reliability and neutrality"* without chasing trend; **Monument Grotesk** (ABC Dinamo), reviving Palmer & Rey's 1884 specimens.

### 1.3 Editorial serifs — the biggest movement of 2026

Every serious source converges here. The framing from the 12-movements analysis: **"the most defining trend of 2026 is the return of the serif — loud, expressive, often slightly absurd display serifs that lean into personality."**

**PP Editorial New** — Pangram Pangram, free-to-try. *"A precise and elegant narrow serif designed with long-form content in mind... easy to see it gracing the pages of high-end fashion magazines or lending an air of luxury to brand identities in the beauty or design industries."* ([pangrampangram.com/products/editorial-new](https://pangrampangram.com/products/editorial-new)) Mid-90s retro sensibility fused with contemporary crispness. **This is the single most-deployed premium display serif on the web right now** — 41 Typewolf uses, 37 documented landing pages on Lapa Ninja. Typewolf's suggested pairing: *Editorial New + Formula Condensed*; real-world pairings observed with Space Grotesk, Neue Montreal, Inter, Degular, Founders Grotesk. Free sub: **Instrument Serif** (Google) is the closest — but see §5, it's now flagged as a tell. Better: **Bespoke Serif** or **Zodiak** (Fontshare).

**Reckless / Reckless Neue** — Displaay. Named in both the expressive-serif and luxury-all-caps movements. Hospitality, fashion, beauty, high-end retail. Free sub: **Gambetta** (Fontshare), **Fraunces** with SOFT/WONK axes dialled down.

**Canela** — Commercial Type. 77 uses, rank 6. *"Occupies intriguing space between sans and serif by shedding serifs and leaving only vestigial flaring at stroke ends."* Signals: restrained luxury, the anti-Playfair. Free sub: **Bodoni Moda** is wrong; **Sentient** (Fontshare) is closer to the flared-stem idea.

**Tiempos Text / Headline** — Klim. *"Reinterprets editorial strengths of Plantin and Times New Roman for contemporary publishing needs with better legibility."* Text for body, Headline for hero. This is the correct choice when you want body copy that reads as *edited*. Free sub: **Source Serif 4**, **Spectral**, or **Literata**.

**Freight Display / Freight Text** — Darden Studio. 192-font integrated system inspired by 18th-c Dutch types. Ranks 31 and 42.

**GT Sectra** — Grilli Type. *"Combines broad nib pen calligraphy with surgical precision."* Three subfamilies from delicate text to extreme display. Signals: cultural institution, longform journalism.

**Migra** — Pangram Pangram, free-to-try. *"Sharp, sculptural typeface that captures the tension and beauty of the natural world — the aerodynamic elegance of migratory birds."* Migra Italic separately shows up in the cyberpunk/sci-fi and Y2K movement lists, which tells you it's versatile-verging-on-overexposed.

**Ogg** — Sharp Type. Rank 14 overall, **#1 serif on Typewolf's 2026 list**. Inspired by calligrapher Oscar Ogg. High-contrast, bridging historical craft with contemporary needs. Free sub: **Cormorant Garamond**.

**Domaine (Display/Text)** — Klim. *"Sharp, elegant serif blending French and British type traditions."* 46 styles, two optical sizes.

Others from the top-10 serif ranking ([typewolf.com/top-10-serif-fonts](https://www.typewolf.com/top-10-serif-fonts)): Times New Roman, Caslon, Garamond, GT Super, Self Modern. Plus **Lyon Text** (Commercial Type) — *"balances elegance with anonymous functionality"*; **Portrait** (Commercial Type) — French Renaissance with triangular Latin serifs; **Mrs Eaves** (Emigre) — Licko's Baskerville, *"slightly eccentric character with charm defying categorization"*, and also on Typewolf's underused list.

**Movement 12 — "anti-geometric editorial serifs"** is the wildcard to watch: EB Garamond, Cormorant Garamond, Bitter, Lora, Crimson Pro, Source Serif Pro, Vollkorn, Tiempos, Lyon, Plantin, Mrs Eaves, Caslon, Untitled Serif — warm book serifs prioritising reading over screen-first refinement, driven by Substack and indie longform. Almost all free.

### 1.4 Display / wide

**Luxury all-caps wide display** is a named 2026 movement with specific spec values: **0.05em–0.15em tracking, generous line-height, small caps for sub-elements.** Faces: Söhne Breit, Editorial New, Söhne Schmal, Tobias, Reckless Neue, Cormorant Garamond, EB Garamond, Italiana, Cinzel, Forum. Sectors: high-end hospitality, fashion, beauty retail. Note that five of those ten are free Google Fonts — this is the most accessible premium look available.

**PP Right Grotesk / PP Neue Machina / Monument Extended** — Pangram Pangram. Monument Extended: *"takes Monument's commanding geometry and amplifies it... inspired by Brutalism with structural confidence."* **Caution:** PP Neue Machina and Monument Extended sit in the *brutalist/industrial display* bucket, which is explicitly rated as fading — **"peaked in 2023, now feel dated unless used ironically."** Same verdict on Druk, Compressa, Trade Gothic Bold Condensed, Anton, Bebas Neue, Archivo Black.

Druk (Commercial Type) is worth a nuance: rank 32 with 38 uses, *"a study in typographic extremes deliberately conceived without normal widths or lighter weights — starts at Medium through Super."* It is not dead, but a Druk hero in 2026 reads as a 2021 fashion site.

**GT Flexa** (Grilli Type) is the interesting wide/variable: three axes (Weight, Width, Italic), 112 styles, built variable-first.

### 1.5 Mono — the sleeper category

Typewolf's 2026 mono ranking: Courier, Space Mono, GT Pressura Mono, Apercu Mono, Inconsolata, Maison Mono, GT America Mono, Pitch (Klim), Roboto Mono, Akkurat Mono. Typewolf's framing: *"monospaced typefaces usually bring to mind typewriters and computer programming, however, they can be a perfect choice for designers looking for a sparse, minimal and 'undesigned' feel."* ([typewolf.com/top-10-monospaced-fonts](https://www.typewolf.com/top-10-monospaced-fonts))

**"Retro monospaced revival" is a full named movement for 2026** — mono escaping the IDE into editorial, packaging, and indie branding, signalling *"craft, precision, or a hint of analog computing nostalgia."* Faces: JetBrains Mono, Geist Mono, Berkeley Mono (paid), Fragment Mono, Space Mono, DM Mono, IBM Plex Mono, Apercu Mono, GT America Mono.

**Geist Mono** — Vercel, **OFL, free**. Built mono-first, then Sans was derived from it. Vercel's stated intent: *"a typeface specifically designed for developers and designers"*, embodying *"simplicity, minimalism, and speed, drawing inspiration from the Swiss design movement."* Weights Thin→Ultra Black. There is also **Geist Pixel** with five shape variants (Square, Circle, Grid, Triangle, Line) driven by an `ELSH` variable axis — genuinely novel and underused. Install via npm for `font-feature-settings` support, not the Google Fonts CDN copy. ([vercel.com/font](https://vercel.com/font))

**JetBrains Mono** — OFL, free. **Berkeley Mono / TX-02** — US Graphics, paid, the current status mono among engineers. **Departure Mono** — free, pixel/bitmap flavoured, the "authored" choice. **Commit Mono** — free, neutral, anti-personality by design. **DM Mono** — Google, free, and showing up in current Typewolf SOTD picks (Dirty Vine). **PP Supply Mono** — Pangram Pangram, free-to-try.

For a dev portfolio: **Geist Mono or DM Mono for metadata/labels, not body.** Mono body copy at 16px reads as a terminal cosplay.

### 1.6 Free-alternative cheat sheet

Fontshare (Indian Type Foundry) is free for commercial use and is the single best substitution source: **Satoshi, Switzer, General Sans, Cabinet Grotesk, Clash Display, Chillax, Bespoke Serif, Boska, Gambetta, Sentient, Zodiak, Erode, Supreme, Ranade, Panchang, Excon.**

| Paid | Free equivalent |
|---|---|
| ABC Diatype | Switzer (Fontshare) |
| Söhne | Inter Display / Archivo |
| Söhne Breit | Archivo Expanded |
| Aeonik | General Sans, Space Grotesk |
| Suisse Int'l | Inter (tuned), Nimbus Sans |
| Neue Haas Grotesk | Inter, Nimbus Sans |
| PP Editorial New | Bespoke Serif, Zodiak, Instrument Serif* |
| Canela | Sentient |
| Tiempos | Source Serif 4, Spectral, Literata |
| Ogg / Domaine | Cormorant Garamond, Playfair Display (careful) |
| Reckless | Gambetta, Fraunces |
| GT Sectra | Fraunces (WONK axis up) |
| Berkeley Mono | Commit Mono, Geist Mono |
| Apercu Mono | DM Mono, Space Mono |

\* Instrument Serif is now catalogued as an AI-slop overused font — see §5.

Typewolf's 40 Best Google Fonts, body-safe picks (asterisked = has regular+italic+bold): DM Sans, Inter, Work Sans, Libre Franklin, Fira Sans, Alegreya/Alegreya Sans, Source Sans/Serif Pro, Fraunces, Spectral, IBM Plex Sans, Lora, Karla, Chivo, Rubik. Non-asterisked but strong for display: Space Grotesk, Syne, Cormorant, Manrope, Eczar, BioRhyme. ([typewolf.com/google-fonts](https://www.typewolf.com/google-fonts))

### 1.7 Fluid type — real clamp() values

Utopia's methodology is the standard and its published defaults are: **min viewport 360px / 18px base, max viewport 1240px / 20px base, min scale ratio 1.2 (minor third), max scale ratio 1.25 (major third).** ([utopia.fyi/type/calculator](https://utopia.fyi/type/calculator)) Real output:

```css
--step-0: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);
--step-3: clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem);
```

The load-bearing insight in that methodology: **the ratio itself scales with viewport.** A 1.2 ratio at 360px and 1.25 at 1240px means hierarchy tightens on mobile and opens up on desktop — this is why hand-written clamp() usually feels wrong at one end.

A full premium scale built on those defaults (Utopia steps −2 → 7), which is the range you actually want for a portfolio:

```css
:root {
  --step--2: clamp(0.7813rem, 0.7747rem + 0.029vw,  0.8rem);
  --step--1: clamp(0.9375rem, 0.9158rem + 0.0966vw, 1rem);
  --step-0:  clamp(1.125rem,  1.0739rem + 0.2273vw, 1.25rem);
  --step-1:  clamp(1.35rem,   1.2571rem + 0.413vw,  1.5625rem);
  --step-2:  clamp(1.62rem,   1.4694rem + 0.6693vw, 1.9531rem);
  --step-3:  clamp(1.944rem,  1.7405rem + 0.9044vw, 2.4414rem);
  --step-4:  clamp(2.3328rem, 2.0568rem + 1.2267vw, 3.0518rem);
  --step-5:  clamp(2.7994rem, 2.4266rem + 1.657vw,  3.8147rem);
  --step-6:  clamp(3.3592rem, 2.8582rem + 2.2268vw, 4.7684rem);
  --step-7:  clamp(4.0311rem, 3.3617rem + 2.9749vw, 5.9605rem);
}
```

Ratio choice by intent:
- **1.2 minor third** — dense, editorial, lots of hierarchy levels. Correct for a text-heavy portfolio or docs.
- **1.25 major third** — the safe default; Utopia's own max.
- **1.333 perfect fourth** — marketing pages; big jump from body to h1, few intermediate levels.
- **1.5 perfect fifth** — one-message landing pages only. Breaks down past three levels.

For a genuinely display-scale hero (the "one enormous headline" move), you go past the scale and hand-write it. Practical band: **min ~2.5rem (40px), max ~9–12rem (144–192px)**, e.g.

```css
.hero {
  font-size: clamp(2.75rem, 1.2rem + 6.9vw, 9rem);
  line-height: 0.95;
  letter-spacing: -0.035em;
  text-wrap: balance;
}
```

### 1.8 Optical sizing, variable axes, tracking craft

The tracking/leading conventions that separate premium from template work:

- **Negative tracking scales with size.** Body at `0`, `--step-3` at `-0.015em`, hero at `-0.03em` to `-0.04em`. Geometric and grotesque faces need more; serifs need less.
- **Hero line-height 0.9–1.05.** Anything at 1.2+ on display type reads as unset defaults. Pair with `text-wrap: balance` on headings and `text-wrap: pretty` on body to kill orphans.
- **All-caps luxury display inverts the rule** — positive tracking `0.05em–0.15em`, per the movement spec above.

Variable font handling:

```css
h1 {
  font-optical-sizing: auto;           /* let opsz respond to size */
  font-variation-settings: "opsz" 96;  /* or pin it for display cuts */
  font-synthesis: none;                /* never fake bold/italic */
}
```

Faces with genuinely useful non-standard axes (movement 10, *"hyper-personal variable display experiments"* — *"typefaces with axes are tools more than typefaces; they reward designers willing to play"*): **Fraunces** (SOFT, WONK), **Recursive** (CASUAL, MONO, slant), **Big Shoulders**, **Eckmannpsych** (Ohno), **GT Flexa** (3 axes/112 styles), **Fragment** (Pangram Pangram). All but the last two are free.

Weight-on-hover and weight-on-scroll via `font-variation-settings` transitions is the current craft signal — but animate `font-variation-settings` only on small text runs; it forces reflow.

> **Note:** §1.8's tracking and leading figures were subsequently corrected against Inter's published dynmetrics and IBM Carbon's shipped tokens — the addendum you already hold supersedes the `-0.03em/-0.04em` and `0.9` line-height guidance here.

---

## 2. COLOR

### 2.1 The institutional forecasts

**Pantone Color of the Year 2026 — Cloud Dancer, PANTONE 11-4201 TCX, `#F0EEE9`** (RGB 240/238/233). Announced 4 Dec 2025. A soft, slightly warm off-white — **the first white ever selected since the program began in 1999.** Positioned as a "billowy, balanced white" bringing calm to a chaotic world; a reset gesture rather than a statement hue. ([pantone.com/color-of-the-year/2026](https://www.pantone.com/color-of-the-year/2026), hex verified against [colorxs](https://www.colorxs.com/color/pantone-11-4201-tcx-cloud-dancer))

Two caveats worth carrying: it was **divisive** — [Artnet](https://news.artnet.com/art-world/pantone-color-of-the-year-white-2724115) ran it as "kind of divisive" and paint companies' competing picks got amplified as an override ([NPR](https://www.npr.org/2025/12/04/nx-s1-5632651/pantones-color-of-the-year-2026-white), [CNN](https://www.cnn.com/2025/12/04/style/pantone-color-of-the-year-2026-intl-scli)). And a **`#F0EFEB` value is circulating on X and is wrong** — two independent color databases agree on `#F0EEE9`.

**Pantone 2025 — Mocha Mousse, 17-1230 TCX, `#A47864`.** Leatrice Eiseman: *"sophisticated and lush, yet at the same time an unpretentious classic."*

**The 2025→2026 arc is the whole story: saturated warm brown → the near-absence of color.** Both point away from chroma, toward material and texture.

**WGSN + Coloro 2026 — "Transformative Teal"**, a fusion of dependable dark blue and aquatic green, framed around 2026 as "the year of redirection." No public hex or Coloro code. A/W 26/27 key colours: Transformative Teal, Wax Paper, Fresh Purple, Cocoa Powder, Green Glow. **2027 — "Luminous Blue"**, theme *interconnectedness*; S/S 27 key colours: Luminous Blue, Energy Orange, Pop Pink, Meadowland Green, Clay. ([wgsn.com](https://www.wgsn.com/en/blog/colour-year-2026-transformative-teal), [2027 release](https://www.wgsn.com/en/wgsn/press/press-releases/wgsn-and-coloro-reveal-colour-year-2027-luminous-blue-and-s-s-27-key))

### 2.2 Dark-mode near-blacks — scraped from live production CSS

These were pulled from the sites' actual shipped stylesheets, not from secondhand write-ups.

| Site | Signature dark | Supporting ramp |
|---|---|---|
| **Linear** | **`#08090A`** (314 occurrences — dominant) | `#191D20`, `#2E2E32`, `#3E3E44`; text `#8A8F98`, `#62666D`; brand `#4354B8` |
| **Vercel** | `--ds-background-100: #000` | `--ds-gray-100 #1a1a1a`, `-200 #1f1f1f`, `-300 #292929`, `-1000 #ededed`; legacy `--accents-1 #111`; `#0a0a0a` present |
| **Stripe** | `#181818`, `#010202` | `#2d2d2d`, `#26251e`, `#43413c`, `#55544f` — distinctly **warm**, not neutral |
| **Family.co** | `#121212`, `#111111`, `#171717` | `#222222`, `#2E2E2E`, `#313131`, `#343433`; light side `#fbfaf9`, `#F6F4EF`; accent `#1A88F8` |
| **Raycast** | `#061225`, `#070d4f` | blue-blacks, not neutral; text `#D8D8D8` |
| **Arc** | light-first `#FFFCEA` cream | accent `#3139FB`, deeper `#2404AA` |

**The usable range for a premium near-black is `#08090A` → `#181818`.** Linear anchors cool, Stripe warm, Material the middle.

### 2.3 Why pure `#000000` reads cheap — the documented mechanisms

1. **OLED black smearing.** Fully-off pixels must energise before displaying content and can't keep pace during scroll, producing visible smear trails. The commonly cited fix is a greyscale value around **5/255** — dark enough to read as black, light enough to keep pixels alive. ([Vidit Bhargava, *Designing a Dark Theme for OLED iPhones*](https://medium.com/lookup-design/designing-a-dark-theme-for-oled-iphones-e13cdfea7ffe))
2. **Halation.** Maximum-contrast white-on-black makes bright glyphs bleed past their boundaries into a fog. Disproportionately affects readers with astigmatism.
3. **Elevation collapse.** Material Design's core argument: dark grey *"can express a wider range of color, elevation, and depth, as it's easier to see shadows on grey (instead of black)."* On pure black you cannot render elevation with shadow at all. Material specifies **`#121212`** as baseline dark surface, elevation as translucent white overlays. Accessibility floor: dark surfaces must sustain **≥15.8:1** with white body text at all elevations. ([m2.material.io/design/color/dark-theme](https://m2.material.io/design/color/dark-theme.html))
4. **Contrast fatigue** on colorful imagery against pure black.

**The real rule, given Vercel ships `#000` successfully:** never use pure black *without a lifted surface layer above it*. Vercel never leaves content on the raw background — `#1a1a1a`/`#1f1f1f` panels go down immediately. The principle is layered surfaces, not the specific background value.

### 2.4 Quiet-luxury light values

Off-whites: `#F0EEE9` (Cloud Dancer), `#F0EFED`, `#F9F8F3`, `#F4EADE` (ivory cream), `#FBFAF9` / `#F6F4EF` (Family.co live), `#FAFAFA` (Vercel light `--ds-background-200`), `#FAFAF8`, `#F5F4F0`.

Warm neutrals / greige / oat: `#8A7968` taupe, `#8B7D6B` warm taupe, `#D6CFB5`, `#C19066`, `#D2B48C` warm sand.

Muted greens: `#9CAF88` sage — described as *"the 2025–2026 color of quiet luxury"*, signalling slow luxury, cashmere, Scandinavian restraint; `#A5A78F`.

The canonical quiet-luxury triad cited across sources: **Warm Taupe `#8B7D6B` + Near-Black `#1A1A1A` + Warm Sand `#D2B48C`, explicitly with no metallic accents.** The absence of gold is precisely what separates *quiet* luxury from conventional luxury branding.

### 2.5 Depth colors and electric accents

**Burgundy / oxblood is being called the defining depth color of 2026:** `#800020` burgundy, `#4A0404` oxblood, `#4A0E0E`, `#4A0000`, `#660033` deep burgundy, `#722F37` wine, `#73343A` merlot, `#5C0921` bordeaux. Also surfacing: plum noir, garnet. ([Revolution Fabrics](https://revolutionfabrics.com/blogs/gotcha-covered/burgundy-the-color-dominating-2026-fashion-interiors-design-trends), [Luhpar](https://luhpar.com/blogs/news/the-return-of-depth-why-burgundy-is-the-defining-hue-of-the-2026-design-landscape))

Deep greens: `#2E6F40` forest green; the forest-green + gold + black combination is the Rolex palette and reads premium reliably. Emerald and "smoky jade" cited as 2026 movements in beauty/hospitality.

Electric accents, all from live production CSS: `#3139FB` (Arc), `#4354B8` (Linear), `#0070f3` (Vercel), `#FF484C` (Rauno Freiberg), and Linear's low-frequency secondaries `#55CDFF`, `#F79CE0`, `#89D196`, `#02B8CC`.

### 2.6 Eight complete palettes for a dev portfolio

**A — Linear Cool Dark** (the industry-standard premium near-black)
`#08090A` bg · `#0F1011` surface · `#191D20` raised · `#8A8F98` muted text · `#F7F8F8` text · `#4354B8` accent

**B — Warm Stripe Dark** (softer, more editorial than A)
`#0E0D0C` bg · `#181818` surface · `#26251E` raised · `#8C8A84` muted · `#F5F4F0` text · `#D4A574` accent

**C — Oxblood Editorial Dark** (the 2026 depth-color play)
`#0A0908` bg · `#141210` surface · `#4A0E0E` accent-deep · `#8A7968` muted · `#F4EADE` text · `#C9553D` accent-live

**D — Cloud Dancer Light** (straight off the Pantone 2026 call)
`#F0EEE9` bg · `#FBFAF8` card · `#E2DFD8` rule · `#6B6862` muted · `#14130F` text · `#2E6F40` accent

**E — Quiet Luxury Warm Light** (no metallics, per the doctrine)
`#F5F4F0` bg · `#FAFAF8` card · `#D2B48C` rule · `#8B7D6B` muted · `#1A1A1A` text · `#4A0404` accent

**F — Sage Slow Luxury**
`#F2F1EC` bg · `#FFFFFF` card · `#9CAF88` accent · `#A5A78F` secondary · `#3A3D36` text · `#5C0921` alert

**G — Forest / Institutional** (works in either mode)
`#0C1210` bg · `#14201B` surface · `#2E6F40` accent · `#7E8B84` muted · `#EDF2EF` text · `#D4AF37` rare highlight

**H — Arc Cream + Electric** (light-first, high-personality)
`#FFFCEA` bg · `#FFFFFF` card · `#E8E3CB` rule · `#5C584A` muted · `#12100A` text · `#3139FB` accent

For all eight: apply the **60/30/10 split** — 60% dominant neutral, 30% secondary surfaces, 10% accent. The mechanical argument for restraint, and the best formulation I found: *"Bright colors pull the eye before anything else, so reserve your most saturated tones for the one action that matters most; scatter bright colors everywhere and they cancel each other out."* Accent color is a zero-sum attention budget. Stripe's dashboard uses **exactly two** accent colors — blue for actions, green for success. ([IxDF](https://ixdf.org/literature/article/ui-color-palette), [Nathan Curtis / EightShapes](https://medium.com/eightshapes-llc/color-in-design-systems-a1c80f65fa3))

---

## 3. TEXTURE

### 3.1 Film grain / noise — the canonical recipe

```xml
<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
```

`type="fractalNoise"` not `turbulence` — turbulence gives sharp veiny lines, fractalNoise gives smooth cloudy dispersion. `stitchTiles="stitch"` is **mandatory** for tiled backgrounds or you get visible seams. `baseFrequency` is the grain-size dial: `0.65` classic mid-grain, `0.8` finer, `4` very fine. `numOctaves="3"` is near-universal — each octave roughly doubles filter cost, so 3 is the practical ceiling.

Production data-URI pattern:

```css
.surface::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 182px;   /* downscaling the 600px viewBox = second tuning axis */
  opacity: 0.12;
}
```

**On opacity — production values run higher than the usual 0.03–0.08 assumption.** Consensus band is **5–15%**, with `0.12` a common default on dark cards. Use 0.03–0.08 for grain *over imagery or light backgrounds*; 0.10–0.15 over flat dark surfaces where the grain is doing anti-banding work.

That anti-banding role is the actual reason grain is everywhere: layering it under/over a gradient eliminates 8-bit banding artifacts. This is why nearly every aurora hero ships with a noise layer.

Performance: `feTurbulence` is a **rasterization-time** cost, not per-frame — free after paint when static. The failure mode is animating `baseFrequency` or `seed`, which forces a full filter re-run every frame. For animated grain, either use a canvas `ImageData` blit driven by `requestAnimationFrame` (which correctly pauses on hidden tabs), or — cheaper and widely used — **pre-render 3–5 noise frames and cycle them with a CSS `steps()` animation**, zero per-frame JS. ([CSS-Tricks Grainy Gradients](https://css-tricks.com/grainy-gradients/), [ibelick](https://ibelick.com/blog/create-grainy-backgrounds-with-css), [freeCodeCamp](https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/))

Pure-CSS approaches (stacked `repeating-conic-gradient`) can't produce true pseudo-random noise — they're regular patterns and read as such. SVG filters remain the only native route.

### 3.2 Aurora / mesh gradients

```css
.aurora {
  background-color: #05010f;                     /* near-black base is mandatory */
  background-image:
    radial-gradient(40% 50% at 20% 30%, rgba(99,102,241,0.55) 0%, transparent 70%),
    radial-gradient(45% 55% at 75% 25%, rgba(45,212,191,0.45) 0%, transparent 70%),
    radial-gradient(50% 60% at 60% 75%, rgba(236,72,153,0.40) 0%, transparent 70%);
}
.aurora::before {
  background: conic-gradient(from 120deg at 50% 30%, #3a29ff, #2dd4bf, #ec4899, #8b5cf6, #3a29ff);
  filter: blur(80px) saturate(1.4);
  opacity: 0.55;
  mix-blend-mode: screen;
  animation: drift 18s ease-in-out infinite alternate;
}
@keyframes drift {
  from { transform: translate3d(-4%, -2%, 0) rotate(0deg); }
  to   { transform: translate3d(4%, 3%, 0) rotate(8deg); }
}
@media (prefers-reduced-motion: reduce) { .aurora::before { animation: none; } }
```

Load-bearing values: **`blur(80px)`** is what makes it aurora rather than four colored blobs (tighter bands use `blur(28px)`); **`saturate(1.4)`** counteracts blur desaturation, without which colors wash to grey; **`mix-blend-mode: screen`** makes the glows additive rather than occluding. **Cap at 3–4 hues** — more and additive blending converges on brown.

Animate **transforms only**, never gradient stops or the blur value. And register custom properties to animate angles natively:

```css
@property --angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
```

([Superdesign Aurora](https://superdesign.dev/styles/aurora))

**The big caveat for 2026:** purple/indigo aurora heroes are now the single most recognizable AI tell (§5). If you use this technique, do not use those hues.

### 3.3 Glass — revived, not dated, but contested

Glassmorphism usage measurably **climbed from 7.45% (Jan) to 9.89% (May 2026)** across 208,000+ generations, driven by Apple's WWDC 2025 Liquid Glass. `backdrop-filter` is now Baseline widely available and **unprefixed since Safari 18 (Sept 2024)**. ([Superdesign](https://www.superdesign.dev/styles/glassmorphism))

```css
/* light glass */
background: rgba(255,255,255,0.12);
backdrop-filter: blur(12px) saturate(160%);
border: 1px solid rgba(255,255,255,0.25);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0,0,0,0.25);

/* dark glass */
background: rgba(17,25,40,0.55);
border-color: rgba(255,255,255,0.12);

/* fallback */
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: rgba(17,25,40,0.92); }
}
```

`blur(12px) saturate(160%)` is the workhorse; wild range is `blur(8–20px)` / `saturate(140–180%)`. The Liquid-Glass variant pushes blur **down** and inset highlights **up**, because the effect is edge refraction not frosting:

```css
backdrop-filter: blur(2px) saturate(180%);
border: 1px solid rgba(255,255,255,0.8);
box-shadow: 0 8px 32px rgba(31,38,135,0.2),
            inset 0 4px 20px rgba(255,255,255,0.3);
```

**True refraction needs `feDisplacementMap`** (R channel = X displacement, G = Y, 8-bit caps at ±127px), derived from Snell's Law — [kube.io's implementation](https://kube.io/blog/liquid-glass-css-svg/) pre-computes 127 samples along one radius. **But SVG-filter-as-`backdrop-filter` is Chromium-only and not in the CSS spec** — Safari and Firefox don't support it. The irony: Apple's design language can't be faithfully reproduced in Apple's browser. Treat as progressive enhancement.

Three conflicting readings you should hold simultaneously:
- Usage is **up** (Superdesign data).
- `backdrop-filter` causes **15–30% FPS drops on mid-tier Android**; survives only in nav bars and modals ([studiomeyer.io](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check)).
- "Frosted glass card" is **catalogued as an AI-slop tell** ([impeccable.style/slop](https://impeccable.style/slop/)).

Net: glass as a *flat frosted rectangle on a card grid* is dead. Glass as a *single material surface with depth and light response* is current. Keep the 1px border — in forced-colors mode it's an accessibility feature, not decoration. Respect `prefers-reduced-transparency: reduce`.

### 3.4 Halftone / dither / 1-bit

Pure-CSS halftone in three declarations, one element:

```css
background: radial-gradient(closest-side, #777, #fff) 0 / 1em 1em space,
            linear-gradient(90deg, #888, #fff);
background-blend-mode: multiply;
filter: contrast(16);
```

A tiled dot pattern multiplied against a map gradient, then `contrast(16)` slams intermediates to pure black/white — dot *size* then varies with map luminance. A genuine halftone, not a static dot field. `space` forces integer tiling so dots never clip. **Scaling rule: increase pattern size → increase contrast proportionally.** Swap the map for any image or `conic-gradient` mask. ([master.dev](https://master.dev/blog/pure-css-halftone-effect-in-3-declarations/), [Lean Rada](https://leanrada.com/notes/pure-css-halftone/))

True ordered dithering uses an SVG chain: `feImage` (4×4 Bayer matrix as base64 PNG) → `feTile` → `feComposite` in `arithmetic` mode with **`k1="0" k2="1" k3="1" k4="-0.5"`** → `feComponentTransfer` to discretize each channel to 0/1. Scales poorly, handles transparency badly — pin to a fixed size. ([dither-with-css](https://github.com/tomren1/dither-with-css))

### 3.5 Paper / risograph / letterpress

Rough paper is bump-mapped noise, not flat grain — note how different the values are from film grain:

```xml
<filter id="paper">
  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
  <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="2">
    <feDistantLight azimuth="45" elevation="60"/>
  </feDiffuseLighting>
</filter>
```

`baseFrequency="0.04"` (vs 0.65) gives large soft fibre structure; `numOctaves="5"` adds fine roughness on top; `surfaceScale="2"` amplifies height. **Lowering `elevation` 60→40 increases surface-irregularity contrast** — that's your "how beat-up is this paper" dial. Add `feDisplacementMap` from the same turbulence for torn/deckled edges. ([Codrops](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/))

Risograph: **`mix-blend-mode: multiply` on 2–4 saturated solid color layers** reproduces genuine overprint mixing, plus **1–3px offsets** for registration error. Risograph.css formalizes it: *"the 'ink' is real layered color with mix-blend-mode: multiply, the grain is an SVG feTurbulence mask not a tiling JPEG, and the misregistration is a couple of custom-property offsets."* It ships a contrast floor so texture can't render body copy illegible — worth copying as a pattern regardless. ([osmanyy.com](https://osmanyy.com/projects/risograph-css/))

Letterpress is pure `text-shadow`, and offset direction is the whole effect — **pressed-in:** dark top-left, light bottom-right; **embossed:** exactly inverted.

```css
text-shadow: 0 -1px 0 rgba(147,140,128,0.7),
             0  1px 0 rgba(250,250,249,0.3);
```

Three rules: use **rgba not solid** so it blends with any ground; **offset on Y only** — *"don't offset in both x and y, it looks better as though the light were directly above"*; blur 0–1px. Requires a mid-tone background; invisible on pure white or black.

### 3.6 Chromatic aberration

```css
text-shadow: -2px 0 #FF0000, 2px 0 #0000FF;              /* cheap */
filter: drop-shadow(2px 0 #F00) drop-shadow(-2px 0 #00F); /* any element */
```

Proper version: absolutely-positioned pseudo-element copies with **`mix-blend-mode: screen`** and independent per-channel offsets — screen is additive, so channels recombine to white where aligned and fringe where not, which is physically what the effect is. SVG-accurate version runs three `feColorMatrix` branches (one per channel, e.g. zeroing the green row) each into its own `feOffset`, recombined with `feBlend mode="screen"`.

**Choose CSS/SVG over WebGL for text, always** — native blend modes run in the hardware-accelerated render pipeline and preserve DOM, text selection, and screen-reader access; a canvas replacement makes text unselectable and invisible to assistive tech. ([DESIGN.md](https://designmd.app/library/chromatic-aberration-rgb-split), [Maxime Heckel on shader light effects](https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/))

### 3.7 Cross-cutting texture rules

- **Texture is layered, not applied:** base color → gradient → blur → blend mode → grain → content on an opaque panel. Grain is almost always the final unifying pass, which is why it doubles as banding repair.
- **Guard every motion effect** with `prefers-reduced-motion`; guard glass with `prefers-reduced-transparency`.
- **Animate transforms, never filters or gradient stops.** This single rule separates 60fps from janky.
- **Contrast is the recurring failure mode.** Aurora, glass and riso all degrade legibility identically; the fix is always to put copy on an opaque panel rather than directly on the textured surface.

---

## 4. DIRECTIONS

**Editorial / Swiss — ascendant, and the safest premium bet.** siteinspire's editorial category shows a clear recency cliff: a burst of new work in the last ~2 months after a two-year gap. Recent: [Estudio Niksen](https://estudioniksen.com), [Bodeyco](https://bodeyco.com), [Squarespace Foundations](https://brand.squarespace.com), [Julia Noni](https://julianoni.com), [Fiona Vilmer](https://fionavilmer.com), [Spots Travel](https://spotstravel.co). Older canon: [i-D](https://i-d.co), [Scandinavian MIND](https://scandinavianmind.com), [Plaster](https://plastermagazine.com), [The Ken](https://the-ken.com). ([siteinspire.com/websites/category/editorial](https://www.siteinspire.com/websites/category/editorial)) The pattern being abandoned is the vertical blog roll; the replacement is story grids with varied card sizes mirroring a print cover/TOC hierarchy.

**Brutalism — absorbed, not dominant.** Figma still lists neo-brutalism/anti-design as live (citing Balenciaga, Diesel, Mailchimp — [figma.com/resource-library/web-design-trends](https://www.figma.com/resource-library/web-design-trends/)); [NN/g](https://www.nngroup.com/articles/neobrutalism/) treats it definitionally rather than as forecast. Everything claiming brutalism "dominates 2026" traces to content farms. **Defensible read:** disciplined brutalism (harsh contrast, system type, visible structure) has been absorbed into the editorial direction; chaotic anti-design brutalism is a portfolio-only move. On a SaaS product it now reads as 2023. The typographic half of it is explicitly fading — Druk/Monument Extended/PP Neue Machina *"peaked in 2023, now feel dated unless used ironically."* One counter-signal: studiomeyer flags **"anti-grid brutalism"** with raw HTML aesthetics and monospace typography as an *emerging* counter-movement to bento ubiquity.

**Organic / blobby — the clearest dead call, and it's evidence-backed.** Blob shapes *"almost never ship on B2B SaaS, e-commerce or any conversion-critical flow"* — they never left creative landing pages. Critically, "organic" has **bifurcated**: the blobby-gradient-shape version is dead; the **material/textural** version is ascendant — hand-stitched texture, visible grain, brush variation, distressed edges. **Do not conflate them: a vector blob background is a 2021 signal; a scanned paper texture is a 2026 signal.**

**Spatial / 3D / WebGL — a liability by default.** A single Spline scene loads **800kB–2MB of JS before first paint**; justified only where "the brand is the experience." Award juries reportedly now score performance alongside craft, with ~60fps on a mid-range phone as a floor. The surviving premium form is **one hard idea executed cleanly** — a single object with real weight, atmosphere and framing rather than stacked effects. The Awwwards Sites of the Year list is instructive here because it is almost entirely this category — [Igloo Inc](https://igloo.inc), [Lusion v3](https://lusion.co), [Active Theory](https://activetheory.net), [Bruno Simon](https://bruno-simon.com), [Prometheus Fuels](https://prometheusfuels.com), [Pangram Pangram](https://pangrampangram.com) (by Locomotive). **That's the tell: Awwwards selects for spectacle, which is why it is now a misleading guide to what premium brands actually ship.** Technical frontier: the WebGL→WebGPU migration in Three.js.

**The AI-era aesthetic — the defining axis of 2026.** The best primary artifact is [impeccable.style/slop](https://impeccable.style/slop/), a catalog of 31+ patterns marking AI-generated UI. Verbatim highlights: *"Thick colored border clashes with the radius"* · *"Glassmorphism everywhere"* · *"Extreme border-radius on cards"* (44px) · *"Font sizes are too close together"* · *"Small rounded-square icon container above a heading"* · *"Oversized italic serif as the primary hero headline"* · *"Tiny uppercase letter-spaced label"* eyebrow · *"Overused font: Inter, Geist, Space Grotesk, Instrument Serif"* · *"Only one font family used for entire page"* · *"Purple/violet gradients and cyan-on-dark"* · *"Dark backgrounds with colored box-shadow glows"* · *"Gradient text is decorative rather than meaningful"* · *"Warm cream or beige page background"* · *"Same-sized cards with icon + heading + text repeated"* · *"Same spacing value used everywhere"* · *"Cards inside cards"* · *"01 / 02 / 03 as section labels"* · *"Bounce and elastic easing"* · em-dash overuse · streamline/empower/supercharge/enterprise-grade · *"Short rebuttal or manufactured-contrast aphorism."*

**Why purple specifically:** traced to Tailwind shipping `bg-indigo-500` as its demo default ~5 years ago, saturating scraped training data. *"When LLMs trained on code scraped from the internet, they learned an implicit rule: 'modern web design = purple buttons.'"* ([prg.sh](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website)) Commercially, a glowing purple gradient now functions as a warning label reading "generic AI wrapper" before anyone reads a word ([925studios](https://www.925studios.co/blog/ai-slop-design-tells)).

**The anti-AI counter-movement.** Spencer Cogburn, creative director at Stills, in It's Nice That — the best directly-verified quotes I obtained: **"The main trend we expect for 2026 is authenticity."** · **"I'm tired of sterile, boring, hyper-polished, pixel-perfect imagery."** · **"Right now, anyone can create something that might be called art, regardless of skill, taste or perspective."** · on why shortcuts hollow out craft: **"That time between knowing what you want to create and actually being able to do it is critical."** · **"Every creative we spoke to brought up the same thing: they want more color, and more personality."** · **"If you're making it for everyone, you're making it for no one."** Named directions: scrapbook/handmade with cataloguing and scribbling, maximalism and grunge, direct flash, Cyber Goth, Future Medieval, Americana. ([itsnicethat.com](https://www.itsnicethat.com/articles/stills-2026-trend-report-creative-industry-sponsored-content-170226) — note: sponsored content, not editorial.) Graham Sykes, global ECD at Landor, on human-driven craft returning *"as the antidote to AI's hyper-slick visual language"* ([Creative Bloq](https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026) — article body was truncated on fetch, quote via secondary citation; verify before quoting publicly).

Typographic expression of this: **movement 3, "anti-AI handwriting and authored type"** — Reenie Beanie, Caveat, Homemade Apple, Permanent Marker, Coldiac, Eckmannpsych, Lost Type, Ohno releases. *"Handwritten type in 2026 is usually used as accent, paired with restrained sans or serif for body text."* Never as body copy.

**Bento — dated as decoration, alive as structure.** Sources genuinely conflict. studiomeyer rates it **SHIPS** (23% more scroll depth vs traditional 12-column; default at Apple, Google, Microsoft, Spotify). SaaSframe says *"static bento grids are 2024"* — the failure mode being cells all the same size with content retrofitted, reading as a card wall; brands that age badly *"picked cell shapes first, then asked what content might fit."* The discipline that holds: cells are large only when content earns large, consistent gutter and inner padding, planned responsive collapse. ([saasframe.io](https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide))

**Y2K / chrome — genuinely unresolved.** Figma lists retrofuturism (neon, chrome, pixel art) as active. The 12-movements analysis rates the Y2K nostalgia display bucket (Bubblegum Sans, Press Start 2P, VT323, Silkscreen, Rubik Bubbles, Bungee, Honk) as likely to *"peak and plateau in 2026."* No credible source calls it dead. Treat as: alive in fashion/music/beauty, wrong for a dev portfolio.

**Skeuomorph revival / Liquid Glass — contested, and Apple walked it back.** Shipped WWDC 2025 across iOS 26 / macOS Tahoe / Vision Pro; the Camera app restored the high-res lens illustration last seen in iOS 6. But TechCrunch (June 2026) reports Apple *"tweaking its controversial"* design, rebuilding foundations *"to ensure exceptional readability"* by diffusing content behind the material and shipping a slider from ultra-clear to fully tinted. ([techcrunch.com](https://techcrunch.com/2026/06/08/apple-is-tweaking-its-controversial-liquid-glass-design/)) The durable principle: styles that survive *"treat depth as information rather than ornament"* ([LogRocket](https://blog.logrocket.com/ux-design/apple-liquid-glass-ui/)).

**Physical / tactile UI — genuinely ascendant, and the least-exploited opportunity.** Physics-based spring, momentum and friction replacing eased-duration animation; Google's Material Expressive is the institutional signal. Sharpest framing: haptics trained expectations first, and *"the visual language finally caught up."* ([designmd.app](https://designmd.app/library/tactile-digital-deformable-ui/)) Note the tension with the slop catalog, which flags *"bounce and elastic easing"* as a tell — the distinction is spring physics with correct mass/tension/friction versus a decorative `cubic-bezier` overshoot bolted onto a button.

---

## 5. WHAT IS NOW DATED — blunt

Ranked by strength of evidence, not confidence of vibe.

| Signal | Status | Source |
|---|---|---|
| Purple/indigo gradient hero, gradient text | **Dead — actively negative** | impeccable.style/slop; prg.sh |
| Glassmorphism cards on a grid | **Dead on taste and perf** (15–30% FPS drop, worst on mid-range Android) | studiomeyer; slop catalog |
| Organic blob backgrounds | **Dead** — never shipped outside creative landing pages | studiomeyer |
| Dark mode + neon accent + glowing borders | **Dead** — reads as AI wrapper | slop catalog |
| Inter (or Geist / Space Grotesk / Instrument Serif) as the *only* typeface | **Dead as a default** — and Typewolf data confirms Inter peaked in 2023 and declined | slop catalog; typewolf.com/all-fonts |
| Oversized rounded corners (24px+, esp. 44px) | **Dead** — reads as "soft blobs" | slop catalog |
| Icon-tile-above-heading card grids, 3-up feature boxes | **Dead** | slop catalog; prg.sh |
| Numbered section markers (01/02/03), tiny uppercase eyebrow pill | **Dead** | slop catalog |
| Oversized italic serif hero headline | **Dead** — the exact move that was premium in 2023 | slop catalog |
| Cream/beige as the "default tasteful" background | **Compromised** — still correct, but now needs texture or an unusual accent to escape the tell | slop catalog |
| Heavy WebGL hero | **Liability unless brand *is* the experience** | studiomeyer |
| Kinetic typography | **Overpromised** — fights screen readers and crawlers, causes CLS, wrecks Core Web Vitals; demos only | studiomeyer |
| Brutalist display type (Druk, Monument Extended, PP Neue Machina) | **Peaked 2023; dated unless ironic** | madegooddesigns 12 movements |
| Static bento grids | **Dated as style, fine as structure** | saasframe (contested by studiomeyer) |
| Hyper-polished pixel-perfect minimalism | **Fading** | Cogburn / It's Nice That |
| Maximalist 3D type effects; generic geometric sans ("Poppins fatigue"); brush-script wedding fonts | **Fatigued** | madegooddesigns |
| AOS scroll-reveal, parallax hero, mesh-gradient hero, emoji section headers, Framer/Webflow template tells | **Widely assumed dated — I found NO direct designer commentary.** Unverified. | — |

That last row matters and I'm flagging it rather than papering over it: those items were in the brief's hypothesis list and I could not substantiate them from real sources. They may well be true. I'd rather hand over the gap than manufacture support.

**The organizing insight:** these aren't dated because taste rotated. They're dated because they became the **statistical median of AI output** and now actively signal "nobody chose this." That reframes the entire list — and it means the counter-moves that hold (editorial structure, material texture, physics-based motion, craft-as-subject-matter) share one property: **they are expensive to fake.**

---

## 6. LIGHT VS DARK LUXURY

**Dark works when:** the product is a tool and the content is the interface (Linear, Vercel, Raycast); imagery is photographic or 3D and needs to sit in a void; the audience is technical and using it at night; you want the accent to carry maximum charge — a single `#4354B8` on `#08090A` does more work than any color on white. Requirement: **token-based color systems**, not two hardcoded themes. 82% of smartphone users run at least one app in dark mode; dark-mode-aware sites show ~18% longer sessions (studiomeyer — treat as directional).

**Light works when:** the content is text and you want it read (editorial, longform, writing-forward portfolios); you're signalling craft and material rather than power — Cloud Dancer and quiet luxury are inherently light-mode arguments; the work you're showing is itself dark or colorful and needs a neutral gallery wall. Every high-tier design-engineer portfolio I could verify — Rauno Freiberg, Emil Kowalski, Paco Coursey, Maxime Heckel, Lynn Fisher — runs **light-or-toggleable neutral by default, not dark-mode-default.** Only Brittany Chiang runs dark-default, and hers is the most conventional of the set.

**Hybrid approaches, in order of sophistication:**

1. **Light shell, dark artifacts.** Off-white page (`#F5F4F0`), dark near-black panels (`#141210`) for code, demos, and project cards. This is the current design-engineer default and it works because the dark surfaces read as *screens embedded in paper*.
2. **`light-dark()` with divergent palettes.** Don't invert. Ship a warm off-white light theme and a cool near-black dark theme with different accents — the accent that reads premium on `#F0EEE9` is rarely the one that reads premium on `#08090A`.
   ```css
   :root { color-scheme: light dark; }
   body {
     background: light-dark(#F5F4F0, #08090A);
     color:      light-dark(#14130F, #F7F8F8);
   }
   --accent: light-dark(#4A0404, #4354B8);
   ```
3. **Dark hero, light body.** Editorial move — full-bleed near-black masthead with the display serif, then off-white for the reading column. Gives you one dramatic moment without asking anyone to read 2,000 words of white-on-black.
4. **Scroll-driven inversion** at section boundaries, animated on `background-color` only. Cheap, striking, and doesn't need WebGL.

**The one non-negotiable in both modes:** content never sits on the raw background. Vercel ships literal `#000` and reads premium because `#1a1a1a` surfaces go down immediately. That layered-surface principle matters more than any specific hex in this report.

---

## Sources

**Typography** — [Typewolf font usage data 2013–2026](https://www.typewolf.com/all-fonts) · [Typewolf homepage / SOTD](https://www.typewolf.com/) · [top 10 sans](https://www.typewolf.com/top-10-sans-serif-fonts) · [serif](https://www.typewolf.com/top-10-serif-fonts) · [mono](https://www.typewolf.com/top-10-monospaced-fonts) · [40 best Google Fonts](https://www.typewolf.com/google-fonts) · [underused fonts](https://www.typewolf.com/top-10-favorite-fonts) · [Editorial New page](https://www.typewolf.com/editorial-new) · [Creative Boom 50 fonts 2026](https://www.creativeboom.com/resources/top-50-fonts-in-2026/) · [Made Good 12 type movements 2026](https://madegooddesigns.com/font-trends-2026/) · [Klim Söhne](https://klim.co.nz/retail-fonts/soehne/) · [Pangram Pangram Editorial New](https://pangrampangram.com/products/editorial-new) · [Migra](https://pangrampangram.com/products/migra) · [Vercel Geist](https://vercel.com/font) · [Utopia fluid type calculator](https://utopia.fyi/type/calculator) · [Wix typography trends 2026](https://www.wix.com/wixel/resources/typography-trends)

**Color** — [Pantone CotY 2026](https://www.pantone.com/color-of-the-year/2026) · [Cloud Dancer hex](https://www.colorxs.com/color/pantone-11-4201-tcx-cloud-dancer) · [NPR](https://www.npr.org/2025/12/04/nx-s1-5632651/pantones-color-of-the-year-2026-white) · [CNN](https://www.cnn.com/2025/12/04/style/pantone-color-of-the-year-2026-intl-scli) · [Artnet](https://news.artnet.com/art-world/pantone-color-of-the-year-white-2724115) · [WGSN Transformative Teal](https://www.wgsn.com/en/blog/colour-year-2026-transformative-teal) · [WGSN Luminous Blue 2027](https://www.wgsn.com/en/wgsn/press/press-releases/wgsn-and-coloro-reveal-colour-year-2027-luminous-blue-and-s-s-27-key) · [Material dark theme](https://m2.material.io/design/color/dark-theme.html) · [OLED dark theme design](https://medium.com/lookup-design/designing-a-dark-theme-for-oled-iphones-e13cdfea7ffe) · [Nathan Curtis, Color in Design Systems](https://medium.com/eightshapes-llc/color-in-design-systems-a1c80f65fa3) · [IxDF UI color palette](https://ixdf.org/literature/article/ui-color-palette) · [Luhpar on burgundy](https://luhpar.com/blogs/news/the-return-of-depth-why-burgundy-is-the-defining-hue-of-the-2026-design-landscape)

**Texture** — [CSS-Tricks Grainy Gradients](https://css-tricks.com/grainy-gradients/) · [ibelick grain](https://ibelick.com/blog/create-grainy-backgrounds-with-css) · [freeCodeCamp SVG noise](https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/) · [Codrops feTurbulence texture](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/) · [Superdesign Aurora](https://superdesign.dev/styles/aurora) · [Superdesign Glassmorphism](https://www.superdesign.dev/styles/glassmorphism) · [CSS-Tricks on Liquid Glass](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/) · [kube.io Liquid Glass refraction](https://kube.io/blog/liquid-glass-css-svg/) · [Pure CSS halftone](https://master.dev/blog/pure-css-halftone-effect-in-3-declarations/) · [dither-with-css](https://github.com/tomren1/dither-with-css) · [Risograph.css](https://osmanyy.com/projects/risograph-css/) · [Chromatic aberration reference](https://designmd.app/library/chromatic-aberration-rgb-split) · [Maxime Heckel shader light effects](https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/)

**Directions / dated** — [impeccable.style AI slop catalog](https://impeccable.style/slop/) · [Why your AI keeps building purple gradients](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website) · [925studios AI slop tells](https://www.925studios.co/blog/ai-slop-design-tells) · [studiomeyer 2026 reality check](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check) · [It's Nice That / Stills 2026 report](https://www.itsnicethat.com/articles/stills-2026-trend-report-creative-industry-sponsored-content-170226) · [Creative Bloq / Landor](https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026) · [Figma web design trends](https://www.figma.com/resource-library/web-design-trends/) · [NN/g neobrutalism](https://www.nngroup.com/articles/neobrutalism/) · [siteinspire editorial](https://www.siteinspire.com/websites/category/editorial) · [Awwwards Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/) · [SaaSframe bento guide](https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide) · [TechCrunch on Liquid Glass walkback](https://techcrunch.com/2026/06/08/apple-is-tweaking-its-controversial-liquid-glass-design/) · [LogRocket Liquid Glass UX](https://blog.logrocket.com/ux-design/apple-liquid-glass-ui/) · [DESIGN.md tactile UI](https://designmd.app/library/tactile-digital-deformable-ui/)

---

**Two open gaps I'd rather name than paper over:** (1) the session's web-search budget (200/200) was exhausted, so Pentagram/Dezeen commentary and the Y2K/chrome question are under-sourced; (2) §1.8's tracking/leading figures are superseded by the correction addendum you already hold — apply that over this section. Additionally, the ratio-selection guidance in §1.7 (1.2 vs 1.25 vs 1.333 vs 1.5 by use case) is my judgment sitting alongside sourced Utopia values, not itself sourced.
---

### 3-БИС. ПОПРАВКА к §1.8 — трекинг и интерлиньяж (верифицировано по исходникам)

Заявленный выше в §1.8 hero-трекинг **-0.03em…-0.04em** и line-height **0.9–1.05** проверены против двух реально отгруженных типосистем. **Цифра трекинга примерно вдвое завышена, а нижняя граница интерлиньяжа слишком низкая.**

**Опубликованная кривая трекинга Inter** (из `d.rsms.me/inter-website/v3/dynmetrics/` — реальная реализация dynamic-metrics Расмуса Андерссона, вербатим):

```js
var a = -0.0223, b = 0.185, c = -0.1745 // 2019-02-07
var l = 1.4

function _InterDynamicTracking(fontSize, weightClass) {
  return a + b * Math.pow(Math.E, c * fontSize)
}
function InterDynamicLineHeight(fontSize, weightClass) {
  return Math.round(fontSize * l)
}
```

Таблица ручных таргетов, под которую фитилась кривая:

`6: 0.043 · 8: 0.024 · 10: 0.01 · 12: 0 · 14: -0.006 · 16: -0.011 · 18: -0.014 · 20: -0.017 · 24: -0.019 · 30: -0.021 · 40: -0.022 · 80: -0.022`

Три следствия:

1. **Кривая асимптотирует к -0.0223em и ПЛОСКАЯ начиная с ~40px.** Inter на 40px и Inter на 80px берут ОДИН И ТОТ ЖЕ трекинг. Интуиция «чем крупнее, тем плотнее» неверна после 40px.
2. **Переход из плюса в минус — на 12px**, и он специфичен для гарнитуры. Шрифт, нарисованный под 16px текст, пересекает ноль на 16px. **Не переноси эти константы на другое семейство.**
3. **Закомментированная история ревизий — сильнейшее свидетельство.** Отменённые константы от 2019-02-06 доходили до **-0.038 на 80px**; наборы 2018 — до -0.034. Андерссон отгружал агрессивный отрицательный трекинг, а потом откатил его к плоскому -0.0223. **Это типодизайнер, сходящийся к оптическому дну СВЕРХУ — он попробовал те самые цифры и отверг их.**

Также: `InterDynamicLineHeight` — плоское `round(fontSize * 1.4)`. **Inter вообще не публикует обратной формулы интерлиньяжа.** Size-inversed leading — конвенция Carbon, а не универсальный закон.

**Отгруженные токены IBM Carbon** (из `@carbon/type@11.63.0` SCSS):

| token | px | line-height | tracking | = em |
|---|---:|---:|---:|---:|
| `label-01` | 12 | 1.333 | +0.32px | **+0.0267** |
| `body-long-01` | 14 | 1.429 | +0.16px | +0.0114 |
| `display-01` | 42 | 1.19 | 0 | 0 |
| `display-03` lg | 60 | 1.16 | -0.64px | -0.0107 |
| `display-04` lg | 92 | 1.11 | -0.64px | **-0.0070** |
| `display-04` max | 156 | 1.05 | -0.96px | **-0.0062** |

Carbon НАМНОГО консервативнее Inter — **меньше -0.01em даже на 156px**. Пол интерлиньяжа — **1.05 на 156px**, никогда ниже.

**Исправленное правило:**

- **≈-0.02em — это оптическая коррекция.** Обоснованно, и плоско выше ~40px.
- **-0.03em / -0.04em, или Tailwind `tracking-tighter` (-0.05em) — это СТИЛИСТИЧЕСКИЙ выбор.** Легитимен для tight-display брендинга, но это вкус, а не коррекция. **Смешение этих двух вещей — ровно то, как буквы в hero начинают слипаться.**
- **Line-height 0.9 плотнее любой верифицируемой системы.** Обоснованный диапазон — **1.0–1.1**; ниже 1.0 — намеренное сжато-editorial решение, требующее ручной проверки коллизий.

Заменить hero-сниппет из §1.7 на:

```css
.display {
  font-size: clamp(2.5rem, 0.667rem + 8.148vw, 8rem);
  font-weight: 600;
  letter-spacing: -0.022em;   /* асимптота Inter; кривая плоская ≥40px */
  line-height: 1.05;          /* пол Carbon на самом крупном токене */
  text-wrap: balance;
  font-optical-sizing: auto;
}

/* стилистический tight-display — НЕ оптическая коррекция */
.display--tight { letter-spacing: -0.035em; line-height: 0.95; }
```

При fluid `clamp()` ты не знаешь, какой тир применится в момент рендера — а поскольку кривая плоская выше 40px, правильная структура: **одна точка перелома на ~40px — интерполировать ниже, константа -0.022em выше.**

**Методологическая заметка:** вторичные пересказы таблиц трекинга Apple HIG / Material / Polaris / Primer следует считать неподтверждёнными — страница Apple HIG — client-rendered SPA, и «таблица» оттуда реконструируется по памяти, а не читается. **Надёжный маршрут — npm-пакеты токенов через unpkg**; именно так получены реальные значения Carbon.

---

## РАЗДЕЛ 4. Моушн и анимационный craft

> Сохранено в оригинале — точность cubic-bezier, spring-параметров и таймингов критична.
> **Легенда достоверности:** ✅ = проверено по первичному источнику · ⚠️ = общепринятая конвенция, НЕ верифицирована независимо · 🔶 = источники противоречат друг другу

I've waited long enough on the last two tracks — I have solid verified material for everything else, so here is the report, with the two outstanding areas written from canonical docs and clearly flagged where a number is convention rather than something I re-verified this session.

---

# Motion & Animation Craft for Premium Web — 2025/2026

**Verification legend:** ✅ = verified this session against a primary source · ⚠️ = widely-used convention, *not* independently verified · 🔶 = conflicting sources, see note

---

## 0. Library landscape — versions pulled live from the npm registry ✅

Queried `registry.npmjs.org` directly, July 2026:

| Package | Version | License | Use it when |
|---|---|---|---|
| `gsap` | **3.15.0** | "Standard 'no charge' license" — all plugins free | Timeline orchestration, ScrollTrigger, SplitText, Flip. The default for agency work. |
| `motion` | **12.42.2** | MIT | React/JS declarative springs, layout animations, gestures. |
| `framer-motion` | **12.42.2** | MIT | Same package, legacy alias — now a re-export of `motion`. |
| `lenis` | **1.3.25** | MIT | Smooth scroll. Was `@studio-freight/lenis`, now `lenis` under darkroomengineering. |
| `animejs` | **4.5.0** | MIT | v4 is a full ESM rewrite with a new modular API — not a drop-in from v3. |
| `three` | **0.185.1** | MIT | WebGL. |
| `@react-three/fiber` | **9.6.1** | MIT | React renderer for Three; v9 targets React 19. |
| `ogl` | **1.0.11** | Unlicense | ~10× smaller than Three; shader-forward sites. |
| `splitting` | **1.1.0** | MIT | Text splitting w/ CSS vars. Largely obsoleted by free SplitText. |
| `@theatre/core` | **0.7.2** | Apache-2.0 | Still pre-1.0; sequencing/GUI. Slow release cadence — evaluate before committing. |
| `lottie-web` | **5.13.0** | MIT | AE-exported vector animation. |
| `@lottiefiles/dotlottie-web` | **0.78.0** | MIT | Newer Rust/WASM runtime; smaller `.lottie` files. |
| `@rive-app/canvas` | **2.38.5** | MIT | State-machine-driven interactive animation. Beats Lottie for anything reactive. |
| `@barba/core` | **2.10.3** | MIT | Last publish 2024-08-12 — effectively dormant. See §6. |

**The GSAP licensing change is the big one:** as of **3.13.0 (2025-04-29)** ✅ every former Club GreenSock plugin — SplitText, MorphSVG, Flip, ScrollSmoother, DrawSVG, Inertia — is free for commercial use under Webflow's sponsorship.

---

## 1. Easing — exact cubic-bezier values

### 1a. Verifying the curves you listed

| Value | Real identity | Verdict |
|---|---|---|
| `cubic-bezier(0.16, 1, 0.3, 1)` | **easeOutExpo** (easings.net) | ✅ confirmed |
| `cubic-bezier(0.65, 0, 0.35, 1)` | **easeInOutCubic** | ✅ |
| `cubic-bezier(0.4, 0, 0.2, 1)` | **Material Design *2* "standard"** | ✅ — note M3 replaced it, see below |
| `cubic-bezier(0.83, 0, 0.17, 1)` | **easeInOutQuint** | ✅ |
| `cubic-bezier(0.22, 1, 0.36, 1)` | **easeOutQuint** | ✅ |
| `cubic-bezier(0.19, 1, 0.22, 1)` | No canonical name — a hand-tuned near-expo out | ⚠️ common in agency codebases; I could not source an authoritative origin |
| `cubic-bezier(0.6, 0.01, 0, 0.9)` | No canonical name — a symmetric in-out | ⚠️ same caveat; searches returned no attributable studio |

The last two are real and usable, but treat "studio X uses this" claims as folklore — I found no primary source.

### 1b. Full easings.net table ⚠️
These are the canonical published values (stable for years, but the page is JS-rendered so I could not re-scrape them this session):

```css
--ease-in-sine:     cubic-bezier(0.12, 0,    0.39, 0);
--ease-out-sine:    cubic-bezier(0.61, 1,    0.88, 1);
--ease-in-out-sine: cubic-bezier(0.37, 0,    0.63, 1);
--ease-in-quad:     cubic-bezier(0.11, 0,    0.5,  0);
--ease-out-quad:    cubic-bezier(0.5,  1,    0.89, 1);
--ease-in-out-quad: cubic-bezier(0.45, 0,    0.55, 1);
--ease-in-cubic:    cubic-bezier(0.32, 0,    0.67, 0);
--ease-out-cubic:   cubic-bezier(0.33, 1,    0.68, 1);
--ease-in-out-cubic:cubic-bezier(0.65, 0,    0.35, 1);
--ease-in-quart:    cubic-bezier(0.5,  0,    0.75, 0);
--ease-out-quart:   cubic-bezier(0.25, 1,    0.5,  1);
--ease-in-out-quart:cubic-bezier(0.76, 0,    0.24, 1);
--ease-in-quint:    cubic-bezier(0.64, 0,    0.78, 0);
--ease-out-quint:   cubic-bezier(0.22, 1,    0.36, 1);
--ease-in-out-quint:cubic-bezier(0.83, 0,    0.17, 1);
--ease-in-expo:     cubic-bezier(0.7,  0,    0.84, 0);
--ease-out-expo:    cubic-bezier(0.16, 1,    0.3,  1);
--ease-in-out-expo: cubic-bezier(0.87, 0,    0.13, 1);
--ease-in-circ:     cubic-bezier(0.55, 0,    1,    0.45);
--ease-out-circ:    cubic-bezier(0,    0.55, 0.45, 1);
--ease-in-out-circ: cubic-bezier(0.85, 0,    0.15, 1);
--ease-in-back:     cubic-bezier(0.36, 0,    0.66, -0.56);
--ease-out-back:    cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-in-out-back: cubic-bezier(0.68, -0.6, 0.32, 1.6);
```

**Practical shortlist.** For premium web, ~90% of work uses four curves: `easeOutExpo` (0.16,1,0.3,1) for entrances, `easeOutQuint` (0.22,1,0.36,1) for a slightly softer entrance, `easeInOutQuint` (0.83,0,0.17,1) for A→B moves, and `easeOutBack` (0.34,1.56,0.64,1) *sparingly* for playful pops.

### 1c. Material 3 tokens ✅
Pulled verbatim from `material-components-android/docs/theming/Motion.md`:

```css
/* Easing */
--md-sys-motion-easing-linear:                cubic-bezier(0, 0, 1, 1);
--md-sys-motion-easing-standard:              cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-standard-decelerate:   cubic-bezier(0, 0, 0, 1);
--md-sys-motion-easing-standard-accelerate:   cubic-bezier(0.3, 0, 1, 1);
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
--md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
```

**`emphasized` is not a cubic-bezier at all** — it's a two-segment path, which is why it can't be expressed as one bezier:
```
M 0,0 C 0.05,0, 0.133333,0.06, 0.166666,0.4 C 0.208333,0.82, 0.25,1, 1,1
```
Feed that straight into `CustomEase.create("m3-emphasized", "M 0,0 C ...")`, or approximate in CSS with `linear()`.

Note M3 **replaced** the M2 `(0.4, 0, 0.2, 1)` standard curve with the much flatter `(0.2, 0, 0, 1)`. If you're using `(0.4,0,0.2,1)` you're on 2014-era Material.

Duration tokens ✅ (exact ms):
```
short1  50    medium1 250    long1 450    extraLong1  700
short2 100    medium2 300    long2 500    extraLong2  800
short3 150    medium3 350    long3 550    extraLong3  900
short4 200    medium4 400    long4 600    extraLong4 1000
```

**M3 Expressive** (announced 2025-05-13) adds a spring-based scheme. Reported cubic-bezier approximations ⚠️ — *these came from a secondary blog, not Google's own docs, and I could not confirm them against m3.material.io (JS-rendered):*
```css
--m3-expressive-spatial-fast:    cubic-bezier(0.42, 1.67, 0.21, 0.9);  /* 350ms */
--m3-expressive-spatial-default: cubic-bezier(0.38, 1.21, 0.22, 1);    /* 500ms */
--m3-expressive-spatial-slow:    cubic-bezier(0.39, 1.29, 0.35, 0.98); /* 650ms */
```
Treat as a starting point, not gospel. The y₂ > 1 values are what produce the overshoot.

### 1d. CSS `linear()` — spring approximation ✅

Support: **Chrome/Edge 113+, Firefox 112+, Safari 17.2+** ✅ — i.e. universally available in 2026. Chrome DevTools has an interactive `linear()` editor since 114.

`cubic-bezier()` mathematically **cannot overshoot past 1 and return**. `linear()` can, because it's an arbitrary polyline. That's the whole point.

```css
/* Syntax: values interpolate linearly between evenly-spaced stops */
animation-timing-function: linear(0, 0.25, 1);
/* Explicit stop position */
animation-timing-function: linear(0, 0.25 75%, 1);
/* Stop with a start AND end (a flat hold) */
animation-timing-function: linear(0, 0.25 25% 75%, 1);
```

Production bounce, straight from Chrome's docs ✅ — copy-pasteable:
```css
animation-timing-function: linear(
  0, 0.004, 0.016, 0.035, 0.063 9.1%, 0.141, 0.25, 0.391, 0.563, 0.765, 1,
  0.891, 0.813 45.5%, 0.785, 0.766, 0.754, 0.75, 0.754, 0.766, 0.785,
  0.813 63.6%, 0.891, 1 72.7%, 0.973, 0.953, 0.941, 0.938, 0.941, 0.953,
  0.973, 1, 0.988, 0.984, 0.988, 1
);
```

**Point count matters.** Josh Comeau's article ✅ demonstrates that an 11-point spring is visibly wrong — *"11 values are just not enough to faithfully reproduce a springy value"* — and that **~40–50 points** is where it becomes convincing. His hand-traced 11-point attempt, shown as a negative example:
```css
linear(0, 1.25, 1, 0.9, 1.04, 0.99, 1.005, 0.996, 1.001, 0.999, 1)  /* don't ship this */
```

**Generators** ✅:
- `https://linear-easing-generator.netlify.app/` (Jake Archibald / Adam Argyle) — takes a JS easing fn or SVG path, outputs optimized `linear()`. Has Spring/Bounce/Material-emphasized presets.
- Easing Wizard — broader (springs, bounces, wiggles), nicer UI.
- `spring-easing` (npm, okikio) — programmatic `CSSSpringEasing()`, works with GSAP/anime/Motion/WAAPI.

**Motion generates these for you** ✅:
```js
import { spring } from "motion"
element.style.transition = "all " + spring(0.5)   // → "0.5s linear(0, 0.004, ...)"
```

### 1e. GSAP eases ✅

`power0` (linear) → `power4` (most aggressive), plus `expo`, `circ`, `back`, `elastic`, `bounce`, `steps()`, `rough`, `slow`. Suffix `.in` / `.out` / `.inOut`; bare name defaults to `.out`.

Rough equivalences ⚠️: `power2` ≈ cubic, `power3` ≈ quart, `power4` ≈ quint. `expo.out` is steeper than `power4.out`.

**CustomEase** ✅ (free since 3.13, register first):
```js
gsap.registerPlugin(CustomEase);

// Form 1 — cubic-bezier shorthand, four numbers as a string
CustomEase.create("premium", "0.16, 1, 0.3, 1");   // easeOutExpo

// Form 2 — arbitrary SVG path (M, C, S, L, Z supported)
CustomEase.create("hop",
  "M0,0 C0,0 0.056,0.442 0.175,0.442 0.294,0.442 0.332,0 0.332,0 0.332,0 0.414,1 0.671,1 0.991,1 1,0 1,0");

// Form 2 also lets you port M3's `emphasized` exactly:
CustomEase.create("m3-emphasized",
  "M 0,0 C 0.05,0, 0.133333,0.06, 0.166666,0.4 C 0.208333,0.82, 0.25,1, 1,1");

gsap.to(el, { duration: 1, y: -100, ease: "hop" });
```
Any cubic-bezier.com value pastes directly into `CustomEase.create()` or the Ease Visualizer.

---

## 2. Spring physics

### 2a. Motion / Framer Motion 🔶

Docs (`motion.dev/docs/react-transitions` and `/docs/spring`) list, on **both** pages:
- `stiffness` — **default 1**
- `damping` — default **10**
- `mass` — default **1**
- `velocity` — current value velocity
- `restSpeed` — **0.1** (units/sec)
- `restDelta` — **0.01**

🔶 **Flag this.** A default stiffness of `1` with damping `10` would be wildly overdamped and is inconsistent with Framer Motion's long-standing documented default of **100**. I fetched the docs twice and got `1` both times, and grepping the minified `motion-dom` bundle didn't resolve it. **Verify against your installed version before relying on it.** What I *did* confirm from the bundle: the duration-based defaults are `duration ≈ 0.3` and `bounce ≈ 0.3` ✅ (docs say bounce 0.25).

Duration/bounce API ✅ — this is the modern, preferred path:
```js
{ type: "spring", duration: 0.8, bounce: 0.25 }   // bounce 0 → 1
{ type: "spring", visualDuration: 0.5, bounce: 0.2 }
```
`visualDuration` overrides `duration` and means "when it visually arrives" — the bouncy tail happens after. This is the parameter you actually want for UI, because it's perceptual.

**Critical gotcha** ✅ — quoting the docs: *"bounce and duration will be overridden if stiffness, damping or mass are set."* Never mix the two systems in one transition object.

Named eases ✅: `linear`, `easeIn/Out/InOut`, `circIn/Out/InOut`, `backIn/Out/InOut`, `anticipate`. Cubic-bezier as a 4-array: `[0.16, 1, 0.3, 1]`.

### 2b. Five named presets ⚠️
Physics values, tuned rather than sourced:
```js
export const springs = {
  // No overshoot, but alive — the workhorse. Modals, cards, drawers.
  smooth:   { type: "spring", stiffness: 260, damping: 32, mass: 1 },
  // Fast + crisp, hair of overshoot. Toggles, chips, tabs.
  snappy:   { type: "spring", stiffness: 400, damping: 30, mass: 1 },
  // Heavy, cinematic. Hero elements, full-screen panels.
  weighted: { type: "spring", stiffness: 140, damping: 26, mass: 1.4 },
  // Playful, visible bounce. Success states, badges, emoji.
  bouncy:   { type: "spring", stiffness: 320, damping: 18, mass: 1 },
  // Gesture handoff — preserves flick velocity without wobble.
  gesture:  { type: "spring", stiffness: 300, damping: 34, mass: 1 },
};
```
**The rule that governs all of this:** the damping ratio is `ζ = damping / (2 × √(stiffness × mass))`.
- `ζ = 1` → critically damped, **zero overshoot**, the fastest possible no-overshoot arrival
- `ζ ≈ 0.75–0.9` → "no overshoot but alive" — a barely-perceptible 1–2% overshoot. This is the premium zone.
- `ζ ≈ 0.5–0.65` → visible, playful bounce
- `ζ < 0.4` → cartoon; wrong for UI chrome

Check yours: `smooth` above = 32 / (2√260) ≈ **0.99**. `bouncy` = 18 / (2√320) ≈ **0.50**.

### 2c. react-spring ✅
Read straight from `packages/core/src/constants.ts` — **`mass` defaults to 1**:
```js
export const config = {
  default:  { tension: 170, friction: 26  },
  gentle:   { tension: 120, friction: 14  },
  wobbly:   { tension: 180, friction: 12  },
  stiff:    { tension: 210, friction: 20  },
  slow:     { tension: 280, friction: 60  },
  molasses: { tension: 280, friction: 120 },
}
```
`tension` = stiffness, `friction` = damping. Note **`default` (170/26) is exactly the Origami/Rebound default** that has propagated through Apple-adjacent design tooling for a decade — ζ ≈ 0.997, i.e. almost perfectly critically damped. That is not a coincidence; it's why it feels "right".

### 2d. Apple — the conversion formulas ✅

From **WWDC23 "Animate with springs"** ✅. Apple's modern API is **duration + bounce**, and bounce ranges **−1.0 to 1.0**:

| bounce | Damping | Behavior |
|---|---|---|
| `> 0` | underdamped | overshoots, oscillates |
| `= 0` | critically damped | long tail, no overshoot |
| `< 0` | overdamped | flatter tail, no overshoot |

**The exact conversion** ✅ — this is the mapping you asked for:
```
mass      = 1
stiffness = (2π ÷ duration)²
damping   = 1 − 4π × bounce ÷ duration        (bounce ≥ 0)
          = 4π ÷ (duration + 4π × bounce)     (bounce <  0)
```
And the older `response`/`dampingFraction` API maps as: `response` **is** the duration term (`stiffness = (2π/response)²`), and `dampingFraction` **is** ζ directly (`damping = 2 × dampingFraction × √(stiffness × mass)`).

Worked example: `duration 0.5, bounce 0` → `stiffness = (6.283/0.5)² ≈ 158`, `damping ≈ 1`… note Apple's formula operates in their normalized unit system, so port the *ratio*, not the raw number, into Motion.

Apple's own recommended values ✅:

| Scenario | bounce | duration |
|---|---|---|
| General purpose | **0** | **0.5s** |
| Playful | 0.15–0.3 | 0.5s |
| Gesture-driven | 0–0.15 | 0.4–0.6s |
| Scroll deceleration | −0.1 to 0 | — |

**Apple's explicit guidance: keep bounce ≤ 0.4, and use 0 as your default.** The single most valuable line from that talk: *a spring with `bounce: 0` is excellent for most UI animations.* Overshoot is not what makes motion feel premium — correct timing does.

SwiftUI presets ✅ exist as `.smooth` (critically damped), `.snappy` (slightly underdamped), `.bouncy` (clearly underdamped), each taking `(duration:extraBounce:)`. ⚠️ Apple does not publish the exact numeric bounce values for these; the WWDC transcript explicitly omits them.

---

## 3. Durations & stagger

### 3a. The numbers ⚠️
Synthesized from Material ✅, Fluent, and practice:

| Interaction | Duration | Ease |
|---|---|---|
| Hover / focus / color | **100–150ms** | `ease-out` or linear (color only) |
| Button press | **80–100ms** down, 150–200ms release | `ease-out` |
| Tooltip / dropdown | **150–200ms** | `easeOutQuad` |
| Small element enter | **200–300ms** | `easeOutExpo` |
| Card / modal enter | **300–400ms** | `easeOutExpo` or spring ζ≈0.85 |
| Modal exit | **200–250ms** | `easeInQuad` — **always faster than enter** |
| Page transition | **400–600ms** total | `easeInOutQuint` |
| Hero reveal (above fold) | **800–1200ms** | `easeOutExpo` |
| Editorial curtain/wipe | **1000–1400ms** ✅ | `ease` |

Hard boundaries ⚠️: **< 80ms reads as broken** (imperceptible, looks like a jump-cut). **> 500ms for a functional UI transition reads as sluggish.** The 200–500ms band is where most functional motion belongs. Hero/editorial reveals break the 500ms rule *deliberately* — but only for content the user isn't waiting on.

### 3b. Stagger ⚠️
```js
// Lists / cards / nav items
stagger: 0.06   // 60ms — tight, premium
stagger: 0.08   // 80ms — the most common value in agency work
stagger: 0.12   // 120ms — deliberate, editorial
stagger: 0.15+  // starts to feel slow with >6 items

// Word-level text
stagger: 0.03   // 30ms

// Character-level text
stagger: 0.015  // 15ms — fast enough to read as one gesture
stagger: 0.02   // 20ms — safe default
stagger: 0.03   // 30ms — only for short words / logos
```
**The stagger budget rule:** `items × stagger + duration` should stay under ~1.2s. 20 cards × 0.08 = 1.6s of stagger alone — too long. Use GSAP's object form to cap total time:
```js
stagger: { each: 0.08, from: "start", amount: 0.6 }  // `amount` caps TOTAL stagger at 0.6s
```
`from` ✅ accepts `"start"` (default), `"center"`, `"end"`, `"edges"`, `"random"`, or an index.

### 3c. Size ↔ duration ⚠️
The underlying principle is **constant perceived velocity**, not constant duration. An object crossing 1000px in 300ms looks frantic; the same 300ms across 40px looks fine. Rough scaling:

| Travel distance | Duration |
|---|---|
| < 100px | 200ms |
| 100–500px | 300ms |
| 500–1000px | 400ms |
| Full viewport | 500–600ms |

Material formalizes this: **150–200ms for small elements, up to 400ms for large ones.** Full-screen elements get the longest durations — and exits should be ~30–40% *shorter* than entrances, because the user has already decided.

---

## 4. Scroll-driven animation ⚠️

*(My delegated research on this section did not return in time; the following is from canonical docs. Re-verify the browser-support line before shipping.)*

### 4a. Native CSS
```css
/* Progress tied to the element's own path through the viewport */
@keyframes reveal {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

/* Progress tied to a scroll container (progress bars) */
.progress {
  animation: grow linear both;
  animation-timeline: scroll(root block);
  transform-origin: left;
}

/* Named timelines — animate element A based on element B's position */
.driver { view-timeline-name: --hero; view-timeline-axis: block; }
.follower {
  animation: fade linear both;
  animation-timeline: --hero;
}
/* If they aren't siblings/descendants, hoist the name: */
body { timeline-scope: --hero; }
```

`animation-range` keywords: `cover` (any overlap), `contain` (fully inside), `entry` (entering), `exit` (leaving), `entry-crossing`, `exit-crossing`. Shorthand: `animation-range: entry 25% cover 50%;`

⚠️ **Browser support, needs re-verification.** Chrome/Edge **115+** shipped it in 2023. Safari shipped scroll-driven animations in the **26.x** line. Firefox has been behind `layout.css.scroll-driven-animations.enabled` — **check caniuse before assuming Firefox parity in 2026.** Always pair with `@supports (animation-timeline: view())` and treat the un-animated state as the baseline.

**Note `animation: ... both` matters** — without `both`, elements snap to their un-animated state outside the range.

### 4b. GSAP ScrollTrigger ⚠️
```js
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".section",
  start: "top 80%",      // trigger's top hits 80% down the viewport
  end: "+=100%",         // 100% of viewport height later
  scrub: 1,              // ← see below
  pin: true,
  pinSpacing: true,
  anticipatePin: 1,      // pre-pins ~1 frame early; kills the pin "jump" on fast scroll
  invalidateOnRefresh: true,
  markers: true,         // dev only
});
```

**`scrub` semantics — the number is seconds of catch-up lag:**
- `scrub: true` — position locks 1:1 to scroll. Zero smoothing. Feels mechanical, and exposes every scroll-wheel step as a jump.
- `scrub: 0.5` — half a second to catch up. Snappy but smoothed.
- `scrub: 1` — **the premium default.** One second of easing toward the scroll position. This is what makes scrub sequences feel liquid.
- `scrub: 2+` — dreamy, laggy; good for background parallax, bad for anything the user is reading.

Using `scrub: true` instead of `scrub: 1` is one of the most common reasons a scroll site feels cheap.

`start`/`end` string syntax is `"[trigger position] [viewport position]"`: `"top bottom"`, `"top 80%"`, `"center center"`, `"bottom top"`, plus relative `"+=500"` / `"+=100%"`.

Snap:
```js
snap: {
  snapTo: 1 / (sections.length - 1),  // or "labels", "labelsDirectional", or a fn
  duration: { min: 0.2, max: 0.6 },
  delay: 0.1,
  ease: "power1.inOut",
  directional: true,
}
```

### 4c. Lenis ⚠️ (v1.3.25 ✅)
```js
import Lenis from 'lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // the canonical Lenis expo-out
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  syncTouch: false,      // leave false — true fights native momentum on iOS
  infinite: false,
});
```

`duration` and `lerp` are **mutually exclusive** — pass one:
- `lerp: 0.1` — the common studio value; frame-based, snappier
- `lerp: 0.075` — heavier, more luxurious
- `duration: 1.2` — time-based, more consistent across refresh rates. Prefer this on 120Hz displays.

**Canonical GSAP integration** (get this wrong and you get double-RAF jitter):
```js
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```
`lagSmoothing(0)` is essential — otherwise GSAP silently clamps delta time after a frame drop and Lenis desyncs.

**Do not smooth-scroll everything.** Lenis on a docs site or a form-heavy page is user-hostile. It belongs on editorial/portfolio work. Always respect `prefers-reduced-motion` by calling `lenis.destroy()`.

### 4d. IntersectionObserver ⚠️
```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    io.unobserve(entry.target);          // one-shot: never re-animate
  });
}, {
  threshold: 0.15,                        // 15% visible
  rootMargin: '0px 0px -15% 0px',         // fire 15% BEFORE it reaches the bottom edge
});
```
- `threshold: 0` — fires on the first pixel. Too eager for reveals.
- `threshold: 0.15–0.25` — the reveal sweet spot.
- `threshold: [0, 0.25, 0.5, 0.75, 1]` — only when you need progress, and even then prefer scroll-driven CSS.

The **negative bottom `rootMargin`** is the trick that makes reveals feel intentional: it delays the trigger until the element is meaningfully on screen rather than peeking.

---

## 5. Text reveal

### 5a. GSAP SplitText — free since 3.13 ✅

The 3.13 rewrite ✅ added 14 features at ~50% of the old size: **built-in masking**, `autoSplit`, `onSplit`, proper `aria` handling, deep-slicing across nested `<span>`/`<strong>`/`<a>`, and emoji/i18n support.

Config options ✅: `type`, `mask`, `linesClass`/`wordsClass`/`charsClass` (append `"++"` to auto-increment), `smartWrap` (false), `autoSplit` (false), `aria` (`"auto"`), `propIndex` (false), `deepSlice` (true), `tag` (`"div"`), `prepareText`, `onSplit`, `reduceWhiteSpace` (true).

**Line-mask reveal — the single most-used premium text pattern** ✅:
```js
gsap.registerPlugin(SplitText);

SplitText.create(".headline", {
  type: "lines",
  mask: "lines",        // ← 3.13+: auto-wraps each line in a clipping div
  autoSplit: true,      // re-splits on font load + resize. ALWAYS use with web fonts.
  onSplit(self) {
    return gsap.from(self.lines, {   // returning the tween syncs timing across re-splits
      yPercent: 110,                 // 110 not 100 — clears descenders (g, y, p)
      duration: 0.8,
      stagger: 0.08,
      ease: "expo.out",
    });
  },
});
```
`yPercent: 110` ✅ is the detail most people miss — at exactly 100 the descenders of `g`/`y`/`p` peek below the mask.

**The DOM-efficiency trick** ✅ from Codrops — split chars for the stagger but mask at the *line* level, so you create N wrappers instead of hundreds:
```js
SplitText.create("h1", { type: "chars, lines", mask: "lines" });
```

**Character stagger** ✅:
```js
SplitText.create(".split", {
  type: "chars",
  onSplit: (self) => gsap.from(self.chars, {
    y: 100, autoAlpha: 0, duration: 1, stagger: 0.02,
  }),
});
```

`autoSplit: true` + `onSplit` returning the animation is the fix for the classic bug where text re-splits after a webfont loads and the animation dies mid-flight.

**Accessibility is handled for you now** ✅ — SplitText adds `aria-label` to the parent and `aria-hidden` to generated elements, so screen readers read the sentence, not the letters. This was a genuine problem with hand-rolled splitters and with Splitting.js.

### 5b. Line-mask without SplitText
```html
<span class="line-mask"><span class="line">Text</span></span>
```
```css
.line-mask { display: block; overflow: hidden; }  /* or `overflow: clip` */
.line { display: block; transform: translateY(110%); }
.is-visible .line {
  transform: translateY(0);
  transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
}
```
Stagger with `transition-delay: calc(var(--i) * 80ms)`.

### 5c. clip-path vs. transform+overflow ⚠️
- **transform + `overflow: hidden`** — cheapest. Pure compositor work, no repaint. Use this for line reveals. Downside: needs a wrapper element, and the wrapper's `overflow` clips any intentional overflow (shadows, italics).
- **`clip-path: inset()`** — no wrapper needed, animates on the compositor in modern browsers, and can do directional wipes and rounded reveals. Slightly more expensive. Use for image/panel reveals and the curtain transition.
- Never animate `width`/`height`/`clip` (deprecated) — those trigger layout.

```css
/* clip-path wipe, no wrapper */
.reveal { clip-path: inset(0 100% 0 0); transition: clip-path 900ms cubic-bezier(0.83,0,0.17,1); }
.reveal.is-visible { clip-path: inset(0 0 0 0); }
```

### 5d. Blur-in ⚠️
```css
@keyframes blur-in {
  from { opacity: 0; filter: blur(12px); transform: translateY(16px); }
  to   { opacity: 1; filter: blur(0);    transform: translateY(0); }
}
.word { animation: blur-in 700ms cubic-bezier(0.16,1,0.3,1) both; }
```
**`filter: blur()` is expensive** — it forces a repaint per frame and does not stay on the compositor. Budget: fine for a single hero line or ~20 words; visibly janky at 200 characters. Blur-in on *words*, never on *chars*, and never simultaneously with a heavy scroll scrub.

The Next.js/Vercel view-transition pattern ✅ uses a smarter variant — a brief blur *spike* mid-transition to mask interpolation artifacts, rather than a blur that runs the whole time:
```css
@keyframes via-blur { 30% { filter: blur(3px); } }
```

### 5e. Variable font reveals ⚠️
```css
@keyframes weight-in {
  from { font-variation-settings: 'wght' 100; opacity: 0; }
  to   { font-variation-settings: 'wght' 700; opacity: 1; }
}
```
⚠️ **Real gotcha:** animating `wght` changes glyph advance widths, so the text's bounding box reflows *every frame* — layout thrash, and lines re-wrap mid-animation. Mitigations: use a font with a `wdth` axis held constant, set `font-variation-settings` on a fixed-width container, or pre-reserve the widest state with `min-inline-size`. Prefer `font-variation-settings` over `font-weight` for sub-100 granularity, and animate opacity/transform alongside so the eye tracks those instead.

---

## 6. Page transitions ✅

*(Fully verified — versions checked against npm, support against caniuse.)*

### 6a. Browser support, July 2026

**Same-document** `document.startViewTransition()` — **88.46% global** ✅:

| Browser | Version |
|---|---|
| Chrome / Edge | **111** (Mar 2023) |
| Safari / iOS | **18.0** (Sep 2024) |
| Firefox | **144** (default on; 143 behind `dom.viewTransitions.enabled`) |

**Cross-document** `@view-transition { navigation: auto; }` — **82.01% global** ✅:

| Browser | Version |
|---|---|
| Chrome / Edge | **126** (Jun 2024) |
| Safari / iOS | **18.2** (Dec 2024) |
| **Firefox** | **NOT SUPPORTED through 155** — Bugzilla 1860854 |

⚠️ **Correct a common 2026 claim:** several blog posts assert cross-document VT is now cross-browser. It is not — **Firefox shipped same-doc only.** MDN still marks `@view-transition` as *Limited availability / not Baseline*. Firefox users get an instant un-animated swap. Ship it as progressive enhancement.

Cross-doc hard constraints ✅: same-origin only, **no intermediate cross-origin redirects**, navigation must be `traverse`/`push`/`replace` (reloads excluded), **4-second timeout**, and the `pagereveal` listener **must be in a parser-blocking `<head>` script** — no `async`, no `defer`, no `type=module`.

### 6b. The default UA stylesheet ✅
Verbatim from **W3C CSS View Transitions L1 §5** — this is where the magic 250ms lives:
```css
@keyframes -ua-view-transition-fade-out { to   { opacity: 0; } }
@keyframes -ua-view-transition-fade-in  { from { opacity: 0; } }

:root::view-transition-group(*) {
  animation-duration: 0.25s;      /* ← THE default */
  animation-fill-mode: both;
}
:root::view-transition-old(*),
:root::view-transition-new(*) {
  animation-duration: inherit;
  animation-fill-mode: inherit;
  animation-delay: inherit;
}
```
**Retime everything by overriding `::view-transition-group()`, not old/new** — duration/delay/timing-function cascade down the tree. Default easing is CSS `ease`.

Pseudo-element tree ✅:
```
::view-transition                         (fixed overlay, fills viewport)
└─ ::view-transition-group(name)          absolute; animates width/height/transform
   └─ ::view-transition-image-pair(name)  isolation: isolate
      ├─ ::view-transition-old(name)      mix-blend-mode: plus-lighter
      └─ ::view-transition-new(name)      mix-blend-mode: plus-lighter
```

### 6c. `view-transition-class` ✅ (Chrome 125+)
Solves the "I have 50 cards and can't write 50 rules" problem — names must be unique, classes need not be:
```css
#card1 { view-transition-name: card1; }
#card2 { view-transition-name: card2; }
#cards > div { view-transition-class: card; }

html::view-transition-group(.card) {          /* note the leading dot */
  animation-timing-function: linear(0, 0.5 25%, 1.2 50%, 0.9 75%, 1);
  animation-duration: 400ms;
}
```

### 6d. `pageswap` / `pagereveal` ✅
```html
<head>
<script> <!-- MUST be parser-blocking -->
window.addEventListener('pageswap', async (e) => {
  if (!e.viewTransition) return;
  const to = new URL(e.activation.entry.url);
  if (to.pathname.startsWith('/photo/')) {
    e.viewTransition.types.add('nav-forward');
    // just-in-time naming: tag ONLY the element being navigated to
    document.querySelector(`[data-id="${to.pathname.split('/').pop()}"]`)
            .style.viewTransitionName = 'hero';
  }
  await e.viewTransition.finished;
});

window.addEventListener('pagereveal', async (e) => {
  if (!e.viewTransition) return;
  document.querySelector('.hero').style.viewTransitionName = 'hero';
  await e.viewTransition.ready;
  document.querySelector('.hero').style.viewTransitionName = 'none'; // free the name
});
</script>
</head>
```
Type-gating:
```css
html:active-view-transition-type(nav-forward) {
  &::view-transition-old(content) { animation-name: slide-out-to-left; }
  &::view-transition-new(content) { animation-name: slide-in-from-right; }
}
```

### 6e. Next.js — native React `<ViewTransition>` ✅ (Next 16.2+)
```ts
// next.config.ts
export default { experimental: { viewTransition: true } }
```
App Router runs React canary, so no `react@canary` install needed. **Activated by Transitions, `<Suspense>`, and `useDeferredValue` — plain `setState` does not trigger it.**

```tsx
import { ViewTransition } from 'react'
<ViewTransition name={`photo-${photo.id}`} share="morph">
  <Image src={photo.src} />
</ViewTransition>
```
```css
::view-transition-group(.morph)      { animation-duration: 400ms; }
::view-transition-image-pair(.morph) { animation-name: via-blur; }
@keyframes via-blur { 30% { filter: blur(3px); } }
```
400ms is Vercel's stated sweet spot: *"slow enough to register, fast enough to feel direct."*

**Asymmetric enter/exit — the premium detail** ✅:
```css
:root { --duration-exit: 150ms; --duration-enter: 210ms; }
::view-transition-old(.slide-down) {
  animation: var(--duration-exit) ease-out both fade reverse,
             var(--duration-exit) ease-out both slide-y reverse;
}
::view-transition-new(.slide-up) {
  animation: var(--duration-enter) ease-in var(--duration-exit) both fade,
             400ms ease-in both slide-y;
}
@keyframes fade    { from { filter: blur(3px); opacity: 0; } to { filter: blur(0); opacity: 1; } }
@keyframes slide-y { from { transform: translateY(10px); }  to { transform: translateY(0); } }
```
**Exit 150ms, enter 210ms delayed by 150ms.** Old content leaves fast so it stops competing for attention; new content arrives gently. Directional nav uses a **60px** offset — enough to read as direction without forcing the eye to track a fast object.

Anchor the header to kill the double-header flash ✅:
```css
::view-transition-group(site-header) { animation: none; z-index: 100; }
::view-transition-old(site-header)   { display: none; }
::view-transition-new(site-header)   { animation: none; }
```
Reduced motion ✅:
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*), ::view-transition-new(*), ::view-transition-group(*) {
    animation-duration: 0s !important; animation-delay: 0s !important;
  }
}
```
`next-view-transitions` (shuding) is at **0.3.5, last published 2025-12-05** ✅ — maintenance mode. Prefer native React on Next 16.2+.

### 6f. Astro ✅
Component was **renamed `<ViewTransitions />` → `<ClientRouter />` in Astro 5**.
```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head><ClientRouter /></head>
...
<aside transition:name="hero">
<header transition:animate="fade">   <!-- fade (default) | slide | none | initial -->
<video transition:persist>           <!-- survives navigation -->
```
```js
document.addEventListener('astro:before-swap', (e) => {
  e.newDocument.documentElement.dataset.theme = localStorage.theme;  // kills theme flash
});
```
Events: `astro:before-preparation`, `astro:after-preparation`, `astro:before-swap`, `astro:after-swap`, `astro:page-load`.

### 6g. SvelteKit ✅ (since 1.24)
```svelte
<script>
  import { onNavigate } from '$app/navigation';
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>
```
`onNavigate` fires *after* data loading, immediately before render — deliberately as late as possible, since starting a transition freezes interaction.

### 6h. Curtain / wipe ✅
Pure CSS, zero JS, cross-document. Note the `@view-transition` opt-in is itself inside the reduced-motion query — that's the clean kill switch:
```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; types: curtain; }
}
html:active-view-transition-type(curtain)::view-transition-old(root) {
  animation: curtain-out 1.4s ease forwards;
}
html:active-view-transition-type(curtain)::view-transition-new(root) {
  animation: curtain-in 1.4s ease forwards;
}
@keyframes curtain-out { from { clip-path: inset(0 0 0 0); } }
@keyframes curtain-in  { from { clip-path: inset(0 50% 0 50%); }
                         to   { clip-path: inset(0 0 0 0); } }

/* Wipe up */
@keyframes wipe-out { from { clip-path: inset(0 0 0 0);    } to { clip-path: inset(0 0 100% 0); } }
@keyframes wipe-in  { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0 0);    } }
```
**1.4s ease forwards** across these recipes — long by app standards, deliberate for editorial. `clip-path` beats a physical panel here because VT snapshots are already composited, so it stays on the compositor thread.

### 6i. Barba.js — status ✅
**`@barba/core@2.10.3`, published 2024-08-12.** Nearly two years with no release. v1.x formally deprecated. 2.10.3's own release notes acknowledge it reintroduces bug #700. Functional, ~7kb, TypeScript — but **dormant. Do not start new premium builds on it.**

Alternatives ✅ (npm-verified):

| Library | Latest | Published |
|---|---|---|
| **swup** | **4.9.2** | 2026-06-12 — actively maintained, ~12KB, best Barba replacement |
| `@unseenco/taxi` | 1.9.1 | 2025-11-01 — Highway.js successor |

**2026 default: native cross-document view transitions.** Reach for swup only when you need Firefox parity, persistent DOM (audio/video/WebGL canvas surviving navigation), or JS-orchestrated multi-stage sequences.

### 6j. GSAP Flip ✅ (free since 3.9)
```js
gsap.registerPlugin(Flip);

const state = Flip.getState('.targets', {
  props: 'backgroundColor,color,borderRadius',
  simple: false,
  kill: false,
});

element.classList.toggle('full-screen');
container.appendChild(element);        // reparenting is fine

Flip.from(state, {
  duration: 0.7,
  ease: 'power1.inOut',
  absolute: true,
  nested: true,
  prune: true,
  scale: true,
  spin: false,
  zIndex: 1000,
  onEnter: (els) => gsap.fromTo(els, {opacity:0, scale:0.8}, {opacity:1, scale:1, duration:0.4}),
  onLeave: (els) => gsap.to(els, {opacity:0, scale:0.8, duration:0.4}),
});
```
The vars that actually matter ✅:
- **`absolute: true`** — forces `position:absolute` during the flip. Essential when flipped elements would otherwise disturb document flow.
- **`nested: true`** — **required** when a parent *and* its child are both targets. Without it, a parent moving 200px plus a child moving 200px compounds to 400px on the child.
- **`prune: true`** — drops unchanged targets. Real perf win on large grids.
- **`scale: true`** — uses `scaleX/scaleY` instead of `width/height`. Compositor-friendly but distorts borders and text; use width/height when crispness matters.

GSAP's global defaults are `duration: 0.5, ease: "power1.out"`; the Flip docs' example uses `duration: 1`. ⚠️ For premium shared-element morphs, **0.6–0.8s with `power2.inOut` or `expo.out`** reads better than the 1s demo value.

Also: `Flip.fit()`, `Flip.batch(id)`, `Flip.to()`, `Flip.isFlipping()`, `Flip.killFlipsOf()`.

**Flip vs. View Transitions:**
- **View Transitions** — cross-document MPA, zero JS, compositor thread, free back/forward. But **uninterruptible by design** (the page is frozen) and limited to snapshot crossfade/transform.
- **GSAP Flip** — same-document only, but **interruptible, reversible, scrubbable**, identical in Firefox, handles reparenting, per-element `onEnter`/`onLeave` staggers, arbitrary CSS props. Choose it for gallery/grid morphs and anything the user can interrupt.

---

## 7. Magnetic cursors & hover physics ⚠️

*(My delegated research here did not return in time. Canonical patterns below — the math is standard, but I have not re-verified specific studio attributions.)*

### 7a. The lerp
```js
const lerp = (a, b, n) => (1 - n) * a + n * b;
```
Per-frame factor, at 60fps:

| n | Feel | Use |
|---|---|---|
| 0.03–0.05 | Very heavy, floaty, ~1s settle | Background parallax layers |
| 0.075 | Luxurious | Cursor ring, smooth scroll |
| 0.1 | **The default** — smooth but responsive | Cursor follower, magnetic buttons |
| 0.15 | Snappy | Cursor dot |
| 0.2–0.3 | Nearly instant, slight smoothing | Fast UI feedback |
| 1.0 | No smoothing | — |

**Frame-rate independence — this matters a lot on 120Hz displays.** A raw lerp with `n = 0.1` moves twice as fast at 120fps as at 60fps, so your site literally feels different on a ProMotion iPad. Fix:
```js
// Exponential decay, normalized to 60fps
const damp = (a, b, n, dt) => lerp(a, b, 1 - Math.pow(1 - n, dt * 60));
// dt in seconds, e.g. from a RAF delta
```
Shipping a naked `lerp(x, target, 0.1)` inside RAF is one of the most common "why does this feel wrong on my machine" bugs.

### 7b. Magnetic button — vanilla
```js
function magnetic(el, { strength = 0.35, radius = 1.5 } = {}) {
  let raf, cx = 0, cy = 0, tx = 0, ty = 0;

  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width  / 2);
    const my = e.clientY - (r.top  + r.height / 2);
    const dist = Math.hypot(mx, my);
    const max  = Math.max(r.width, r.height) * radius;   // threshold = 1.5× element size

    if (dist < max) {
      const falloff = 1 - dist / max;                    // linear falloff to 0 at the edge
      tx = mx * strength * falloff;
      ty = my * strength * falloff;
    } else { tx = 0; ty = 0; }
  };

  const tick = () => {
    cx = lerp(cx, tx, 0.15);
    cy = lerp(cy, ty, 0.15);
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
  tick();
}
```

**The parameters that define the feel:**
- `strength` **0.2** = subtle/corporate · **0.35** = the sweet spot · **0.5** = playful · **>0.6** = the element visibly detaches from its label and looks broken
- `radius` **1.5–2×** the element's largest dimension. Below 1.2 the effect never triggers; above 3 buttons grab the cursor from across the page.
- The **falloff term is non-optional** — without it the element snaps to full offset the instant the cursor crosses the threshold.

### 7c. GSAP `quickTo` version — this is what you should actually ship
```js
const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });

el.addEventListener('mousemove', (e) => {
  const r = el.getBoundingClientRect();
  xTo((e.clientX - (r.left + r.width  / 2)) * 0.35);
  yTo((e.clientY - (r.top  + r.height / 2)) * 0.35);
});
el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
```
`quickTo` returns a reusable setter that **retargets an existing tween** instead of instantiating a new one per mousemove. Calling `gsap.to()` on every mousemove creates and garbage-collects dozens of tween objects per second and causes visible stutter — this is the single biggest perf mistake in cursor code. `duration: 0.6, ease: "power3"` is the widely-used pairing.

For a return-with-personality, use `elastic.out(1, 0.3)` on `mouseleave` only — never on the tracking itself.

### 7d. Custom cursor: dot + ring
```js
const dotX  = gsap.quickTo('.cursor-dot',  'x', { duration: 0.15, ease: 'power3' });
const ringX = gsap.quickTo('.cursor-ring', 'x', { duration: 0.6,  ease: 'power3' });
// ...same for y
```
**Different lerp/duration per layer is the whole effect** — the dot tracks near-instantly (0.15) while the ring lags (0.6). Equal values look like one object with a stroke.
```css
.cursor-dot, .cursor-ring {
  position: fixed; top: 0; left: 0;
  pointer-events: none;                 /* non-negotiable */
  will-change: transform;
  mix-blend-mode: difference;           /* auto-contrast over any background */
  z-index: 9999;
}
body { cursor: none; }
@media (hover: none) { .cursor-dot, .cursor-ring { display: none; } }
```
On hover of an interactive element, scale the ring 1 → 2.5 over ~300ms with `power2.out` and drop its opacity.

⚠️ **Accessibility:** `cursor: none` plus `mix-blend-mode: difference` can render the pointer invisible over mid-grey. Always keep a visible fallback, and disable the whole system under `prefers-reduced-motion` and on touch (`@media (hover: none)`).

### 7e. Velocity skew
```js
let last = 0;
lenis.on('scroll', ({ scroll, velocity }) => {
  const skew = gsap.utils.clamp(-12, 12, velocity * 0.15);
  gsap.to('.skew-target', { skewY: skew, duration: 0.4, ease: 'power3.out' });
});
```
Clamp hard (±8–12°). Uncapped velocity skew on a trackpad flick produces a 45° shear that looks like a rendering bug.

---

## 8. Apple-smooth vs. cheap — the specific failure modes

**1. Linear easing on anything spatial.** Nothing in the physical world starts and stops instantaneously. `transition: transform 300ms linear` is the single loudest "amateur" signal. Linear is correct for exactly two things: continuous rotation/marquees, and **scroll-driven animations** (where the scroll itself provides the easing — using `ease` there double-eases and feels mushy).

**2. Symmetric enter/exit.** Entrances should decelerate (`ease-out` — fast start, soft landing); exits should accelerate (`ease-in`) and run **30–40% shorter**. The user has already decided; making them watch a 400ms exit is making them wait. Vercel's 150ms-exit / 210ms-enter split ✅ is the pattern.

**3. Missing exit animations entirely.** Elements that fade in gracefully and then vanish on a frame are the most common polish failure in React apps — because unmounting is synchronous by default. This is precisely what `AnimatePresence` and View Transitions exist to solve.

**4. Raw scroll position with no smoothing.** Binding `transform` directly to `scrollY` exposes every discrete wheel-tick (~100px on Windows). Either smooth it (`scrub: 1`, Lenis lerp 0.1) or use native scroll-driven CSS, which the compositor smooths for you. `scrub: true` is the trap: it's technically "correct" and feels mechanical.

**5. Animating layout properties.** `width`, `height`, `top`, `left`, `margin` trigger layout → paint → composite every frame. Only `transform`, `opacity`, and (mostly) `filter`/`clip-path` stay on the compositor. `width: 100px → 200px` and `scaleX(2)` look similar and cost 60× different.

**6. `will-change` abuse.** Slapping `will-change: transform` on hundreds of elements promotes each to its own compositor layer and exhausts GPU memory — making things *slower*. Apply immediately before the animation, remove after, or just let the browser decide.

**7. Overshoot misuse.** Apple's own guidance ✅ is bounce ≤ 0.4, default 0. Bounce on a navigation drawer, modal, or anything the user is waiting on reads as unserious and delays task completion. Overshoot is a reward signal — reserve it for confirmations and delight moments. `easeOutBack` on a dropdown is a tell.

**8. Too many simultaneous animations.** More than ~3 independent motions in one viewport and the eye has nowhere to land. Premium motion is *sequenced* — one thing leads, others follow on stagger. A GSAP timeline with offsets beats five independent tweens that happen to start together.

**9. Broken momentum continuity.** When a drag ends, the animation must inherit the gesture's velocity — this is why Motion's springs read `velocity` by default ✅ and why Apple stresses velocity preservation and retargeting ✅. An element that stops dead on release, or restarts from zero velocity, breaks the illusion of physical continuity instantly.

**10. Uninterruptible animations.** If a user clicks during a 400ms transition and nothing happens for 400ms, the interface feels broken regardless of how pretty the curve is. Springs retarget natively; GSAP tweens need `overwrite: 'auto'`. This is a real argument for Flip over View Transitions on interactive surfaces — VT freezes the page by design.

**11. Ignoring `prefers-reduced-motion`.** Both an accessibility failure and a craft failure. The correct response is usually *not* "no animation" but "opacity only, no spatial movement" — vestibular triggers come from large translations, not fades.

**12. Wrong duration for the distance.** Constant duration regardless of travel distance produces frantic motion on large elements and sluggish motion on small ones. Perceived velocity should stay roughly constant — see §3c.

**13. Animating through a font swap.** Text splits computed before webfonts load produce misaligned lines. `autoSplit: true` ✅ exists for exactly this. Alternatively gate reveals behind `document.fonts.ready`.

---

## Key sources

Easing/springs: [easings.net](https://easings.net/) · [M3 easing & duration tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs) · [material-components-android Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md) · [WWDC23 Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/) · [Motion react-transitions](https://motion.dev/docs/react-transitions) · [Motion spring](https://motion.dev/docs/spring) · [react-spring constants.ts](https://github.com/pmndrs/react-spring/blob/main/packages/core/src/constants.ts) · [Chrome — linear()](https://developer.chrome.com/docs/css-ui/css-linear-easing-function) · [Josh Comeau — linear timing](https://www.joshwcomeau.com/animation/linear-timing-function/) · [Linear Easing Generator](https://linear-easing-generator.netlify.app/) · [GSAP CustomEase](https://gsap.com/docs/v3/Eases/CustomEase/)

Text/GSAP: [GSAP 3.13 release](https://gsap.com/blog/3-13/) · [SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/) · [Codrops — 7 GSAP tips](https://tympanus.net/codrops/2025/09/03/7-must-know-gsap-animation-tips-for-creative-developers/) · [Codrops — free GSAP plugin demos](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/)

Page transitions: [caniuse view-transitions](https://caniuse.com/view-transitions) · [caniuse @view-transition](https://caniuse.com/mdn-css_at-rules_view-transition) · [W3C CSS View Transitions L1](https://www.w3.org/TR/css-view-transitions-1/) · [Chrome — cross-document VT](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) · [Next.js view transitions](https://nextjs.org/docs/app/guides/view-transitions) · [Astro view transitions](https://docs.astro.build/en/guides/view-transitions/) · [SvelteKit 1.24 VT](https://svelte.dev/blog/view-transitions) · [CSS-Tricks — 7 VT recipes](https://css-tricks.com/7-view-transitions-recipes-to-try/) · [GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/) · [Bugzilla 1860854](https://bugzilla.mozilla.org/show_bug.cgi?id=1860854)

---

**Two caveats worth restating before you use any of this in production:** the Motion `stiffness` default is genuinely ambiguous (docs say `1`, historical behavior says `100`) — check your installed version. And sections 4 and 7 are from canonical documentation rather than sources I re-verified in this session, so spot-check the scroll-driven-animation browser-support line against caniuse before you rely on Safari/Firefox parity.
---

## РАЗДЕЛ 6. «Невозможные» техники, реально отгруженные в прод

> Сохранено в оригинале. Каждый URL проверен на живость (HTTP 200) или подтверждён страницей Awwwards / кейсом FWA / разбором Codrops. Версии — из npm registry / GitHub API на 2026-07-20.
> Непроверенное помечено `[unverified]`, а не заполнено правдоподобными названиями: поисковое поле 2026 по этим темам сильно засорено AI-сгенерированным SEO-спамом, выдумывающим компании, статистику и кейсы.

All five agents complete. Here is the consolidated report.

---

# Advanced Web Techniques Actually Shipped in Production, 2024–2026

**Verification standard.** Every site URL below was confirmed live (HTTP 200) or corroborated by an Awwwards site page, FWA case, or published Codrops case study. Versions come from the npm registry / GitHub API as of **2026-07-20**. Items that could not be verified are marked `[unverified]` rather than filled in with plausible-sounding names — the 2026 search landscape for these topics is heavily polluted with AI-generated SEO spam inventing companies, statistics, and case studies.

**A framing note on "impossible to integrate."** The research does not support that framing, and a portfolio built on it will read as inexperienced to a senior reviewer. Nearly every technique here has a well-trodden library path: fluid simulation is a copy-paste registry component, Rapier is an npm install, MSDF text is one import. What is genuinely hard — and what actually distinguishes senior work — is the *integration cost*: mobile GPU budgets, fallback paths, VRAM (not file size), accessibility, autoplay/gesture gates, and asset pipelines. The difficulty ratings below reflect that honestly. Several sections deliberately record **negative findings**, which are often more valuable than the positive ones because they stop you building on something dead.

---

## 1. WebGL Fluid Simulation / Navier–Stokes Cursor Trails

**Technique.** GPU Navier–Stokes via the GPU Gems Ch.38 method. Separate fragment shaders handle advection, divergence, curl, vorticity confinement, pressure solve, and gradient subtraction, ping-ponging between double-buffered FBOs. Pointer movement injects velocity and dye splats. The pressure step is an iterative Jacobi solve — quality and cost trade linearly with iteration count.

**Canonical source:** [PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) — 16,503★, MIT, last push 2024-11-12.

**Production sites:**

| Site | Status |
|---|---|
| [ASTRODITHER](https://astrodither.robertborghesi.is/) | Strongest case. [Awwwards SOTD](https://www.awwwards.com/sites/astrodither) 2026-05-05, [FWA case](https://thefwa.com/cases/astrodither). Page describes "a custom fluid built from scratch in a single pass for performances" in **TSL/WebGPU** — deliberately single-pass to skip the multi-pass pressure solve. Not a Dobryakov derivative. |
| [BlueYard Capital](https://blueyard.com/) | Effect **no longer live**. Documented at [Awwwards](https://www.awwwards.com/inspiration/webgl-fluid-mouse-interaction-blueyard-capital); site since redesigned, no canvas in current markup. |

**Honest finding:** despite 16.5k stars, no currently-live award-winning brand site was verified running Dobryakov's simulation. It now ships almost entirely through **copy-paste registry components**, not a maintained dependency.

**⚠️ The most actionable finding in this section:** React Bits' [`SplashCursor`](https://reactbits.dev/animations/splash-cursor) is a line-by-line port that **stripped the upstream safety rails**. Grepping the source: `isMobile` absent, `prefers-reduced-motion` absent, the mobile `DYE_RESOLUTION = 512` downgrade absent — and it runs `DYE_RESOLUTION = 1440`, *higher* than upstream's 1024, unconditionally on phones. Audit before shipping.

**npm (weekly downloads, week of 2026-07-12):** [`webgl-fluid`](https://www.npmjs.com/package/webgl-fluid) 0.4.0 — 2,117/wk, best maintained · [`webgl-fluid-enhanced`](https://www.npmjs.com/package/webgl-fluid-enhanced) 0.8.0 — 1,757/wk, TS types · `react-fluid-animation` (2018, dead) · `react-webgl-fluid-sim` (0 downloads, abandoned).

**Difficulty 2/5** to integrate, **5/5** to author. **Cost:** at default `PRESSURE_ITERATIONS: 20`, that is 20 fullscreen draws + 20 FBO swaps per frame, plus advection/divergence/curl/vorticity/gradient, plus `BLOOM_ITERATIONS: 8`. Scales O(SIM_RESOLUTION²).

**Fallbacks by leverage:** SIM_RESOLUTION 128→64 (4× less pressure work) → PRESSURE_ITERATIONS 20→8-10 → disable bloom → halve DYE_RESOLUTION on mobile → **add `prefers-reduced-motion` yourself; neither upstream nor React Bits implements it.**

**Tutorial:** [Codrops — WebGPU Fluids](https://tympanus.net/codrops/2025/01/29/particles-progress-and-perseverance-a-journey-into-webgpu-fluids/) (Hector Arellano) · [demo](https://tympanus.net/Tutorials/WebGPUFluid/) · [repo](https://github.com/HectorArellanoDev/WebGPUFluids). **The author explicitly disclaims production use** (~120fps M3 Max, struggles on MacBook Air, no mobile).

---

## 2. GPGPU Particle Systems

**Technique.** Particle state (position, velocity, life) lives in float textures, one texel per particle. A fullscreen quad runs a simulation fragment shader reading texture N and writing N+1, then buffers swap. A vertex shader samples the position texture to place points. Curl noise (`curl(fbm(p))`) is divergence-free, giving incompressible-looking flow with no neighbor queries.

| Site | Detail |
|---|---|
| [The Monolith Project](https://themonolithproject.net/) | Strongest true ping-pong reference. Position/velocity/rotation/life across 13 WebGL scenes, `MeshSurfaceSampler` emission. R3F + GLSL. [Case study](https://tympanus.net/codrops/2025/11/29/building-the-monolith-composable-rendering-systems-for-a-13-scene-webgl-epic/) |
| [Until Labs](https://www.untillabs.com/) | 60,000 particles, **single `GL_POINTS` draw call**, locked 60fps. Curl noise + fBm. Clever: position split across **high-byte/low-byte RGB textures**, avoiding float-texture dependency entirely. 20 MB JSON → **604 KB** packed payload. A funded biotech, not a portfolio. [Case study](https://tympanus.net/codrops/2025/12/10/simulating-life-in-the-browser-creating-a-living-particle-system-for-the-untillabs-website/) |
| [Phantom.land](https://www.phantom.land/) | ~78,400 particles/face (280×280) from two 256×256 WebP textures (<15KB each), RealityScan iPhone scans. ⚠️ Texture-sampled point-cloud positioning, **not** FBO simulation. [Case study](https://tympanus.net/codrops/2025/06/30/invisible-forces-the-making-of-phantom-lands-interactive-grid-and-3d-face-particle-system/) |
| [Forged.build](https://forged.build/) | Custom **WebGPU** engine, compute shaders for light scattering/prefiltering/blur. **Ships no WebGPU fallback** — aggressive, don't copy. [Case study](https://tympanus.net/codrops/2025/10/20/from-garage-to-browser-forged-build-and-the-webgpu-revolution/) |

**Instructive counter-example:** [Unseen Studio "Cellular"](https://unseen.co/labs/cellular/) *evaluated and rejected* GPGPU for collision-driven motion, choosing CPU-side Rapier and keeping the GPU for Kawase blur + grading. [Case study](https://tympanus.net/codrops/2025/09/11/when-cells-collide-the-making-of-an-organic-particle-experiment-with-rapier-three-js/)

> **⚠️ Reality check on "millions of particles":** documented 2024–26 production examples cluster at **60k–80k**. No verified production site claims a million-plus GPGPU system on the open web. Claiming it in a portfolio invites a question you can't answer with evidence.

**Libraries:** [`GPUComputationRenderer`](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/misc/GPUComputationRenderer.js) — defaults to `NearestFilter` deliberately, preserving discrete compute values and sidestepping `OES_texture_float_linear`. TSL compute: [`webgpu_tsl_compute_attractors_particles`](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_tsl_compute_attractors_particles.html) runs **262,144 particles** using **persistent storage buffers updated in place — no ping-pong**. WebGPU removes the double-buffering requirement, halving simulation memory. `three-nebula` — 1.2k★ but **last release Nov 2021**; do not build on it.

**Difficulty 4/5.** **Memory:** RGBA32F = 16 B/texel. 1M particles → 1024×1024 → 16 MB per attribute; position + velocity = 32 MB; ping-pong doubles to **~64 MB VRAM** before geometry or post. `setDataType()` → RGBA16F halves it.

**Extension gotcha worth knowing cold:** [`OES_texture_float_linear`](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear) grants *linear filtering*, not the ability to render into float textures. That is `EXT_color_buffer_float` / `EXT_color_buffer_half_float` — and that is what ping-pong actually depends on.

**Tutorial:** [Codrops — Dreamy Particle Effect with GPGPU](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/) · [demo](https://tympanus.net/Tutorials/DreamyParticles) · [repo](https://github.com/DGFX/codrops-dreamy-particles)

---

## 3. Real-Time Custom Shaders

### (a) Hover displacement — ⚠️ no verified production site
[`hover-effect`](https://github.com/robin-dela/hover-effect) (three.js + GSAP peers; `intensity`, `speedIn` 1.6s, `speedOut` 1.2s) · [demo](https://tympanus.net/Development/DistortionHoverEffect/). Nearest production evidence uses a *different interaction model*: [stabondar.com](https://stabondar.com/) drives displacement from **scroll velocity** plus Bayer dithering ([case study](https://tympanus.net/codrops/2025/03/25/stas-bondar-25-the-code-techniques-behind-a-next-level-portfolio/)); [romanjeanelie.com](https://www.romanjeanelie.com/) does fold/curl displacement via vector projection with curvature-based fake shadow ([case study](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)). **Difficulty 2/5**, cost negligible.

### (b) RGB split / chromatic aberration
**Key finding: in production this never ships standalone — it is always a glass-material parameter.** That pattern held across every case study fetched. drei [`MeshTransmissionMaterial`](https://drei.docs.pmnd.rs/shaders/mesh-transmission-material) → `chromaticAberration` (default 0.03); `MeshRefractionMaterial` → `aberrationStrength`, documented "can be expensive", with `fastChroma: true` trading accuracy for fewer casts. **Difficulty 1/5** standalone (3 offset samples). Tutorial: [Grid Displacement + RGB Shift with GPGPU](https://tympanus.net/codrops/2024/08/27/grid-displacement-texture-with-rgb-shift-using-three-js-gpgpu-and-shaders/) — per-channel multipliers 0.25×R / 1.5×B / 2×G, grid ~27×27, relaxation 0.965.

### (c) Liquid / ripple distortion
[wind-waker-js.vercel.app](https://wind-waker-js.vercel.app/) — water shader by Robin Payot ([spotlight](https://tympanus.net/codrops/2025/06/12/developer-spotlight-robin-payot/)). Tutorial: [Animating WebGL Shaders with GSAP](https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/) — GSAP drives `uRippleProgress`/`uMouse`, procedural noise breaks the circular mask, **requires ≥50×50 segment PlaneGeometry**, blur uses Kawase. **Difficulty 2–3/5**; multi-pass blur dominates, not the ripple.

### (d) Refraction & glass — best-evidenced category
[leseldissey.isseymiyakeparfums.com](https://leseldissey.isseymiyakeparfums.com/) — Issey Miyake salt-crystal customizer; dev Robin Payot: *"the main technical challenge was achieving a beautiful refraction shader effect."* [aurelienvigne.com](https://aurelienvigne.com/) — three.js + Vue 3 + GSAP + Lenis + Cannon.js, ~100 models + 150 physics bodies, **adaptive 60/30/10 FPS capping** ([case study](https://tympanus.net/codrops/2025/05/20/behind-the-curtain-building-aurels-grand-theater-from-design-to-code/)) — though its case study covers rope/lighting/perf, not transmission, so it is weaker "glass" evidence than expected.

**The performance number that matters:** drei's docs state `MeshTransmissionMaterial` *"causes an additional render pass of the scene"*, and three renders **a separate pass per object** using it. **Cost scales linearly with the number of transmissive objects, not just `samples`.** Mitigate via `samples` (default 6), `resolution` (defaults fullscreen — drei recommends **as low as 32×32** for rough glass), `buffer` to share one texture, `transmissionSampler: true`. **Difficulty 3/5** with drei, **5/5** hand-rolled. [Tutorial](https://tympanus.net/codrops/2025/03/13/warping-3d-text-inside-a-glass-torus/).

### (e) Raymarched SDF scenes
[themonolithproject.net](https://themonolithproject.net/) — 13 scenes with **deferred rendering**, depth+normal edge detection, **octahedron normal encoding** to compress G-Buffer normals, dedicated `MaterialTransitionRaymarched`. Architecture deliberately avoids "giant material files with hundreds of lines of GLSL." Tutorial: [Liquid Raymarching with TSL](https://tympanus.net/codrops/2024/07/15/how-to-create-a-liquid-raymarching-scene-using-three-js-shading-language/) — **TSL + WebGPURenderer with WebGL fallback**, 80 iterations/pixel, early exit at dist < 0.001 · [repo](https://github.com/phobon/raymarching-tsl). **Difficulty 5/5**; cost = loop bound × pixel count. The 80-iteration (scene) vs 16 (metaballs) spread is your tuning range.

### (f) Gooey metaballs — ⚠️ no verified production site
Shader: [Interactive Droplet Metaballs](https://tympanus.net/codrops/2025/06/09/how-to-create-interactive-droplet-like-metaballs-with-three-js-and-glsl/) — raymarched SDF spheres blended with `smoothMin`, `const int ITR = 16` · [repo](https://github.com/koji014/interactive-droplets). SVG trick, mechanically confirmed via [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feColorMatrix): `feGaussianBlur` → `feColorMatrix` whose **4th row (a1–a5) transforms alpha independently** — that is what converts soft blur into a hard gooey edge. Set `color-interpolation-filters="sRGB"`. **Difficulty 2/5** (SVG) / **4/5** (shader).

### Additional verified architecture lessons
[kai-group.com/global/design](https://www.kai-group.com/global/design/) (mount inc.) — custom line depth-of-field: lines → FBO, second FBO dilates by blur radius encoding blur data in RGB (G = area, R = intensity), two-pass planar Gaussian. Video scrubbing via ffmpeg `-g 12`, baseline profile L3.1, mediabunny/WebCodecs Firefox fallback. [inkgames.com](https://www.inkgames.com/) (ToyFight) — **notably uses no custom shaders**; stencil buffers + clipping planes. The real lesson is architectural: **one shared WebGL canvas across all 3D sections** (respecting context limits) with a conditional frame loop running only when 3D is visible or scrolling.

---

## 4. Physics on the Web

**Two architectures ship.** 3D rigid body runs on simplified collision proxies — boxes, spheres, capsules, convex hulls, **never render geometry** — stepped at a fixed timestep, then transforms are copied onto meshes. 2D (Matter.js) is canvas-space bodies for "stuff falls into a pile" heroes, and is far more common on commercial sites than 3D physics.

**Soft body / cloth is almost never a real engine.** Rapier has no soft body in its JS bindings. Production "cloth" is a vertex shader with noise + sine displacement, or a GPGPU position-based-dynamics pass.

### Bruno Simon and the cannon→Rapier migration — the most instructive case

[bruno-simon.com](https://bruno-simon.com/) — Awwwards Site of the Month. Current stack confirmed by direct fetch: **three.js (WebGL + WebGPU via TSL), Rapier, Howler.js**, Blender assets, MIT source.

The original used **Cannon.js**, and his [case study](https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b) names the exact failure: *"framerate drop after playing for a few minutes… objects not going to sleep by default. Meaning that if you bump into every object, each one will be tested for collision on every frame even if they are barely moving."* Mobile was salvaged by removing blur post-processing, clamping pixel ratio, and disabling `matrixAutoUpdate`. **The sleep-threshold problem that broke the Cannon build is precisely what Rapier's island-based sleeping solves by default.**

| | cannon-es | Rapier |
|---|---|---|
| Language | Pure TS/JS | Rust → WASM |
| Init | Synchronous | **Async WASM load** — must be awaited |
| Latest release | **Aug 2022** (2.0k★) — frozen | Active, SIMD builds |
| Perf | Fine to ~100–200 bodies | Fastest browser physics engine as of mid-2026 |
| Determinism | No | Cross-platform on IEEE-754 |

**Matter.js production sites** (via the [Awwwards Matter.js collection](https://www.awwwards.com/websites/matterjs/)): [Museum of Money](https://www.museumofmoney.com) — Developer Award + SOTD, Mar 2026 · [Tesoro](https://www.tesoroxp.com) — Developer Award + SOTD, Dec 2025 · [Wildish & Co.](https://www.wildishandco.co.uk/) — Honorable Mention, Jan 2026 · [Cloudstudio](https://cloudstudio.es). The first two are real commercial products (a museum, a fintech) with Developer Awards inside the last ~7 months.

**Rapier beyond bruno-simon.com is an open gap** — `@react-three/rapier` publishes no production-user list. Treat as unverified rather than absent.

**Libraries:** [rapier.rs](https://rapier.rs) · `@dimforge/rapier3d` **0.19.3** (2025-11-05) · [`@react-three/rapier`](https://github.com/pmndrs/react-three-rapier) **2.2.0** (React 19 + R3F v9) · [cannon-es](https://github.com/pmndrs/cannon-es) 0.20.0 · [matter-js](https://github.com/liabru/matter-js) 0.20.0, 18.3k★.

**Difficulty:** Matter.js hero **2** · Rapier modest scene **3** · Rapier + `InstancedRigidBodies` 1000+ bodies **4** · soft body **5**. **Non-negotiables:** primitive colliders only (a trimesh collider on detailed geometry will destroy you); enable and tune sleeping; fixed timestep with accumulator, never raw `deltaTime`; await the WASM before first step. Rapier's 0.19.x sparse voxel storage exists because of the **4 GB wasm32 memory ceiling** — Memory64 is still not portable, so this is a live constraint.

---

## 5. 3D Scroll Scenes

**Core primitive:** map normalized scroll progress onto a timeline position. Three flavors — Theatre.js sequence scrubbing (`sheet.sequence.position = scroll.offset * length`, visually keyframed), **GSAP ScrollTrigger with `scrub`** (code-first, dominant), and direct `useFrame` lerp along a `CatmullRomCurve3`.

**Lenis matters more than it looks:** raw `wheel` events are wildly inconsistent across trackpad/mouse/touch. Lenis produces one normalized progress value that both the 3D scene and DOM read, eliminating the "3D lags the text by two frames" artifact.

| Site | Credit | Award | Tech |
|---|---|---|---|
| [MIU MIU — A House that we shaped](https://immersivebags.miumiu.com/) | Merci Michel | Awwwards Nominee, Jul 17 2026 | WebGL, Three.js. Voter scores 8.5–9.6 |
| [Race Condition](https://www.northkingdom.com/case/racecondition) | North Kingdom | Awwwards Nominee, Jul 16 2026 | WebGL, Three.js, Angular. 1000+ agents, built for the **Google Cloud Next 2026 keynote** |
| [IZANAMI](https://izanami-official.com/) | baqemono.inc | **Dev Award + SOTD**, Jul 18 2026 | WebGL, GSAP |
| [Vectr](https://vectrfl.com/) | — | **Dev Award + SOTD**, Jul 11 2026 | Industrial staffing — award-winning WebGL in a genuinely non-creative B2B vertical |
| [Shader.se](https://shader.se) | Shader | Codrops case study | Scroll-driven **WebGPU** with WebGL fallback via **TSL**; forked Lenis for snapping. [Case study](https://tympanus.net/codrops/2026/05/19/80s-business-tech-seamless-scene-transitions-inside-shader-ses-scroll-driven-webgpu-pipeline/) |
| [Cartier Watches & Wonders](https://www.cartier.com/watchesandwonders) | Immersive Garden | SOTD | Six scroll-linked 3D alcoves, GLSL + GSAP + Lenis + Web Audio |

More verified WebGL-collection members: [Hiroto Sato](https://www.hirotos.com), [RISK](https://www.risk.film), [21 Hrs On The Moon](https://www.21hrs.space/), [Julien Calot](https://www.juliencalot.com), [MONOLOG](https://bymonolog.com/), [D&G Beauty GiftFinder](https://beautytools.dolcegabbana.com/gift-finder), [Explore Primland](https://explore.ownprimland.com), [Oryzo](https://oryzo.ai) (Lusion), [Hubtown](https://hubtown.co.in) (Unseen), [IVRESS](https://brand.ivress.co.jp) (Utsubo — WebGPURenderer + TSL).

**⚠️ Theatre.js reality check:** 7.7k★, docs still at v0.5, and **its own homepage lists no production users or showcase** — only developer testimonials. Public repo silent since **2024-04-11** ("Add the 1.0 notice"); development *"temporarily moved to a private repo"* over two years ago with no public 1.0. **Do not adopt for new production work.** GSAP ScrollTrigger is what actually ships.

### Asset pipeline — the part that decides whether the site is usable

[glTF-Transform](https://gltf-transform.dev/) is the workhorse: `gltf-transform optimize in.glb out.glb --texture-compress webp`. [gltfjsx](https://github.com/pmndrs/gltfjsx) `--transform` produces binary-packed + Draco + 1024² WebP + deduped + instanced, documented **70–90% size reduction**.

**Compression decision rule:** *Draco* — best geometry ratio (50–80%) but **discards morph targets and keyframe animation**. *Meshopt* — slightly worse ratio, **preserves animation**, much faster decode; usually the better real-world tradeoff. *KTX2/Basis* — 3–5× smaller than JPG and, critically, **stays GPU-compressed in VRAM**.

> **The most-skipped optimization is KTX2.** Draco gets attention because file-size numbers are legible, but a 2 MB JPG atlas becomes **64 MB decompressed on the GPU**. On texture-heavy scenes that is the difference between working and not working on mobile. **Budget VRAM, not file size.**

```js
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

**Difficulty:** model rotation **2** · ScrollTrigger camera path **3** · Theatre cinematic **3–4** · WebGPU/TSL pipeline **5**. Cap DPR at 2 (1.5 low-end), lazy-load per section via IntersectionObserver, drop post-processing on mobile. Lenis caps at 30fps in low-power mode and warns `syncTouch` misbehaves on iOS < 16.

---

## 6. Audio-Reactive Visuals

**Chain:** `AudioContext` → source → `AnalyserNode` → destination. The analyser is pass-through; **omit the destination connection for silent analysis** — that is how mic-reactive visuals avoid feedback.

**`fftSize`** (power of 2, 32–32768; `frequencyBinCount = fftSize/2`): 32–64 for 1–3 scalar uniforms; 256–512 practical default; 2048 the de-facto standard. Bin *i* centers at `i * sampleRate / fftSize` — at 48kHz/2048 each bin ≈ 23.4 Hz. Bands: bass 20–250, mid 250–4000, treble 4000–16000 Hz.

> **The perceptual trap that ruins most implementations:** FFT bins are linear, hearing is logarithmic. A naive mean is dominated entirely by bass bins and the visual reacts only to the kick drum. Weight the bands or work in log space.

`smoothingTimeConstant` (default 0.8) is an EMA across frames — below ~0.5 reads jittery, above ~0.9 lags the beat. Most production code adds a **second JS-side lerp** because 0.8 alone still strobes on percussive material.

**Two paths into shaders:** *scalar uniforms* (all three verified tutorials; cheap, sufficient for displacement/glow/scale) or *DataTexture* (`RedFormat`, `NearestFilter`, `ClampToEdgeWrapping`, **allocate once, never per frame**) — only worth it when different geometry positions must sample different frequencies. **No verified production reference exists for the DataTexture path.**

> **Autoplay policy is the #1 failure mode.** `AudioContext` starts `suspended`; `await ctx.resume()` must run inside a genuine user gesture, or it silently no-ops and visuals freeze at zero **with no error**. Every award-winning example has an explicit click-to-begin gate. Design it in from the start.

| Site | Credit | Award | Evidence |
|---|---|---|---|
| [Spectral Field](https://www.robfwa.com/) | Rob FWA | Awwwards Nominee, Jul 19 2026 | **Strongest verification** — live page exposes an **"FFT 2048"** control plus Low/Mid/Hi sliders. Canvas API, not WebGL |
| [Spotify Wrapped Party](https://wrapped-party.activetheory.dev) | **Active Theory** | Honorable Mention, Jun 2026 | GSAP, Firebase, WebGL, sound-audio tags |
| [Audiograph](http://audiograph.xyz/) | Matt DesLauriers | SOTD 2016 (7.46) | The landmark. WebGL + WebAudio + Dolby Digital Plus. **Confirmed still live in 2026** |
| [JazzKeys](https://jazzkeys.plan8.co/) | plan8 | SOTD 2020 (7.69) | Musical typing interface |
| [Patatap](http://www.patatap.com/) | jonobr1 + Lullatone | SOTD 2014 | Uses Two.js. **Trigger-driven, not FFT-driven** — cite as landmark, not analyser example |

**Best references:** [Codrops Jun 2025](https://tympanus.net/codrops/2025/06/18/coding-a-3d-audio-visualizer-with-three-js-gsap-web-audio-api/) (fftSize 2048, single `audioLevel` uniform → displacement + fresnel) · [Codrops Dec 2023](https://tympanus.net/codrops/2023/12/19/creating-audio-reactive-visuals-with-dynamic-particles-in-three-js/) — **best three-band reference**, high→amplitude, mid→`offsetGain*0.6`, low→time increment, BPM via `web-audio-beat-detector`, [code](https://github.com/tgcnzn/Interactive-Particles-Music-Visualizer) · [Codrops Feb 2023](https://tympanus.net/codrops/2023/02/07/audio-reactive-shaders-with-three-js-and-shader-park/) — explicitly implements the gesture gate.

**Libraries:** [Tone.js](https://github.com/Tonejs/Tone.js) `tone` 15.1.22, 14.7k★ (overkill for analysis alone) · [Meyda](https://github.com/meyda/meyda) 5.6.3 — spectral centroid, ZCR, MFCC (note the 2-year release gap) · [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) 7.12.11 — **wrong tool for shader-driving**; README states it is not a Web Audio wrapper and ships no analyser · three.js `AudioAnalyser` (docs: fftSize between 256 and 2048) · howler.js — exposes `Howler.ctx`; **this is what bruno-simon.com uses**.

**Cost:** analysis is effectively free — the FFT runs on the audio thread. All cost is rendering. **iOS landmines:** `window.AudioContext || window.webkitAudioContext`; a programmatic `.click()` won't unlock it; **with the hardware silent switch on, HTMLMediaElement playback is muted and the analyser returns all zeros** — visuals look broken while the page looks fine, so test with the switch on; re-`resume()` on `visibilitychange`.

**Pragmatic default:** fftSize 512, smoothing 0.8, three averaged bands → three scalar uniforms, behind a click gate. ~90% of the payoff at difficulty 2–3.

---

## 7. Generative Art / Creative Coding

[Until Labs](https://www.untillabs.com/) is the best "generative art on a real commercial site" example found (see §2). [False Earth](https://false-earth.mingjyunhung.com/) — infinite procedural landscape, millions of grass blades, Voronoi clustering (each blade blends its two nearest centers, killing seams), world-position-as-seed, **zero textures**, TSL + WebGPU compute, GPU frustum culling dropping ~80% of instances, LOD 15/5/2 segments, **no WebGL fallback** ([case study](https://tympanus.net/codrops/2026/04/21/false-earth-from-webgl-limits-to-a-webgpu-driven-world/)). [Weisdevice](https://www.weisdevice.xyz/) — **extreme asset discipline: 0.76 MB model, 3 MB textures total** ([case study](https://tympanus.net/codrops/2025/10/22/weisdevice-crafting-a-glitched-out-world-between-2d-3d-and-sound/)). [Stefan Vitasović](https://stefanvitasovic.dev/), [Roman Jean-Elie](https://www.romanjeanelie.com/) (MorphSVG's render callback writes the morph path **straight to a 2D canvas**, bypassing DOM). [Mike van der Sanden](https://mikevandersanden.com/) — Honorable Mention Aug 2025, **the only p5.js-tagged Awwwards site from 2024–2026**. [DICH™ Fashion](https://dich-fashion.webflow.io/) — canvas-2D `getImageData()` brightness sampling; **the case study notes shader/Perlin explorations did not ship**. [fxhash](https://www.fxhash.xyz/) ([boilerplate](https://github.com/fxhash/fxhash-boilerplate)) and [Art Blocks](https://www.artblocks.io/) for deterministic hash-seeded work.

**Four findings worth acting on:**
1. **No production hydra deployment found.** It is a VJ tool and its own docs concede Chromium-only.
2. **No verified reaction-diffusion on a production site, 2024–2026.** Abundant demos, nothing shipped — the 10–30 iterations/frame cost is the likely reason.
3. **p5.js has largely exited award-winning production work.** The Awwwards p5.js collection is a 2021–22 artifact with one 2024–26 entry. The field consolidated onto three.js/R3F + GLSL, then TSL + WebGPU.
4. **Generative brand identity was the weakest category** — the two best candidates fell through on inspection (Windsurf × Metalab is conventional static identity; [Obys](https://obys.agency/) uses native WebGL only for isolated elements).

**Tooling:** [p5.js](https://p5js.org/) v2.0 (Apr 2025 — JS shaders, variable fonts, OKLab) · [hydra](https://github.com/hydra-synth/hydra) (Chromium-only, self-described experimental) · [ogl](https://github.com/oframe/ogl) **29 kB minzipped, zero deps, Unlicense** · [canvas-sketch](https://github.com/mattdesl/canvas-sketch) 5.3k★ still `[beta]` · [thi.ng/umbrella](https://github.com/thi-ng/umbrella) (216 packages; `shader-ast` compiles TS→GLSL) · [glsl-noise](https://github.com/hughsk/glsl-noise) — **marked frozen** · [regl](https://github.com/regl-project/regl).

---

## 8. Custom Cursors with Distortion

| Variant | Mechanism |
|---|---|
| **Lerped/trailing** | `x += (target - x) * 0.1` per rAF. Never animate `left/top` — `transform: translate3d()` on a `position:fixed` layer |
| **Magnetic** | Compute pointer→center delta, scale ~0.3, GSAP-tween both cursor and element; release with elastic ease |
| **Blend-mode** | `mix-blend-mode: difference` on a white circle. **Gotcha:** any ancestor with `filter`, `opacity < 1`, `transform`, or `will-change` creates a stacking context and kills the blend |
| **Mask-reveal** | Two stacked layers, `-webkit-mask-image: radial-gradient(...)` with pointer-driven `mask-position` |
| **WebGL-distorted** | (a) displacement-map — sample noise, offset UVs by distance-to-cursor; (b) flowmap/fluid — ping-pong FBO accumulating pointer velocity into an advected field |

**Sites** (via the [Awwwards "Hovers, Cursors and Cute Interactions" collection](https://www.awwwards.com/awwwards/collections/hovers-cursors-and-cute-interactions/)): [Sweetpunk](https://www.sweetpunk.com/) ([Awwwards entry](https://www.awwwards.com/inspiration/webgl-cursor-animation-effect-sweetpunk)) · [Antoine Wodniack](https://wodniack.dev/) · [Stas Bondar](https://www.stabondar.com/) · [Henri Heymans](https://henriheymans.com/) · [Made by Analogue](https://madebyanalogue.co.uk/studio/) · [Lusion](https://lusion.co/).

**Libraries:** [`blobity`](https://github.com/gmrchk/blobity) — **licensing trap: GPLv3, commercial projects require a paid license** · [`hover-effect`](https://github.com/robin-dela/hover-effect) 1.9k★ · [`react-creative-cursor`](https://github.com/ehsan-shv/react-creative-cursor) · OGL flowmap tutorials: [mouse flowmap deformation](https://tympanus.net/codrops/2019/09/25/mouse-flowmap-deformation-with-ogl/), [stylised mouse trails](https://tympanus.net/codrops/2019/09/24/crafting-stylised-mouse-trails-with-ogl/), [pixel distortion](https://tympanus.net/codrops/2022/01/12/pixel-distortion-effect-with-three-js/).

**Difficulty:** 1 (lerp) · 2 (magnetic/blend) · 3 (mask-reveal) · 4 (WebGL flowmap). **All of these are pointer-only: gate behind `@media (hover: hover) and (pointer: fine)` and skip entirely on touch.** Never remove the real cursor without a visible focus fallback.

---

## 9. Video-in-Text Masks

1. **`background-clip: text`** — cannot take a live `<video>` directly; real implementations paint frames to a canvas or use the inverse mask.
2. **SVG `<mask>` "window" (most robust)** — a solid `<rect>` with white `<text>` inside a `<mask>`; letters become see-through windows over a plain `<video>`. **Notably better cross-browser support** than applying an SVG `clipPath` to an HTML `<video>`. [Reference](https://oreillymedia.github.io/Using_SVG/extras/ch15-video-mask.html)
3. **`mix-blend-mode`** — cheapest, but the result depends entirely on the video's luminance, so it is art-directed, not deterministic.
4. **WebGL** — `THREE.VideoTexture` + MSDF alpha: `gl_FragColor = vec4(videoColor.rgb, msdfAlpha)`.

**⚠️ This is the weakest-evidenced section. No production sites were verified** before the search budget ran out, and none have been invented. Reference implementations only: [CodeMyUI](https://codemyui.com/svg-text-mask-video-background/) · [CodePen](https://codepen.io/SimonEvans/pen/weoLLB).

**Difficulty:** 2 (blend) · 3 (SVG mask) · 4 (WebGL). The video decode dominates, not the mask. Mobile Safari requires `muted playsinline autoplay`. Text inside `<mask>` is not selectable and often not read by AT — mirror it in a visually-hidden `<h1>`.

---

## 10. ASCII / Dithering / Halftone / CRT

**The strongest-evidenced trend in this set** — search volume for "dither effect" is reported up ~900% YoY.

**Techniques.** *ASCII (GPU)*: divide screen into cells, compute per-cell luminance, map to a character — the modern approach draws glyphs **procedurally in GLSL on a 5×7 grid rather than sampling a bitmap atlas**. *ASCII (classic)*: three.js `AsciiEffect` reads pixels back and emits DOM characters — the readback + DOM churn is the bottleneck. *Ordered/Bayer dithering*: compare luminance against a procedurally-computed 4×4 or 8×8 matrix, then quantize `floor(color * (n-1) + 0.5) / (n-1)` — **no texture loading required**. *Blue-noise*: less structured than ordered. *CRT*: curvature UV distortion + scanlines + chromatic aberration + vignette, finished with bloom.

> **The key architectural fork:** error-diffusion (Floyd–Steinberg 7/16, 3/16, 5/16, 1/16; Atkinson; JJN) is **inherently sequential and therefore not fragment-shader-friendly** — it must run on CPU in JS/WASM. Ordered → GPU realtime; error-diffusion → CPU, one-shot.

**Sites:** [Efecto](https://efecto.app/) — realtime ASCII + 8 dithering variants on live 3D; three.js + `postprocessing` + R3F, **WebGPU for texture management with a Canvas2D fallback for Firefox** ([build write-up](https://tympanus.net/codrops/2026/01/04/efecto-building-real-time-ascii-and-dithering-effects-with-webgl-shaders/)) · [Type Dither](https://typedither.vercel.app/) — Awwwards Nominee, Reed Hollett · [basement.studio Shader Lab](https://eng.basement.studio/tools/shader-lab) · [Ditther](https://www.ditther.com/) · [Turbo Dither](https://www.turbodither.com/) · [Paper](https://shaders.paper.design/dithering).

**Libraries:** [`AsciiEffect`](https://threejs.org/docs/pages/AsciiEffect.html) — **must import explicitly from `three/addons/effects/AsciiEffect.js`** · [drei `AsciiRenderer`](https://drei.docs.pmnd.rs/abstractions/ascii-renderer) · [emilwidlund/ASCII](https://github.com/emilwidlund/ASCII) (GPU-side) · [at-scii](https://github.com/louisescher/at-scii) · [@sister.software/asciify](https://github.com/sister-software/asciify) — **<7kb min+gzip, zero deps**, best-in-class · [dithering-shader](https://github.com/niccolofanton/dithering-shader) ([tutorial](https://tympanus.net/codrops/2025/06/04/building-a-real-time-dithering-shader/)) · [basementstudio/shader-lab](https://github.com/basementstudio/shader-lab) — 15+ effects, TSL, **requires WebGPU**, Apache-2.0 · [p5.asciify](https://github.com/humanbydefinition/p5.asciify) — **no longer maintained**, successor `textmode.js`. Theory: [Maxime Heckel on dithering](https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/).

**⚠️ The "hertzole" library named in the brief does not appear to exist.** No such ASCII library was found.

**Difficulty:** 2 (drop-in) · 3 (Bayer post-pass) · 4 (procedural-glyph GLSL, CRT stack) · 5 (WebGPU/TSL). Efecto's team warns directly that *"complex shaders with lots of post-processing can drop frame rates significantly, especially on older hardware."* Cost is per-pixel: **clamp DPR to 1–1.5** and render at reduced internal resolution — which the aesthetic actually rewards. The DOM-based `AsciiEffect` is the worst mobile offender.

---

## 11. WebGPU in Production, 2026

**This is the year it became near-universal.** Per the [gpuweb Implementation Status wiki](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) (authoritative):

| Browser | Status |
|---|---|
| Chrome/Edge desktop | GA since **113**. **Linux: 144** (Intel Gen12+), **147** adds NVIDIA |
| Chrome Android | **121**, **139** adds Imagination. **Samsung Xclipse still WIP** |
| **Safari** | **Fully shipped, default on** — macOS Tahoe 26, iOS 26, iPadOS 26, visionOS 26 |
| **Firefox** | **141** Windows, **145** Mac Apple Silicon, **147** other Macs. Linux/Android Nightly-only |

[caniuse](https://caniuse.com/webgpu): **83.63% global**. **Trust the gpuweb wiki over caniuse** — caniuse still lists Firefox as "disabled by default through 155" and Safari desktop as "partial," contradicting both vendors' shipping notes.

**Real caveats the "WebGPU hit baseline!" posts skip:** Android is the weak spot, not desktop — Samsung Xclipse (Exynos flagships) is still unimplemented. Desktop Linux is months old. All implementations trace to **Dawn** (Chromium) or **wgpu** (Firefox/Safari/Servo), and cross-browser bugs cluster along that seam. **You still need a WebGL2 fallback in 2026** — ~16% of users, skewed mobile.

**TSL.** [Docs](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language) — a **GitHub wiki page**, easily missed; last revised 2026-06-24, now mature with no instability warnings. Not a language with its own syntax — a **node-graph abstraction in plain JavaScript**. Two `NodeBuilder` subclasses (`WGSLNodeBuilder`, `GLSLNodeBuilder`) run setup → analyze → generate, emitting both WGSL and GLSL from one graph, auto-applying per-backend workarounds and caching repeated subexpressions. **This is the only thing that makes WebGPU-primary/WebGL2-fallback affordable.** Difficulty 3/5.

**three.js r185** (2026-07-01; npm `three@0.185.1`). **WebGPURenderer is NOT the default and WebGLRenderer is NOT deprecated** — I read the full r184/r185 release bodies; neither announces a switch or deprecation, and both backends got substantial fixes side by side. The strongest signal: in [`examples/files.json` at r185](https://raw.githubusercontent.com/mrdoob/three.js/r185/examples/files.json) the WebGPU category is still literally labelled **`"webgpu (wip)"`**. Anything claiming "three.js made WebGPU default in 2026" is unsourced.

**Compute examples** (all verified filenames, live at `threejs.org/examples/#<name>`): `webgpu_compute_particles`, `_fluid`, `_rain`, `_snow`, `webgpu_compute_birds`, `_cloth`, `_water`, `_points`, `webgpu_compute_sort_bitonic`, `_rasterizer`, `_reduce`, `webgpu_compute_texture_pingpong`, `webgpu_tsl_compute_attractors_particles`. The two most production-relevant primitives are **bitonic sort** (transparency ordering) and **texture pingpong**. Difficulty 4/5 — the hard parts are workgroup sizing, buffer discipline, and near-blind debugging.

**Who has shipped:**
1. **[PlayCanvas SuperSplat](https://blog.playcanvas.com/new-in-supersplat-webgpu-and-streaming-bring-huge-performance-wins)** — strongest verified case. WebGPU renderer shipped **June 2026** with GPU radix sort. Published M4 Max benchmarks: **2.6× at 10M gaussians, 4.4× at 20M, 5.4× at 30M, 5.7× at 35M**; iPhone 13 Pro Max ~2×. States WebGPU reaches **~85% of their end users** with automatic WebGL2 fallback. [Repo](https://github.com/playcanvas/supersplat) v2.31.1, 9,637★. Live: [superspl.at/editor](https://superspl.at/editor)
2. **[WebLLM](https://github.com/mlc-ai/web-llm)** — 18.4k★, full LLM inference on WebGPU. Live: [chat.webllm.ai](https://chat.webllm.ai)
3. **[ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html)** — WebGPU EP now a standalone plugin (v0.1.0, 2026-05-29) with DP4A and subgroup-matrix kernels
4. **Hugging Face Spaces** — [bonsai-webgpu-kernels](https://huggingface.co/spaces/webml-community/bonsai-webgpu-kernels) (1-bit 27B LLM in-browser), [conversational-webgpu](https://huggingface.co/spaces/webml-community/conversational-webgpu)

`[unverified]`: Threekit, Adobe, Figma, Google, Unity/Unreal web-export WebGPU status. Note Figma and Photoshop-web are verified **WASM** stories, not verified WebGPU ones — do not conflate.

---

## 12. Scroll-Driven Canvas / Image Sequences

**Technique:** pre-render N frames, preload, compute `frameIndex = clamp(progress * (N-1))`, `ctx.drawImage()` inside rAF. Canvas (vs swapping `<img>` src) avoids decode jank. Side-effect: **DevTools can't inspect past a canvas**, which is why these aren't obvious on inspection.

> **⚠️ Important correction:** the canonical implementation is the **2019 AirPods Pro page**. Fetching Apple's **current** [airpods-pro](https://www.apple.com/airpods-pro/) found **no canvas elements** — it uses `hero_startframe`/`endframe` **image-frame swapping** plus `.usdz` AR models. "Apple ships canvas image sequences" is true historically but **not of the current page**. Know this before citing it.

**Verified numbers on the original:** 65 PNGs = **15.2 MB**; WebP conversion drops it to **~1.7 MB (≈90%)**. Apple loads **frames at major checkpoints first**, so a degraded version plays almost immediately — **that progressive-checkpoint strategy is the single highest-value thing to copy.**

**Other sites:** [Shopify Editions](https://www.shopify.com/editions/spring2026) · [Explore Primland](https://explore.ownprimland.com) (real-time 3D — the alternative solution to the same brief) · [Cartier](https://www.cartier.com/watchesandwonders) · [Oryzo](https://oryzo.ai) · [Awwwards entry for the original](https://www.awwwards.com/inspiration/product-scroll-triggered-animation-apple-airpods-pro).

**Tooling:** GSAP ScrollTrigger `scrub: true` + `onUpdate` ([forum thread](https://gsap.com/community/forums/topic/25188-airpods-image-sequence-animation-using-scrolltrigger/)) · ffmpeg `-vf "fps=30,scale=1440:-1" -q:v 3` — 60–120 frames is the sweet spot · **WebCodecs `VideoDecoder`**, the modern replacement: demux → `EncodedVideoChunk` → `VideoDecoder` → `VideoFrame` → canvas. **WebCodecs does not demux** — you need [Mediabunny](https://github.com/Vanilagy/mediabunny) or web-demuxer. Reference: [webcodecs-scroll-sync](https://github.com/diffusionstudio/webcodecs-scroll-sync).

> **Two hard WebCodecs gotchas:** (1) `VideoFrame` holds real GPU memory — call `.close()` on **every** frame or you leak continuously. (2) Reverse/random seek performance is dominated by **keyframe density** — re-encode with a short GOP (`-g 10`) or backward scrubbing stutters.

**Difficulty:** 2 (naive) · 3 (checkpoint preloading + responsive frame sets) · 4–5 (WebCodecs). Bandwidth is the whole story; a 15 MB PNG sequence is mobile-hostile.

---

## 13. Text / Typography Effects

**Variable-font morphing** — animate `font-variation-settings` axes. Prefer `font-weight`/`font-stretch` where possible so the browser can interpolate discretely. **Not GPU-composited — it forces text re-rasterization each frame.** Keep it to a headline, not a paragraph.

**MSDF** — multi-channel signed distance fields recover the sharp corners single-channel SDF loses. One draw call per string, per-glyph vertex manipulation.

**Sites:** [Mat Voyce](https://matvoyce.tv) — GSAP kinetic typography, GSAP Site of the Year 2025 nomination · [IZANAMI](https://izanami-official.com/) · plus the [Awwwards typography collection](https://www.awwwards.com/websites/typography/): [PAPA TOM](https://papatom.studio/), [Glitch&Grit](https://glitchandgrit.com/), [The Record Institute](https://therecord.institute/), [MONOLOG](https://bymonolog.com/), [Studio OL](https://ol.studio/).

**[troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text)** **0.52.4**, ~2k★ — runtime SDF from font files; kerning, ligatures, RTL/bidi, Arabic joining, unicode fallback. Crucially, **all parsing, SDF generation and layout runs in a web worker, so it doesn't drop frames.** Patches any three.js material, so lighting/shadows/fog still work. (Technically SDF, not strictly MSDF.)

**[three-text](https://github.com/countertype/three-text)** — the 2026 challenger. Two pipelines (mesh geometry + resolution-independent GPU vector outlines), **HarfBuzz shaping, Knuth-Plass line breaking, TeX hyphenation, full variable-font axis control**. Its README's critique of the incumbent: *"troika-three-text generates SDF glyphs at runtime via HarfBuzz. More flexible than bmfont, but still an image-space technique with artifacts up close."* **Caveat: alpha, API not stable until ~summer 2026.**

**Difficulty:** 2 (variable-font CSS) · 3 (troika) · 4 (MSDF pipeline) · 5 (custom typesetting). **Accessibility is the real risk:** WebGL text is invisible to screen readers and unselectable, and split-character animations break reading order — supply the full string via `aria-label` and hide split spans from AT.

---

## 14. WebGL Page Transitions

**Approaches:** persistent GL scene + SPA router (canvas never unmounts; the only way to get truly seamless) · curtain/texture transition (`mix(texA, texB, step(progress, noise(uv)))` — wipes, dissolves and liquid reveals are one shader with different mask functions) · DOM→WebGL handoff (curtains.js model: HTML elements become textured planes still sized by CSS).

**curtains.js production sites** (via the [Awwwards collection](https://www.awwwards.com/websites/curtains/)): [Gentilhomme](https://gentilhomme.com/en/) · [-99®](https://www.minus99.com) · [Rupert & Rothschild](https://rupert-rothschildvignerons.com/) · [Tumulte](https://studio-tumulte.com) · [Pilot'in](https://www.pilot-in.com/) · [Atoll Digital](https://atolldigital.com/) · [Martin Laxenaire](https://www.martin-laxenaire.fr/) (author).

**⚠️ curtains.js is effectively dormant** — 8.1.6, last code release **May 2024**; the only commit since is "updated showcase links" (Apr 2025). Not hostile, just done. The author moved to **[gpu-curtains](https://www.npmjs.com/package/gpu-curtains) 0.16.3**, a WebGPU engine with the same DOM↔3D-plane syncing. **Do not start new projects on curtains.js.**

**Modern references:** [Persistent page transitions with WebGPU + vanilla JS](https://tympanus.net/codrops/2026/06/30/building-persistent-page-transitions-with-webgpu-and-vanilla-javascript/) (2026 state of the art) · [Async transitions in vanilla JS](https://tympanus.net/codrops/2026/02/26/building-async-page-transitions-in-vanilla-javascript/) · [Barba.js + GSAP in Astro](https://tympanus.net/codrops/2026/04/08/creating-custom-page-transitions-in-astro-with-barba-js-and-gsap/) · [Awwwards Academy WebGL+Barba course](https://www.awwwards.com/academy/course/creating-a-simple-portfolio-website-with-webgl-and-barba-js) · [next-view-transitions](https://github.com/shuding/next-view-transitions). **Next.js 15 ships a native `<ViewTransition>` component**; App Router navigations auto-trigger, no manual `startViewTransition`. View Transitions is stable in Chromium and Safari, Firefox flagged.

**No verified production site combining View Transitions with WebGL** was found — they're used separately.

**Difficulty:** 3 (curtains planes) · 4 (Barba + GSAP + shader) · 5 (persistent scene surviving client-side routing with correct texture lifecycle). The transition is one fullscreen quad — cheap. Real costs are holding a GL context for the app's lifetime, render-target memory at DPR>1, and router bundle size. **Lowest-risk 2026 recipe: View Transitions for the DOM (progressive enhancement), WebGL reserved for a persistent background layer rather than the transition mechanism.** Give transitions a hard timeout so a slow fetch can't leave a blank screen.

---

## 15. Adjacent Technologies

### WASM in production
**[Figma](https://www.figma.com/blog/webassembly-cut-figmas-load-time-by-3x/)** — C++ + WebGL renderer via wasm; **load time improved >3×** vs asm.js *independent of document size*, but "download size didn't end up shrinking by much, especially after compression." **The lesson generalizes: wasm buys parse/startup time, not bytes.** **[Photoshop web](https://web.dev/ps-on-the-web)** — C++ via Emscripten, no rewrite; required dynamic wasm multithreading; SIMD gave Halide **3–4× average, up to 80–160×** in specific kernels; service worker + V8 code cache **cut code-init 75%**.

**Baseline** (per [webstatus.dev](https://webstatus.dev)): *widely available* — fixed-width SIMD, **threads & atomics (2021-12)**, exception handling, reference types, bulk memory. *Newly available* — **GC (2024-12)**, tail calls, branch hinting. *Limited, needs fallback* — **relaxed SIMD** (what ML kernels most want), **Memory64** (the 4 GB fix), JSPI.

> **The deployment blocker nobody mentions upfront:** wasm threads require `SharedArrayBuffer`, which requires **cross-origin isolation via COOP + COEP over HTTPS**. Detect with `crossOriginIsolated`. COEP breaks third-party embeds — ads, analytics, iframes, any CDN image without CORP — which is exactly why most sites quietly ship the single-threaded build. **Decide early; expensive to retrofit.**

### ML in the browser

| Library | Version | Status |
|---|---|---|
| `@mediapipe/tasks-vision` | **0.10.35** (2026-04-28) | Actively maintained |
| `@huggingface/transformers` | **4.2.0** | Very active |
| `onnxruntime-web` | **1.27.0** (2026-06-19) | Very active |
| `@tensorflow/tfjs` | **4.22.0** (Oct 2024) | **Effectively dormant** |

> **TensorFlow.js has gone 21 months without a release.** Not deprecated, not archived — but commit history shows a cluster through mid-2025 then essentially one infra commit in April 2026, with 577 open issues. Google's investment visibly moved to MediaPipe. **Do not start new work on TF.js in 2026.**

**MediaPipe** — [repo](https://github.com/google-ai-edge/mediapipe), healthy cadence. **Docs moved:** `ai.google.dev/edge/mediapipe/*` now 301s to `developers.google.com/edge/mediapipe/*`. **Critical caveat from Google's own docs:** `detect()` and `detectForVideo()` **run synchronously and block the UI thread** — they explicitly recommend web workers. This is the #1 cause of janky MediaPipe integrations.

**transformers.js** wraps ORT but pins a **dev build** (`onnxruntime-web@1.26.0-dev.20260416`) — expect version skew. WASM backend is default/stable (`q8`); **WebGPU is experimental** (`device: 'webgpu'`, `fp32`). **ORT Web:** Chrome/Edge out-of-box; **Firefox behind a flag, Safari Technology Preview only**. Their own guidance: for small models where binary size matters, **prefer WASM EP over WebGPU**. Use IO Binding for transformer loops.

**WebNN is not shippable.** [W3C CR Draft 2026-06-26](https://www.w3.org/TR/webnn/), still needs two independent interoperable implementations. Chrome is **origin-trial only** (M147+). **No MDN page exists** — itself a tell. **WebGPU is the acceleration path in 2026.**

Live: [Whisper Web](https://huggingface.co/spaces/Xenova/whisper-web) · [chat.webllm.ai](https://chat.webllm.ai)

### Real-time collaborative cursors

**Liveblocks** `@liveblocks/client` **3.22.0** (2026-07-15). Free $0 (10 connections/room, 3,000 collab-minutes), Pro $30/mo, Team $600–3,750/mo. **$0.002/collaboration-minute**, solo sessions free. Named users on [liveblocks.io/customers](https://liveblocks.io/customers): Vercel, Resend, Rippling, Mixpanel, PostHog, Typeform, VSCO, BBC, Prismic. **Cost trap:** two idle open tabs still meter — disconnect on tab blur.

> **⚠️ PartyKit's hosted product is abandoned and the site does not say so.** [partykit.io](https://www.partykit.io/) returns 200 with **no deprecation banner**, which is actively misleading. Reality: npm `partykit` last stable **0.0.115 (2025-05-21)**; main branch last commit **2025-09-11**; **the hosted deploy target is broken** — [issue #985](https://github.com/partykit/partykit/issues/985) (opened 2026-06-18, still open, **zero maintainer response**) reports `partykit deploy` failing on a 10,000-custom-domain zone limit. **New users cannot deploy.** The live successor is [cloudflare/partykit](https://github.com/cloudflare/partykit) — a different, actively maintained repo: **`partyserver` 0.5.8**, `partysocket` 1.3.0, `y-partyserver` (replacing the dead `y-partykit@0.0.33`). Anyone starting from a 2024-era tutorial walks straight into this.

**Yjs** 13.6.31 (v14 in RC since 2023 — don't bet on it landing), 22.2k★. Cursors ride the separate **ephemeral awareness protocol**, not the CRDT doc. **tldraw** 5.2.5, 49k★ — **licensing trap: it looks open source and is not.** License is `"SEE LICENSE IN LICENSE.md"`; terms forbid production use without a commercial agreement and forbid interfering with watermark/license-key enforcement. Sync must be self-hosted. Budget the license before building.

**Best code to actually read:** [excalidraw.com](https://excalidraw.com) (open source, 127k★).

**Difficulty:** 2 (managed cursors-only) · 3.5 (self-hosted Yjs) · 4 (Durable Objects + partyserver + own auth) · 4.5 (full CRDT with offline merge). **You cannot avoid a server** — WebRTC mesh still needs signaling and degrades past ~8 peers. **Throttle `pointermove` from 60–120 Hz to 20–30 Hz** and interpolate client-side (~6 KB/s down per client in a 10-person room). **Never put cursor positions in the CRDT document** — they'd persist forever.

### Gaussian splatting — consolidated hard

- **❌ Luma AI is dead.** `@lumaai/luma-web` 0.2.2 carries an explicit npm deprecation; the repo is **archived** (last push 2024-03-06). lumalabs.ai in 2026 sells video gen and agents, zero splatting. **Rule out.**
- **✅ [Spark](https://github.com/sparkjsdev/spark) 2.1.0** — best three.js option, **built by World Labs**, 3,428★, MIT. Peer `three ≥0.180.0`; `SplatMesh` lives in the normal scene graph. PLY/SPZ/SPLAT/KSPLAT/SOG. GPU distance readback → **CPU bucket-sort on a worker**; sort lags render by ≥1 frame (visible on fast whips). **WebGL2 only.** ⚠️ npm's `repository` field points at `sparkjs-dev/spark`, which **404s**.
- **✅ PlayCanvas SuperSplat** — most advanced. **Streamed SOG with automatic LOD**, demo scene **24M gaussians**.
- **⚠️ gsplat** — package is `gsplat` (not `gsplat.js`), 1.2.9, [huggingface/gsplat.js](https://github.com/huggingface/gsplat.js). Standalone renderer; `.splat` has no SH coefficients → **no view-dependent color**.
- **⚠️ `@mkkellogg/gaussian-splats-3d` 0.4.7** — 18 months stale, but the most honest docs: ceilings **~16M splats at SH0, ~11M at SH1, ~8M at SH2**.

**The number that decides feasibility:** PlayCanvas's skate park — **1 GB raw PLY at 4M gaussians → 42 MB as SOG** (~95% reduction). SOG's real win isn't size but **Morton order, GPU-ready, no processing on load**, avoiding the multi-second decode stall that makes PLY feel broken. **Budget 15–50 MB compressed for one hero scene** — 10–50× a normal hero image.

> **Who shipped splats on a real marketing site? Almost nobody — and that is the finding.** **Awwwards returns "No results found"** for both `gaussian splatting` and `splat`. **Codrops has exactly one** relevant article, from **2023-11-29**. **Spark's own site has no showcase or "used by" section** — a company as well-funded as World Labs would list marquee sites if it had them. Verified deployed work is architecture/real-estate/heritage, not brand campaigns. **Treat any "top 10 brands using gaussian splatting in 2026" listicle as spam.** For a portfolio this is an opportunity — you'd be early rather than following a proven pattern — but say so honestly rather than implying an established trend.

**Difficulty 3/5.** Spark into an existing three.js scene is a 2; it's a 3 because the work is the **asset pipeline**: capture → SuperSplat cleanup → SOG/SPZ conversion → streaming host → LOD tuning → mobile QA on sort artifacts.

### CSS Houdini / Paint API — it is dead

Verified against caniuse source JSON and MDN BCD 8.0.7:

| Browser | CSS Painting API |
|---|---|
| Chrome / Edge / Samsung | ✅ 65+ / 79+ / 9.0+ |
| **Firefox** | ❌ **never** — every version through 155 is `n` |
| **Safari** | ❌ **never shipped** — flagged behind Experimental Features from **Safari 12.1 (2019) through Safari 27 (2026)** |
| **iOS Safari** | ❌ never |

**Safari has left the Paint API behind an experimental flag for over seven years without enabling it. That is the whole answer.**

| API | Verdict |
|---|---|
| **`@property`** | ✅ **Baseline** — Chrome 85 / Safari 16.4 / Firefox 128. Use freely |
| `CSS.paintWorklet` | ❌ Chromium-only, still flagged `experimental: true` |
| **Layout API** | ❌ **Not in BCD at all.** Never shipped anywhere, including Chrome |
| **Animation Worklet** | ❌ chromestatus: "Origin trial", desktop `None`. Never reached stable |
| Typed OM | 🟡 Firefox still preview-only after ~8 years |

caniuse tracks **exactly one Houdini feature file out of 571**.

**The crucial nuance: `@property` won, worklets lost.** Everything requiring a worklet failed.

**The ecosystem's own showcase sites are gone** (verified by direct HTTP, July 2026): **houdini.how — DNS does not resolve**, and [GoogleChromeLabs/houdini.how](https://github.com/GoogleChromeLabs/houdini.how) is **ARCHIVED** (last push 2023-03-29). **extra.css — does not resolve.** **css-houdini.rocks — domain lost**, now 301s to an unrelated commercial site. When all three canonical showcases are offline or squatted, that's your answer. **No verifiable production site ships a paint worklet as a load-bearing visual in 2026.**

**What replaced it:** **scroll-driven animations** (`animation-timeline`, Chrome 115, **Safari 26**) took Animation Worklet's job — notably Safari shipped these after refusing Animation Worklet for years. Native CSS absorbed the rest: `conic-gradient`, `@container`, `color-mix()`, `linear()` easing, anchor positioning, relative color syntax.

**Difficulty 5/5** — not because a paint worklet is hard (~30 lines) but because you maintain **two complete implementations**, with the fallback covering ~24% of users including **100% of iOS**. **Recommendation: do not build on Paint/Layout/Animation Worklet in 2026.**

---

# The Essential Library Stack, July 2026

*(All versions verified against the npm registry / GitHub API on 2026-07-20.)*

### Core
| Library | Version | Notes |
|---|---|---|
| [three.js](https://www.npmjs.com/package/three) | **r185** (`0.185.1`) | Shipped 2026-07-01; ~6–8 week cadence. WebGPURenderer production-viable **but still labelled `webgpu (wip)`** upstream; WebGLRenderer **not** deprecated |
| [TSL](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language) | — | **The single most important thing to learn in this stack right now.** Docs live in a GitHub *wiki* page |
| [OGL](https://github.com/oframe/ogl) | **1.0.11** | **29 kB minzipped**, Unlicense. Use for shader-first work without three's ecosystem tax |
| [gpu-curtains](https://www.npmjs.com/package/gpu-curtains) | **0.16.3** | WebGPU DOM↔3D-plane syncing; the curtains.js successor |
| [curtains.js](https://github.com/martinlaxenaire/curtainsjs) | 8.1.6 | ⚠️ **Dormant** since May 2024 — don't start new projects |

### R3F ecosystem
`@react-three/fiber` **9.6.1** (peers `react >=19 <19.3`, `three >=0.156`; **v9 = React 19, v8 = React 18**) · `@react-three/drei` **10.7.7** · `@react-three/postprocessing` **3.0.4** · `@react-three/rapier` **2.2.0** · `leva` **0.10.1** · `zustand` **5.0.14** (essential — setState-per-frame will destroy you) · `maath` **0.10.8** · `gltfjsx` **6.5.3**

> **Version-pin watch:** `postprocessing@6.39.3` peers `three >=0.168 <0.186` and three is at **0.185.1** — you are **one release from that upper bound**. Expect a required bump at r186.

### Physics
`@dimforge/rapier3d` **0.19.3** (versioned by **git tags, not GitHub Releases** — read `CHANGELOG.md`) · `cannon-es` **0.20.0** (frozen since Aug 2022) · `matter-js` **0.20.0**

### Animation
| Library | Version | Notes |
|---|---|---|
| [GSAP](https://gsap.com/pricing/) | **3.15.0** | 🎉 **100% FREE, all plugins.** Verified from gsap.com/pricing: *"GSAP is now 100% free for all users, thanks to Webflow's support."* **ScrollTrigger, SplitText, MorphSVG, DrawSVG, Draggable, ScrollSmoother** all free. Webflow acquired GSAP; footer reads "A Webflow Product," maintained by the original team full-time |
| [Motion](https://github.com/motiondivision/motion) | **12.42.2** | Formerly Framer Motion; org moved to `motiondivision`. One package, two flavors: `motion` (vanilla, WAAPI) and `motion/react` |
| [Lenis](https://github.com/darkroomengineering/lenis) | **1.3.25** | Ships React/Vue/Nuxt bindings in-package |
| [Theatre.js](https://github.com/theatre-js/theatre) | 0.7.2 | ⚠️ **Public repo silent since Apr 2024.** Don't adopt for production |
| react-spring | `@react-spring/three` **10.1.2** | Spring physics vs fixed-duration tweens |
| split-type | 0.3.4 | **Largely obsoleted by free SplitText** |

**Two knock-on effects of GSAP going free:** free **ScrollSmoother** now competes directly with Lenis at zero cost, and free **SplitText** kills most of the reason for SplitType/Splitting.js. Lenis remains lighter and framework-agnostic — but the cost argument evaporated.

**darkroom.engineering companions:** `tempus` **1.0.0-dev.18** (one shared rAF ticker) and `hamo` **1.0.0-dev.10** — both still on **prerelease dev tags**. ⚠️ **The org renamed from `@studio-freight` to `darkroomengineering` — `@studio-freight/*` packages are legacy; migrate.**

### Shaders, tooling, assets
- **glslify 7.1.1, last published September 2020 — legacy.** Its browserify-transform model fights modern bundlers. **Use [`vite-plugin-glsl`](https://www.npmjs.com/package/vite-plugin-glsl) 1.6.0** — inlines and minifies **GLSL and WGSL** with `#include`. For noise, vendor `webgl-noise` functions directly into a `.glsl` file; it's a few hundred lines of well-known code and a dependency isn't earning its keep.
- **Debug UI:** `lil-gui` **0.21.0** (vanilla + minimum bytes) · `tweakpane` **4.0.5** (graphs/monitors; v4 is ESM-only, stay on 3.x for CJS) · `leva` **0.10.1** (inside R3F)
- **[postprocessing](https://github.com/pmndrs/postprocessing) 6.39.3** — **merges compatible effects into a single fragment pass**, where three's EffectComposer runs one pass per effect. With 4+ effects the difference is large. On WebGPURenderer, prefer TSL's own post/MRT nodes over either.
- **Text:** `troika-three-text` **0.52.4**
- **Assets:** `@gltf-transform/core` **4.4.1** · `meshoptimizer` **1.2.0** · `three-mesh-bvh` **0.9.13** (mandatory for interactive picking on dense geometry)
- **Splats:** `@sparkjsdev/spark` **2.1.0** (if splats are one element in a three scene) · `gsplat` **1.2.9** (if the splat *is* the experience)

---

# Learning Sources

**Verified active:**

1. **[Codrops](https://tympanus.net/codrops/)** — free, intermediate→advanced. Very active: "ZERO: The Engineering Behind a Defiant Interactive Narrative" (Jul 17 2026), "Meet the Speakers of the First Three.js Conference" (Jul 16), "The Architecture Behind Trionn" (Jul 15). **Correction: there is no `/codrops/demos/`** — the showcase is now **[The Creative Hub](https://tympanus.net/codrops/hub/)**, open-source demos with source links.
2. **[Three.js Journey](https://threejs-journey.com/)** (Bruno Simon) — **$95 one-time, VAT included, lifetime.** 7 chapters / 66 lessons / **93 hours**; Discord 21k+. **⚠️ WebGPU/TSL: NO.** The full lesson index contains zero mentions of WebGPU, TSL, or WGSL — the Shaders chapter is GLSL-only. Still the best structured on-ramp to three.js, just not to WebGPU.
3. **[Maxime Heckel](https://blog.maximeheckel.com/)** — free, long-form with live editable shader playgrounds. **The best current WebGPU/TSL resource**; key post [Field Guide to TSL and WebGPU](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/) (Oct 2025). Also "On Rendering the Sky, Sunsets, and Planets" (May 2026), "Shades of Halftone" (Feb 2026).
4. **[The Book of Shaders](https://thebookofshaders.com/)** — free, beginner→intermediate. The canonical fragment-shader primer. **Caveat: still unfinished** — Fractals, most of Image Processing, and Simulation remain unwritten and have for years.
5. **[Inigo Quilez](https://iquilezles.org/articles/)** — free, expert. SDFs, raymarching, procedural noise, intersectors. Reference, not course.
6. **[WebGPU Fundamentals](https://webgpufundamentals.org/)** / **[WebGL Fundamentals](https://webglfundamentals.org/)** (greggman) — free, open-source. WebGPU covers Basics → Textures → 3D Math → **Compute Shaders**; the best free structured path into raw WebGPU.
7. **[R3F docs (Poimandres)](https://r3f.docs.pmnd.rs/getting-started/introduction)** — recency confirmed via the v8/v9 React versioning note.
8. **[Olivier Larose](https://blog.olivierlarose.com/)** — free tutorials + paid course. ⚠️ **Newest posts are both June 2, 2024. No 2025 or 2026 content.** Valuable archive, not a live feed.

**Handle confirmed, video recency unverified** (YouTube renders client-side and blocks text proxies):

9. **[Yuri Artiukh / akella](https://www.youtube.com/@akella_)** — advanced. Long-form livestreams reverse-engineering award-winning WebGL effects from real sites. **His personal site could not be confirmed — don't cite a domain for him.**
10. **[Robot Bobby](https://www.youtube.com/@robotbobby9)** — beginner→intermediate, project-based three.js. ⚠️ **`robotbobby.com` is NOT his site** — it 307-redirects to an Afternic domain-for-sale page.
11. **[kishimisu](https://www.youtube.com/@kishimisu)** — the "Introduction to Shader Art Coding" videos; probably the best gentle entry into shader art.
12. **[SimonDev](https://www.youtube.com/@simondev758)** — graphics and game-dev math. `simondev.io` resolves but rendered no readable content; pricing `[unverified]`.

**⚠️ Could not verify — do not cite without a browser check:**
- **Offcourse** — `offcourse.co` returns **403** (likely a WAF, so probably exists but unreadable by tooling). **`offcourse.dev` is an unrelated "make money online" business — do not conflate.**
- **Samsy** — **`blog.samsy.ninja` does not resolve (DNS ENOTFOUND)**. The apex [samsy.ninja](https://samsy.ninja/) resolves as a portfolio ("Award Winning Creative Graphics Engineer") but is a JS app with no readable body. **Confirmed as a portfolio, not as a learning resource.**
- **Domenico D'Ostilio** — `domenicodostilio.com` does not resolve; YouTube `@domenicodostilio` **404s**; a Codrops site search returns **0 results**. **No evidence found under this spelling** — likely a misspelling. Recommend dropping unless you can supply the correct handle.
- **Shadertoy** — [shadertoy.com](https://www.shadertoy.com/) returned **403** to tooling, almost certainly bot-blocking rather than an outage. Verify in a browser; its corpus is still the reference.

---

# Ten Things Worth Acting On

1. **GSAP is free, permanently and entirely** — the biggest economic change in this stack. It reshuffles the Lenis case and kills SplitType.
2. **TSL is the skill to invest in**, and there is a **real WebGPU/TSL education gap** — the $95 flagship course is still entirely GLSL. The credible path is Maxime Heckel's field guide + webgpufundamentals.org + Codrops Hub demos.
3. **WebGPU is at ~84% and Safari shipped it**, but **Android is the weak spot** (Samsung Xclipse unimplemented) and you still need a WebGL2 fallback.
4. **Four dormancy warnings:** Theatre.js, curtains.js, glslify, TensorFlow.js — all still look alive on their homepages.
5. **PartyKit's site looks alive and its deploys are broken** with zero maintainer response for 10 months. Use `cloudflare/partykit` → `partyserver`.
6. **Three licensing traps:** blobity (GPLv3), tldraw (looks OSS, is not), Liveblocks (per-connected-minute billing on idle tabs).
7. **Budget VRAM, not file size.** KTX2 is the most-skipped optimization; a 2 MB JPG atlas is 64 MB on the GPU.
8. **COOP/COEP is an infrastructure decision** gating WASM threads and multi-threaded ML. Decide early.
9. **Three techniques have effectively no production footprint** despite strong demo presence: hydra (Chromium-only), reaction-diffusion (iteration cost), and physics-engine soft body (shipped "cloth" is a vertex shader fake). Gaussian splatting on marketing sites is nearly empty too.
10. **Three claims in the original brief did not survive verification:** the "hertzole" ASCII library, `robotbobby.com`, and `blog.samsy.ninja`; "Domenico D'Ostilio" found no match; and Apple's current AirPods Pro page no longer uses canvas sequences. Worth correcting before any of this reaches a portfolio, since a reviewer who checks one dead link discounts the rest.

**Research gaps, stated plainly:** the 200-call search budget was exhausted, so FWA, Godly.website, and siteinspire were never swept, and named agencies (Lusion, Resn, Unseen, Dogstudio, Hello Monday) were not individually researched. Section 9 (video-in-text) has **no verified production sites**. Hover displacement and gooey metaballs have **no verified production sites**. Rapier beyond bruno-simon.com is unverified. A re-run with fresh search budget would most likely close sections 4, 6, and 9 first.
---
