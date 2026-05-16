import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const JWT_EXPIRY = '7d'

export interface JwtPayload {
  id: number
  email: string
  role?: string
}

export const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  })

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  })

  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload
  } catch {
    return null
  }
}
