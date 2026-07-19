# Motion Screen Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить герой и арт-дирекшн Motion-экрана на петролевую шейдерную подачу 2026 с 19 слоями анимации, функциональным dope sheet и интерактивной easing-лабораторией.

**Architecture:** `MotionScreen.tsx` (510 строк) разбивается на папку `src/screens/motion/`. Тяжёлый r3f-холст выносится в отдельный ленивый чанк и монтируется через `<Suspense>` по образцу `Modeling3DScreen.tsx:98-100`. Палитра выносится в один модуль, из которого её берут все секции экрана.

**Tech Stack:** React 18, TypeScript, Tailwind, framer-motion, three@0.169, @react-three/fiber@8, @react-three/postprocessing, Lenis, сырой GLSL.

Спека: `docs/superpowers/specs/2026-07-19-motion-screen-hero-design.md`

## Global Constraints

- **Только WebGL.** `WebGPURenderer` в three@0.169 + r3f v8 не заводится штатно. Не использовать.
- **Билд обязан проходить:** `tsc && vite build`. Любая неиспользуемая переменная или импорт валит деплой на Railway.
- **Playwright не добавлять в `package.json`** — его postinstall качает браузер и ломает билд на Railway. Он живёт только в локальном `node_modules`.
- **MTS Wide: только веса 300/400/500/700.** В `index.css:60` стоит `font-synthesis: none` — 600/800/900 не отрисуются. В герое MTS Wide не используется.
- **Шрифты подключаются лениво** через `useFonts()` с guard по `document.getElementById` — паттерн `MotionScreen.tsx:18-28`.
- **JetBrains Mono не использовать** — занят экраном «Разработка». Моно-шрифт здесь Geist Mono.
- **Onest не использовать** — занят экраном 3D-моделирования.
- **Текст заголовка живёт в DOM**, не внутри холста.
- **`clip-path` вместо посимвольной разбивки** — SplitText ломает скринридеры.
- **Хроматическая аберрация: 1.5px в покое, максимум 3px.** 10px читается как поломка.
- **Зерно статичное.** Анимированное зерно читается как ИИ-обработка.
- **`ember` (#E2725B) ≤5% площади**, только CTA и активные состояния.
- **Фон `#071316`** — тонированный, не `#000`. `src/lib/color.ts` читает реальный `background-color`.
- **`prefers-reduced-motion: reduce`** схлопывает всё в одну 200 мс opacity-проявку, холст не монтируется.
- Прелоадер привязан к `THREE.LoadingManager`, не к `setTimeout`.
- `.animate-marquee` сдвигает на `-50%` → `Kinetic` обязан рендерить ровно 2 блока-дубля.

## Verification Harness

В проекте нет тестового фреймворка. Гейт каждой задачи:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
cd ~/Desktop/WEB3\ TECH\ SI
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vite build
```

Плюс визуальная проверка (Task 0 создаёт скрипт):

```bash
./node_modules/.bin/vite preview --port 4188 --strictPort &
sleep 3 && node scripts/shot-motion.mjs /tmp/shots && kill %1
```

Скрипт печатает `pageerrors: none` — любое другое значение означает провал задачи.

## File Structure

| Файл | Ответственность |
|---|---|
| `src/screens/motion/palette.ts` | Палитра `C`, `EASE`, шрифтовые константы. Единственный источник цвета для экрана |
| `src/screens/motion/useMotionFonts.ts` | Ленивая подгрузка Bricolage Grotesque + Geist Mono |
| `src/screens/motion/primitives.tsx` | `Reveal`, `WordReveal`, `CountUp`, `Kinetic`, `Magnetic`, `useReducedMotion` |
| `src/screens/motion/MotionShader.tsx` | r3f-холст: икосаэдр, GLSL, постобработка. **Ленивый чанк** |
| `src/screens/motion/MotionHero.tsx` | Прелоадер, занавес, заголовок, метаданные, CTA, курсор-кольцо |
| `src/screens/motion/DopeSheet.tsx` | Сетка кадров + плейхед + навигация |
| `src/screens/motion/EasingLab.tsx` | Интерактивные easing-карточки |
| `src/screens/MotionScreen.tsx` | Композиция секций. Ужимается с 510 до ~200 строк |
| `scripts/shot-motion.mjs` | Скриншотная проверка |

---

### Task 0: Проверочная петля

**Files:**
- Create: `scripts/shot-motion.mjs` (из существующего `_mo.mjs`)
- Delete: `_mo.mjs`, три `Снимок экрана*.png` в корне

**Interfaces:**
- Produces: `node scripts/shot-motion.mjs <outdir>` → скриншоты `motion_hero.png`, `motion_easing.png`, `motion_dope.png` + строка `pageerrors: ...`

- [ ] **Step 1: Перенести и расширить скрипт**

```js
// scripts/shot-motion.mjs
// Локальный инструмент визуальной проверки Motion-экрана.
// playwright намеренно НЕ в package.json — живёт только в локальном node_modules.
import { chromium } from 'playwright'

const OUT = process.argv[2] ?? '/tmp/shots'
const REDUCED = process.argv.includes('--reduced')
const NOWEBGL = process.argv.includes('--no-webgl')

const args = NOWEBGL ? ['--disable-gpu', '--disable-webgl'] : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
const b = await chromium.launch({ args })
const p = await b.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: REDUCED ? 'reduce' : 'no-preference',
})
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
p.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text()))

