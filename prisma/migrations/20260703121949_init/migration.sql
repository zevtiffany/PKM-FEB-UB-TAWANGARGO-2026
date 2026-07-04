-- CreateTable
CREATE TABLE "InfoDesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "nama" TEXT NOT NULL DEFAULT 'Desa Tawangargo',
    "kecamatan" TEXT NOT NULL DEFAULT 'Kecamatan Karangploso',
    "kabupaten" TEXT NOT NULL DEFAULT 'Kabupaten Malang',
    "deskripsi" TEXT NOT NULL,
    "jumlahDusun" INTEGER NOT NULL DEFAULT 6,
    "namaaDusun" TEXT NOT NULL DEFAULT 'Suwaluhan, Kalimalang, Leban, Ngudi, Lasah, Boro',
    "jumlahPenduduk" INTEGER NOT NULL DEFAULT 10211,
    "mayoritas" TEXT NOT NULL DEFAULT 'Petani & Perkebunan (57%)',
    "komoditas" TEXT NOT NULL DEFAULT 'Sawi, Kol, Brokoli, Tomat, Seledri, Cabai, Jagung',
    "dikenal" TEXT NOT NULL DEFAULT 'Desa Wisata Sayur Mayur Lereng Gunung Arjuno',
    "emailKontak" TEXT NOT NULL DEFAULT 'kkntawangargo@example.com',
    "waKontak" TEXT NOT NULL DEFAULT '+6281234567890',
    "periodeMulai" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "periodeSelesai" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Kegiatan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "keterangan" TEXT,
    "kegiatanId" INTEGER NOT NULL,
    CONSTRAINT "Foto_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "Kegiatan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Anggota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "peran" TEXT NOT NULL,
    "foto" TEXT,
    "kontak" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
