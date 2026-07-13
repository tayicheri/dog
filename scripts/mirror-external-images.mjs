#!/usr/bin/env node
/**
 * Télécharge les images externes (Stitch/Google) vers backend/assets/images/
 * et génère manifest.json (url → /uploads/...).
 *
 * Usage :
 *   node scripts/mirror-external-images.mjs
 *   node scripts/mirror-external-images.mjs --patch-site-json
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const assetsDir = path.join(root, 'backend/assets/images')
const uploadsDir = path.join(root, 'backend/uploads')
const siteJsonPath = path.join(root, 'backend/data/site.json')
const manifestPath = path.join(assetsDir, 'manifest.json')

/** @type {{ file: string, url: string }[]} */
const IMAGES = [
  {
    file: 'hero.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDShfwN8z5YQJQv9gHjBzkcB63QyxGAMkcuzN0hQAaNZ9Z9l43EhiE_NbbzRu2kmbHp6Y_m_ji4iY65gHRcsJjp9q1iTqvv4SRGbJPNWuz4JQwX8FYt3f5UBupE4zIPWk44Nj0vckCPqeB_KSTqJoGLbWICyB_tB-oF5vswYwJYfY--CuC0TGxDHmgHThfParbACeQnHpadVqjBUQzSaMIVHxqOUJk_USR0wzAVGkU9GsIFy13wsf8vza5Iccp-rk3XpWyky8c0leGW',
  },
  {
    file: 'portfolio-01.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh9cPElnTmvty1ykclCwt7xunm02X8Cq-2iJ6RYPWOisgLRk3D9nozPMhyd5_krWJ4wIznM3rH7159VB5EjlKVDrJ1K7RToW7kbWUUcoNeplb9vGUIvthLgK-sIiSf6WtOFUtXzagJeqmIDKEhO8clV0kRWSXE_EOEepvOydvz5fm1ImffXqhqg49n94EF1Y7GqBtSp6PLGKcSkuvpQTVOC8ry4z39sLV0Wo204Xe0CRsfb5CoIeXUBR4SAuFHS2Us55MuGwbnIQO5',
  },
  {
    file: 'portfolio-02.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvGZMbpzP-dGP0DgVlVHtOvBEdK5jBuIxk3obNY22rf1Wfzt51ycRji1IC8n4rP4jeULpFnNohLt02NPSBfuSGPvOpvE7PHHBnHrlCF8snwdnU5ippR5I67cwHsXkxSjGTBh0m35AFIyEryQQtjck36QSu2Rcn-svernxKZsPjovCjrWyoxGGaWfvgbZaaIA8A4XzZ6TOsKTRC1lXAn2RAF4ZH7UeSmA16XLIn6PVRZvoKU8HQS68rRc8FlYV9sQ-TN6040heYNxYS',
  },
  {
    file: 'portfolio-03.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj_8j05TEU9S4ZWFthrVPeH7Xlh1RR4K1ZdaYmu9r9dmERW_7RwIiXOvnR3E1lU71VNXBwv3SaedXTjhrtByat3YudJUDSwy6IRELRff7r4RL94U0k8PYVTJylvULvMmW64tNFP7pv-aHX8yEMfsOYhcjTz0rm_4xG58N9RgpIIrIKBgLuvk7ux3-DhQtvB0BSnx5rArUO5jNECKqX_hbv_McAw2oGK1rxYqeJ3sN2rrC4CnbZjkYCwgXVZI2R7sUCnLieCllKYrvx',
  },
  {
    file: 'social-youtube.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEOEzCMF2uBMwD8o1VVh7JZu-lRf3upqMnZQk35f90KeQuzcfuFbMVWd05rDcRO5TgcHT3nKsvVoJEAAaHEVS1tYGPOz14BVXlyAxqiC8ZFj5qKbwsKWJWBiFMOCSHSaK8RT3wFjvNP9E6OdXkuEZQRsqo4NdviFYzLAGS11wJxRJAIYz9C1n_bykQeUou4ljTurL2ORw9EJs97LpC4wdWm1p-mMXWFsNNDWQ3IqOiHwAfZYyCPNPRwpKo0yZMw1tZoJGxHSNXBqnk',
  },
  {
    file: 'social-tiktok.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMiTUmDwrO1lbdbCVPQDteHKKZ1xh-Yg5jB6dqWEOlZ2d-HnW2BCGSqPWjlFUKLhoFAYoOvIQlTcJlQs69NxbtaxBYtOMHMAA4-ERfT0OoPWoqicCF2IPYGCuNSMqLYLqpsFxciDrMaah384PC7ZWTWkRs2lU7h2tEd7uH1WtvXKPn2XsDQokPAusREVhgraz_CvncqNgVay9LArVAt3rkwfVfNDaQlJeJVt0I4iDEdy1JQqpgnfjq4EbZG0o20iYx1oi3W28a3ToX',
  },
]

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(dest, buf)
}

function buildManifest() {
  /** @type {Record<string, string>} */
  const map = {}
  for (const { file, url } of IMAGES) {
    map[url] = `/uploads/${file}`
  }
  return map
}

function patchValue(value, manifest) {
  if (typeof value === 'string' && manifest[value]) return manifest[value]
  if (typeof value === 'string' && value.startsWith('https://lh3.googleusercontent.com/')) {
    const hit = Object.entries(manifest).find(([url]) => value.startsWith(url.slice(0, 80)) || url === value)
    if (hit) return hit[1]
  }
  return value
}

function patchObject(obj, manifest) {
  if (Array.isArray(obj)) return obj.map((item) => patchObject(item, manifest))
  if (obj && typeof obj === 'object') {
    /** @type {Record<string, unknown>} */
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'image' || k === 'youtubeImage' || k === 'tiktokImage') {
        out[k] = typeof v === 'string' ? patchValue(v, manifest) : v
      } else {
        out[k] = patchObject(v, manifest)
      }
    }
    return out
  }
  return obj
}

async function main() {
  const patchSite = process.argv.includes('--patch-site-json')
  await fs.mkdir(assetsDir, { recursive: true })
  await fs.mkdir(uploadsDir, { recursive: true })

  const manifest = buildManifest()
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')

  for (const { file, url } of IMAGES) {
    const assetPath = path.join(assetsDir, file)
    const uploadPath = path.join(uploadsDir, file)
    console.log(`→ ${file}`)
    await download(url, assetPath)
    await fs.copyFile(assetPath, uploadPath)
  }

  console.log(`\n✅ ${IMAGES.length} images → backend/assets/images/ et backend/uploads/`)

  if (patchSite) {
    try {
      const raw = await fs.readFile(siteJsonPath, 'utf-8')
      const data = JSON.parse(raw)
      const patched = patchObject(data, manifest)
      await fs.writeFile(siteJsonPath, JSON.stringify(patched, null, 2), 'utf-8')
      console.log('✅ site.json patché')
    } catch (e) {
      console.warn('⚠ site.json non patché :', e instanceof Error ? e.message : e)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
