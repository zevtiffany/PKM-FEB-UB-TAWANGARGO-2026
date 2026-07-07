import { NextRequest, NextResponse } from 'next/server'
import { db, bucket, COLLECTIONS } from '@/lib/firebase'
import { getSession } from '@/lib/auth'

type Params = { params: { id: string } }

// GET single kegiatan
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const doc = await db.collection(COLLECTIONS.KEGIATAN).doc(params.id).get()
    if (!doc.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Ambil subcollection foto
    const fotoSnapshot = await db
      .collection(COLLECTIONS.KEGIATAN)
      .doc(params.id)
      .collection(COLLECTIONS.FOTO)
      .get()

    const foto = fotoSnapshot.docs.map((f) => ({ id: f.id, ...f.data() }))

    return NextResponse.json({ id: doc.id, ...doc.data(), foto })
  } catch (error) {
    console.error('GET kegiatan/[id] error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// PUT update kegiatan
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { judul, tanggal, deskripsi, kategori } = body

    const data = {
      judul,
      tanggal,
      deskripsi,
      kategori,
      updatedAt: new Date().toISOString(),
    }

    await db.collection(COLLECTIONS.KEGIATAN).doc(params.id).update(data)
    return NextResponse.json({ id: params.id, ...data })
  } catch (error) {
    console.error('PUT kegiatan/[id] error:', error)
    return NextResponse.json({ error: 'Gagal mengupdate data' }, { status: 500 })
  }
}

// DELETE kegiatan + semua foto dari Storage
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const kegiatanId = params.id

    // Ambil semua foto dari subcollection
    const fotoSnapshot = await db
      .collection(COLLECTIONS.KEGIATAN)
      .doc(kegiatanId)
      .collection(COLLECTIONS.FOTO)
      .get()

    // Hapus file dari Firebase Storage + dokumen foto
    await Promise.all(
      fotoSnapshot.docs.map(async (fotoDoc) => {
        const fotoData = fotoDoc.data()
        if (fotoData.storagePath) {
          try {
            await bucket.file(fotoData.storagePath).delete()
          } catch {
            // Lanjutkan meski file tidak ada
          }
        }
        await fotoDoc.ref.delete()
      })
    )

    // Hapus dokumen kegiatan
    await db.collection(COLLECTIONS.KEGIATAN).doc(kegiatanId).delete()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE kegiatan/[id] error:', error)
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 })
  }
}
