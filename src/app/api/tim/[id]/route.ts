import { NextRequest, NextResponse } from 'next/server'
import { db, bucket, COLLECTIONS } from '@/lib/firebase'
import { getSession } from '@/lib/auth'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = params.id
    const formData = await req.formData()
    const nama = formData.get('nama') as string
    const peran = formData.get('peran') as string
    const kontak = formData.get('kontak') as string | null
    const urutan = parseInt(formData.get('urutan') as string) || 0
    const fotoFile = formData.get('foto') as File | null

    const docRef = db.collection(COLLECTIONS.ANGGOTA).doc(id)
    const existing = await docRef.get()
    if (!existing.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const existingData = existing.data()!
    let fotoUrl = existingData.foto
    let storagePath = existingData.storagePath

    if (fotoFile && fotoFile.size > 0) {
      // Hapus foto lama dari Storage
      if (existingData.storagePath) {
        try {
          await bucket.file(existingData.storagePath).delete()
        } catch {
          // Lanjutkan meski gagal
        }
      }

      const buffer = Buffer.from(await fotoFile.arrayBuffer())
      const ext = fotoFile.name.split('.').pop() ?? 'jpg'
      const filename = `anggota-${Date.now()}.${ext}`
      storagePath = `anggota/${filename}`

      const fileRef = bucket.file(storagePath)
      await fileRef.save(buffer, {
        metadata: { contentType: fotoFile.type },
      })
      await fileRef.makePublic()
      fotoUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`
    }

    const data = {
      nama,
      peran,
      kontak: kontak || null,
      urutan,
      foto: fotoUrl,
      storagePath,
      updatedAt: new Date().toISOString(),
    }

    await docRef.update(data)
    return NextResponse.json({ id, ...data })
  } catch (error) {
    console.error('PUT tim/[id] error:', error)
    return NextResponse.json({ error: 'Gagal mengupdate data' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = params.id
    const docRef = db.collection(COLLECTIONS.ANGGOTA).doc(id)
    const existing = await docRef.get()
    if (!existing.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const existingData = existing.data()!

    // Hapus foto dari Firebase Storage
    if (existingData.storagePath) {
      try {
        await bucket.file(existingData.storagePath).delete()
      } catch {
        // Lanjutkan meski file tidak ada
      }
    }

    await docRef.delete()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE tim/[id] error:', error)
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 })
  }
}
