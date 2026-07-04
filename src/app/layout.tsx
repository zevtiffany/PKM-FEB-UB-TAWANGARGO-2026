import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import PublicShell from '@/components/public/PublicShell'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KKN Desa Tawangargo | FEB Universitas Brawijaya',
  description:
    'Website resmi program Kuliah Kerja Nyata (KKN) di Desa Tawangargo, Kecamatan Karangploso, Kabupaten Malang. Menampilkan dokumentasi kegiatan, program kerja, dan profil tim KKN.',
  keywords: 'KKN, Tawangargo, Karangploso, Malang, Universitas Brawijaya, FEB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-jakarta bg-cream-fog text-earth-brown antialiased">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  )
}
