import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

mkdirSync('capturas', { recursive: true })

async function snap(label, url) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const problems = []
  page.on('console', m => { if (m.type() === 'error') problems.push(m.text()) })
  page.on('requestfailed', r => problems.push('REQFAIL ' + r.url()))
  page.on('pageerror', e => problems.push('PAGEERROR ' + e.message))
  page.setDefaultTimeout(25000)
  await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(1500)

  await page.evaluate(async () => {
    const d = ms => new Promise(r => setTimeout(r, ms))
    let y = 0
    while (y < document.body.scrollHeight) {
      y += 700
      window.scrollTo(0, y)
      await d(90)
    }
    window.scrollTo(0, document.body.scrollHeight)
    await d(500)
  })

  const snapshot = await page.evaluate(() => {
    const norm = s => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
    const lines = Array.from(
      new Set(document.body.innerText.split('\n').map(l => norm(l)).filter(Boolean))
    )
    return {
      lines,
      images: Array.from(document.querySelectorAll('img')).map(i => ({
        src: i.getAttribute('src') || i.currentSrc || '',
        ok: i.complete && i.naturalWidth > 0,
      })),
      sig: Array.from(document.querySelectorAll('h1,h2,h3,section,.section-label,.g-tag,.credits-group-label')).map(
        e => e.tagName + '.' + (e.className && String(e.className)) + '::' + norm(e.textContent).slice(0, 60)
      ),
      videoCount: document.querySelectorAll('video').length,
      iframeCount: document.querySelectorAll('iframe').length,
    }
  })
  await page.screenshot({ path: `capturas/${label}.png`, fullPage: true })
  await browser.close()
  return { label, problems, ...snapshot }
}

const [orig, react] = await Promise.all([
  snap('original', process.argv[2]),
  snap('react', process.argv[3]),
])

const soloOriginal = orig.lines.filter(l => !react.lines.includes(l))
const soloReact = react.lines.filter(l => !orig.lines.includes(l))

console.log('=== LINEAS SOLO EN ORIGINAL ===')
console.log(soloOriginal.join('\n') || '(ninguna)')
console.log('=== LINEAS SOLO EN REACT ===')
console.log(soloReact.join('\n') || '(ninguna)')
console.log('=== IMAGENES ORIGINAL ===')
console.log(orig.images.map(i => (i.ok ? 'OK ' : 'FALLA ') + i.src).join('\n'))
console.log('=== IMAGENES REACT ===')
console.log(react.images.map(i => (i.ok ? 'OK ' : 'FALLA ') + i.src).join('\n'))
console.log('=== PROBLEMAS ORIGINAL ===')
console.log(orig.problems.join('\n') || '(ninguno)')
console.log('=== PROBLEMAS REACT ===')
console.log(react.problems.filter(p => !/\.mp4/.test(p)).join('\n') || '(ninguno)')
console.log('=== FIRMA DOM original ===')
console.log(orig.sig.join('\n'))
console.log('=== FIRMA DOM react ===')
console.log(react.sig.join('\n'))
console.log('resumen:', JSON.stringify({
  lineasOriginal: orig.lines.length,
  lineasReact: react.lines.length,
  soloOriginal: soloOriginal.length,
  soloReact: soloReact.length,
  imgsOrigOK: orig.images.filter(i => i.ok).length + '/' + orig.images.length,
  imgsReactOK: react.images.filter(i => i.ok).length + '/' + react.images.length,
  videos: [orig.videoCount, react.videoCount],
  iframes: [orig.iframeCount, react.iframeCount],
}))