import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { JwtPayload } from '../types.js'

export interface AuthRequest extends Request {
  admin?: JwtPayload
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Non authentifié' })
    return
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload
    if (payload.role !== 'admin') {
      res.status(403).json({ error: 'Accès refusé' })
      return
    }
    req.admin = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token invalide' })
  }
}
