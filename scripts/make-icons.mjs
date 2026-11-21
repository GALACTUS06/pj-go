/** Rasterize public/icons/icon.svg → icon-192.png / icon-512.png */
import sharp from 'sharp'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const icons = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')

for (const size of [192, 512]) {
  await sharp(join(icons, 'icon.svg'), { density: 300 })
    .resize(size, size)
    .png()
    .toFile(join(icons, `icon-${size}.png`))
  console.log(`icon-${size}.png`)
}
