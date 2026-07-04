import { prisma } from '@/lib/prisma'
import ScrollReveal from '@/components/public/ScrollReveal'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Kontak | KKN Desa Tawangargo',
  description: 'Informasi kontak tim KKN Desa Tawangargo.',
}

export default async function KontakPage() {
  const infoDesa = await prisma.infoDesa.findFirst({ where: { id: 1 } })

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="relative py-16 bg-gradient-to-br from-green-900 via-green-800 to-stone-800">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-green-200 text-sm font-semibold rounded-full mb-4">
            Kontak
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Hubungi Kami
          </h1>
          <p className="text-green-200 text-lg max-w-xl mx-auto">
            Ada pertanyaan atau ingin berkolaborasi? Jangan ragu untuk menghubungi tim KKN kami.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <ScrollReveal>
              <div className="bg-white rounded-3xl p-8 shadow-card border border-stone-100">
                <h2 className="font-playfair text-2xl font-bold text-green-900 mb-6">
                  Informasi Kontak
                </h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                      📍
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Lokasi</p>
                      <p className="text-stone-600 text-sm mt-1">
                        Desa Tawangargo, {infoDesa?.kecamatan}<br />
                        {infoDesa?.kabupaten}, Jawa Timur<br />
                        Indonesia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                      ✉️
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Email</p>
                      <a
                        href={`mailto:${infoDesa?.emailKontak}`}
                        className="text-green-700 hover:text-green-900 text-sm mt-1 block transition-colors"
                      >
                        {infoDesa?.emailKontak}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                      💬
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">WhatsApp</p>
                      <a
                        href={`https://wa.me/${infoDesa?.waKontak?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 hover:text-green-900 text-sm mt-1 block transition-colors"
                      >
                        {infoDesa?.waKontak}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">
                      🏔️
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Periode KKN</p>
                      <p className="text-stone-600 text-sm mt-1">
                        {infoDesa?.periodeMulai
                          ? new Date(infoDesa.periodeMulai).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : '-'}{' '}
                        s/d{' '}
                        {infoDesa?.periodeSelesai
                          ? new Date(infoDesa.periodeSelesai).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100">
                  <a
                    href={`https://wa.me/${infoDesa?.waKontak?.replace(/[^0-9]/g, '')}?text=Halo%20Tim%20KKN%20Tawangargo%2C%20saya%20ingin%20bertanya...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Chat via WhatsApp
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Map */}
          <ScrollReveal delay={150}>
            <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-stone-100 h-full min-h-96">
              <div className="p-6 border-b border-stone-100">
                <h2 className="font-playfair text-2xl font-bold text-green-900">
                  Lokasi Desa Tawangargo
                </h2>
                <p className="text-stone-500 text-sm mt-1">
                  Kecamatan Karangploso, Kabupaten Malang
                </p>
              </div>
              <div className="relative h-80 md:h-full min-h-72">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15800.17788218082!2d112.5726!3d-7.8726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e788609a5dc8f59%3A0x5027a76e355be70!2sTawangargo%2C%20Karangploso%2C%20Malang%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1720000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '350px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Desa Tawangargo"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
