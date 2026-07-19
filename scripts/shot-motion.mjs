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
