import { NextRequest, NextResponse } from 'next/server'
import { db, bucket, COLLECTIONS } from '@/lib/firebase'
import { getSession } from '@/lib/auth'

// POST: Upload foto untuk kegiatan
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const kegiatanId = formData.get('kegiatanId') as string
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

      // Upload ke Firebase Storage
      const fileRef = bucket.file(storagePath)
      await fileRef.save(buffer, {
        metadata: { contentType: file.type },
      })

      // Buat URL publik yang bisa diakses
      await fileRef.makePublic()
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`

      // Simpan ke subcollection foto di Firestore
      const fotoRef = await db
        .collection(COLLECTIONS.KEGIATAN)
        .doc(kegiatanId)
        .collection(COLLECTIONS.FOTO)
        .add({
          url: publicUrl,
          storagePath,
          keterangan: keterangan ?? null,
          kegiatanId,
          createdAt: new Date().toISOString(),
        })

      savedFotos.push({
        id: fotoRef.id,
        url: publicUrl,
        storagePath,
        keterangan: keterangan ?? null,
        kegiatanId,
      })
    }

    return NextResponse.json(savedFotos, { status: 201 })
  } catch (error) {
    console.error('POST upload error:', error)
    return NextResponse.json({ error: 'Gagal mengupload foto' }, { status: 500 })
  }
}

// DELETE: Hapus satu foto
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, kegiatanId } = await req.json()

    if (!id || !kegiatanId) {
      return NextResponse.json({ error: 'id dan kegiatanId wajib diisi' }, { status: 400 })
    }

    const fotoRef = db
      .collection(COLLECTIONS.KEGIATAN)
      .doc(kegiatanId)
      .collection(COLLECTIONS.FOTO)
      .doc(id)

    const fotoDoc = await fotoRef.get()
    if (!fotoDoc.exists) {
      return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 })
    }

    const fotoData = fotoDoc.data()!

    // Hapus file dari Firebase Storage
    if (fotoData.storagePath) {
      try {
        await bucket.file(fotoData.storagePath).delete()
      } catch {
        // Lanjutkan meski file tidak ada di storage
      }
    }

    // Hapus dokumen dari Firestore
    await fotoRef.delete()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE upload error:', error)
    return NextResponse.json({ error: 'Gagal menghapus foto' }, { status: 500 })
  }
}
