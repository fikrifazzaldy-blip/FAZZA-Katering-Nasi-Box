import React from 'react';
import { ASSET_IMAGES } from '../assets/imagesMap';
import { UtensilsCrossed, Clock, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onExploreMenu }) => {
  return (
    <section id="beranda" className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
      {/* Background soft ambient warm gradient */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 -z-10 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Grid Hero: 2-column with items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Column 1: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Clean unboxed kicker with typographic separator */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
              <span>Katering Terpercaya</span>
              <span aria-hidden="true">·</span>
              <span>100% Halal & Higienis</span>
              <span aria-hidden="true">·</span>
              <span>Gandrungmangu, Karangpucung & Sekitarnya</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-[#291811] leading-[1.15] text-balance">
              Lezatnya Hidangan,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700">
                Mudahnya Pemesanan
              </span>
            </h1>

            {/* Lead paragraph */}
            <p className="text-base sm:text-lg text-[#43281C]/80 leading-relaxed max-w-xl">
              Nikmati sajian katering istimewa bercita rasa nusantara autentik untuk nasi box harian, hajatan, pernikahan, rapat kantor, dan syukuran keluarga di wilayah Karangpucung, Gandrungmangu, dan sekitarnya (Cilacap). Pesan online praktis, tiba tepat waktu bergaransi.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOrderNow}
                className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 group"
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-orange-50 border border-stone-200 text-[#43281C] font-semibold text-sm sm:text-base shadow-sm transition-all"
              >
                Lihat Menu & Harga
              </button>
            </div>

            {/* Micro proof highlight */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#43281C]/75">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Pemesanan Minimum Mulai 5 Porsi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Bebas Konsultasi Menu via WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Column 2: Visual Asset Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-orange-950/10 shadow-2xl bg-stone-100 aspect-[4/3] lg:aspect-auto lg:h-[480px]">
              <img
                src={ASSET_IMAGES.hero}
                alt="Meja jamuan katering nusantara FAZZA FOOD dengan nasi tumpeng, ayam goreng, sate dan nasi box"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Young Chef Badge (no name label) */}
              <div className="absolute top-4 left-4 bg-[#FCFAF7]/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-[#EDE3D8] flex items-center gap-3 max-w-[240px]">
                <div className="relative shrink-0">
                  <img
                    src={ASSET_IMAGES.youngChef}
                    alt="Chef FAZZA FOOD"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#E8C2AC] shadow-xs"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-[#8C7A6E] tracking-wider">Kepala Dapur</p>
                  <p className="text-xs font-semibold text-[#2C1810] leading-snug">Racikan Rempah Segar Pilihan</p>
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white pointer-events-none">
                <p className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Pilihan Utama Acara Spesial
                </p>
                <p className="text-base font-semibold leading-tight drop-shadow-sm">
                  Dibuat dari bahan segar pilihan setiap fajar oleh tim Chef Fazza
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Feature & Trust Proof Strip below hero */}
        <div className="mt-14 pt-8 border-t border-orange-950/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#291811]">100% Halal & Higienis</h4>
              <p className="text-xs text-[#43281C]/70 mt-0.5">Dapur bersih berstandar sanitasi ketat</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#291811]">Tepat Waktu Bergaransi</h4>
              <p className="text-xs text-[#43281C]/70 mt-0.5">Tiba 30-45 menit sebelum jadwal acara</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 shrink-0">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#291811]">Rasa Nusantara Autentik</h4>
              <p className="text-xs text-[#43281C]/70 mt-0.5">Bumbu rempah tradisional warisan nusantara</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#291811]">Fleksibel Sesuai Budget</h4>
              <p className="text-xs text-[#43281C]/70 mt-0.5">Bisa katering harian hingga prasmanan akbar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