await p.goto('http://localhost:4188/', { waitUntil: 'networkidle' })
await p.waitForTimeout(5000)

const y = await p.evaluate(() => document.querySelector('#price').getBoundingClientRect().top + window.scrollY)
await p.evaluate((yy) => window.scrollTo(0, yy + window.innerHeight * 1.6), y)
await p.waitForTimeout(800)

const btns = p.locator('#price [role="button"]')
await btns.nth(2).click().catch(async () => {
  await p.locator('text=Motion-дизайн').first().click().catch(() => {})
})
await p.waitForTimeout(3500)

const suffix = REDUCED ? '_reduced' : NOWEBGL ? '_nowebgl' : ''
await p.screenshot({ path: `${OUT}/motion_hero${suffix}.png` })

for (const [name, frac] of [['easing', 1.05], ['dope', 2.4]]) {
  await p.evaluate((f) => window.scrollTo(0, window.innerHeight * f), frac)
  await p.waitForTimeout(1200)
  await p.screenshot({ path: `${OUT}/motion_${name}${suffix}.png` })
}

console.log('pageerrors:', errs.length ? errs.slice(0, 3).join(' | ') : 'none')
await b.close()
```

- [ ] **Step 2: Убрать мусор из корня репозитория**

```bash
cd ~/Desktop/WEB3\ TECH\ SI
rm -f _mo.mjs
rm -f "Снимок экрана"*.png
```

- [ ] **Step 3: Прогнать на текущем (ещё не переделанном) экране — снять базовую линию**

```bash
export PATH="$HOME/.local/node/bin:$PATH"
mkdir -p /tmp/shots-baseline
./node_modules/.bin/vite build && ./node_modules/.bin/vite preview --port 4188 --strictPort &
sleep 4 && node scripts/shot-motion.mjs /tmp/shots-baseline; kill %1
```

Ожидаемо: `pageerrors: none` и три скриншота старого фиолетового экрана. Это точка отсчёта для сравнения.

- [ ] **Step 4: Коммит**

```bash
git add scripts/shot-motion.mjs
git commit -m "Add Motion screen screenshot harness"
```

---

### Task 1: Палитра и шрифты

**Files:**
- Create: `src/screens/motion/palette.ts`, `src/screens/motion/useMotionFonts.ts`
- Modify: `src/screens/MotionScreen.tsx:5-28` (заменить `C`, `EASE`, `MTS`, `useFonts`)

**Interfaces:**
- Produces: `C` (объект палитры), `EASE` (кортеж), `DISPLAY`/`MONO` (объекты `React.CSSProperties`), `useMotionFonts()`

- [ ] **Step 1: Создать палитру**

```ts
// src/screens/motion/palette.ts
/** Палитра Motion-экрана. Петроль WGSN 2026 + один тёплый акцент. */
export const C = {
  abyss: '#071316',
  panel: '#0E2226',
  border: 'rgba(127,178,174,0.16)',
  petrol: '#1F5C63',
  deepOcean: '#003B5C',
  seaGlass: '#7FB2AE',
  chalk: '#E3E6E4',
  dim: 'rgba(227,230,228,0.6)',
  ember: '#E2725B',
} as const

