'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Foto {
  id: number
  url: string
  keterangan: string | null
}

interface Kegiatan {
  id: number
  judul: string
  tanggal: string
  deskripsi: string
  kategori: string
  foto: Foto[]
}

const KATEGORI_LIST = [
  'Survei & Observasi',
  'Pemberdayaan Ekonomi',
  'Pendidikan',
  'Kesehatan',
  'Lingkungan',
  'Sosial Budaya',
  'Infrastruktur',
  'Penutupan',
  'Lainnya',
]

const emptyForm = {
  judul: '',
  tanggal: '',
  deskripsi: '',
  kategori: KATEGORI_LIST[0],
}

export default function AdminKegiatanPage() {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 3000)
  }

  const fetchKegiatan = async () => {
    const res = await fetch('/api/kegiatan')
    const data = await res.json()
    setKegiatan(data)
    setLoading(false)
  }

  useEffect(() => { fetchKegiatan() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editId ? `/api/kegiatan/${editId}` : '/api/kegiatan'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const saved = await res.json()

      // Upload photos if any
      if (selectedFiles.length > 0) {
        const fd = new FormData()
        fd.append('kegiatanId', String(editId ?? saved.id))
        selectedFiles.forEach((f) => fd.append('foto', f))
        await fetch('/api/upload', { method: 'POST', body: fd })
        setSelectedFiles([])
        if (fileRef.current) fileRef.current.value = ''
      }

      showMsg('success', editId ? 'Kegiatan berhasil diupdate!' : 'Kegiatan berhasil ditambahkan!')
      setShowForm(false)
      setEditId(null)
      setForm(emptyForm)
      fetchKegiatan()
    } catch (err: any) {
      showMsg('error', err.message ?? 'Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (k: Kegiatan) => {
    setEditId(k.id)
    setForm({
      judul: k.judul,
      tanggal: k.tanggal.slice(0, 10),
      deskripsi: k.deskripsi,
      kategori: k.kategori,
    })
    setShowForm(true)
    setSelectedFiles([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus kegiatan ini beserta semua fotonya?')) return
    const res = await fetch(`/api/kegiatan/${id}`, { method: 'DELETE' })
    if (res.ok) {
      showMsg('success', 'Kegiatan berhasil dihapus!')
      fetchKegiatan()
    }
  }

  const handleDeleteFoto = async (fotoId: number) => {
    if (!confirm('Hapus foto ini?')) return
    const res = await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fotoId }),
    })
    if (res.ok) {
      showMsg('success', 'Foto berhasil dihapus!')
      fetchKegiatan()
    }
  }

  const handleUploadFoto = async (kegiatanId: number) => {
    if (selectedFiles.length === 0) return
    setUploadingId(kegiatanId)
    const fd = new FormData()
    fd.append('kegiatanId', String(kegiatanId))
    selectedFiles.forEach((f) => fd.append('foto', f))
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    setUploadingId(null)
    if (res.ok) {
      showMsg('success', 'Foto berhasil diunggah!')
      setSelectedFiles([])
      if (fileRef.current) fileRef.current.value = ''
      fetchKegiatan()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-green-900">Kelola Kegiatan</h1>
          <p className="text-stone-500 mt-1">Tambah, edit, dan hapus program kerja KKN</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditId(null)
            setForm(emptyForm)
            setSelectedFiles([])
          }}
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kegiatan
        </button>
      </div>

      {/* Flash message */}
      {msg && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {msg.type === 'success' ? '✅' : '❌'} {msg.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-card border border-stone-200 p-6 mb-8">
          <h2 className="font-playfair text-xl font-bold text-green-900 mb-6">
            {editId ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Judul Kegiatan *</label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  className="form-input"
                  placeholder="Contoh: Pelatihan Digital Marketing"
                  required
                />
              </div>
              <div>
                <label className="form-label">Tanggal *</label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div>
              <label className="form-label">Kategori *</label>
              <select
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                className="form-input"
                required
              >
                {KATEGORI_LIST.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Deskripsi *</label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                className="form-input min-h-32 resize-y"
                placeholder="Deskripsi lengkap kegiatan..."
                rows={5}
                required
              />
            </div>

            {/* Photo upload */}
            <div>
              <label className="form-label">
                {editId ? 'Tambah Foto Baru (opsional)' : 'Upload Foto (opsional)'}
              </label>
              <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                  className="hidden"
                  id="foto-upload"
                />
                <label htmlFor="foto-upload" className="cursor-pointer">
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-stone-600 text-sm">
                    Klik untuk pilih foto <span className="text-stone-400">(bisa multiple)</span>
                  </p>
                </label>
                {selectedFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {selectedFiles.map((f, i) => (
                      <span key={i} className="badge badge-green">{f.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Menyimpan...' : editId ? 'Update Kegiatan' : 'Simpan Kegiatan'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}
                className="btn-secondary"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kegiatan List */}
      {loading ? (
        <div className="text-center py-20 text-stone-400">Memuat data...</div>
      ) : kegiatan.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-stone-500">Belum ada kegiatan. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {kegiatan.map((k) => (
            <div key={k.id} className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-green-900 text-lg">{k.judul}</h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-stone-400 text-sm">
                          {new Date(k.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </span>
                        <span className="badge badge-green">{k.kategori}</span>
                        <span className="text-stone-400 text-xs">{k.foto.length} foto</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleEdit(k)} className="btn-warning text-sm px-3 py-1.5">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(k.id)} className="btn-danger text-sm px-3 py-1.5">
                        Hapus
                      </button>
                      <button
                        onClick={() => setExpandedId(expandedId === k.id ? null : k.id)}
                        className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-sm hover:bg-stone-200 transition-colors"
                      >
                        {expandedId === k.id ? '▲ Tutup' : '▼ Foto'}
                      </button>
                    </div>
                  </div>
                  <p className="text-stone-500 text-sm mt-2 line-clamp-2">{k.deskripsi}</p>
                </div>
              </div>

              {/* Expanded: foto management */}
              {expandedId === k.id && (
                <div className="border-t border-stone-100 p-5">
                  {k.foto.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                      {k.foto.map((f) => (
                        <div key={f.id} className="relative group aspect-square rounded-xl overflow-hidden">
                          <Image src={f.url} alt={f.keterangan ?? 'foto'} fill className="object-cover" />
                          <button
                            onClick={() => handleDeleteFoto(f.id)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-sm mb-4">Belum ada foto untuk kegiatan ini.</p>
                  )}

                  {/* Upload more photos */}
                  <div className="flex gap-3 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                      className="flex-1 text-sm text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 file:font-medium hover:file:bg-green-200 file:cursor-pointer cursor-pointer"
                    />
                    <button
                      onClick={() => handleUploadFoto(k.id)}
                      disabled={selectedFiles.length === 0 || uploadingId === k.id}
                      className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
                    >
                      {uploadingId === k.id ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
