import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed InfoDesa
  await prisma.infoDesa.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nama: 'Desa Tawangargo',
      kecamatan: 'Kecamatan Karangploso',
      kabupaten: 'Kabupaten Malang',
      deskripsi:
        'Desa Tawangargo adalah desa sejuk yang terletak di lereng Gunung Arjuno, berbatasan langsung dengan Kota Batu. Dikenal sebagai sentra sayur mayur berkualitas tinggi, desa ini menjadi pemasok utama pasar Karangploso dan Gadang. Dengan pemandangan alam yang indah berupa hamparan terasering hijau dan udara pegunungan yang segar, Tawangargo menyimpan potensi wisata dan pertanian yang luar biasa.',
      jumlahDusun: 6,
      namaaDusun: 'Suwaluhan, Kalimalang, Leban, Ngudi, Lasah, Boro',
      jumlahPenduduk: 10211,
      mayoritas: 'Petani & Perkebunan (57%)',
      komoditas: 'Sawi, Kol, Brokoli, Tomat, Seledri, Cabai, Jagung',
      dikenal: 'Desa Wisata Sayur Mayur Lereng Gunung Arjuno',
      emailKontak: 'kkntawangargo2025@gmail.com',
      waKontak: '+6281234567890',
      periodeMulai: new Date('2025-07-01'),
      periodeSelesai: new Date('2025-08-31'),
    },
  })

  // Seed Kegiatan
  const kegiatan1 = await prisma.kegiatan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      judul: 'Observasi & Pemetaan Sosial',
      tanggal: new Date('2025-07-05'),
      deskripsi:
        'Kegiatan survei dan observasi awal kondisi sosial, ekonomi, dan potensi desa. Tim KKN melakukan wawancara dengan tokoh masyarakat, kepala dusun, dan warga untuk memahami kebutuhan dan permasalahan utama yang dihadapi Desa Tawangargo.',
      kategori: 'Survei & Observasi',
    },
  })

  const kegiatan2 = await prisma.kegiatan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      judul: 'Pelatihan Digital Marketing untuk UMKM Petani',
      tanggal: new Date('2025-07-20'),
      deskripsi:
        'Pelatihan penggunaan media sosial dan platform marketplace untuk membantu para petani dan pelaku UMKM Desa Tawangargo memasarkan produk sayuran unggulan mereka secara digital. Peserta diajarkan cara membuat konten menarik, menggunakan WhatsApp Business, dan berjualan di Tokopedia/Shopee.',
      kategori: 'Pemberdayaan Ekonomi',
    },
  })

  const kegiatan3 = await prisma.kegiatan.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      judul: 'Penutupan & Serah Terima Program KKN',
      tanggal: new Date('2025-08-28'),
      deskripsi:
        'Acara penutupan resmi program KKN di Desa Tawangargo. Tim KKN mempresentasikan capaian selama 60 hari kepada perangkat desa, tokoh masyarakat, dan perwakilan kampus. Dilakukan serah terima program kerja yang telah diselesaikan untuk dilanjutkan oleh warga desa secara mandiri.',
      kategori: 'Penutupan',
    },
  })

  // Seed Anggota Tim (placeholder)
  const anggotaData = [
    {
      nama: 'Ahmad Fauzi',
      peran: 'Koordinator Desa',
      urutan: 1,
      kontak: 'wa.me/6281234567891',
    },
    {
      nama: 'Siti Rahmawati',
      peran: 'Sekretaris',
      urutan: 2,
      kontak: 'wa.me/6281234567892',
    },
    {
      nama: 'Budi Santoso',
      peran: 'Bendahara',
      urutan: 3,
      kontak: 'wa.me/6281234567893',
    },
    {
      nama: 'Dewi Kusuma',
      peran: 'Koordinator Bidang Pendidikan',
      urutan: 4,
      kontak: 'wa.me/6281234567894',
    },
    {
      nama: 'Rizky Pratama',
      peran: 'Koordinator Bidang Ekonomi',
      urutan: 5,
      kontak: 'wa.me/6281234567895',
    },
    {
      nama: 'Nurul Hidayah',
      peran: 'Koordinator Bidang Kesehatan',
      urutan: 6,
      kontak: 'wa.me/6281234567896',
    },
    {
      nama: 'Fajar Ramadhan',
      peran: 'Koordinator Bidang Lingkungan',
      urutan: 7,
      kontak: 'wa.me/6281234567897',
    },
    {
      nama: 'Ayu Lestari',
      peran: 'Koordinator Bidang Sosial Budaya',
      urutan: 8,
      kontak: 'wa.me/6281234567898',
    },
  ]

  for (const anggota of anggotaData) {
    await prisma.anggota.upsert({
      where: { id: anggota.urutan },
      update: {},
      create: { id: anggota.urutan, ...anggota },
    })
  }

  console.log('✅ Seed data berhasil dimasukkan!')
  console.log(`   - InfoDesa: Desa Tawangargo`)
  console.log(`   - Kegiatan: 3 kegiatan placeholder`)
  console.log(`   - Anggota Tim: 8 anggota placeholder`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
