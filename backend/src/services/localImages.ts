import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from '../config/env.js'
import type { SiteContent } from '../types.js'

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../assets/images')

function sitePath() {
  return path.join(env.dataDir, 'site.json')
}

function patchImageUrl(value: string, manifest: Record<string, string>): string {
  if (!value) return value
  if (manifest[value]) return manifest[value]
  if (value.startsWith('https://lh3.googleusercontent.com/')) {
    const entry = Object.entries(manifest).find(([url]) => url === value || value.startsWith(url.slice(0, 96)))
    if (entry) return entry[1]
  }
  return value
}

function patchContentImages(content: SiteContent, manifest: Record<string, string>): SiteContent {
  return {
    ...content,
    sections: {
      ...content.sections,
      hero: {
        ...content.sections.hero,
        image: patchImageUrl(content.sections.hero.image, manifest),
      },
      about: {
        ...content.sections.about,
        image: patchImageUrl(content.sections.about.image, manifest),
      },
      portfolio: content.sections.portfolio.map((item) => ({
        ...item,
        image: patchImageUrl(item.image, manifest),
      })),
      social: {
        ...content.sections.social,
        youtubeImage: patchImageUrl(content.sections.social.youtubeImage ?? '', manifest),
        tiktokImage: patchImageUrl(content.sections.social.tiktokImage ?? '', manifest),
      },
    },
  }
}

export async function syncLocalImages(): Promise<void> {
  const manifestPath = path.join(assetsDir, 'manifest.json')
  let manifest: Record<string, string> = {}
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8')) as Record<string, string>
  } catch {
    return
  }

  try {
    const files = await fs.readdir(assetsDir)
    for (const file of files) {
      if (file === 'manifest.json') continue
      const src = path.join(assetsDir, file)
      const dest = path.join(env.uploadsDir, file)
      try {
        await fs.access(dest)
      } catch {
        await fs.copyFile(src, dest)
        console.log(`[images] Copié ${file} → uploads/`)
      }
    }
  } catch {
    return
  }

  try {
    const raw = await fs.readFile(sitePath(), 'utf-8')
    const content = JSON.parse(raw) as SiteContent
    const patched = patchContentImages(content, manifest)
    if (JSON.stringify(content) !== JSON.stringify(patched)) {
      const tmp = `${sitePath()}.tmp`
      await fs.writeFile(tmp, JSON.stringify(patched, null, 2), 'utf-8')
      await fs.rename(tmp, sitePath())
      console.log('[images] site.json migré vers chemins /uploads/')
    }
  } catch {
    // site.json absent ou invalide — ignoré au bootstrap
  }
}
