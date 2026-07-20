import { chromium } from './node_modules/playwright-core/index.mjs'
const OUT='/private/tmp/claude-501/-Users-maximiliannovikov/1c0614f9-26b3-42cb-bc1a-9480433e253e/scratchpad'
const b = await chromium.launch()
const errs=[]
const ctx = await b.newContext({ viewport:{width:1440,height:900} })
const p = await ctx.newPage()
p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()) })
p.on('pageerror', e=>errs.push('PAGEERROR '+e.message))
await p.goto('http://localhost:4321/', { waitUntil:'load' })
await p.waitForTimeout(4000)
await p.evaluate(()=>document.querySelector('#price')?.scrollIntoView())
await p.waitForTimeout(1500)
const cards = p.locator('[role="button"]')
const n = await cards.count()
console.log('cards', n)
for(let i=0;i<n;i++){
  const txt=(await cards.nth(i).textContent())||''
  if(/моушн|motion/i.test(txt)){ await cards.nth(i).scrollIntoViewIfNeeded(); await cards.nth(i).click({force:true}); console.log('clicked',i); break }
}
await p.waitForTimeout(2500)
const found = await p.evaluate(()=>!!document.querySelector('[data-screen="motion"]'))
console.log('found', found)
if(found){
  const over = await p.evaluate(()=>({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth}))
  console.log('overflow', JSON.stringify(over))
  for(const id of ['m-duel','m-stagger','m-layers','m-budget','m-dope','m-deliverables']){
    await p.evaluate(x=>document.querySelector(x)?.scrollIntoView(), '#'+id)
    await p.waitForTimeout(1100)
    await p.screenshot({path:`${OUT}/d-${id}.png`})
  }
  // Скраб таймлайна: проверяем, что промежуточный кадр действительно промежуточный
  await p.evaluate(()=>document.querySelector('#m-layers')?.scrollIntoView())
  await p.waitForTimeout(900)
  const slider = p.locator('#m-layers input[type=range]')
  const read = () => p.evaluate(()=>{
    const s=document.querySelector('#m-layers')
    const card=[...s.querySelectorAll('div')].find(d=>/Карточка открылась/.test(d.textContent||'') && d.style.transform)
    const title=s.querySelector('span span span')
    return { cardOpacity: card?.style.opacity, cardTransform: card?.style.transform, label: s.querySelector('span[class*="tabular"]')?.textContent }
  })
  await slider.fill('0'); await p.waitForTimeout(200); console.log('t=0   ', JSON.stringify(await read()))
  await slider.fill('400'); await p.waitForTimeout(200); console.log('t=400 ', JSON.stringify(await read()))
  await slider.fill('1150'); await p.waitForTimeout(200); console.log('t=1150', JSON.stringify(await read()))
  await p.screenshot({path:`${OUT}/d-scrub-1150.png`})
  await slider.fill('400'); await p.waitForTimeout(300)
  await p.screenshot({path:`${OUT}/d-scrub-400.png`})
}
console.log('ERRORS:', errs.length?errs.slice(0,8):'none')
await b.close()
