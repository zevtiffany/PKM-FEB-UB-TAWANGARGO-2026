import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import path from 'path'
import fs from 'fs'

// GET all anggota
export async function GET() {
  const anggota = await prisma.anggota.findMany({ orderBy: { urutan: 'asc' } })
  return NextResponse.json(anggota)
}

// POST create anggota
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const nama = formData.get('nama') as string
  const peran = formData.get('peran') as string
  const kontak = formData.get('kontak') as string | null
  const urutan = parseInt(formData.get('urutan') as string) || 0
  const fotoFile = formData.get('foto') as File | null

  if (!nama || !peran) {
    return NextResponse.json({ error: 'Nama dan peran wajib diisi' }, { status: 400 })
  }

  let fotoUrl: string | null = null

  if (fotoFile && fotoFile.size > 0) {
    const buffer = Buffer.from(await fotoFile.arrayBuffer())
    const ext = fotoFile.name.split('.').pop() ?? 'jpg'
    const filename = `anggota-${Date.now()}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
    fs.writeFileSync(path.join(uploadDir, filename), buffer)
    fotoUrl = `/uploads/${filename}`
  }

  const anggota = await prisma.anggota.create({
    data: { nama, peran, kontak: kontak || null, urutan, foto: fotoUrl },
  })

  return NextResponse.json(anggota, { status: 201 })
}
