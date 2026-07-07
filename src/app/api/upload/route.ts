import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { supabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase'

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

  const savedFotos = []

  for (const file of files) {
    if (!file.type.startsWith('image/')) continue

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const storagePath = `kegiatan/${kegiatanId}/${filename}`

    // Upload ke Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      continue
    }

    // Ambil public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    const foto = await prisma.foto.create({
      data: {
        url: urlData.publicUrl,
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

  // Hapus dari Supabase Storage
  try {
    const supabaseUrl = process.env.SUPABASE_URL!
    const bucketPublicPrefix = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`
    if (foto.url.startsWith(bucketPublicPrefix)) {
      const storagePath = foto.url.replace(bucketPublicPrefix, '')
      await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([storagePath])
    }
  } catch (e) {
    console.error('Delete storage error:', e)
  }

  await prisma.foto.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