export const EASE = [0.22, 0.61, 0.36, 1] as const
/** ease-out-expo — для наезда камеры и раскрытия занавеса. */
export const EXPO = [0.16, 1, 0.3, 1] as const

export const DISPLAY = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const
export const MONO = { fontFamily: "'Geist Mono', ui-monospace, monospace" } as const
```

- [ ] **Step 2: Создать хук шрифтов**

```ts
// src/screens/motion/useMotionFonts.ts
import { useEffect } from 'react'

/** Ленивая подгрузка шрифтов Motion-экрана. Переменные оси: wght, wdth, opsz. */
export function useMotionFonts() {
  useEffect(() => {
    const id = 'motion-fonts-2026'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@10..48,75..100,200..800&family=Geist+Mono:wght@400;500&display=swap'
    document.head.appendChild(l)
  }, [])
}
```

- [ ] **Step 3: Переключить экран на новую палитру**

В `src/screens/MotionScreen.tsx`: удалить локальные `C`, `EASE`, `MTS`, `useFonts` (строки 4–28), добавить импорты:

```ts
import { C, EASE, DISPLAY, MONO } from './motion/palette'
import { useMotionFonts } from './motion/useMotionFonts'
```

Затем механическая замена по всему файлу:

| Было | Стало |
|---|---|
| `C.bg` | `C.abyss` |
| `C.violet` | `C.seaGlass` |
| `C.violetDim` | `C.petrol` |
| `C.accent` | `C.ember` |
| `C.cream` | `C.chalk` |
| `...MTS` | `...DISPLAY` |
| `useFonts()` | `useMotionFonts()` |

Заменить `font-onest` на `font-sans` в `<main>` (`:374`). Заменить фиксированное свечение (`:375`) на:

```tsx
<div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(55% 45% at 50% 15%, rgba(31,92,99,0.20), transparent 70%), radial-gradient(45% 40% at 85% 85%, rgba(226,114,91,0.06), transparent 70%)' }} />
```

Заменить жёстко прописанные цвета в массивах `FORMATS` (`:168-175`) и `LAYERS` (`:279-286`) и в `RING_COLORS` (`:222`) на оттенки новой палитры — использовать `C.petrol`, `C.seaGlass`, `C.deepOcean`, `C.ember` и два производных: `#0B3A40`, `#A8C9C5`.

- [ ] **Step 4: Убрать градиентный текст**

`animate-grad` — тот самый приём, который читается как ИИ-слоп. Три места: `:401` (H1), `:212` (`BigScrollWord`), `:240` (`ZoomPortal`). Везде заменить `<span className="bg-clip-text text-transparent animate-grad" style={{ backgroundImage: ... }}>` на сплошной цвет:

```tsx
<span style={{ color: C.chalk }}>
```

а акцентное слово — на `style={{ color: C.seaGlass }}`.

- [ ] **Step 5: Проверить, что фиолетовых остатков нет**

```bash
grep -n 'a06bff\|6a4ba0\|ef4a23\|animate-grad\|ff4d8d\|3fb6ff\|f5b400\|4ade80' src/screens/MotionScreen.tsx
```

Ожидается: пустой вывод.

- [ ] **Step 6: Билд и скриншот**

```bash
export PATH="$HOME/.local/node/bin:$PATH"
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vite build
./node_modules/.bin/vite preview --port 4188 --strictPort &
sleep 4 && node scripts/shot-motion.mjs /tmp/shots-t1; kill %1
```

Ожидается: `pageerrors: none`, экран целиком петролевый, ни одного фиолетового пикселя.

- [ ] **Step 7: Коммит**

```bash
git add src/screens/motion/palette.ts src/screens/motion/useMotionFonts.ts src/screens/MotionScreen.tsx
git commit -m "Motion: petrol palette (WGSN 2026), Bricolage + Geist Mono, drop gradient text"
```

---

### Task 2: Вынести примитивы, вырезать AE-мебель

**Files:**
- Create: `src/screens/motion/primitives.tsx`
- Modify: `src/screens/MotionScreen.tsx` (удалить `FloatingShapes`, `Timeline`, `AEWorkspace`, `EasingCard`, секцию 7)

