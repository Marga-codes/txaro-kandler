// Pre-Flight Check mecanico del skill de diseno. Comprueba las reglas que se
// pueden medir en el DOM: contraste, jerarquia, tells de IA, diales.
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const server = await preview({ preview: { port: 4322, strictPort: true } })
const base = server.resolvedUrls.local[0]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const fallos = []
page.on('response', res => {
  if (res.status() >= 400) fallos.push({ status: res.status(), url: res.url() })
})
page.on('requestfailed', req =>
  fallos.push({ status: 'FAILED', url: req.url(), error: req.failure()?.errorText })
)
const consola = []
page.on('console', m => {
  if (m.type() === 'error') consola.push(m.text().slice(0, 160))
})
page.on('pageerror', e => consola.push('pageerror: ' + String(e).slice(0, 160)))

await page.goto(base, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

// recorre la pagina para disparar las imagenes lazy
await page.evaluate(async () => {
  const paso = window.innerHeight * 0.7
  for (let y = 0; y < document.body.scrollHeight; y += paso) {
    window.scrollTo(0, y)
    await new Promise(r => setTimeout(r, 150))
  }
})

// espera a que todas carguen ANTES de volver arriba: si se vuelve al inicio
// antes, Chrome cancela las peticiones lazy que aun estan en vuelo.
await page
  .waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0), null, {
    timeout: 20000,
  })
  .catch(() => {})

