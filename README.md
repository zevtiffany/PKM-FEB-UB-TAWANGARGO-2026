# 🌿 Website KKN Desa Tawangargo

Website resmi program Kuliah Kerja Nyata (KKN) di **Desa Tawangargo, Kecamatan Karangploso, Kabupaten Malang**.

Dibuat dengan Next.js 14, Tailwind CSS, dan SQLite (Prisma ORM).

---

## 🚀 Cara Menjalankan Lokal

### 1. Persiapan Awal (Sekali Saja)

```bash
# Install semua dependensi
npm install

# Buat database dan isi data awal
npx prisma migrate dev --name init
npx prisma db seed
```

### 2. Jalankan Server

```bash
npm run dev
```

Website akan buka di **http://localhost:3000**

---

## ⚙️ Konfigurasi

Buat file `.env.local` di folder utama project (copy dari `.env.example`):

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password_pilihan_anda
SESSION_SECRET=string_acak_minimal_32_karakter
DATABASE_URL="file:./prisma/dev.db"
```

> ⚠️ **Ganti `ADMIN_PASSWORD` dan `SESSION_SECRET`** sebelum dipakai publik!

---

## 🔑 Cara Pakai Panel Admin

### Masuk ke Panel Admin

1. Buka browser, pergi ke **http://localhost:3000/admin/login**
2. Masukkan username dan password sesuai `.env.local`
3. Klik **Masuk**

---

### 📅 Mengelola Kegiatan (Program Kerja)

**Tambah Kegiatan Baru:**
1. Klik menu **Kelola Kegiatan** di sidebar
2. Klik tombol **"Tambah Kegiatan"** (pojok kanan atas)
3. Isi formulir:
   - **Judul** — nama kegiatan (wajib)
   - **Tanggal** — tanggal pelaksanaan (wajib)
   - **Kategori** — pilih dari daftar yang tersedia
   - **Deskripsi** — penjelasan lengkap kegiatan
   - **Foto** — bisa pilih beberapa foto sekaligus (opsional)
4. Klik **"Simpan Kegiatan"**

**Edit Kegiatan:**
1. Cari kegiatan di daftar
2. Klik tombol **"Edit"** (kuning)
3. Ubah data yang perlu
4. Klik **"Update Kegiatan"**

**Hapus Kegiatan:**
1. Klik tombol **"Hapus"** (merah)
2. Konfirmasi dengan klik **"OK"**
> ⚠️ Menghapus kegiatan akan menghapus semua fotonya juga!

**Tambah/Hapus Foto:**
1. Klik **"▼ Foto"** di kegiatan yang ingin dikelola
2. Untuk hapus: hover foto → klik tombol **"×"** merah
3. Untuk tambah: pilih file foto → klik **"Upload"**

---

### 👥 Mengelola Tim KKN

**Tambah Anggota:**
1. Klik menu **Kelola Tim** di sidebar
2. Klik **"Tambah Anggota"**
3. Isi nama, peran, kontak (format: `wa.me/6281xxx`), dan foto profil
4. Field **Urutan** menentukan posisi di halaman Tim (angka kecil = tampil duluan)
5. Klik **"Simpan Anggota"**

**Edit/Hapus Anggota:**
- Tombol **Edit** (kuning) dan **Hapus** (merah) ada di tiap kartu anggota

---

### 🏘️ Mengedit Info Desa

1. Klik menu **Info Desa** di sidebar
2. Edit data yang ingin diubah:
   - Nama, kecamatan, kabupaten desa
   - Deskripsi panjang tentang desa
   - Statistik: jumlah dusun, jumlah penduduk
   - Nama-nama dusun (pisah dengan koma)
   - Komoditas unggulan (pisah dengan koma)
   - Email dan nomor WhatsApp kontak
   - Periode mulai dan selesai KKN
3. Klik **"💾 Simpan Semua Perubahan"**

---

## 🏗️ Build untuk Production

```bash
npm run build
npm run start
```

---

## 🌐 Hosting yang Disarankan

| Platform | Cocok? | Catatan |
|---|---|---|
| **Railway** | ✅ Terbaik | Persistent disk, support Node.js + SQLite |
| **Render** | ✅ Bagus | Free tier, ada sleep 15 menit idle |
| **VPS** | ✅ Kontrol penuh | Perlu setup Node.js & PM2 |
| Vercel | ❌ Tidak cocok | Filesystem tidak persisten → data hilang |

---

## 📂 Struktur File Penting

```
/prisma/dev.db          → Database SQLite (jangan dihapus!)
/public/uploads/        → Foto yang diupload admin
/src/app/               → Halaman-halaman website
/src/app/admin/         → Panel admin
/src/app/api/           → Backend API
```

---

*Website ini dibuat untuk KKN FEB Universitas Brawijaya di Desa Tawangargo* 🌿
