import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import ScrollReveal from '@/components/public/ScrollReveal'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Program Kerja | KKN Desa Tawangargo',
  description:
    'Daftar lengkap program kerja KKN di Desa Tawangargo — timeline kegiatan, deskripsi, dan dokumentasi foto.',
}

const KATEGORI_COLORS: Record<string, string> = {
  'Survei & Observasi': 'bg-blue-100 text-blue-800',
  'Pemberdayaan Ekonomi': 'bg-emerald-100 text-emerald-800',
  Pendidikan: 'bg-purple-100 text-purple-800',
  Kesehatan: 'bg-red-100 text-red-800',
  Lingkungan: 'bg-teal-100 text-teal-800',
  Penutupan: 'bg-orange-100 text-orange-800',
  default: 'bg-green-100 text-green-800',
}

export default async function ProgramKerjaPage() {
  const kegiatan = await prisma.kegiatan.findMany({
    orderBy: { tanggal: 'asc' },
    include: { foto: true },
  })

  const allKategori = [...new Set(kegiatan.map((k) => k.kategori))]

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="relative py-16 bg-gradient-to-br from-green-900 via-green-800 to-stone-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0,150 Q100,50 200,150 Q300,250 400,150" stroke="white" strokeWidth="2" fill="none" />
            <path d="M0,200 Q100,100 200,200 Q300,300 400,200" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-green-200 text-sm font-semibold rounded-full mb-4 backdrop-blur-sm">
            Program Kerja KKN
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Timeline Kegiatan
          </h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Seluruh rangkaian kegiatan KKN di Desa Tawangargo, disusun secara kronologis.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        {kegiatan.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📋</div>
            <h2 className="font-playfair text-3xl font-bold text-green-900 mb-4">
              Belum Ada Kegiatan
            </h2>
            <p className="text-stone-500">
              Program kerja akan ditampilkan di sini setelah admin menambahkan data.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-orange-400 -translate-x-1/2" />

            <div className="space-y-12">
              {kegiatan.map((k, i) => {
                const isLeft = i % 2 === 0
                const badgeColor =
                  KATEGORI_COLORS[k.kategori] ?? KATEGORI_COLORS.default

                return (
                  <ScrollReveal key={k.id} delay={i * 80}>
                    <div
                      className={`flex flex-col md:flex-row gap-6 md:gap-10 ${
                        !isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Card */}
                      <div className="flex-1 bg-white rounded-3xl shadow-card border border-stone-100 overflow-hidden card-hover">
                        {k.foto.length > 0 && (
                          <div className="relative h-52 overflow-hidden">
                            <Image
                              src={k.foto[0].url}
                              alt={k.judul}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </div>
                        )}
                        <div className="p-6 md:p-8">
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className={`badge ${badgeColor}`}>{k.kategori}</span>
                            <time className="text-stone-400 text-sm">
                              {new Date(k.tanggal).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </time>
                          </div>
                          <h2 className="font-playfair text-2xl font-bold text-green-900 mb-3 leading-snug">
                            {k.judul}
                          </h2>
                          <p className="text-stone-600 leading-relaxed">{k.deskripsi}</p>

                          {k.foto.length > 1 && (
                            <div className="mt-6">
                              <p className="text-sm font-medium text-stone-500 mb-3">
                                Foto ({k.foto.length})
                              </p>
                              <div className="grid grid-cols-4 gap-2">
                                {k.foto.slice(0, 4).map((foto, fi) => (
                                  <div
                                    key={foto.id}
                                    className="relative aspect-square rounded-xl overflow-hidden"
                                  >
                                    <Image
                                      src={foto.url}
                                      alt={foto.keterangan ?? k.judul}
                                      fill
                                      className="object-cover"
                                    />
                                    {fi === 3 && k.foto.length > 4 && (
                                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                          +{k.foto.length - 4}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timeline dot (center) */}
                      <div className="hidden md:flex flex-col items-center justify-start pt-8 flex-shrink-0 w-8">
                        <div className="w-5 h-5 rounded-full bg-white border-4 border-green-600 shadow-lg shadow-green-200 z-10" />
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="hidden md:block flex-1" />
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
