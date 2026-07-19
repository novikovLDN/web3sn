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

// Short click timeouts so a broken selector fails fast (seconds), not a 30-45s hang.
const CLICK_TIMEOUT = 3000
const NAV_ASSERT_TIMEOUT = 5000
const MOTION_MARKER = 'main[data-screen="motion"]' // stable marker: survives redesign of copy/palette/fonts

const btns = p.locator('#price [role="button"]')
await btns.nth(2).click({ timeout: CLICK_TIMEOUT }).catch(async () => {
  await p.locator('text=Motion-дизайн').first().click({ timeout: CLICK_TIMEOUT }).catch(() => {})
})

// Positive assertion: don't screenshot until we've actually landed on the Motion screen.
const landed = await p.waitForSelector(MOTION_MARKER, { timeout: NAV_ASSERT_TIMEOUT }).catch(() => null)
if (!landed) {
  console.error(
    `FATAL: navigation to Motion screen failed — "${MOTION_MARKER}" not found after clicking ` +
      `#price [role="button"] (index 2) and the "text=Motion-дизайн" fallback. ` +
      `Refusing to screenshot (would be misleading).`
  )
  await b.close()
  process.exit(1)
}

await p.waitForTimeout(3500)

const suffix = `${REDUCED ? '_reduced' : ''}${NOWEBGL ? '_nowebgl' : ''}`
await p.screenshot({ path: `${OUT}/motion_hero${suffix}.png` })

// Scroll by anchor, not by a hardcoded viewport fraction: section order changes
// between tasks and a stale fraction silently produces a shot of the wrong section.
// No fallback: a missing anchor means the section moved/renamed and the shot would
// be of the wrong content, so we fail loudly instead of quietly photographing garbage —
// same contract as the unreachable-Motion-screen check above.
const SETTLE_TIMEOUT_MS = 8000

for (const [name, anchor] of [
  ['easing', '#m-easing'],
  ['dope', '#m-dope'],
]) {
  const found = await p.evaluate((a) => {
    const el = document.querySelector(a)
    if (!el) return false
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40)
    return true
  }, anchor)
  if (!found) {
    console.error(
      `FATAL: anchor "${anchor}" (section "${name}") not found — refusing to screenshot (would be misleading).`
    )
    await b.close()
    process.exit(1)
  }

  // Lenis keeps gliding past any fixed wait: poll until scrollY actually stops.
  // Bounded so a stuck scroll fails the gate instead of hanging it forever
  // (page.evaluate has no built-in timeout of its own).
  try {
    await p.evaluate(
      (timeoutMs) =>
        new Promise((resolve, reject) => {
          const start = performance.now()
          let last = -1
          let still = 0
          const t = () => {
            if (performance.now() - start > timeoutMs) {
              reject(new Error(`scrollY did not settle within ${timeoutMs}ms`))
              return
            }
            const y = Math.round(window.scrollY)
            still = y === last ? still + 1 : 0
            last = y
            still > 8 ? resolve(undefined) : requestAnimationFrame(t)
          }
          requestAnimationFrame(t)
        }),
      SETTLE_TIMEOUT_MS
    )
  } catch (e) {
    console.error(`FATAL: scroll settle failed for section "${name}" (${anchor}): ${e.message}`)
    await b.close()
    process.exit(1)
  }

  await p.waitForTimeout(1600)
  if (name === 'easing') {
    // The easing grid (6 cards) is taller than the 900px viewport, so a plain
    // viewport screenshot crops the bottom row and hides half the cubic-bezier
    // values. Element screenshots aren't viewport-bound, so capture the section
    // itself. Other sections keep the plain viewport capture.
    await p.locator(anchor).screenshot({ path: `${OUT}/motion_${name}${suffix}.png` })
  } else {
    await p.screenshot({ path: `${OUT}/motion_${name}${suffix}.png` })
  }
}

console.log('pageerrors:', errs.length ? errs.slice(0, 3).join(' | ') : 'none')
await b.close()
if (errs.length > 0) process.exit(1)
