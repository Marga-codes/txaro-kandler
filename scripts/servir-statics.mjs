import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, sep } from 'node:path'

const root = normalize(process.argv[2])
const port = Number(process.argv[3])
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.json': 'application/json',
}
createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  const finalPath = urlPath.endsWith('/') ? urlPath + 'index.html' : urlPath
  const file = normalize(join(root, '.' + finalPath))
  if (!file.startsWith(root)) {
    res.statusCode = 403
    res.end('403')
    return
  }
  let data
  try {
    data = await readFile(file)
  } catch {
    res.statusCode = 404
    res.end('404')
    return
  }
  res.writeHead(200, {
    'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store',
  })
  res.end(data)
}).listen(port, () => console.log('statics sirviendo ' + root + ' en :' + port))