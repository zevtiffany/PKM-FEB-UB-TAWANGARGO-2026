import { db, COLLECTIONS } from '@/lib/firebase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [kegiatanSnap, anggotaSnap] = await Promise.all([
    db.collection(COLLECTIONS.KEGIATAN).orderBy('createdAt', 'desc').get(),
    db.collection(COLLECTIONS.ANGGOTA).get(),
  ])

  const kegiatanCount = kegiatanSnap.size
  const anggotaCount = anggotaSnap.size

  // Hitung total foto dari semua kegiatan
  let fotoCount = 0
  await Promise.all(
    kegiatanSnap.docs.map(async (doc) => {
      const fSnap = await db
        .collection(COLLECTIONS.KEGIATAN)
        .doc(doc.id)
        .collection(COLLECTIONS.FOTO)
        .get()
      fotoCount += fSnap.size
    })
  )

  // 5 kegiatan terbaru + 1 foto
  const recentKegiatan = await Promise.all(
    kegiatanSnap.docs.slice(0, 5).map(async (doc) => {
      const fSnap = await db
        .collection(COLLECTIONS.KEGIATAN)
        .doc(doc.id)
        .collection(COLLECTIONS.FOTO)
        .limit(1)
        .get()
      return { id: doc.id, ...doc.data(), foto: fSnap.docs.map((f) => ({ id: f.id, ...f.data() })) } as any
    })
  )



  const stats = [
    {
      label: 'Total Kegiatan',
      value: kegiatanCount,
      icon: '📅',
      href: '/admin/kegiatan',
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Total Foto',
      value: fotoCount,
      icon: '📸',
      href: '/admin/kegiatan',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Anggota Tim',
      value: anggotaCount,
      icon: '👥',
      href: '/admin/tim',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-green-900">Dashboard Admin</h1>
        <p className="text-stone-500 mt-1">Selamat datang di panel admin KKN Desa Tawangargo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className="text-3xl mb-3">{stat.icon}</div>
            <div className="text-3xl font-bold font-playfair">{stat.value}</div>
            <div className="text-white/80 text-sm mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Link
          href="/admin/kegiatan"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card border border-stone-100 hover:border-green-200 hover:shadow-green-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center text-2xl transition-colors">
            ➕
          </div>
          <div>
            <p className="font-semibold text-green-900">Tambah Kegiatan</p>
            <p className="text-stone-500 text-xs">Program kerja baru</p>
          </div>
        </Link>

        <Link
          href="/admin/tim"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card border border-stone-100 hover:border-orange-200 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center text-2xl transition-colors">
            👤
          </div>
          <div>
            <p className="font-semibold text-green-900">Kelola Tim</p>
            <p className="text-stone-500 text-xs">Data anggota KKN</p>
          </div>
        </Link>

        <Link
          href="/admin/info-desa"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card border border-stone-100 hover:border-blue-200 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-2xl transition-colors">
            🏘️
          </div>
          <div>
            <p className="font-semibold text-green-900">Edit Info Desa</p>
            <p className="text-stone-500 text-xs">Statistik & deskripsi</p>
          </div>
        </Link>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-green-900">Kegiatan Terbaru</h2>
          <Link href="/admin/kegiatan" className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors">
            Lihat Semua →
          </Link>
        </div>
        {recentKegiatan.length === 0 ? (
          <div className="p-10 text-center text-stone-400">
            <p className="text-4xl mb-3">📋</p>
            <p>Belum ada kegiatan. <Link href="/admin/kegiatan" className="text-green-600 hover:underline">Tambah sekarang →</Link></p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentKegiatan.map((k) => (
              <div key={k.id} className="px-6 py-4 flex items-center gap-4 hover:bg-stone-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 text-lg">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-green-900 truncate">{k.judul}</p>
                  <p className="text-stone-400 text-xs mt-0.5">
                    {new Date(k.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    · {k.foto.length} foto
                  </p>
                </div>
                <span className="badge badge-green text-xs flex-shrink-0">{k.kategori}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
