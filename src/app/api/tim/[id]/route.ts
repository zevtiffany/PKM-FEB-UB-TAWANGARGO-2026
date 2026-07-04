import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import path from 'path'
import fs from 'fs'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = parseInt(params.id)
  const formData = await req.formData()
  const nama = formData.get('nama') as string
  const peran = formData.get('peran') as string
  const kontak = formData.get('kontak') as string | null
  const urutan = parseInt(formData.get('urutan') as string) || 0
  const fotoFile = formData.get('foto') as File | null

  const existing = await prisma.anggota.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let fotoUrl = existing.foto

  if (fotoFile && fotoFile.size > 0) {
    // Delete old file
    if (existing.foto) {
      try {
        const oldPath = path.join(process.cwd(), 'public', existing.foto)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      } catch {}
    }

    const buffer = Buffer.from(await fotoFile.arrayBuffer())
    const ext = fotoFile.name.split('.').pop() ?? 'jpg'
    const filename = `anggota-${Date.now()}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
    fs.writeFileSync(path.join(uploadDir, filename), buffer)
    fotoUrl = `/uploads/${filename}`
  }

  const anggota = await prisma.anggota.update({
    where: { id },
    data: { nama, peran, kontak: kontak || null, urutan, foto: fotoUrl },
  })

  return NextResponse.json(anggota)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = parseInt(params.id)
  const existing = await prisma.anggota.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (existing.foto) {
    try {
      const filePath = path.join(process.cwd(), 'public', existing.foto)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch {}
  }

  await prisma.anggota.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
