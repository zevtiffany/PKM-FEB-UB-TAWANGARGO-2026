import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import path from 'path'
import fs from 'fs'

type Params = { params: { id: string } }

// GET single kegiatan
export async function GET(_req: NextRequest, { params }: Params) {
  const id = parseInt(params.id)
  const kegiatan = await prisma.kegiatan.findUnique({
    where: { id },
    include: { foto: true },
  })
  if (!kegiatan) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(kegiatan)
}

// PUT update kegiatan
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = parseInt(params.id)
  const body = await req.json()
  const { judul, tanggal, deskripsi, kategori } = body

  const kegiatan = await prisma.kegiatan.update({
    where: { id },
    data: {
      judul,
      tanggal: new Date(tanggal),
      deskripsi,
      kategori,
    },
  })
  return NextResponse.json(kegiatan)
}

// DELETE kegiatan + cascade photos
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = parseInt(params.id)

  // Get photos to delete files
  const fotos = await prisma.foto.findMany({ where: { kegiatanId: id } })
  for (const foto of fotos) {
    try {
      const filePath = path.join(process.cwd(), 'public', foto.url)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch {}
  }

  await prisma.kegiatan.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
