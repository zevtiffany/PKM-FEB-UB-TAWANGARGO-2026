import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-green-900 via-green-800 to-stone-800 text-white">
      {/* Wavy top */}
      <div className="relative h-16 overflow-hidden">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z"
            fill="#14532d"
          />
        </svg>
      </div>

      <div className="bg-green-900 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-b border-white/10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white font-playfair font-bold text-lg">T</span>
                </div>
                <div>
                  <div className="font-playfair font-bold text-lg">KKN Tawangargo</div>
                  <div className="text-green-300 text-xs">FEB Universitas Brawijaya</div>
                </div>
              </div>
              <p className="text-green-200 text-sm leading-relaxed">
                Program Kuliah Kerja Nyata di Desa Tawangargo, Kecamatan Karangploso, Kabupaten Malang.
                Lereng Gunung Arjuno yang subur dan sejuk.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 font-playfair">Halaman</h4>
              <ul className="space-y-2">
                {[
                  { href: '/', label: 'Beranda' },
                  { href: '/program-kerja', label: 'Program Kerja' },
                  { href: '/galeri', label: 'Galeri' },
                  { href: '/tim', label: 'Tim KKN' },
                  { href: '/kontak', label: 'Kontak' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-green-300 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-carrot-orange flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-semibold text-white mb-4 font-playfair">Lokasi</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-carrot-orange mt-0.5">📍</span>
                  <div className="text-green-200 text-sm">
                    Desa Tawangargo<br />
                    Kec. Karangploso, Kab. Malang<br />
                    Jawa Timur
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-carrot-orange">🏔️</span>
                  <span className="text-green-200 text-sm">Lereng Gunung Arjuno</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-carrot-orange">🌿</span>
                  <span className="text-green-200 text-sm">Desa Wisata Sayur Mayur</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-green-400 text-xs">
              © {currentYear} KKN Desa Tawangargo · FEB Universitas Brawijaya
            </p>
            <Link
              href="/admin"
              className="text-green-600 hover:text-green-400 text-xs transition-colors duration-200"
            >
              Panel Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
