import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'kkn-admin-session'

export interface SessionData {
  isLoggedIn: boolean
  username: string
}

// Simple HMAC-based session (no external lib needed)
function base64url(str: string): string {
  return Buffer.from(str).toString('base64url')
}

function createToken(data: SessionData, secret: string): string {
  const payload = base64url(JSON.stringify(data))
  const sig = base64url(`${payload}.${secret}`)
  return `${payload}.${sig}`
}

function verifyToken(token: string, secret: string): SessionData | null {
  try {
    const [payload, sig] = token.split('.')
    const expectedSig = base64url(`${payload}.${secret}`)
    if (sig !== expectedSig) return null
    return JSON.parse(Buffer.from(payload, 'base64url').toString())
  } catch {
    return null
  }
}

export async function createSession(data: SessionData) {
  const secret = process.env.SESSION_SECRET!
  const token = createToken(data, secret)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: '/',
  })
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  const secret = process.env.SESSION_SECRET!
  return verifyToken(token, secret)
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export function getSessionFromRequest(req: NextRequest): SessionData | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  const secret = process.env.SESSION_SECRET!
  return verifyToken(token, secret)
}
