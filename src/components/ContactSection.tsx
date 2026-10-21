import React from 'react';
import { useApp } from '../context/AppContext';
import { createWhatsAppUrl } from '../utils/formatters';
import { MapPin, Clock, Phone, Mail, Instagram, Facebook, MessageCircle, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, setIsAdminOpen } = useApp();

  const directWaUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `Halo Admin ${settings.storeName}, saya ingin bertanya seputar pemesanan katering dan ketersediaan tanggal.`
  );

  return (
    <section id="kontak" className="py-16 md:py-24 bg-[#FAF5EE]/90 border-t border-orange-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <span>Hubungi Kami</span>
            <span aria-hidden="true">·</span>
            <span>Respon Cepat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#291811]">
            Informasi Dapur & Kontak Resmi
          </h2>
          <p className="text-sm sm:text-base text-[#43281C]/75">
            Konsultasikan rencana katering Anda, request food testing untuk acara besar, atau tanyakan ketersediaan tanggal acara kepada tim kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Card 1: Official Contacts & Operational Hours */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#291811] border-b border-stone-100 pb-4">
              Layanan Pelanggan {settings.storeName}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">WhatsApp Pemesanan</h4>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">{settings.displayPhone}</p>
                  <a
                    href={directWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1"
                  >
                    <span>Chat Sekarang</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Jam Operasional Dapur</h4>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">{settings.openingHours}</p>
                  <span className="text-[11px] text-stone-500 mt-1 block">Pesanan mendesak harap via WhatsApp</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Email Resmi</h4>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">{settings.email}</p>
                  <span className="text-[11px] text-stone-500 mt-1 block">Untuk proposal tender & korporat</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Media Sosial</h4>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">{settings.instagram}</p>
                  <span className="text-[11px] text-stone-500 mt-1 block">Facebook: {settings.facebook}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase">Alamat Dapur Utama & Titik Ambil:</h4>
                <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                  {settings.address}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Wilayah Pengiriman: {settings.kitchenCity}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Instant Direct Order Box */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-[#291811]">
                Punya Kebutuhan Menu Khusus?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Ingin custom menu prasmanan, diet vegetarian, request tester makanan kantor, atau ada batasan anggaran tertentu? Konsultasikan langsung dengan konsultan kuliner kami tanpa biaya.
              </p>

              <div className="mt-5 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Respon dalam 5-15 menit di jam operasional</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Bisa kirim invoice resmi ber-NPWP untuk instansi</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-100">
              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Kami via WhatsApp</span>
              </a>

              <p className="text-[11px] text-stone-500 text-center">
                *Nomor WhatsApp resmi di atas dapat diperbarui langsung oleh pengelola melalui{' '}
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-orange-600 font-bold underline"
                >
                  Dashboard Admin
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
