'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Anggota {
  id: number
  nama: string
  peran: string
  foto: string | null
  kontak: string | null
  urutan: number
}

const emptyForm = { nama: '', peran: '', kontak: '', urutan: '0' }

export default function AdminTimPage() {
  const [anggota, setAnggota] = useState<Anggota[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 3000)
  }

  const fetchAnggota = async () => {
    const res = await fetch('/api/tim')
    const data = await res.json()
    setAnggota(data)
    setLoading(false)
  }

  useEffect(() => { fetchAnggota() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (fotoFile) fd.append('foto', fotoFile)

      const url = editId ? `/api/tim/${editId}` : '/api/tim'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) throw new Error((await res.json()).error)

      showMsg('success', editId ? 'Anggota berhasil diupdate!' : 'Anggota berhasil ditambahkan!')
      setShowForm(false)
      setEditId(null)
      setForm(emptyForm)
      setFotoFile(null)
      if (fileRef.current) fileRef.current.value = ''
      fetchAnggota()
    } catch (err: any) {
      showMsg('error', err.message ?? 'Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (a: Anggota) => {
    setEditId(a.id)
    setForm({
      nama: a.nama,
      peran: a.peran,
      kontak: a.kontak ?? '',
      urutan: String(a.urutan),
    })
    setFotoFile(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus anggota ini?')) return
    const res = await fetch(`/api/tim/${id}`, { method: 'DELETE' })
    if (res.ok) {
      showMsg('success', 'Anggota berhasil dihapus!')
      fetchAnggota()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-green-900">Kelola Tim</h1>
          <p className="text-stone-500 mt-1">Tambah, edit, dan hapus anggota tim KKN</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setFotoFile(null) }}
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Anggota
        </button>
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

      {showForm && (
        <div className="bg-white rounded-2xl shadow-card border border-stone-200 p-6 mb-8">
          <h2 className="font-playfair text-xl font-bold text-green-900 mb-6">
            {editId ? 'Edit Anggota' : 'Tambah Anggota Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nama Lengkap *</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="form-input"
                  placeholder="Nama lengkap anggota"
                  required
                />
              </div>
              <div>
                <label className="form-label">Peran / Jabatan *</label>
                <input
                  type="text"
                  value={form.peran}
                  onChange={(e) => setForm({ ...form, peran: e.target.value })}
                  className="form-input"
                  placeholder="Contoh: Koordinator Desa"
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Kontak (WhatsApp/Link)</label>
                <input
                  type="text"
                  value={form.kontak}
                  onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                  className="form-input"
                  placeholder="wa.me/6281234567890"
                />
              </div>
              <div>
                <label className="form-label">Urutan Tampil</label>
                <input
                  type="number"
                  value={form.urutan}
                  onChange={(e) => setForm({ ...form, urutan: e.target.value })}
                  className="form-input"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Foto Profil {editId ? '(opsional, kosongkan untuk pertahankan foto lama)' : '(opsional)'}</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setFotoFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-stone-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 file:font-medium hover:file:bg-green-200 file:cursor-pointer border border-stone-200 rounded-xl p-2"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Menyimpan...' : editId ? 'Update Anggota' : 'Simpan Anggota'}
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

      {loading ? (
        <div className="text-center py-20 text-stone-400">Memuat data...</div>
      ) : anggota.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <p className="text-5xl mb-4">👥</p>
          <p className="text-stone-500">Belum ada anggota. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anggota.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
              <div className="relative h-36 bg-gradient-to-br from-green-100 to-green-200">
                {a.foto ? (
                  <Image src={a.foto} alt={a.nama} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center">
                      <span className="text-2xl font-playfair font-bold text-green-700">
                        {a.nama.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-green-900">{a.nama}</h3>
                <p className="text-stone-500 text-sm">{a.peran}</p>
                {a.kontak && <p className="text-green-600 text-xs mt-1 truncate">{a.kontak}</p>}
                <p className="text-stone-400 text-xs mt-0.5">Urutan: {a.urutan}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(a)} className="btn-warning flex-1 justify-center text-sm py-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="btn-danger flex-1 justify-center text-sm py-2">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
