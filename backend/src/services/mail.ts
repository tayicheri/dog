import nodemailer from 'nodemailer'
import { env } from '../config/env.js'
import { readSmtpConfig } from './storage.js'
import type { ContactPayload } from '../types.js'

interface ResolvedSmtp {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
  to: string
}

async function resolveSmtpConfig(): Promise<ResolvedSmtp | null> {
  const stored = await readSmtpConfig()
  if (stored?.email && stored.password) {
    return {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      user: stored.email,
      pass: stored.password,
      from: stored.email,
      to: stored.email,
    }
  }

  if (env.smtp.host && env.smtp.user && env.smtp.pass) {
    return {
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      user: env.smtp.user,
      pass: env.smtp.pass,
      from: env.smtp.from,
      to: env.smtp.to,
    }
  }

  return null
}

export async function sendContactEmail(payload: ContactPayload) {
  const smtp = await resolveSmtpConfig()
  if (!smtp) {
    console.warn('[mail] SMTP non configuré — message non envoyé :', payload)
    return { simulated: true as const }
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  })

  await transporter.sendMail({
    from: smtp.from,
    to: smtp.to,
    replyTo: payload.email,
    subject: `[Contact] ${payload.name}`,
    text: [
      `Nom : ${payload.name}`,
      `Email : ${payload.email}`,
      payload.phone ? `Téléphone : ${payload.phone}` : '',
      '',
      payload.message,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  return { simulated: false as const }
}
