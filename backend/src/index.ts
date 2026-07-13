import cors from 'cors'
import express from 'express'
import path from 'node:path'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { adminRouter } from './routes/admin.js'
import { contactRouter } from './routes/contact.js'
import { contentRouter } from './routes/content.js'
import { bootstrap } from './services/storage.js'
import { syncLocalImages } from './services/localImages.js'

await bootstrap()
await syncLocalImages()

const app = express()

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.use('/uploads', express.static(env.uploadsDir))
app.use('/api', contentRouter)
app.use('/api', contactRouter)
app.use('/api/admin', adminRouter)

app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`[api] Écoute sur le port ${env.port}`)
  console.log(`[api] Données : ${path.resolve(env.dataDir)}`)
})
