'use client'

import { useState, useEffect } from 'react'

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
  periodeMulai: string
  periodeSelesai: string
}

export default function AdminInfoDesaPage() {
  const [form, setForm] = useState<Partial<InfoDesa>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 3000)
  }

  useEffect(() => {
    fetch('/api/info-desa')
      .then((r) => r.json())
      .then((data) => {
        setForm({
          ...data,
          periodeMulai: data.periodeMulai?.slice(0, 10) ?? '',
          periodeSelesai: data.periodeSelesai?.slice(0, 10) ?? '',
        })
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/info-desa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      showMsg('success', 'Info desa berhasil disimpan!')
    } catch (err: any) {
      showMsg('error', err.message ?? 'Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const setField = (key: keyof InfoDesa, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-stone-400">Memuat data...</div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-green-900">Kelola Info Desa</h1>
        <p className="text-stone-500 mt-1">
          Edit informasi dan statistik Desa Tawangargo yang tampil di halaman Beranda dan Kontak
        </p>
      </div>

      {msg && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {msg.type === 'success' ? '✅' : '❌'} {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Identitas Desa */}
        <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
          <h2 className="font-playfair text-xl font-bold text-green-900 mb-5 flex items-center gap-2">
            🏘️ Identitas Desa
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Nama Desa</label>
              <input
                type="text"
                value={form.nama ?? ''}
                onChange={(e) => setField('nama', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Kecamatan</label>
              <input
                type="text"
                value={form.kecamatan ?? ''}
                onChange={(e) => setField('kecamatan', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Kabupaten</label>
              <input
                type="text"
                value={form.kabupaten ?? ''}
                onChange={(e) => setField('kabupaten', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="form-label">Deskripsi Desa</label>
            <textarea
              value={form.deskripsi ?? ''}
              onChange={(e) => setField('deskripsi', e.target.value)}
              className="form-input min-h-36 resize-y"
              rows={5}
              placeholder="Deskripsi lengkap tentang Desa Tawangargo..."
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Dikenal Sebagai</label>
            <input
              type="text"
              value={form.dikenal ?? ''}
              onChange={(e) => setField('dikenal', e.target.value)}
              className="form-input"
              placeholder="Contoh: Desa Wisata Sayur Mayur Lereng Gunung Arjuno"
            />
          </div>
        </div>

        {/* Statistik */}
        <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
          <h2 className="font-playfair text-xl font-bold text-green-900 mb-5 flex items-center gap-2">
            📊 Statistik Desa
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Jumlah Dusun</label>
              <input
                type="number"
                value={form.jumlahDusun ?? 0}
                onChange={(e) => setField('jumlahDusun', e.target.value)}
                className="form-input"
                min="0"
              />
            </div>
            <div>
              <label className="form-label">Jumlah Penduduk</label>
              <input
                type="number"
                value={form.jumlahPenduduk ?? 0}
                onChange={(e) => setField('jumlahPenduduk', e.target.value)}
                className="form-input"
                min="0"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="form-label">Nama-nama Dusun (pisahkan dengan koma)</label>
            <input
              type="text"
              value={form.namaaDusun ?? ''}
              onChange={(e) => setField('namaaDusun', e.target.value)}
              className="form-input"
              placeholder="Suwaluhan, Kalimalang, Leban, Ngudi, Lasah, Boro"
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Mayoritas Pekerjaan</label>
            <input
              type="text"
              value={form.mayoritas ?? ''}
              onChange={(e) => setField('mayoritas', e.target.value)}
              className="form-input"
              placeholder="Contoh: Petani & Perkebunan (57%)"
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Komoditas Unggulan (pisahkan dengan koma)</label>
            <input
              type="text"
              value={form.komoditas ?? ''}
              onChange={(e) => setField('komoditas', e.target.value)}
              className="form-input"
              placeholder="Sawi, Kol, Brokoli, Tomat, Seledri, Cabai, Jagung"
            />
          </div>
        </div>

        {/* Kontak */}
        <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
          <h2 className="font-playfair text-xl font-bold text-green-900 mb-5 flex items-center gap-2">
            📞 Kontak & Periode KKN
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Email Kontak</label>
              <input
                type="email"
                value={form.emailKontak ?? ''}
                onChange={(e) => setField('emailKontak', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Nomor WhatsApp</label>
              <input
                type="text"
                value={form.waKontak ?? ''}
                onChange={(e) => setField('waKontak', e.target.value)}
                className="form-input"
                placeholder="+6281234567890"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="form-label">Periode Mulai KKN</label>
              <input
                type="date"
                value={form.periodeMulai ?? ''}
                onChange={(e) => setField('periodeMulai', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Periode Selesai KKN</label>
              <input
                type="date"
                value={form.periodeSelesai ?? ''}
                onChange={(e) => setField('periodeSelesai', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50 text-base px-8 py-4">
          {saving ? 'Menyimpan...' : '💾 Simpan Semua Perubahan'}
        </button>
      </form>
    </div>
  )
}
