import { chromium } from './node_modules/playwright-core/index.mjs'
const OUT='/private/tmp/claude-501/-Users-maximiliannovikov/1c0614f9-26b3-42cb-bc1a-9480433e253e/scratchpad'
const b = await chromium.launch({ channel: undefined, executablePath: undefined })
const errs=[]
for (const [w,h,tag] of [[390,844,'m'],[1440,900,'d']]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 })
  const p = await ctx.newPage()
  p.on('console', m=>{ if(m.type()==='error') errs.push(`[${tag}] ${m.text()}`) })
  p.on('pageerror', e=>errs.push(`[${tag}] PAGEERROR ${e.message}`))
  await p.goto('http://localhost:4321/', { waitUntil:'load' })
  await p.waitForTimeout(4000)
  // Открываем motion-экран напрямую через React-состояние недоступно; кликаем по услуге.
  await p.evaluate(()=>document.querySelector('#price')?.scrollIntoView())
  await p.waitForTimeout(1500)
  const cards = p.locator('[role="button"]')
  const n = await cards.count()
  let opened='not-found'
  for(let i=0;i<n;i++){
    const txt = (await cards.nth(i).textContent())||''
    if(/моушн|motion/i.test(txt)){ await cards.nth(i).click({force:true}); opened='clicked '+i; break }
  }
  await p.waitForTimeout(2500)
  const info = await p.evaluate(()=>{
    const m=document.querySelector('[data-screen="motion"]')
    if(!m) return {found:false}
    const ids=[...m.querySelectorAll('section[id]')].map(s=>s.id)
    const de=document.documentElement
    return { found:true, ids, hOverflow: de.scrollWidth>de.clientWidth ? de.scrollWidth-de.clientWidth : 0, scrollW:de.scrollWidth, clientW:de.clientWidth }
  })
  console.log(tag, opened, JSON.stringify(info))
  if(info.found){
    await p.evaluate(()=>document.querySelector('#m-layers')?.scrollIntoView())
    await p.waitForTimeout(1200)
    await p.screenshot({path:`${OUT}/${tag}-layers.png`})
    await p.evaluate(()=>document.querySelector('#m-duel')?.scrollIntoView())
    await p.waitForTimeout(1200)
    await p.screenshot({path:`${OUT}/${tag}-duel.png`})
    await p.evaluate(()=>document.querySelector('#m-stagger')?.scrollIntoView())
    await p.waitForTimeout(1200)
    await p.screenshot({path:`${OUT}/${tag}-stagger.png`})
    await p.evaluate(()=>document.querySelector('#m-budget')?.scrollIntoView())
    await p.waitForTimeout(800)
    await p.screenshot({path:`${OUT}/${tag}-budget.png`})
    // sticky-проверка форматов
    const sticky = await p.evaluate(()=>{
      const s=document.querySelector('#m-formats'); if(!s) return null
      const inner=s.firstElementChild
      return getComputedStyle(inner).position
    })
    console.log(tag,'formats sticky =',sticky)
  }
  await ctx.close()
}
console.log('ERRORS:', errs.length?errs.slice(0,10):'none')
await b.close()
