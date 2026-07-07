'use client'

import Image from 'next/image'
import ScrollReveal from '@/components/public/ScrollReveal'

interface Anggota {
  id: string
  nama: string
  peran: string
  foto: string | null
  kontak: string | null
  urutan: number
}


export default function TimGrid({ anggota }: { anggota: Anggota[] }) {
  if (anggota.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-8xl mb-6">👥</div>
        <h2 className="font-playfair text-3xl font-bold text-green-900 mb-4">
          Data Tim Belum Diisi
        </h2>
        <p className="text-stone-500">
          Profil anggota tim akan ditampilkan di sini.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {anggota.map((a, i) => (
        <ScrollReveal key={a.id} delay={i * 60}>
          <div className="group bg-white rounded-3xl overflow-hidden shadow-card border border-stone-100 card-hover text-center">
            {/* Foto */}
            <div className="relative h-52 overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
              {a.foto ? (
                <Image
                  src={a.foto}
                  alt={a.nama}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/60 flex items-center justify-center shadow-inner">
                    <span className="text-4xl font-playfair font-bold text-green-700">
                      {a.nama.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
              {/* Overlay on hover */}
              {a.kontak && (
                <div className="absolute inset-0 bg-green-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={a.kontak.startsWith('http') ? a.kontak : `https://${a.kontak}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-green-800 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Hubungi
                  </a>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <h3 className="font-playfair font-bold text-green-900 text-lg leading-snug mb-1">
                {a.nama}
              </h3>
              <p className="text-stone-500 text-sm">{a.peran}</p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}
