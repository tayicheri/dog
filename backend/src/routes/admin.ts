import path from 'node:path'
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { z } from 'zod'
import { env } from '../config/env.js'
import { requireAuth } from '../middleware/auth.js'
import type { AuthRequest } from '../middleware/auth.js'
import { readAuth, readSiteContent, readSmtpConfig, writeAuth, writeSiteContent, writeSmtpConfig } from '../services/storage.js'
import type { SiteContent } from '../types.js'
import fs from 'node:fs/promises'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

const siteContentSchema: z.ZodType<SiteContent> = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
  }),
  business: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.string(),
    city: z.string(),
    hours: z.string(),
  }),
  sections: z.object({
    hero: z.object({
      badge: z.string(),
      title: z.string(),
      titleAccent: z.string(),
      subtitle: z.string(),
      ctaLabel: z.string(),
      secondaryCtaLabel: z.string(),
      image: z.string(),
      imageTag: z.string(),
    }),
    services: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      }),
    ),
    about: z.object({
      title: z.string(),
      body: z.string(),
      image: z.string(),
    }),
    contact: z.object({
      intro: z.string(),
      newsletterTitle: z.string(),
    }),
    portfolio: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        image: z.string(),
        tag: z.string(),
        badge: z.string(),
        badgeStyle: z.enum(['premium', 'fixed', 'pro']),
        buttonLabel: z.string(),
      }),
    ),
    social: z.object({
      title: z.string(),
      subtitle: z.string(),
      youtubeUrl: z.string(),
      tiktokUrl: z.string(),
    }),
  }),
  legal: z.object({
    terms: z.string(),
    privacy: z.string(),
  }),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

const gmailEmailSchema = z
  .string()
  .email()
  .refine((value) => value.toLowerCase().endsWith('@gmail.com'), {
    message: "L'adresse doit être un compte Gmail (@gmail.com)",
  })

const smtpUpdateSchema = z.object({
  email: gmailEmailSchema,
  password: z.string().min(1).optional(),
})

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, safe)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const ext = path.extname(file.originalname).toLowerCase()
    const isImageMime = typeof file.mimetype === 'string' && file.mimetype.startsWith('image/')
    if (!allowed.includes(ext)) {
      cb(new Error('Format non supporté'))
      return
    }
    if (!isImageMime) {
      cb(new Error('Type MIME non supporté'))
      return
    }
    cb(null, true)
  },
})

export const adminRouter = Router()

async function listReferencedUploads() {
  const content = await readSiteContent()
  const urls: string[] = []

  if (content.sections.hero.image) urls.push(content.sections.hero.image)
  if (content.sections.about.image) urls.push(content.sections.about.image)
  for (const item of content.sections.portfolio) {
    if (item.image) urls.push(item.image)
  }

  const filenames = new Set<string>()
  for (const url of urls) {
    if (!url.startsWith('/uploads/')) continue
    const name = url.slice('/uploads/'.length)
    if (name) filenames.add(name)
  }
  return filenames
}

adminRouter.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Identifiants requis' })
      return
    }

    const auth = await readAuth()
    if (parsed.data.username !== auth.username) {
      res.status(401).json({ error: 'Identifiants incorrects' })
      return
    }

    const valid = await bcrypt.compare(parsed.data.password, auth.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Identifiants incorrects' })
      return
    }

    const token = jwt.sign({ sub: auth.username, role: 'admin' }, env.jwtSecret, {
      expiresIn: '8h',
    })
    res.json({ token })
  } catch (err) {
    next(err)
  }
})

adminRouter.put('/content', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const parsed = siteContentSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Contenu invalide', details: parsed.error.flatten() })
      return
    }
    await writeSiteContent(parsed.data)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

adminRouter.post('/upload', requireAuth, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Fichier manquant' })
      return
    }
    const url = `/uploads/${req.file.filename}`
    res.json({ url })
  } catch (err) {
    next(err)
  }
})

adminRouter.get('/uploads/orphans', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const dryRun = String(req.query.dryRun ?? 'true') !== 'false'
    const referenced = await listReferencedUploads()

    const entries = await fs.readdir(env.uploadsDir, { withFileTypes: true })
    const files = entries.filter((e) => e.isFile()).map((e) => e.name)

    const orphans = files.filter((name) => !referenced.has(name))

    if (!dryRun) {
      await Promise.all(orphans.map((name) => fs.unlink(path.join(env.uploadsDir, name)).catch(() => {})))
    }

    res.json({ ok: true, dryRun, referencedCount: referenced.size, orphans })
  } catch (err) {
    next(err)
  }
})

adminRouter.put('/password', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const parsed = passwordSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Mot de passe invalide' })
      return
    }

    const auth = await readAuth()
    const valid = await bcrypt.compare(parsed.data.currentPassword, auth.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Mot de passe actuel incorrect' })
      return
    }

    auth.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12)
    await writeAuth(auth)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

adminRouter.get('/smtp', requireAuth, async (_req: AuthRequest, res, next) => {
  try {
    const config = await readSmtpConfig()
    if (!config) {
      res.json({ email: '', configured: false })
      return
    }
    res.json({ email: config.email, configured: true })
  } catch (err) {
    next(err)
  }
})

adminRouter.put('/smtp', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const parsed = smtpUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'Configuration SMTP invalide',
        details: parsed.error.flatten(),
      })
      return
    }

    const existing = await readSmtpConfig()
    const password = parsed.data.password ?? existing?.password

    if (!password) {
      res.status(400).json({ error: 'Mot de passe d\'application requis pour la première configuration' })
      return
    }

    await writeSmtpConfig({
      email: parsed.data.email.toLowerCase(),
      password,
      updatedAt: new Date().toISOString(),
    })

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})
