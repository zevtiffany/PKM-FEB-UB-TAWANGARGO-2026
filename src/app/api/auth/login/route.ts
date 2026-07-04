import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const validUsername = process.env.ADMIN_USERNAME
  const validPassword = process.env.ADMIN_PASSWORD

  if (!validUsername || !validPassword) {
    return NextResponse.json(
      { error: 'Konfigurasi server belum lengkap' },
      { status: 500 }
    )
  }

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json(
      { error: 'Username atau password salah' },
      { status: 401 }
    )
  }

  await createSession({ isLoggedIn: true, username })
  return NextResponse.json({ ok: true })
}
