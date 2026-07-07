import { NextRequest, NextResponse } from 'next/server'
import { db, bucket, COLLECTIONS } from '@/lib/firebase'
import { getSession } from '@/lib/auth'

// GET all anggota
export async function GET() {
  try {
    const snapshot = await db
      .collection(COLLECTIONS.ANGGOTA)
      .orderBy('urutan', 'asc')
      .get()

    const anggota = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(anggota)
  } catch (error) {
    console.error('GET tim error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// POST create anggota
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const nama = formData.get('nama') as string
    const peran = formData.get('peran') as string
    const kontak = formData.get('kontak') as string | null
    const urutan = parseInt(formData.get('urutan') as string) || 0
    const fotoFile = formData.get('foto') as File | null

    if (!nama || !peran) {
      return NextResponse.json({ error: 'Nama dan peran wajib diisi' }, { status: 400 })
    }

    let fotoUrl: string | null = null
    let storagePath: string | null = null

    if (fotoFile && fotoFile.size > 0) {
      const buffer = Buffer.from(await fotoFile.arrayBuffer())
      const ext = fotoFile.name.split('.').pop() ?? 'jpg'
      const filename = `anggota-${Date.now()}.${ext}`
      storagePath = `anggota/${filename}`

      const fileRef = bucket.file(storagePath)
      await fileRef.save(buffer, {
        metadata: { contentType: fotoFile.type },
      })
      await fileRef.makePublic()
      fotoUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`
    }

    const data = {
      nama,
      peran,
      kontak: kontak || null,
      urutan,
      foto: fotoUrl,
      storagePath: storagePath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const ref = await db.collection(COLLECTIONS.ANGGOTA).add(data)
    return NextResponse.json({ id: ref.id, ...data }, { status: 201 })
  } catch (error) {
    console.error('POST tim error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  }
}
