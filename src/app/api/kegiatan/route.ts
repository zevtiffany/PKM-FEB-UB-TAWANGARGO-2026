import { NextRequest, NextResponse } from 'next/server'
import { db, COLLECTIONS } from '@/lib/firebase'
import { getSession } from '@/lib/auth'

// GET all kegiatan
export async function GET() {
  try {
    const snapshot = await db
      .collection(COLLECTIONS.KEGIATAN)
      .orderBy('tanggal', 'desc')
      .get()

    const kegiatan = await Promise.all(
      snapshot.docs.map(async (doc) => {
        // Ambil subcollection foto
        const fotoSnapshot = await db
          .collection(COLLECTIONS.KEGIATAN)
          .doc(doc.id)
          .collection(COLLECTIONS.FOTO)
          .get()

        const foto = fotoSnapshot.docs.map((f) => ({ id: f.id, ...f.data() }))

        return { id: doc.id, ...doc.data(), foto }
      })
    )

    return NextResponse.json(kegiatan)
  } catch (error) {
    console.error('GET kegiatan error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// POST create kegiatan
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { judul, tanggal, deskripsi, kategori } = body

    if (!judul || !tanggal || !deskripsi || !kategori) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    const data = {
      judul,
      tanggal,
      deskripsi,
      kategori,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const ref = await db.collection(COLLECTIONS.KEGIATAN).add(data)
    return NextResponse.json({ id: ref.id, ...data }, { status: 201 })
  } catch (error) {
    console.error('POST kegiatan error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  }
}
