import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string }
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const payload = verifyAccessToken(token)

  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }

  req.user = payload
  next()
}

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (token) {
    const payload = verifyAccessToken(token)
    if (payload) {
      req.user = payload
    }
  }

  next()
}
