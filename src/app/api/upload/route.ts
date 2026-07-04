import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import path from 'path'
import fs from 'fs'

// POST: Upload foto untuk kegiatan
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const kegiatanId = parseInt(formData.get('kegiatanId') as string)
  const files = formData.getAll('foto') as File[]
  const keterangan = formData.get('keterangan') as string | null

  if (!kegiatanId || files.length === 0) {
    return NextResponse.json({ error: 'kegiatanId dan foto wajib diisi' }, { status: 400 })
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

  const savedFotos = []

  for (const file of files) {
    if (!file.type.startsWith('image/')) continue

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = path.join(uploadDir, filename)

    fs.writeFileSync(filePath, buffer)

    const foto = await prisma.foto.create({
      data: {
        url: `/uploads/${filename}`,
        keterangan: keterangan ?? null,
        kegiatanId,
      },
    })
    savedFotos.push(foto)
  }

  return NextResponse.json(savedFotos, { status: 201 })
}

// DELETE: Hapus satu foto
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  const foto = await prisma.foto.findUnique({ where: { id } })
  if (!foto) return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 })

  try {
    const filePath = path.join(process.cwd(), 'public', foto.url)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch {}

  await prisma.foto.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
