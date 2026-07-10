import { Router } from 'express'
import { z } from 'zod'
import { sendContactEmail } from '../services/mail.js'

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().min(10).max(5000),
})

export const contactRouter = Router()

contactRouter.post('/contact', async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Données invalides', details: parsed.error.flatten() })
      return
    }

    const result = await sendContactEmail(parsed.data)
    res.json({ ok: true, ...result })
  } catch (err) {
    next(err)
  }
})