await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(600)
const r = await page.evaluate(() => {
  // ---- utilidades de color ----
  const parse = c => {
    const m = c.match(/[\d.]+/g)
    return m ? m.slice(0, 3).map(Number) : [0, 0, 0]
  }
  const lum = ([r, g, b]) => {
    const f = v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (fg, bg) => {
    const a = lum(parse(fg))
    const b = lum(parse(bg))
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
  }
  const bgOf = el => {
    let n = el
    while (n) {
      const bg = getComputedStyle(n).backgroundColor
      if (bg && !/rgba?\(0, 0, 0, 0\)|transparent/.test(bg)) return bg
      n = n.parentElement
    }
    return 'rgb(250,250,248)'
  }

  const $ = s => document.querySelector(s)
  const $$ = s => [...document.querySelectorAll(s)]
  const cs = el => getComputedStyle(el)

  // ---- Hero ----
  const hero = $('.hero')
  const h1 = $('h1')
  const cta = $('.hero-cta')
  const sub = $('.hero-sub')
  const h1Rect = h1.getBoundingClientRect()
  const ctaRect = cta.getBoundingClientRect()
  const heroCS = cs(hero)
  const heroInner = $('.hero-inner')
  const innerTop = parseFloat(cs(heroInner).paddingTop)
  const h1Lines = Math.round(h1Rect.height / parseFloat(cs(h1).lineHeight))
  const subWords = sub.innerText.trim().split(/\s+/).length
  const heroTextEls = [...hero.querySelectorAll('p, h1, a, span')].filter(
    el => (el.innerText||'').trim() && el.offsetParent !== null
  )

  // ---- Eyebrows: solo micro-etiquetas EN SEGUNDO LUGAR (inmediatamente encima de un titular).
  // Regla: max 1 eyebrow por cada 3 secciones; el hero cuenta como seccion.
  const esMicro = el => {
    if (el.children.length) return false
    const txt = (el.innerText || '').trim()
    if (!txt || txt.length > 40) return false
    const s = cs(el)
    return (
      s.textTransform === 'uppercase' &&
      parseFloat(s.letterSpacing) >= 0.1 &&
      parseFloat(s.fontSize) <= 13
    )
  }
  const siguienteTitular = el => {
    const r = el.getBoundingClientRect()
    const h = $$('h1, h2, h3, h4').find(x => {
      const t = x.getBoundingClientRect()
      return t.top >= r.bottom - 1 && t.left <= r.right + 40 && t.right >= r.left - 40
    })
    // distancia vertical razonable para "inmediatamente encima"
    if (!h) return null
    return h.getBoundingClientRect().top - r.bottom <= 48 ? h : null
  }
  const eyebrows = $$('#top *, section *')
    .filter(esMicro)
    .map(el => ({ el, h: siguienteTitular(el) }))
    .filter(x => x.h)
    .map(x => ({
      texto: (x.el.innerText || '').trim(),
      clase: x.el.className || x.el.tagName,
      titular: (x.h.innerText || '').trim().slice(0, 40),
      seccion: (x.el.closest('section[id]') || { id: 'top' }).id,
    }))


  // ---- Secciones centradas ----
  const secciones = $$('section[id]').map(s => {
    const head = s.querySelector('.section-title')
  return {
      id: s.id,
      centrado: head ? cs(head).textAlign === 'center' : false,
      layout: s.className,
    }
  })

  // ---- Radios usados (shape consistency lock) ----
  const radios = new Set()
  $$('*').forEach(el => {
    const r = cs(el).borderRadius
    if (r && r !== '0px') radios.add(r)
  })

  // ---- Acentos usados (color consistency lock) ----
  const acentos = new Set()
  $$('*').forEach(el => {
    const s = cs(el)
    const c = s.color
    if (/rgb\(139, 34, 82\)|rgb\(184, 148, 95\)|rgb\(109, 26, 65\)/.test(c)) acentos.add(c)
  })

  // ---- Botones y campos ----
  const botones = $$('.hero-cta, .form-submit').map(el => ({
    texto: (el.innerText||'').trim(),
    contraste: +ratio(cs(el).color, bgOf(el)).toFixed(2),
    lineas: (() => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const range = document.createRange()
      let lineas = 1
      let n
      while ((n = walker.nextNode())) {
        if (!n.nodeValue.trim()) continue
        range.selectNodeContents(n)
        const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0)
        // fusiona rects en la misma linea por su top
        const tops = new Set(rects.map(r => Math.round(r.top)))
        lineas = Math.max(lineas, tops.size)
      }
      return lineas
    })(),
  }))

  const placeholders = ['#757570'].map(c => +ratio(c, bgOf($('input[name="name"]'))).toFixed(2))
  const labelColor = cs($('label[for="name"]')).color
  const labelContraste = +ratio(labelColor, bgOf($('label[for="name"]'))).toFixed(2)

  // ---- Tells ----
  const bodyText = document.body.innerText
  const tells = {
    emDash: (bodyText.match(/[\u2014\u2013]/g) || []).length,
    lorem: /lorem ipsum/i.test(bodyText),
    scrollCue: /\bscroll\b|\u2193|desliza/i.test(bodyText),
    numeroPagina: $$('.pub-tag, .g-tag, [class*="tag"]').length,
    puntosMedios: (bodyText.match(/\u00b7/g) || []).length,
    pillsSobreFoto: $$('img ~ span[class*="tag"], figure span[class*="cap"]').length,
    faviconInline:
      (document.querySelector('link[rel="icon"]')?.getAttribute('href') || '').startsWith(
        'data:image/svg'
      ),
  }

  return {
    hero: {
      minHeight: heroCS.minHeight,
      h1Lineas: h1Lines,
      h1Palabras: h1.innerText.trim().split(/\s+/).length,
      subPalabras: subWords,
      ctaVisibleSinScroll: ctaRect.bottom < window.innerHeight,
      ctaBottom: Math.round(ctaRect.bottom),
      paddingTopHero: Math.round(innerTop),
      elementosTexto: heroTextEls.length,
      elementos: heroTextEls.map(e => ((e.innerText || '') + '').slice(0, 40)),
    },
    eyebrows: {
      total: eyebrows.length,
      presupuesto: Math.ceil($$('section[id]').length / 3),
      textos: eyebrows.map(e => `${e.seccion}: ${e.texto}`),
    },
    secciones,
    radios: [...radios],
    acentos: [...acentos],
    botones,
    form: { placeholderContraste: placeholders, labelContraste: labelContraste },
    tells,
    h1Count: $$('h1').length,
    navAltura: Math.round($('.nav').getBoundingClientRect().height),
    imgs: {
      total: $$('img').length,
      rotas: $$('img')
        .filter(i => !(i.complete && i.naturalWidth > 0))
        .map(i => (i.currentSrc || i.src || '').split('/').slice(-2).join('/')),
      sinAlt: $$('img').filter(i => !i.getAttribute('alt')).length,
      sinDimension: $$('img').filter(
        i => !i.getAttribute('width') || !i.getAttribute('height')
      ).length,
    },
  }
})

r.fallosHttp = fallos
r.erroresConsola = consola
await browser.close()
await server.close()
console.log(JSON.stringify(r, null, 2))