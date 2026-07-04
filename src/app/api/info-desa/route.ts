import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET info desa
export async function GET() {
  const info = await prisma.infoDesa.findFirst({ where: { id: 1 } })
  return NextResponse.json(info)
}

// PUT update info desa
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const updated = await prisma.infoDesa.upsert({
    where: { id: 1 },
    update: {
      nama: body.nama,
      kecamatan: body.kecamatan,
      kabupaten: body.kabupaten,
      deskripsi: body.deskripsi,
      jumlahDusun: parseInt(body.jumlahDusun),
      namaaDusun: body.namaaDusun,
      jumlahPenduduk: parseInt(body.jumlahPenduduk),
      mayoritas: body.mayoritas,
      komoditas: body.komoditas,
      dikenal: body.dikenal,
      emailKontak: body.emailKontak,
      waKontak: body.waKontak,
      periodeMulai: body.periodeMulai ? new Date(body.periodeMulai) : undefined,
      periodeSelesai: body.periodeSelesai ? new Date(body.periodeSelesai) : undefined,
    },
    create: {
      id: 1,
      nama: body.nama ?? 'Desa Tawangargo',
      kecamatan: body.kecamatan ?? 'Kecamatan Karangploso',
      kabupaten: body.kabupaten ?? 'Kabupaten Malang',
      deskripsi: body.deskripsi ?? '',
      jumlahDusun: parseInt(body.jumlahDusun) ?? 6,
      namaaDusun: body.namaaDusun ?? '',
      jumlahPenduduk: parseInt(body.jumlahPenduduk) ?? 10211,
      mayoritas: body.mayoritas ?? '',
      komoditas: body.komoditas ?? '',
      dikenal: body.dikenal ?? '',
      emailKontak: body.emailKontak ?? '',
      waKontak: body.waKontak ?? '',
    },
  })

  return NextResponse.json(updated)
}
