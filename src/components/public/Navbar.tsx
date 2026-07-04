'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/program-kerja', label: 'Program Kerja' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/tim', label: 'Tim KKN' },
  { href: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-green-900/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-playfair font-bold text-lg">T</span>
            </div>
            <div className="hidden sm:block">
              <div
                className={`font-playfair font-bold text-lg leading-tight transition-colors ${
                  scrolled ? 'text-green-800' : 'text-white'
                }`}
              >
                KKN Tawangargo
              </div>
              <div
                className={`text-xs transition-colors ${
                  scrolled ? 'text-stone-500' : 'text-green-200'
                }`}
              >
                FEB Universitas Brawijaya
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? scrolled
                      ? 'bg-green-700 text-white'
                      : 'bg-white/20 text-white'
                    : scrolled
                    ? 'text-stone-700 hover:bg-green-50 hover:text-green-800'
                    : 'text-white/90 hover:bg-white/15 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              scrolled ? 'text-stone-700 hover:bg-stone-100' : 'text-white hover:bg-white/20'
            }`}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-current transition-all ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all ${
                  menuOpen ? '-rotate-45 -translate-y-[9px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/98 backdrop-blur-xl border-t border-stone-100 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-green-700 text-white'
                  : 'text-stone-700 hover:bg-green-50 hover:text-green-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
