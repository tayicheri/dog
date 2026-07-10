import type { NextFunction, Request, Response } from 'express'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  if (res.headersSent) return

  const message = err instanceof Error ? err.message : 'Erreur interne'
  res.status(500).json({ error: message })
}
