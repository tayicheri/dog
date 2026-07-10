#!/usr/bin/env node
/**
 * Récupère tous les écrans visibles du projet Stitch « dog ».
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const mcpPath = path.join(process.env.HOME || '', '.cursor/mcp.json')

const config = JSON.parse(fs.readFileSync(mcpPath, 'utf8'))
const apiKey = config?.mcpServers?.stitch?.headers?.['X-Goog-Api-Key']
if (!apiKey) {
  console.error('Clé Stitch introuvable dans ~/.cursor/mcp.json')
  process.exit(2)
}

async function callStitch(tool, args = {}) {
  const res = await fetch('https://stitch.googleapis.com/mcp', {
    method: 'POST',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: tool, arguments: args },
    }),
  })
  return JSON.parse(await res.text())
}

async function fetchScreen(projectId, screenId) {
  const attempts = [
    { name: `projects/${projectId}/screens/${screenId}` },
    { projectId, screenId },
  ]
  for (const args of attempts) {
    const res = await callStitch('get_screen', args)
    if (res?.result?.structuredContent?.htmlCode?.downloadUrl) {
      return res
    }
  }
  return null
}

const projectsRes = await callStitch('list_projects')
fs.writeFileSync(path.join(root, '.stitch-projects.json'), JSON.stringify(projectsRes, null, 2))

const projects = projectsRes?.result?.structuredContent?.projects ?? []
const dog = projects.find((p) => /^dog$/i.test((p.title || '').trim()))
if (!dog) {
  console.error('Projet dog introuvable.')
  process.exit(4)
}

const projectId = dog.name.split('/').pop()
const screens = dog.screenInstances?.filter((s) => s.type !== 'DESIGN_SYSTEM_INSTANCE' && !s.hidden) ?? []

console.log(`Projet dog (${projectId}) — ${screens.length} écran(s) visible(s)`)

let mainHtml = ''
for (const screen of screens) {
  const screenId = screen.sourceScreen?.split('/').pop() || screen.id
  const screenRes = await fetchScreen(projectId, screenId)
  if (!screenRes) {
    console.warn(`  ✗ ${screenId} — échec`)
    continue
  }
  const title = screenRes.result.structuredContent.title || screenId
  const htmlUrl = screenRes.result.structuredContent.htmlCode.downloadUrl
  const html = await (await fetch(htmlUrl)).text()

  if (screenId === '68b433006b5a4eaf9e1d4d3d98bb3206' || !mainHtml) {
    mainHtml = html
    fs.writeFileSync(path.join(root, '.stitch-screen.json'), JSON.stringify(screenRes, null, 2))
    fs.writeFileSync(path.join(root, '.stitch-source.html'), html)
    console.log(`  ✓ ${screenId} — ${title} (page principale, ${html.length} octets)`)
  } else if (screenId === 'b39960009fa8409595cfad6566c3f604') {
    fs.writeFileSync(path.join(root, '.stitch-modal.json'), JSON.stringify(screenRes, null, 2))
    fs.writeFileSync(path.join(root, '.stitch-modal.html'), html)
    console.log(`  ✓ ${screenId} — ${title} (modale, ${html.length} octets)`)
  } else {
    console.log(`  · ${screenId} — ${title} (${html.length} octets, non importé)`)
  }
}

const designMd = `# Design — dog (Stitch)

Source: \`projects/${projectId}\`

## Identité D.O.G.

- **Style** : Cyber gaming, fond \`#131318\`, accents cyan \`#00dbe9\` / violet \`#ebb2ff\`
- **Polices** : Sora + JetBrains Mono

## Écrans

${screens.map((s) => `- \`${(s.sourceScreen || s.id).split('/').pop()}\` (${s.width || '?'}×${s.height || '?'})`).join('\n')}

## Fichiers cache

- \`.stitch-source.html\` — page principale
- \`.stitch-modal.html\` — modale contact (si récupérée)
- \`.stitch-projects.json\`, \`.stitch-screen.json\`

Relancer : \`node scripts/fetch-stitch.mjs\`
`

fs.writeFileSync(path.join(root, 'DESIGN.md'), designMd)
console.log('DESIGN.md mis à jour')
