import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import type { Bucket } from '@google-cloud/storage'

// Inisialisasi Firebase Admin SDK hanya jika env vars tersedia
function initFirebase() {
  if (getApps().length > 0) return getApps()[0]

  // Lewati inisialisasi saat build time (env vars belum ada)
  if (!process.env.FIREBASE_PROJECT_ID) return null

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey!,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}

// Helper: buat lazy proxy — Firebase hanya diinisialisasi saat property pertama diakses
// (saat request masuk), bukan saat module di-import (saat build)
function createLazyProxy<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_, prop) {
      const instance = factory()
      const value = (instance as any)[prop]
      return typeof value === 'function' ? value.bind(instance) : value
    },
  })
}

// Lazy exports — tidak menjalankan Firebase init saat import
export const db: Firestore = createLazyProxy(() => {
  initFirebase()
  return getFirestore()
})

export const bucket: Bucket = createLazyProxy(() => {
  initFirebase()
  return getStorage().bucket()
})

// Nama collections Firestore
export const COLLECTIONS = {
  INFO_DESA: 'info_desa',
  KEGIATAN: 'kegiatan',
  FOTO: 'foto',
  ANGGOTA: 'anggota',
} as const
