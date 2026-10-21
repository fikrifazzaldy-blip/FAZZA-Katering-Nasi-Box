import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setIsAdminOpen } = useApp();

  return (
    <footer className="bg-[#291811] text-stone-300 pt-16 pb-12 border-t border-orange-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/src/assets/images/young_chef_profile_1792499414113.jpg"
                alt="Chef FAZZA FOOD"
                className="w-10 h-10 rounded-full object-cover border border-amber-300/40"
              />
              <span className="text-2xl tracking-wider text-white font-brand">
                {settings.storeName}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Layanan katering online profesional untuk nasi box harian, prasmanan resepsi pernikahan, hajatan, rapat kantor, dan acara keluarga di wilayah Karangpucung, Gandrungmangu, dan sekitarnya (Cilacap).
            </p>
            <div className="text-xs text-amber-400 font-semibold">
              {settings.tagline}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigasi Cepat</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#beranda" className="hover:text-orange-400 transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-orange-400 transition-colors">
                  Daftar Menu & Harga
                </a>
              </li>
              <li>
                <a href="#paket" className="hover:text-orange-400 transition-colors">
                  Paket Katering Acara
                </a>
              </li>
              <li>
                <a href="#cara-pemesanan" className="hover:text-orange-400 transition-colors">
                  Cara Pemesanan 4 Langkah
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-orange-400 transition-colors">
                  Tentang Dapur Kami
                </a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-orange-400 transition-colors">
                  Kontak & Jam Operasional
                </a>
              </li>
            </ul>
          </div>

          {/* Jam & Layanan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Dapur & Operasional</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p>
                <strong className="text-stone-200">Jam Layanan:</strong>
                <br />
                {settings.openingHours}
              </p>
              <p>
                <strong className="text-stone-200">Alamat Dapur:</strong>
                <br />
                {settings.address}
              </p>
              <p>
                <strong className="text-stone-200">WhatsApp Resmi:</strong>
                <br />
                {settings.displayPhone}
              </p>
            </div>
          </div>

          {/* Admin & Keamanan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Akses Pengelola</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Pengelola dapat mengelola pesanan, mengubah harga menu, paket katering, dan nomor WhatsApp melalui panel admin.
            </p>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Buka Panel Admin</span>
            </button>
            <p className="text-[11px] text-stone-500">
              *Demo PIN: <code className="text-amber-300">fazza123</code>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-stone-400">
              Data demo tersimpan lokal di browser (LocalStorage)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
