import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import logger from '../utils/logger'

export interface AdminRequest extends Request {
  admin?: {
    id: number
    email: string
    role: string
  }
}

export const adminMiddleware = (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authorization token provided',
      })
    }

    const token = authHeader.substring(7)
    const payload = verifyAccessToken(token)

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      })
    }

    if (payload.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
      })
    }

    req.admin = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch (error) {
    logger.error('Admin middleware error:', { error });
    res.status(401).json({
      success: false,
      error: 'Authentication failed',
    })
  }
}
