'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FotoItem {
  id: number
  url: string
  keterangan: string | null
  kegiatanId: number
  kegiatan: { id: number; judul: string }
}

interface GaleriClientProps {
  fotos: FotoItem[]
  kegiatan: { id: number; judul: string }[]
}

export default function GaleriClient({ fotos, kegiatan }: GaleriClientProps) {
  const [filterKegiatan, setFilterKegiatan] = useState<number | null>(null)
  const [lightbox, setLightbox] = useState<FotoItem | null>(null)

  const filtered = filterKegiatan
    ? fotos.filter((f) => f.kegiatanId === filterKegiatan)
    : fotos

  return (
    <>
      {/* Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <button
          onClick={() => setFilterKegiatan(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filterKegiatan === null
              ? 'bg-green-700 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-green-50 border border-stone-200'
          }`}
        >
          Semua Foto
        </button>
        {kegiatan.map((k) => (
          <button
            key={k.id}
            onClick={() => setFilterKegiatan(k.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterKegiatan === k.id
                ? 'bg-green-700 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-green-50 border border-stone-200'
            }`}
          >
            {k.judul}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-4">📷</div>
          <p className="text-stone-500 text-lg">Belum ada foto untuk kegiatan ini.</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((foto) => (
            <div
              key={foto.id}
              className="break-inside-avoid cursor-pointer group relative rounded-2xl overflow-hidden"
              onClick={() => setLightbox(foto)}
            >
              <Image
                src={foto.url}
                alt={foto.keterangan ?? foto.kegiatan.judul}
                width={400}
                height={300}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-white text-sm font-medium leading-tight">
                    {foto.keterangan ?? foto.kegiatan.judul}
                  </p>
                  <p className="text-white/70 text-xs mt-1">{foto.kegiatan.judul}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 text-4xl leading-none"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.url}
              alt={lightbox.keterangan ?? lightbox.kegiatan.judul}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-medium text-lg">
                {lightbox.keterangan ?? lightbox.kegiatan.judul}
              </p>
              <p className="text-white/60 text-sm mt-1">{lightbox.kegiatan.judul}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
