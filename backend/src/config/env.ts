import path from 'node:path'
import { config } from 'dotenv'

config()

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`)
  }
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 8080),
  jwtSecret: required('JWT_SECRET', 'dev-secret-change-me'),
  adminUsername: process.env.ADMIN_USERNAME ?? 'admin',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'changeme',
  dataDir: path.resolve(process.env.DATA_DIR ?? './data'),
  uploadsDir: path.resolve(process.env.UPLOADS_DIR ?? './uploads'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.MAIL_FROM ?? 'noreply@example.com',
    to: process.env.MAIL_TO ?? 'contact@example.com',
  },
}