**Interfaces:**
- Produces: `Reveal`, `WordReveal`, `CountUp`, `Kinetic`, `Magnetic`, `usePrefersReducedMotion`

- [ ] **Step 1: Создать модуль примитивов**

Перенести без изменения логики из `MotionScreen.tsx`: `Reveal` (:34-40), `WordReveal` (:42-52), `CountUp` (:54-72), `Kinetic` (:105-122), `Magnetic` (:251-276). Импортировать `C`, `EASE`, `DISPLAY` из `./palette`. Добавить новый хук:

```tsx
import { useEffect, useState } from 'react'

/** true, если пользователь просил уменьшить анимацию. Реактивен к смене настройки. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}
```

- [ ] **Step 2: Удалить AE-мебель**

Из `MotionScreen.tsx` удалить целиком:
- `FloatingShapes` (:93-102) и его вызов в герое (:391) — блоб-круги
- `Timeline` (:147-166) и константу `TRACKS` (:146)
- `AEWorkspace` (:287-336) и константу `LAYERS` (:279-286)
- секцию 7 «Рабочий процесс» (:467-472)
- `EasingCard` (:131-143) и секцию 5 — их заменит `EasingLab` в Task 7. Константу `EASES` (:125-130) **оставить**, она переедет.

- [ ] **Step 3: Билд**

```bash
export PATH="$HOME/.local/node/bin:$PATH"
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vite build
```

Ожидается: успех. Если `tsc` ругается на неиспользуемый импорт (`useInView`, `MotionValue` и т.п.) — удалить его, иначе Railway упадёт.

- [ ] **Step 4: Коммит**

```bash
git add src/screens/motion/primitives.tsx src/screens/MotionScreen.tsx
git commit -m "Motion: extract primitives, remove decorative After Effects chrome"
```

---

### Task 3: Шейдерный холст

**Files:**
- Create: `src/screens/motion/MotionShader.tsx`

**Interfaces:**
- Produces: `export default function MotionShader({ pointer, velocity, onReady }: { pointer: React.RefObject<{x:number;y:number}>; velocity: React.RefObject<number>; onReady: () => void })` — дефолтный экспорт для `lazy()`

Реализует слои 1–5, 9, 11, 13 из инвентаря спеки.

- [ ] **Step 1: Написать холст**

```tsx
// src/screens/motion/MotionShader.tsx
// Ленивый чанк: r3f-холст героя. Импортируется только через lazy().
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

const VERT = /* glsl */ `
uniform float uTime;
uniform float uPointer;   // сила искажения под курсором
uniform vec3  uPointerPos;
varying vec3  vNormal;
varying vec3  vViewPos;

