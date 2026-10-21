import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CateringPackage } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Check, ShoppingBag, Eye, Users, ChevronRight } from 'lucide-react';

export const CateringPackagesSection: React.FC = () => {
  const { packages, addToCart, setSelectedDetailItem } = useApp();
  const [selectedEventType, setSelectedEventType] = useState<string>('all');

  const eventFilters = [
    { id: 'all', label: 'Semua Paket' },
    { id: 'Katering Harian', label: 'Katering Harian' },
    { id: 'Rapat Kantor', label: 'Rapat Kantor' },
    { id: 'Nasi Box Acara', label: 'Nasi Box Acara' },
    { id: 'Pernikahan / Prasmanan', label: 'Pernikahan / Prasmanan' },
    { id: 'Pengajian / Syukuran', label: 'Pengajian & Syukuran' },
    { id: 'Ulang Tahun', label: 'Ulang Tahun' },
  ];

  const filteredPackages = packages.filter((pkg) => {
    if (selectedEventType === 'all') return true;
    return pkg.eventType === selectedEventType;
  });

  return (
    <section id="paket" className="py-16 md:py-24 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <span>Solusi Lengkap Acara</span>
            <span aria-hidden="true">·</span>
            <span>Hemat & Berkelas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#291811]">
            Paket Katering Spesial Sesuai Kebutuhan
          </h2>
          <p className="text-sm sm:text-base text-[#43281C]/75">
            Disediakan khusus untuk berbagai jenis momentum. Menu lengkap dengan perlengkapan makan, jaminan rasa prima, dan layanan antar tepat waktu.
          </p>
        </div>

        {/* Event Type Filter Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {eventFilters.map((flt) => {
            const active = selectedEventType === flt.id;
            return (
              <button
                key={flt.id}
                onClick={() => setSelectedEventType(flt.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {flt.label}
              </button>
            );
          })}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl overflow-hidden border border-orange-950/10 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                {/* Image & Header */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Minimum Portion Badge */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5 text-xs font-semibold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>Min. {pkg.minPortion} Porsi</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                        {pkg.eventType}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedDetailItem(pkg)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-stone-800 rounded-lg shadow-sm"
                      title="Lihat Detail Paket"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#291811] group-hover:text-orange-600 transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-xs font-medium text-amber-700 mt-1">
                        {pkg.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-[#43281C]/75 mt-2 line-clamp-3 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Inclusions List */}
                    <div className="pt-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                        Fasilitas & Isi Paket:
                      </p>
                      <ul className="space-y-1.5 text-xs text-[#291811]">
                        {pkg.inclusions.slice(0, 4).map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="leading-tight">{inc}</span>
                          </li>
                        ))}
                        {pkg.inclusions.length > 4 && (
                          <li className="text-[11px] text-orange-600 font-semibold pl-5">
                            +{pkg.inclusions.length - 4} kelengkapan lainnya...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-stone-500 block">Mulai dari:</span>
                      <div className="text-xl font-bold text-orange-600 font-mono tabular-nums">
                        {formatRupiah(pkg.pricePerPortion)}
                        <span className="text-xs font-normal text-stone-500"> / porsi</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(pkg, pkg.minPortion)}
                      className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Pesan Paket</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
