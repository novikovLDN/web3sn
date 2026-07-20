// scripts/shots.mjs
// Визуальная проверка всего сайта: полностраничные скриншоты каждой секции
// и каждого тематического экрана на трёх ширинах.
//
// playwright намеренно НЕ в package.json — его postinstall тянет браузер и
// ломает сборку на Railway. Живёт только в локальном node_modules.
//
// Запуск:
//   node scripts/shots.mjs [outDir] [--port 4188] [--reduced]

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = process.argv[2]?.startsWith('--') ? '/tmp/shots' : (process.argv[2] ?? '/tmp/shots')
const REDUCED = process.argv.includes('--reduced')
const portArg = process.argv.indexOf('--port')
const PORT = portArg > -1 ? process.argv[portArg + 1] : '4188'
const BASE = `http://localhost:${PORT}/`

mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
  { name: 'desktop', width: 1600, height: 1000 },
  { name: 'tablet', width: 900, height: 1200 },
  { name: 'mobile', width: 390, height: 844 },
]

// Тематические экраны открываются кликом по строке услуги в #price.
const SCREENS = [
  { id: 'modeling', label: '3D-моделинг' },
  { id: 'development', label: 'Разработка' },
  { id: 'motion', label: 'Motion-дизайн' },
  { id: 'branding', label: 'Брендинг' },
  { id: 'webdesign', label: 'Веб-дизайн' },
]

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})

const allErrors = []

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: REDUCED ? 'reduce' : 'no-preference',
    deviceScaleFactor: 1,
  })

  const errs = []
  page.on('pageerror', (e) => errs.push(`[${vp.name}] pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push(`[${vp.name}] console: ${m.text()}`)
  })

  await page.goto(BASE, { waitUntil: 'networkidle' })
  // Экран загрузки + первые reveal-анимации должны отыграть до съёмки.
  await page.waitForTimeout(4500)

  // Полная страница одним кадром — видно ритм секций и стыки между ними.
  await page.screenshot({
    path: `${OUT}/${vp.name}-full.png`,
    fullPage: true,
  })

  // Посекционно: удобнее разбирать композицию каждого блока отдельно.
  const sections = await page.evaluate(() =>
    Array.from(document.querySelectorAll('section[id]')).map((s) => s.id)
  )
  for (const id of sections) {
    const el = page.locator(`section#${id}`)
    if (!(await el.count())) continue
    await el.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(900)
    await el
      .screenshot({ path: `${OUT}/${vp.name}-section-${id}.png` })
      .catch((e) => errs.push(`[${vp.name}] section ${id}: ${e.message}`))
  }

  // Тематические экраны — только на десктопе и мобильном, чтобы не плодить кадры.
  if (vp.name !== 'tablet') {
    for (const s of SCREENS) {
      await page.goto(BASE, { waitUntil: 'networkidle' })
      await page.waitForTimeout(3500)

      const row = page.locator(`#price [role="button"]`, { hasText: s.label })
      if (!(await row.count())) {
        errs.push(`[${vp.name}] экран "${s.label}": строка услуги не найдена`)
        continue
      }
      await row.first().click({ timeout: 3000 }).catch(() => {})

      const landed = await page
        .waitForSelector(`main[data-screen="${s.id}"]`, { timeout: 5000 })
        .catch(() => null)
      if (!landed) {
        errs.push(`[${vp.name}] экран "${s.label}": не открылся (нет data-screen="${s.id}")`)
        continue
      }
      await page.waitForTimeout(2500)
      await page.screenshot({
        path: `${OUT}/${vp.name}-screen-${s.id}.png`,
        fullPage: true,
      })
    }
  }

  allErrors.push(...errs)
  await page.close()
}

await browser.close()

if (allErrors.length) {
  console.error('\n⚠️  Ошибки на странице:\n' + allErrors.map((e) => '  ' + e).join('\n'))
} else {
  console.log('\n✓ Ошибок в консоли нет')
}
console.log(`\nСкриншоты: ${OUT}`)
