import { prisma } from '@/lib/prisma'
import GaleriClient from '@/components/public/GaleriClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Galeri | KKN Desa Tawangargo',
  description: 'Dokumentasi foto seluruh kegiatan KKN di Desa Tawangargo.',
}

export default async function GaleriPage() {
  const [fotos, kegiatan] = await Promise.all([
    prisma.foto.findMany({
      orderBy: { id: 'desc' },
      include: { kegiatan: { select: { id: true, judul: true } } },
    }),
    prisma.kegiatan.findMany({
      orderBy: { tanggal: 'asc' },
      select: { id: true, judul: true },
    }),
  ])

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="relative py-16 bg-gradient-to-br from-green-900 via-green-800 to-stone-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="300" cy="80" r="100" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="100" cy="200" r="80" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-green-200 text-sm font-semibold rounded-full mb-4">
            Dokumentasi
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Galeri Kegiatan
          </h1>
          <p className="text-green-200 text-lg max-w-xl mx-auto">
            Kumpulan foto dokumentasi seluruh kegiatan KKN Desa Tawangargo.
            Klik foto untuk melihat lebih besar.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-green-300 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {fotos.length} foto dari {kegiatan.length} kegiatan
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <GaleriClient fotos={fotos} kegiatan={kegiatan} />
      </div>
    </div>
  )
}
