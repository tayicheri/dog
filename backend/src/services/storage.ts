import fs from 'node:fs/promises'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { defaultSiteContent } from './defaults.js'
import type { AuthData, SiteContent, SmtpConfig } from '../types.js'

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

function sitePath() {
  return path.join(env.dataDir, 'site.json')
}

function authPath() {
  return path.join(env.dataDir, 'auth.json')
}

function smtpPath() {
  return path.join(env.dataDir, 'smtp.json')
}

export async function bootstrap() {
  await ensureDir(env.dataDir)
  await ensureDir(env.uploadsDir)

  const siteFile = sitePath()
  try {
    await fs.access(siteFile)
  } catch {
    await fs.writeFile(siteFile, JSON.stringify(defaultSiteContent(), null, 2), 'utf-8')
    console.log('[bootstrap] site.json créé avec le contenu par défaut')
  }

  const authFile = authPath()
  try {
    await fs.access(authFile)
  } catch {
    const passwordHash = await bcrypt.hash(env.adminPassword, 12)
    const auth: AuthData = {
      username: env.adminUsername,
      passwordHash,
    }
    await fs.writeFile(authFile, JSON.stringify(auth, null, 2), 'utf-8')
    console.log(
      `[bootstrap] Compte admin initial créé (${env.adminUsername}) — changez le mot de passe après la première connexion`,
    )
  }
}

export async function readSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(sitePath(), 'utf-8')
  const parsed = JSON.parse(raw) as Partial<SiteContent>
  const defaults = defaultSiteContent()
  const sections: Partial<SiteContent['sections']> = parsed.sections ?? {}

  return {
    seo: { ...defaults.seo, ...parsed.seo },
    business: { ...defaults.business, ...parsed.business },
    sections: {
      hero: { ...defaults.sections.hero, ...sections.hero },
      services: Array.isArray(sections.services) ? sections.services : defaults.sections.services,
      about: { ...defaults.sections.about, ...sections.about },
      contact: { ...defaults.sections.contact, ...sections.contact },
      portfolio: Array.isArray(sections.portfolio) ? sections.portfolio : defaults.sections.portfolio,
      social: { ...defaults.sections.social, ...sections.social },
    },
  }
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  const target = sitePath()
  const tmp = `${target}.tmp`
  await fs.writeFile(tmp, JSON.stringify(content, null, 2), 'utf-8')
  await fs.rename(tmp, target)
}

export async function readAuth(): Promise<AuthData> {
  const raw = await fs.readFile(authPath(), 'utf-8')
  return JSON.parse(raw) as AuthData
}

export async function writeAuth(auth: AuthData): Promise<void> {
  const tmp = `${authPath()}.tmp`
  await fs.writeFile(tmp, JSON.stringify(auth, null, 2), 'utf-8')
  await fs.rename(tmp, authPath())
}

export async function readSmtpConfig(): Promise<SmtpConfig | null> {
  try {
    const raw = await fs.readFile(smtpPath(), 'utf-8')
    return JSON.parse(raw) as SmtpConfig
  } catch {
    return null
  }
}

export async function writeSmtpConfig(config: SmtpConfig): Promise<void> {
  const target = smtpPath()
  const tmp = `${target}.tmp`
  await fs.writeFile(tmp, JSON.stringify(config, null, 2), 'utf-8')
  await fs.rename(tmp, target)
}
