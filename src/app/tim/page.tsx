import { prisma } from '@/lib/prisma'
import TimGrid from '@/components/public/TimGrid'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Tim KKN | KKN Desa Tawangargo',
  description: 'Profil anggota tim KKN di Desa Tawangargo.',
}

export default async function TimPage() {
  const anggota = await prisma.anggota.findMany({
    orderBy: { urutan: 'asc' },
  })

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="relative py-16 bg-gradient-to-br from-green-900 via-green-800 to-stone-800 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-green-200 text-sm font-semibold rounded-full mb-4">
            Tim KKN
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Kenali Tim Kami
          </h1>
          <p className="text-green-200 text-lg max-w-xl mx-auto">
            Para mahasiswa yang berdedikasi mengabdi di Desa Tawangargo selama program KKN.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-16">
        <TimGrid anggota={anggota} />
      </div>
    </div>
  )
}
