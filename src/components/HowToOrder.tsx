import React from 'react';
import { ShoppingCart, CalendarClock, MessageCircle, Truck } from 'lucide-react';

export const HowToOrder: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Pilih Menu & Paket',
      desc: 'Pilih menu favorit atau paket katering khusus. Tentukan jumlah porsi sesuai tamu undangan Anda.',
      icon: ShoppingCart,
      color: 'bg-orange-100 text-orange-700',
    },
    {
      step: '02',
      title: 'Atur Jadwal & Alamat',
      desc: 'Tentukan tanggal, jam pengiriman yang diinginkan, serta alamat lengkap lokasi acara Anda.',
      icon: CalendarClock,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      step: '03',
      title: 'Konfirmasi via WhatsApp',
      desc: 'Sistem menyusun rincian pesanan secara otomatis. Tekan tombol WhatsApp untuk konfirmasi instan bersama Admin.',
      icon: MessageCircle,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      step: '04',
      title: 'Diantar Segar & Hangat',
      desc: 'Tim dapur FAZZA FOOD memasak pada hari-H dan mengantarkan pesanan tiba 30-45 menit sebelum acara dimulai.',
      icon: Truck,
      color: 'bg-stone-100 text-stone-800',
    },
  ];

  return (
    <section id="cara-pemesanan" className="py-16 md:py-24 bg-[#FAF5EE]/70 border-t border-orange-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <span>Alur Praktis 4 Langkah</span>
            <span aria-hidden="true">·</span>
            <span>Mudah & Transparan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#291811]">
            Cara Mudah Melakukan Pemesanan
          </h2>
          <p className="text-sm sm:text-base text-[#43281C]/75">
            Kami merancang sistem pemesanan seringkas mungkin agar Anda dapat fokus menyiapkan kelancaran acara tanpa repot.
          </p>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm relative flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-stone-300">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#291811] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#43281C]/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-orange-600 flex items-center gap-1">
                  <span>Langkah {idx + 1} dari 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
