import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET all kegiatan
export async function GET() {
  const kegiatan = await prisma.kegiatan.findMany({
    orderBy: { tanggal: 'desc' },
    include: { foto: true },
  })
  return NextResponse.json(kegiatan)
}

// POST create kegiatan
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { judul, tanggal, deskripsi, kategori } = body

  if (!judul || !tanggal || !deskripsi || !kategori) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
  }

  const kegiatan = await prisma.kegiatan.create({
    data: {
      judul,
      tanggal: new Date(tanggal),
      deskripsi,
      kategori,
    },
  })

  return NextResponse.json(kegiatan, { status: 201 })
}
