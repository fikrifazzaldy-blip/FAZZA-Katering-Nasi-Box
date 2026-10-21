import React from 'react';
import { useApp } from '../context/AppContext';
import { TESTIMONIALS_SAMPLE } from '../data/initialData';
import { Award, ShieldCheck, HeartHandshake, Star, Quote } from 'lucide-react';

export const AboutAndTestimonials: React.FC = () => {
  const { settings } = useApp();

  return (
    <div id="tentang" className="py-16 md:py-24 space-y-20">
      {/* 1. About FAZZA FOOD Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#43281C] to-[#291811] text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <span>Dapur Sentral Higienis</span>
                <span aria-hidden="true">·</span>
                <span>Tentang {settings.storeName}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white leading-tight">
                Dedikasi Menghidangkan Cita Rasa Nusantara Terbaik
              </h2>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Berdiri dengan semangat menyajikan hidangan lezat rumahan berkualitas restoran, <span className="text-amber-400 font-semibold">{settings.storeName}</span> hadir sebagai solusi katering tepercaya. Kami percaya bahwa setiap acara—baik santapan harian kantor, syukuran keluarga, hingga jamuan pernikahan—pantas mendapatkan santapan terbaik yang diolah dengan higienis, halal, dan penuh ketulusan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Higienis & Halal</span>
                  </div>
                  <p className="text-xs text-stone-400">Peralatan sanitasi stainless steel & sertifikasi halal</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Award className="w-4 h-4" />
                    <span>Bumbu Asli</span>
                  </div>
                  <p className="text-xs text-stone-400">Rempah lokal segar tanpa pengawet berbahaya</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <HeartHandshake className="w-4 h-4" />
                    <span>Layanan Amanah</span>
                  </div>
                  <p className="text-xs text-stone-400">Komitmen tepat waktu demi kelancaran momentum Anda</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              {/* Profile Card Young Chef */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-md flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src="/src/assets/images/young_chef_profile_1792499414113.jpg"
                    alt="Chef FAZZA FOOD"
                    className="w-20 h-20 rounded-full object-cover border-2 border-amber-300/80 shadow-lg"
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Komitmen Dapur Sentral Kami:
                  </p>
                  <p className="text-xs text-stone-200 italic leading-relaxed">
                    "Setiap butir nasi dan racikan bumbu rempah kami olah secara higienis dari dapur Karanggintung untuk menyukseskan setiap momen istimewa Anda di Gandrungmangu, Karangpucung, dan sekitarnya."
                  </p>
                </div>
              </div>

              {/* Kitchen Capacity */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Spesifikasi Dapur & Kapasitas Produksi:
                </h3>
                <ul className="space-y-2 text-xs text-stone-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                    <span><strong>Kapasitas Harian:</strong> Hingga 2.500 box nasi & 5 event prasmanan per hari.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                    <span><strong>Jangkauan Antar:</strong> Wilayah Karangpucung, Gandrungmangu, dan sekitarnya (Cilacap).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                    <span><strong>Packaging:</strong> Kotak ramah lingkungan (eco-friendly bento) food-grade.</span>
                  </li>
                </ul>
                <div className="pt-2 text-[11px] text-stone-400 border-t border-white/10">
                  Alamat Dapur: {settings.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Testimonials Section (Clearly labeled as sample / contoh as requested) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <span>Ulasan & Pengalaman Katering</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">Contoh Ulasan Pelanggan</span>
          </div>
          <h2 className="text-3xl font-bold font-display text-[#291811]">
            Apa Kata Mereka Tentang Rasa Kami
          </h2>
          <p className="text-xs sm:text-sm text-[#43281C]/70">
            *Diberi label contoh ulasan untuk transparansi demo bisnis katering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_SAMPLE.map((testi) => (
            <div
              key={testi.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-2">5.0 / 5.0</span>
                </div>

                {/* Event tag */}
                <div className="text-[11px] font-bold text-orange-700 mb-2">
                  Acara: {testi.event}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  "{testi.comment}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#291811]">{testi.name}</h4>
                  <p className="text-[11px] text-stone-500">{testi.role} · {testi.city}</p>
                </div>
                <Quote className="w-5 h-5 text-orange-200 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
