import sharp from 'sharp'
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const SRC_ROOT = 'assets-originales'
const SRC_DIRS = ['assets-originales/img', 'assets-originales/Txaro_Fotos']
const OUT_ROOT = 'public/media'

// Ancho maximo por rol de uso. Los carteles se muestran pequenos, asi que
// no tiene sentido emitir 1500px para una tarjeta de 380px de ancho.
const MAX_W = {
  poster: 900,
  press: 1600,
  gallery: 1600,
  hero: 2400,
}
const QUALITY = { webp: 78, avif: 62 }

const isRaster = f => /\.(jpe?g|png)$/i.test(f)
const isVideo = f => /\.(mp4|webm)$/i.test(f)

async function* walk(dir) {
  if (!existsSync(dir)) return
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

// Clasifica por nombre de archivo para elegir el ancho maximo adecuado.
function roleFor(file) {
  const f = file.toLowerCase()
  if (/poster|cartel/.test(f)) return 'poster'
  if (/hero/.test(f)) return 'hero'
  if (/press|prensa/.test(f)) return 'press'
  return 'gallery'
}

const manifest = {}
let beforeTotal = 0
let afterTotal = 0
const rows = []

for (const dir of SRC_DIRS) {
  for await (const file of walk(dir)) {
    const base = path.basename(file)
    if (isVideo(file)) {
      const s = await stat(file)
      beforeTotal += s.size
      rows.push({ file, kb: Math.round(s.size / 1024), note: 'video, sin recomprimir' })
      continue
    }
    if (!isRaster(file)) continue

// La salida replica la estructura de origen (img/ig-profile/x.webp,
// Txaro_Fotos/x.webp) para que las rutas del sitio sean predecibles.
const rel = path.relative(SRC_ROOT, file).replace(/\\/g, '/')
const stem = path.parse(base).name.replace(/[^a-zA-Z0-9_-]/g, '-')
const role = roleFor(base)
const outDir = path.join(OUT_ROOT, path.dirname(rel))
    await mkdir(outDir, { recursive: true })

    const img = sharp(file, { failOn: 'none' })
    const meta = await img.metadata()
    const src = await stat(file)
    beforeTotal += src.size

    const width = Math.min(meta.width ?? 0, MAX_W[role])
    const outName = `${stem}.webp`
    const outPath = path.join(outDir, outName)

    const pipeline = sharp(file, { failOn: 'none' }).rotate().resize({
      width,
      withoutEnlargement: true,
    })

    await pipeline.clone().webp({ quality: QUALITY.webp }).toFile(outPath)
    let out = await stat(outPath)

    // Los JPEG de origen ya vienen comprimidos y no ganan nada con WebP.
    // Si el peso sube, se emite JPEG y se sirve el original recomprimido.
    let finalPath = outPath
    if (out.size > src.size) {
      finalPath = path.join(outDir, `${stem}${path.extname(base).toLowerCase()}`)
      await pipeline
        .clone()
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(finalPath)
      out = await stat(finalPath)
    }

    const outMeta = await sharp(finalPath).metadata()
    afterTotal += out.size

    manifest[`/${path.relative('public', finalPath).replace(/\\/g, '/')}`] = {
      width: outMeta.width,
      height: outMeta.height,
      bytes: out.size,
      srcBytes: src.size,
      ext: path.extname(finalPath).slice(1),
    }

    rows.push({
      file: `public/${path.relative('public', file).replace(/\\/g, '/')}`,
      kb: Math.round(src.size / 1024),
      newKb: Math.round(out.size / 1024),
      dims: `${meta.width}x${meta.height}`,
      note: `${role} -> ${width}px`,
    })
  }
}

await mkdir(OUT_ROOT, { recursive: true })
await writeFile(
  'src/media-manifest.json',
  JSON.stringify(manifest, null, 2) + '\n'
)

rows.sort((a, b) => b.kb - a.kb)
console.log('--- mayor reduccion primero (imagenes) ---')
for (const r of rows.slice(0, 22)) {
  const pct = r.newKb ? `${Math.round((1 - r.newKb / r.kb) * 100)}% menos` : r.note
  console.log(
    `${String(r.kb).padStart(6)} KB  ${r.dims ?? ''}  ->  ${String(r.newKb ?? '-').padStart(5)} KB  ${pct}  ${r.file}`
  )
}
const mb = n => (n / 1024 / 1024).toFixed(1) + ' MB'
console.log(`\nTotal assets: ${mb(beforeTotal)} -> raster optimizado ${mb(afterTotal)}`)
console.log(`Imagenes en manifiesto: ${Object.keys(manifest).length}`)