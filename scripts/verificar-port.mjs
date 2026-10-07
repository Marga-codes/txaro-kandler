import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:4173/txaro-kandler/'
mkdirSync('capturas', { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const problems = []
page.on('console', m => { if (m.type() === 'error') problems.push('CONSOLE: ' + m.text()) })
page.on('pageerror', e => problems.push('PAGEERROR: ' + e.message))
page.on('requestfailed', r => problems.push('REQFAIL: ' + r.url()))
page.on('response', r => { if (r.status() >= 400) problems.push('HTTP ' + r.status() + ': ' + r.url()) })

page.setDefaultTimeout(30000)
await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
await page.waitForFunction(() => document.querySelector('.nav-links'), null, { timeout: 30000 })
await page.waitForTimeout(1500)
console.log('title:', await page.title())

{ // scroll desde arriba hasta abajo para activar reveals y lazy-loading
  await page.evaluate(async () => {
    const delay = ms => new Promise(r => setTimeout(r, ms))
    let y = 0
    while (y < document.body.scrollHeight) {
      y += 700
      window.scrollTo(0, y)
      await delay(120)
    }
    window.scrollTo(0, document.body.scrollHeight)
    await delay(700)
  })
}

const stats = await page.evaluate(() => ({
  rooth: document.getElementById('root').children.length,
  texto: document.body.innerText.length,
  imgs: [...document.querySelectorAll('img')].map(i => [i.alt || '', i.complete && i.naturalWidth > 0]),
  vitegos: document.querySelectorAll('.g-item').length,
  tags: [...document.querySelectorAll('.g-tag')].map(t => t.textContent.trim()),
  caps: [...document.querySelectorAll('.g-cap')].map(c => c.textContent.trim()),
  gnote: !!document.querySelector('.g-note'),
  loremNodes: [...document.querySelectorAll('p')].filter(p => /Lorem ipsum/i.test(p.textContent)).length,
  visible: document.querySelectorAll('.reveal.visible').length,
  reveals: document.querySelectorAll('.reveal').length,
  pressCards: document.querySelectorAll('.press-card').length,
  creditsGroups: document.querySelectorAll('.credits-group').length,
  pubItems: document.querySelectorAll('.pub-item').length,
  contactLinks: document.querySelectorAll('.contact-link').length,
  navLinks: document.querySelectorAll('#nav-links a, #mobile-menu a').length,
  videocls: document.querySelectorAll('video').length,
  iframes: document.querySelectorAll('iframe').length,
}))
console.log(JSON.stringify(stats, null, 1))
const noCargadas = stats.imgs.filter(i => !i[1])
console.log('imgs:', stats.imgs.length, 'cargadas:', stats.imgs.length - noCargadas.length, 'fallidas:', noCargadas.length)
if (noCargadas.length) console.log('  ->', noCargadas)

{ // lightbox
  await page.locator('.g-item').nth(0).click()
  await page.waitForTimeout(400)
  const lb = await page.locator('.lightbox.open').count()
  const lbImg = await page.$eval('.lightbox-figure img', i => i.complete && i.naturalWidth > 0).catch(() => false)
  console.log('lightbox open:', lb > 0, '| img cargada:', lbImg)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
  console.log('lightbox cerrado:', (await page.locator('.lightbox.open').count()) === 0)
}

{ // menu movil
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('#nav-toggle').click()
  await page.waitForTimeout(400)
  const st = await page.evaluate(() => ({
    menuOpen: document.querySelector('#mobile-menu').classList.contains('open'),
    bodyLock: document.body.classList.contains('no-scroll'),
    aria: document.querySelector('#nav-toggle').getAttribute('aria-expanded'),
  }))
  console.log('menu movil:', JSON.stringify(st))
  await page.locator('#nav-toggle').click()
}

await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(400)
await page.screenshot({ path: 'capturas/port.png', fullPage: true })
console.log('screenshot: capturas/port.png')

const primero = stats.tags.sort()
const esperado = ['01', '02', '03', '04', '05', '06', '07', '08']
const fallos = []
const warnings = []
for (const tag of esperado) if (!primero.includes(tag)) fallos.push('falta g-tag ' + tag)
for (const p of problems) {
  if (/REQFAIL:.*\.mp4/.test(p)) warnings.push(p)
  else fallos.push(p)
}
if (stats.texto < 3000) fallos.push('poco texto: ' + stats.texto)
if (stats.vitegos !== 8) fallos.push('vitegos != 8')
if (stats.gnote !== true) fallos.push('sin .g-note')
if (stats.pressCards !== 5) fallos.push('pressCards != 5')
if (stats.creditsGroups !== 4) fallos.push('creditsGroups != 4')
if (stats.pubItems !== 6) fallos.push('pubItems != 6')
console.log(fallos.length ? 'FALLOS:\n' + fallos.join('\n') : 'TODO OK')
if (warnings.length) console.log('AVISOS (mp4 en headless):\n' + warnings.join('\n'))
await browser.close()
process.exit(fallos.length ? 1 : 0)