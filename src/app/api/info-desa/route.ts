import { NextRequest, NextResponse } from 'next/server'
import { db, COLLECTIONS } from '@/lib/firebase'
import { getSession } from '@/lib/auth'

const INFO_DOC_ID = 'main'

// GET info desa
export async function GET() {
  try {
    const doc = await db.collection(COLLECTIONS.INFO_DESA).doc(INFO_DOC_ID).get()
    if (!doc.exists) {
      return NextResponse.json(null)
    }
    return NextResponse.json({ id: doc.id, ...doc.data() })
  } catch (error) {
    console.error('GET info-desa error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// PUT update info desa
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const data = {
      nama: body.nama ?? 'Desa Tawangargo',
      kecamatan: body.kecamatan ?? 'Kecamatan Karangploso',
      kabupaten: body.kabupaten ?? 'Kabupaten Malang',
      deskripsi: body.deskripsi ?? '',
      jumlahDusun: parseInt(body.jumlahDusun) || 6,
      namaaDusun: body.namaaDusun ?? '',
      jumlahPenduduk: parseInt(body.jumlahPenduduk) || 0,
      mayoritas: body.mayoritas ?? '',
      komoditas: body.komoditas ?? '',
      dikenal: body.dikenal ?? '',
      emailKontak: body.emailKontak ?? '',
      waKontak: body.waKontak ?? '',
      periodeMulai: body.periodeMulai ?? null,
      periodeSelesai: body.periodeSelesai ?? null,
      updatedAt: new Date().toISOString(),
    }

    await db.collection(COLLECTIONS.INFO_DESA).doc(INFO_DOC_ID).set(data, { merge: true })
    return NextResponse.json({ id: INFO_DOC_ID, ...data })
  } catch (error) {
    console.error('PUT info-desa error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  }
}
