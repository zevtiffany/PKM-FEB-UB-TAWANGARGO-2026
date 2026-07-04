import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: 'Panel Admin | KKN Tawangargo',
  robots: 'noindex,nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 font-jakarta relative z-0">
      <AdminSidebar />
      <div className="md:ml-64 min-h-screen bg-stone-50">
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  )
}
