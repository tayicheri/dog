import { Router } from 'express'
import { readSiteContent } from '../services/storage.js'

export const contentRouter = Router()

contentRouter.get('/content', async (_req, res, next) => {
  try {
    const content = await readSiteContent()
    res.json(content)
  } catch (err) {
    next(err)
  }
})

contentRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})
