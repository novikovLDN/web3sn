// scripts/shot-screen.mjs
// Универсальная визуальная проверка экрана услуги.
// Использование: node scripts/shot-screen.mjs <screenId> <btnIndex> [outDir] [--reduced]
// playwright намеренно НЕ в package.json — живёт только в локальном node_modules.
import { chromium } from 'playwright'

const screenId = process.argv[2]
const btnIndex = Number(process.argv[3] ?? 0)
const OUT = process.argv[4]?.startsWith('--') ? '/tmp/shots' : (process.argv[4] ?? '/tmp/shots')
const REDUCED = process.argv.includes('--reduced')

if (!screenId) {
  console.error('usage: node scripts/shot-screen.mjs <screenId> <btnIndex> [outDir] [--reduced]')
  process.exit(1)
}

const b = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const p = await b.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: REDUCED ? 'reduce' : 'no-preference',
})
const errs = []
p.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
p.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text()))

await p.goto('http://localhost:4188/', { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(5000)

// доскроллить до блока услуг, чтобы строки смонтировались и попали в вид
const y = await p.evaluate(() => document.querySelector('#price').getBoundingClientRect().top + window.scrollY)
await p.evaluate((yy) => window.scrollTo(0, yy + window.innerHeight * 1.6), y)
await p.waitForTimeout(800)

const CLICK_TIMEOUT = 3000
const NAV_ASSERT_TIMEOUT = 6000
const MARKER = `main[data-screen="${screenId}"]`

await p.locator('#price [role="button"]').nth(btnIndex).click({ timeout: CLICK_TIMEOUT }).catch(() => {})

// Позитивная проверка: не снимаем скриншот, пока реально не попали на экран.
const landed = await p.waitForSelector(MARKER, { timeout: NAV_ASSERT_TIMEOUT }).catch(() => null)
if (!landed) {
  console.error(
    `FATAL: переход на экран "${screenId}" не удался — селектор "${MARKER}" не найден ` +
      `после клика по #price [role="button"] index ${btnIndex}. Скриншот не снимаю (был бы обманом).`
  )
  await b.close()
  process.exit(1)
}

await p.waitForTimeout(1200)
const tag = REDUCED ? `${screenId}-reduced` : screenId
await p.screenshot({ path: `${OUT}/${tag}-hero.png` })

// прокрутка по экрану — снимки ключевых секций
const H = await p.evaluate(() => document.body.scrollHeight)
const shots = [0.28, 0.52, 0.78]
for (let i = 0; i < shots.length; i++) {
  await p.evaluate((yy) => window.scrollTo(0, yy), Math.round(H * shots[i]))
  await p.waitForTimeout(900)
  await p.screenshot({ path: `${OUT}/${tag}-${i + 2}.png` })
}

console.log(`OK: ${tag} — снято ${shots.length + 1} кадров в ${OUT}`)
console.log(errs.length ? 'ОШИБКИ:\n' + errs.slice(0, 10).join('\n') : 'ошибок консоли нет')
await b.close()
