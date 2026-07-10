import nodemailer from 'nodemailer'
import { env } from '../config/env.js'
import type { ContactPayload } from '../types.js'

export async function sendContactEmail(payload: ContactPayload) {
  if (!env.smtp.host) {
    console.warn('[mail] SMTP non configuré — message non envoyé :', payload)
    return { simulated: true as const }
  }

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  })

  await transporter.sendMail({
    from: env.smtp.from,
    to: env.smtp.to,
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
