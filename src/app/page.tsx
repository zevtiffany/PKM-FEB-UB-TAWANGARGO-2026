import { db, COLLECTIONS } from '@/lib/firebase'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/public/ScrollReveal'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface InfoDesa {
  id: string
  nama: string
  kecamatan: string
  kabupaten: string
  deskripsi: string
  jumlahDusun: number
  namaaDusun: string
  jumlahPenduduk: number
  mayoritas: string
  komoditas: string
  dikenal: string
  emailKontak: string
  waKontak: string
  periodeMulai: string | null
  periodeSelesai: string | null
}

export default async function BerandaPage() {
  // Ambil data dari Firestore
  const [infoDoc, kegiatanSnapshot] = await Promise.all([
    db.collection(COLLECTIONS.INFO_DESA).doc('main').get(),
    db.collection(COLLECTIONS.KEGIATAN).orderBy('tanggal', 'desc').limit(3).get(),
  ])

  const infoDesa = infoDoc.exists ? { id: infoDoc.id, ...infoDoc.data() } as InfoDesa : null

  // Ambil kegiatan + foto masing-masing
  const kegiatanTerbaru = await Promise.all(
    kegiatanSnapshot.docs.map(async (doc) => {
      const fotoSnap = await db
        .collection(COLLECTIONS.KEGIATAN)
        .doc(doc.id)
        .collection(COLLECTIONS.FOTO)
        .limit(1)
        .get()
      const foto = fotoSnap.docs.map((f) => ({ id: f.id, ...f.data() }))
      return { id: doc.id, ...doc.data(), foto } as any
    })
  )

  // Ambil 6 foto terbaru dari semua kegiatan
  const allKegiatanSnap = await db.collection(COLLECTIONS.KEGIATAN).get()
  const fotoTerbaru: any[] = []
  for (const kegDoc of allKegiatanSnap.docs) {
    if (fotoTerbaru.length >= 6) break
    const fSnap = await db
      .collection(COLLECTIONS.KEGIATAN)
      .doc(kegDoc.id)
      .collection(COLLECTIONS.FOTO)
      .limit(6 - fotoTerbaru.length)
      .get()
    fSnap.docs.forEach((f) =>
      fotoTerbaru.push({
        id: f.id,
        ...f.data(),
        kegiatan: { judul: (kegDoc.data() as any).judul },
      })
    )
  }



  const stats = [
    { label: 'Dusun', value: infoDesa?.jumlahDusun ?? 6, icon: '🏘️' },
    { label: 'Penduduk', value: (infoDesa?.jumlahPenduduk ?? 10211).toLocaleString('id-ID'), icon: '👥' },
    { label: 'Petani', value: '57%', icon: '🌾' },
    { label: 'Komoditas', value: '7+', icon: '🥦' },
  ]

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/hero-tawangargo.png"
          alt="Pemandangan terasering Desa Tawangargo"
          fill
          className="object-cover object-center"
          priority
          quality={85}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/80 to-stone-900/85" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl" />

        {/* Terrace pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0,200 Q100,100 200,200 Q300,300 400,200" stroke="white" strokeWidth="1" fill="none" />
            <path d="M0,250 Q100,150 200,250 Q300,350 400,250" stroke="white" strokeWidth="1" fill="none" />
            <path d="M0,150 Q100,50 200,150 Q300,250 400,150" stroke="white" strokeWidth="1" fill="none" />
            <path d="M0,100 Q100,0 200,100 Q300,200 400,100" stroke="white" strokeWidth="1" fill="none" />
            <path d="M0,300 Q100,200 200,300 Q300,400 400,300" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-green-200 text-sm mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            KKN Desa Tawangargo · {infoDesa?.kecamatan}, {infoDesa?.kabupaten}
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            Mengabdi di{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-orange-300">
              Lereng Arjuno
            </span>
          </h1>

          <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Bersama masyarakat Desa Tawangargo — membangun potensi desa wisata sayur mayur
            di kaki Gunung Arjuno menjadi lebih berdaya dan berkelanjutan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/program-kerja"
              className="inline-flex items-center gap-2 px-8 py-4 bg-carrot-orange-500 text-white font-semibold rounded-2xl hover:bg-carrot-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/30"
              style={{ backgroundColor: '#E8621A' }}
            >
              Lihat Program Kerja
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/25 active:scale-95 transition-all backdrop-blur-sm"
            >
              Lihat Galeri
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative -mt-16 z-20 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-green-900/10 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-playfair font-bold text-green-800">
                  {stat.value}
                </div>
                <div className="text-stone-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TENTANG DESA ─── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-4">
                Tentang Desa
              </span>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-green-900 mb-6">
                Desa Tawangargo
              </h2>
              <p className="text-stone-600 max-w-3xl mx-auto text-lg leading-relaxed">
                {infoDesa?.deskripsi}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Dusun */}
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-3xl p-8 shadow-card border border-stone-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                    🏘️
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-xl text-green-900">
                      {infoDesa?.jumlahDusun} Dusun
                    </h3>
                    <p className="text-stone-500 text-sm">Wilayah Administratif</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {infoDesa?.namaaDusun.split(',').map((d: string) => (
                    <span
                      key={d}
                      className="px-3 py-1.5 bg-green-50 text-green-800 text-sm rounded-xl border border-green-100 font-medium"
                    >
                      {d.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Komoditas */}
            <ScrollReveal delay={200}>
              <div className="bg-white rounded-3xl p-8 shadow-card border border-stone-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
                    🥦
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-xl text-green-900">
                      Komoditas Unggulan
                    </h3>
                    <p className="text-stone-500 text-sm">{infoDesa?.dikenal}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {infoDesa?.komoditas.split(',').map((k: string) => (
                    <span
                      key={k}
                      className="px-3 py-1.5 bg-orange-50 text-orange-800 text-sm rounded-xl border border-orange-100 font-medium"
                    >
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── PROGRAM KERJA TERBARU ─── */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-cream-fog-100">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-4">
                  Program Kerja
                </span>
                <h2 className="font-playfair text-4xl font-bold text-green-900">
                  Kegiatan Terkini
                </h2>
              </div>
              <Link
                href="/program-kerja"
                className="hidden md:flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition-colors"
              >
                Lihat Semua
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {kegiatanTerbaru.map((kegiatan, i) => (
              <ScrollReveal key={kegiatan.id} delay={i * 100}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-stone-100 card-hover">
                  {kegiatan.foto[0] ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={kegiatan.foto[0].url}
                        alt={kegiatan.judul}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <span className="text-6xl">🌿</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge badge-green">{kegiatan.kategori}</span>
                      <span className="text-stone-400 text-xs">
                        {new Date(kegiatan.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="font-playfair font-bold text-xl text-green-900 mb-2 leading-snug">
                      {kegiatan.judul}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                      {kegiatan.deskripsi}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/program-kerja" className="btn-secondary">
              Lihat Semua Program Kerja
            </Link>
          </div>
        </div>
      </section>

      {/* ─── GALERI SINGKAT ─── */}
      {fotoTerbaru.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full mb-4">
                  Galeri
                </span>
                <h2 className="font-playfair text-4xl font-bold text-green-900">
                  Dokumentasi Kegiatan
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fotoTerbaru.map((foto, i) => (
                <ScrollReveal key={foto.id} delay={i * 80}>
                  <div className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                    <Image
                      src={foto.url}
                      alt={foto.keterangan ?? foto.kegiatan.judul}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-sm font-medium">
                        {foto.kegiatan.judul}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/galeri" className="btn-primary">
                Lihat Semua Foto
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── EMPTY GALLERY PLACEHOLDER ─── */}
      {fotoTerbaru.length === 0 && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-8xl mb-6">📸</div>
            <h2 className="font-playfair text-3xl font-bold text-green-900 mb-4">
              Belum Ada Foto
            </h2>
            <p className="text-stone-500 mb-8">
              Foto dokumentasi kegiatan akan ditampilkan di sini setelah admin mengunggahnya.
            </p>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="rounded-3xl bg-gradient-to-br from-green-800 to-green-900 p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full translate-y-24 -translate-x-24" />
              <div className="relative z-10">
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
                  Ingin Tahu Lebih Lanjut?
                </h2>
                <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto">
                  Kenali tim kami dan semua program kerja yang sedang kami jalankan di Desa Tawangargo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/tim" className="btn-primary" style={{ backgroundColor: '#E8621A' }}>
                    Kenali Tim Kami
                  </Link>
                  <Link
                    href="/kontak"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Hubungi Kami
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