// 3D-симплекс-шум (Ashima, сокращённый)
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 Cc = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, Cc.yyy));
  vec3 x0 = v - i + dot(i, Cc.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + Cc.xxx;
  vec3 x2 = x0 - i2 + Cc.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main(){
  vNormal = normalize(normalMatrix * normal);
  // Слой 1+4: дыхание формы, две частоты шума в противофазе — силуэт не повторяется
  float n1 = snoise(normal * 1.4 + uTime * 0.18);
  float n2 = snoise(normal * 3.1 - uTime * 0.11);
  float disp = n1 * 0.30 + n2 * 0.12;
  // Слой 9: локальное усиление под курсором
  float d = distance(normalize(position), normalize(uPointerPos));
  disp += uPointer * 0.35 * smoothstep(1.1, 0.0, d);
  vec3 pos = position + normal * disp;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vViewPos = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const FRAG = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uGlass;
varying vec3 vNormal;
varying vec3 vViewPos;

void main(){
  vec3 n = normalize(vNormal);
  // Слой 2: градиент вдоль нормали
  float ramp = smoothstep(-1.0, 1.0, n.y);
  vec3 col = mix(uDeep, uGlass, ramp);
  // Слой 3: френелевский ободок — объём без источников света
  float fres = pow(1.0 - max(dot(n, normalize(vViewPos)), 0.0), 2.6);
  col += uGlass * fres * 0.85;
  gl_FragColor = vec4(col, 1.0);
}
`

function Blob({ pointer, velocity }: { pointer: React.RefObject<{ x: number; y: number }>; velocity: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null)
  const strength = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: 0 },
      uPointerPos: { value: new THREE.Vector3(0, 0, 1) },
      uDeep: { value: new THREE.Color('#003B5C') },
      uGlass: { value: new THREE.Color('#7FB2AE') },
    }),
    []
  )

  useFrame((state, dt) => {
    const m = mesh.current
    if (!m) return
    uniforms.uTime.value = state.clock.elapsedTime

    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    // Слой 6: инерционное доворачивание за курсором, lerp 0.06
    m.rotation.y += ((px * 0.6) - m.rotation.y) * 0.06
    m.rotation.x += ((-py * 0.4) - m.rotation.x) * 0.06
    // Слой 13: быстрый скролл подкручивает форму
    m.rotation.z += dt * (0.06 + Math.min(Math.abs(velocity.current ?? 0) / 3000, 0.5))

    uniforms.uPointerPos.value.set(px, py, 1).normalize()
    strength.current += ((pointer.current ? 1 : 0) - strength.current) * 0.05
    uniforms.uPointer.value = strength.current
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.5, 48]} />
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  )
}

function Rig({ velocity }: { velocity: React.RefObject<number> }) {
  useFrame((state) => {
    // Слой 10: камера отъезжает при выходе из героя
    const target = 4.2 + Math.min((window.scrollY / window.innerHeight) * 3.5, 4)
    state.camera.position.z += (target - state.camera.position.z) * 0.05
  })
  return null
}

function Aberration({ velocity }: { velocity: React.RefObject<number> }) {
  const ref = useRef<any>(null)
  useFrame(() => {
    if (!ref.current) return
    // Слой 11: 1.5px в покое → максимум 3px на скорости скролла. Порог не превышаем.
    const v = Math.min(Math.abs(velocity.current ?? 0) / 4000, 1)
    const px = (1.5 + v * 1.5) / window.innerWidth
    ref.current.offset.set(px, px)
  })
  return <ChromaticAberration ref={ref} blendFunction={BlendFunction.NORMAL} radialModulation modulationOffset={0.3} offset={[0.0011, 0.0011] as any} />
}

export default function MotionShader({
  pointer,
  velocity,
  onReady,
}: {
  pointer: React.RefObject<{ x: number; y: number }>
  velocity: React.RefObject<number>
  onReady: () => void
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#071316')
        onReady()
      }}
    >
      <Blob pointer={pointer} velocity={velocity} />
      <Rig velocity={velocity} />
      <EffectComposer>
        {/* Слой 5 */}
        <Bloom intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
        <Aberration velocity={velocity} />
        {/* Слой 16 */}
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
        {/* Слой 15: зерно СТАТИЧНОЕ — premultiply без анимации времени */}
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
      </EffectComposer>
    </Canvas>
  )
}
```

- [ ] **Step 2: Проверить типы**

```bash
export PATH="$HOME/.local/node/bin:$PATH"
./node_modules/.bin/tsc --noEmit
```

Если `ChromaticAberration` ругается на `offset` — тип в `@react-three/postprocessing@2` ожидает `Vector2`. Тогда убрать проп `offset` из JSX и задавать только через `ref` в `useFrame`.

- [ ] **Step 3: Коммит**

```bash
git add src/screens/motion/MotionShader.tsx
git commit -m "Motion: WebGL hero shader — noise-displaced icosahedron, fresnel, post FX"
```

---

### Task 4: Герой — входная последовательность

**Files:**
- Create: `src/screens/motion/MotionHero.tsx`
- Modify: `src/screens/MotionScreen.tsx` (заменить секцию 1, :382-412)

**Interfaces:**
- Consumes: `MotionShader` (lazy), `C`/`EASE`/`EXPO`/`DISPLAY`/`MONO`, `usePrefersReducedMotion`, `Magnetic`
- Produces: `export default function MotionHero({ onClose }: { onClose: () => void })`

Реализует слои входной последовательности + 7, 8, 12, 14, 17, 18, 19.

- [ ] **Step 1: Написать компонент героя**

Ключевые решения, которые нельзя менять:

- Заголовок — **четыре `<span>`-строки в DOM**, каждая в обёртке с `overflow: hidden`, анимируется `clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)`, стагger 70 мс. Никакой посимвольной разбивки.
- Ось `wdth` идёт 75 → 100 за 550 мс через `fontVariationSettings` на motion-значении.
- Прелоадер слушает `THREE.LoadingManager`; поскольку холст не грузит внешних ассетов, прогресс берётся от готовности WebGL-контекста (`onReady`) плюс `document.fonts.ready` — оба честные события, не таймер.
- WebGL детектится до монтирования: `document.createElement('canvas').getContext('webgl2')`. Нет контекста → рендерится CSS-фолбэк `radial-gradient(circle at 50% 45%, #003B5C, #071316 65%)` + то же SVG-зерно.
- При `usePrefersReducedMotion()` холст **не монтируется вовсе**, вся последовательность — одна 200 мс opacity-проявка.

Структура:

```tsx
const reduced = usePrefersReducedMotion()
const hasWebGL = useMemo(() => {
  try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false }
}, [])
const pointer = useRef({ x: 0, y: 0 })
const velocity = useRef(0)
const [ready, setReady] = useState(false)
const [progress, setProgress] = useState(0)
```

`useVelocity(useScroll().scrollY)` подписывается через `.on('change', v => { velocity.current = v })` — записываем в ref, не в state, иначе перерисовка на каждом кадре скролла.

Слои:
- **7 — параллакс строк заголовка:** каждая строка получает `x`/`y` от `pointer` с коэффициентом 4–10px, в противофазе к форме (знак минус).
- **12 — параллакс скролла:** заголовок `useTransform(scrollYProgress, [0,1], [0, -180])`, холст `[0, -60]`.
- **14 — поле частиц:** ~40 абсолютных `<span>`, три слоя глубины (`0.3`/`0.6`/`1.0` множитель параллакса), цвет `C.petrol`, размеры 1–3px, позиции из детерминированного псевдо-рандома по индексу (не `Math.random()` — иначе прыгают на каждом ререндере).
- **17 — метаданные:** `SHOWREEL 2026 — 01:42 — 24FPS` печатается посимвольно за 1.2s, `MONO`, uppercase, +8% tracking, `C.dim`.
- **18 — CTA:** `Magnetic` + пульсация `boxShadow` вокруг `C.ember`.
- **19 — скролл-подсказка:** собственная, не `animate-bob-down` (занята двумя другими экранами). Вертикальная линия 1px `C.petrol` высотой 48px, внутри неё стекает вниз отрезок `C.seaGlass` с затуханием, 1.8s infinite.

Курсор-кольцо (слой 8): `position: fixed`, 40px, `border: 1px solid C.seaGlass`, следует за курсором через spring; над холстом растёт до 90px и показывает `DRAG` в `MONO`. Скрывается при `pointer: coarse` (`window.matchMedia('(pointer: coarse)').matches`).

- [ ] **Step 2: Подключить в экран**

```tsx
import MotionHero from './motion/MotionHero'
// ...
{/* 1 · Герой */}
<MotionHero onClose={onClose} />
```

- [ ] **Step 3: Билд и три скриншота**

```bash
export PATH="$HOME/.local/node/bin:$PATH"
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vite build
./node_modules/.bin/vite preview --port 4188 --strictPort &
sleep 4
node scripts/shot-motion.mjs /tmp/shots-t4
node scripts/shot-motion.mjs /tmp/shots-t4 --reduced
node scripts/shot-motion.mjs /tmp/shots-t4 --no-webgl
kill %1
```

Ожидается: все три прогона печатают `pageerrors: none`. На `--no-webgl` виден CSS-градиентный фолбэк, на `--reduced` — статичный герой без холста.

- [ ] **Step 4: Коммит**

```bash
git add src/screens/motion/MotionHero.tsx src/screens/MotionScreen.tsx
git commit -m "Motion: immersive hero — honest preloader, curtain reveal, clip-path headline"
```

---

### Task 5: Dope sheet

**Files:**
- Create: `src/screens/motion/DopeSheet.tsx`
- Modify: `src/screens/MotionScreen.tsx` (вставить вместо удалённой секции 7)

**Interfaces:**
- Consumes: `C`, `MONO`, `DISPLAY`, `usePrefersReducedMotion`
- Produces: `export default function DopeSheet({ onJump }: { onJump: (anchor: string) => void })`

- [ ] **Step 1: Написать сетку**

- 120 ячеек, `grid-template-columns: repeat(20, 1fr)`, 6 рядов, `aspect-ratio: 1`, фон `C.panel`, зазор 3px.
- **Появление:** `transition-delay: ${(row + col) * 12}ms`, переход фона `C.panel` → `#232B2E`. Чистый CSS, запускается по `whileInView` через класс на контейнере.
- **Наполнение:** 14 ячеек помечены активными (детерминированный список индексов, не рандом). Каждая содержит процедурную микроанимацию — маленький `<svg>` или CSS-фигура: вращающийся квадрат, пульсирующее кольцо, сдвигающиеся полосы, морфящийся `border-radius`. Ротация из 5 заготовок по `index % 5`.
- **Ступенчатость (ключевое):** активные ячейки анимируются с `animation-timing-function: steps(8)` — намеренные 8fps против 60fps заголовка. Это и есть сигнал ремесла, не баг.
- **Плейхед:** вертикальная линия 2px `C.seaGlass`, проходит слева направо за 700 мс линейно, запускается при входе секции во вьюпорт и по клику. Пересечённая ячейка вспыхивает в `C.seaGlass` на ~16 мс.
- **Навигация (обязательна):** каждая активная ячейка — `<button>` с `aria-label`, клик вызывает `onJump(anchor)` и прокручивает к соответствующей секции через `scrollToTarget` из `src/lib/scroll.ts` (Lenis-aware). Hover — прокрутка фазы своей микроанимации.
- Подпись снизу в `MONO`: `120 КАДРОВ / 14 РАБОТ / 2019—2026`.
- При `usePrefersReducedMotion()`: волна и плейхед не запускаются, ячейки статичны, навигация продолжает работать.

- [ ] **Step 2: Билд и скриншот**

```bash
export PATH="$HOME/.local/node/bin:$PATH"
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vite build
./node_modules/.bin/vite preview --port 4188 --strictPort &
sleep 4 && node scripts/shot-motion.mjs /tmp/shots-t5; kill %1
```

Проверить на `motion_dope.png`: сетка видна, часть ячеек подсвечена, вёрстка не разъехалась.

- [ ] **Step 3: Коммит**

```bash
git add src/screens/motion/DopeSheet.tsx src/screens/MotionScreen.tsx
git commit -m "Motion: functional dope sheet — the one AE motif still unclaimed"
```

---

### Task 6: Easing-лаборатория

**Files:**
- Create: `src/screens/motion/EasingLab.tsx`
- Modify: `src/screens/MotionScreen.tsx` (заменить секцию 5)

**Interfaces:**
- Consumes: `C`, `MONO`, `DISPLAY`, `EASES` (переносится сюда из `MotionScreen.tsx:125-130`)
- Produces: `export default function EasingLab()`

Кривая как декорация — клише. Кривая как интерактивный инструмент — легитимна. Разница в том, что карточка что-то делает.

- [ ] **Step 1: Написать лабораторию**

- Список `EASES` расширить до 6: добавить `Ease-in` (`cubic-bezier(0.7,0,0.84,0)`) и `Back-out` (`cubic-bezier(0.34,1.56,0.64,1)`), с корректными `path` для SVG-превью.
- Состояние `active: string` — выбранная кривая.
- **Общий демо-объект:** один квадрат 56px `C.seaGlass` над сеткой карточек, пробегает дорожку слева направо за 1.4s с выбранным easing. Перезапуск при смене кривой и по клику «проиграть».
- Клик по карточке: делает её активной (рамка `C.seaGlass`, фон `#132B2F`) и перезапускает демо.
- Значение `cubic-bezier(...)` показано в `MONO` под кривой; клик по нему копирует в буфер через `navigator.clipboard.writeText` и на 1.2s меняет подпись на `СКОПИРОВАНО`. Обернуть в `try/catch` — в небезопасном контексте API недоступен.
- SVG-кривая рисуется `pathLength` 0→1 при входе во вьюпорт (это уже есть в старом `EasingCard`, перенести).

- [ ] **Step 2: Билд и скриншот**

```bash
export PATH="$HOME/.local/node/bin:$PATH"
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vite build
./node_modules/.bin/vite preview --port 4188 --strictPort &
sleep 4 && node scripts/shot-motion.mjs /tmp/shots-t6; kill %1
```

- [ ] **Step 3: Коммит**

```bash
git add src/screens/motion/EasingLab.tsx src/screens/MotionScreen.tsx
git commit -m "Motion: easing cards become an interactive tool, not decoration"
```

---

### Task 7: Чистка CSS и финальная сборка

**Files:**
- Modify: `src/index.css`, `src/screens/MotionScreen.tsx`

- [ ] **Step 1: Найти осиротевшие keyframes**

```bash
cd ~/Desktop/WEB3\ TECH\ SI
for k in float-a float-b wobble kf-pulse playhead-run ease-run grad-pan; do
  echo "=== $k ==="
  grep -rn "$k" src/ --include=*.tsx --include=*.ts | grep -v index.css
done
```

Удалить из `src/index.css` только те, у которых нет ни одного потребителя в `.tsx`. `ease-run` останется, если `EasingLab` его использует; `grad-pan`/`.animate-grad` — проверить, не нужен ли он другим экранам, прежде чем удалять.

- [ ] **Step 2: Добавить новые keyframes**

В `src/index.css` дописать в конец: `dope-wave` (не нужен, делается через transition-delay), `playhead-sweep` (0→100% за 700ms linear), `scroll-trickle` (для подсказки из слоя 19), `ember-pulse` (пульсация тени CTA). Каждый обернуть в `@media (prefers-reduced-motion: no-preference)`, чтобы не полагаться только на JS.

- [ ] **Step 3: Полная проверка**

```bash
export PATH="$HOME/.local/node/bin:$PATH"
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vite build
./node_modules/.bin/vite preview --port 4188 --strictPort &
sleep 4
node scripts/shot-motion.mjs /tmp/shots-final
node scripts/shot-motion.mjs /tmp/shots-final --reduced
node scripts/shot-motion.mjs /tmp/shots-final --no-webgl
kill %1
grep -n 'a06bff\|6a4ba0\|ef4a23\|animate-grad' src/screens/MotionScreen.tsx src/screens/motion/*.tsx
```

Ожидается: три раза `pageerrors: none`, `grep` пустой.

- [ ] **Step 4: Проверить размер ленивого чанка**

```bash
ls -la dist/assets/ | sort -k5 -n | tail -8
```

Холст обязан быть отдельным чанком. Если `three` попал в основной бандл — `lazy()` подключён неверно, чинить до коммита.

- [ ] **Step 5: Коммит и пуш**

```bash
git add -A src/ docs/
git commit -m "Motion: prune orphaned keyframes, add new motion primitives"
git push origin main
```

---

## Self-Review

**Покрытие спеки:**

| Требование спеки | Задача |
|---|---|
| Палитра на весь экран | Task 1 |
| Bricolage + Geist Mono | Task 1 |
| Удаление `animate-grad` | Task 1, шаг 4 |
| Удаление `FloatingShapes`/`AEWorkspace`/`Timeline` | Task 2 |
| Слои 1–5 (шейдер), 9, 11, 13 | Task 3 |
| Входная последовательность 0–2.5s | Task 4 |
| Слои 6–8, 10, 12, 14–19 | Task 3 (6,10), Task 4 (7,8,12,14,17,18,19) |
| Dope sheet + навигация | Task 5 |
| Интерактивные easing-карточки | Task 6 |
| Фолбэк без WebGL | Task 4, шаг 1 + проверка шаг 3 |
| `prefers-reduced-motion` | Task 2 (хук), Task 4/5, Task 7 (CSS) |
| Ленивая загрузка холста | Task 3 + проверка Task 7 шаг 4 |
| Чистка keyframes | Task 7 |

Пробелов не найдено.

**Согласованность имён:** `C.abyss/panel/border/petrol/deepOcean/seaGlass/chalk/dim/ember` — единый набор во всех задачах. `usePrefersReducedMotion` (не `useReducedMotion` — так избегаем коллизии с одноимённым хуком framer-motion). `MotionShader` принимает `{ pointer, velocity, onReady }` — ровно эти имена используются в Task 4.

**Известный риск:** Task 3 шаг 2 содержит развилку по типам `ChromaticAberration` — тип `offset` расходится между версиями `@react-three/postprocessing`. Обходной путь описан в самом шаге.
