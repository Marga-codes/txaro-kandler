// Arranca el preview de Vite, captura la pagina a varios anchos, comprueba
// enlaces e imagenes rotas y cierra el servidor. Todo en un proceso para que
// el servidor no sobreviva al shell.
import { preview } from 'vite'
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const OUT = 'capturas'
await mkdir(OUT, { recursive: true })

const server = await preview({ preview: { port: 4321, strictPort: true } })
const base = server.resolvedUrls.local[0]
console.log('preview en', base)

const browser = await chromium.launch()
const problems = []

for (const [name, width, height] of [
  ['desktop', 1440, 900],
  ['tablet', 900, 1000],
  ['movil', 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } })

  page.on('console', m => {
    if (m.type() === 'error') problems.push(`[${name}] console: ${m.text()}`)
  })
  page.on('pageerror', e => problems.push(`[${name}] pageerror: ${e.message}`))
  page.on('response', r => {
    if (r.status() >= 400) problems.push(`[${name}] ${r.status()} ${r.url()}`)
  })

  await page.goto(base, { waitUntil: 'networkidle', timeout: 45000 })
  await page.waitForTimeout(1200)

  // Comprobar cada URL de imagen y video. Las lazy nunca se piden al cargar,
  // asi que un 404 pasaria desapercibido si solo miramos las respuestas.
  const rutas = await page.evaluate(() => {
    const pick = sel =>
      [...document.querySelectorAll(sel)].map(n => n.currentSrc || n.src || n.poster)
    return [...new Set([...pick('img'), ...pick('video')].filter(Boolean))]
  })
  for (const r of rutas) {
    const res = await page.request.head(r).catch(() => null)
    if (!res || res.status() >= 400) problems.push(`[${name}] ${res?.status()} ${r}`)
  }

  await page.screenshot({ path: `${OUT}/${name}-hero.png` })
  await page.screenshot({ path: `${OUT}/${name}-completo.png`, fullPage: true })

  // Auditar tells que el Pre-Flight Check prohibe.
  const audit = await page.evaluate(() => {
    const text = document.body.innerText
    const imgs = [...document.querySelectorAll('img')]
    return {
      emDash: (text.match(/[\u2014\u2013]/g) || []).length,
      lorem: /lorem ipsum/i.test(text),
      imgsSinDimension: imgs.filter(
        i => !i.getAttribute('width') || !i.getAttribute('height')
      ).map(i => i.currentSrc || i.src),
      imgsSinAlt: imgs.filter(i => !i.getAttribute('alt')).length,
      imgs: imgs.length,
      h1: document.querySelectorAll('h1').length,
      // Nav en una sola linea: los enlaces caben en la altura del nav.
      navAltura: document.querySelector('.nav')?.getBoundingClientRect().height,
      navUnaLinea: (() => {
        const links = [...document.querySelectorAll('.nav-links a')]
        if (links.length < 2) return true
        const top = links[0].getBoundingClientRect().top
        return links.every(l => Math.abs(l.getBoundingClientRect().top - top) < 2)
      })(),
      // Ningun listener de scroll registrado por la app.
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      secciones: [...document.querySelectorAll('section[id]')].map(s => s.id),
    }
  })

  console.log(`\n--- ${name} (${width}x${height}) ---`)
  console.log(JSON.stringify(audit, null, 2))

  // Lightbox: abrir con teclado y comprobar que funciona.
  if (name === 'desktop') {
    await page.locator('.gallery-button').first().focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(700)
    const abierto = await page.locator('.lightbox.is-open').count()
    console.log('lightbox abre con Enter:', abierto === 1)
    await page.screenshot({ path: `${OUT}/${name}-lightbox.png` })
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(500)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    console.log('lightbox cierra con Escape:', (await page.locator('.lightbox.is-open').count()) === 0)
  }

  await page.close()
}

await browser.close()
await server.close()

console.log('\n--- problemas ---')
if (problems.length === 0) console.log('ninguno')
else [...new Set(problems)].forEach(p => console.log(p))