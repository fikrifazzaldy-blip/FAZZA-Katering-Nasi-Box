import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, MenuCategory } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Search, Plus, Minus, ShoppingBag, Eye, Flame, Check } from 'lucide-react';

export const FeaturedMenu: React.FC = () => {
  const { menus, addToCart, setSelectedDetailItem } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  
  // Local portion quantities per card
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQtyChange = (itemId: string, minOrder: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || minOrder;
      const next = current + delta;
      return {
        ...prev,
        [itemId]: next >= minOrder ? next : minOrder,
      };
    });
  };

  const getQty = (item: MenuItem) => {
    return quantities[item.id] || item.minOrder;
  };

  // Filter logic
  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }

      // Price filter
      if (priceFilter === 'under20k' && item.price >= 20000) return false;
      if (priceFilter === '20k-30k' && (item.price < 20000 || item.price > 30000)) return false;
      if (priceFilter === 'above30k' && item.price <= 30000) return false;

      return true;
    });
  }, [menus, selectedCategory, searchTerm, priceFilter]);

  const categories = [
    { id: 'all', label: 'Semua Menu' },
    { id: 'nasi_box', label: 'Nasi Box' },
    { id: 'prasmanan', label: 'Prasmanan & Buffet' },
    { id: 'spesial', label: 'Spesial Tumpeng' },
    { id: 'snack_minuman', label: 'Snack & Minuman' },
  ];

  return (
    <section id="menu" className="py-16 md:py-24 bg-[#FAF5EE]/60 border-t border-b border-orange-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <span>Daftar Menu FAZZA FOOD</span>
            <span aria-hidden="true">·</span>
            <span>Higienis & Lezat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#291811]">
            Pilihan Menu Katering Favorit
          </h2>
          <p className="text-sm sm:text-base text-[#43281C]/75">
            Setiap porsi diracik dari bahan segar dengan bumbu rempah asli nusantara. Harga dapat disesuaikan dan diatur oleh admin secara langsung.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari menu (contoh: Ayam Goreng, Bakar, Lele)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-[#FFFDF9]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-medium"
                >
                  Hapus
                </button>
              )}
            </div>

            {/* Price Filter Segment */}
            <div className="w-full md:w-auto flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">Rentang Harga:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="all">Semua Harga</option>
                <option value="under20k">Di bawah Rp20.000</option>
                <option value="20k-30k">Rp20.000 - Rp30.000</option>
                <option value="above30k">Di atas Rp30.000</option>
              </select>
            </div>
          </div>

          {/* Category Tabs (Segmented Buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Grid */}
        {filteredMenus.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
            <p className="text-stone-600 font-medium">Tidak ada menu yang sesuai dengan pencarian Anda.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceFilter('all');
              }}
              className="mt-3 text-xs font-bold text-orange-600 hover:text-orange-700 underline"
            >
              Reset semua filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredMenus.map((item) => {
              const qty = getQty(item);
              const subtotal = item.price * qty;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-orange-950/10 shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Image Container with Fallback */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback container image
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />

                    {/* Spicy Level Tag if any */}
                    {item.spicyLevel && item.spicyLevel > 0 && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-red-600 flex items-center gap-1 shadow-sm">
                        <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        <span>Pedas {item.spicyLevel === 3 ? 'Ekstra' : 'Sedang'}</span>
                      </div>
                    )}

                    {/* Availability Tag */}
                    {!item.available && (
                      <div className="absolute inset-0 bg-stone-900/70 flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                          Habis Sementara
                        </span>
                      </div>
                    )}

                    {/* Quick View Button */}
                    <button
                      onClick={() => setSelectedDetailItem(item)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-stone-700 rounded-lg shadow-sm transition-transform active:scale-90"
                      title="Lihat Detail & Komposisi"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Clean unboxed category label */}
                      <div className="text-[11px] font-semibold tracking-wider uppercase text-orange-700 mb-1">
                        {item.category === 'nasi_box'
                          ? 'Nasi Box'
                          : item.category === 'prasmanan'
                          ? 'Prasmanan / Buffet'
                          : item.category === 'spesial'
                          ? 'Spesial Tumpeng'
                          : 'Snack Box'}
                        <span className="text-stone-300 mx-1.5">·</span>
                        <span className="text-stone-500">Min. {item.minOrder} porsi</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-[#291811] group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#43281C]/75 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Inclusions summary preview */}
                      {item.packageContents && item.packageContents.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-wrap gap-1 text-[11px] text-stone-600">
                          {item.packageContents.slice(0, 3).map((pc, idx) => (
                            <span key={idx} className="bg-stone-50 px-1.5 py-0.5 rounded text-stone-700">
                              ✓ {pc}
                            </span>
                          ))}
                          {item.packageContents.length > 3 && (
                            <span className="text-stone-400">+{item.packageContents.length - 3} lainnya</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Pricing, Stepper & Add to Cart */}
                    <div className="pt-3 border-t border-orange-950/10 space-y-3">
                      {/* Price & Subtotal */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-stone-500">Harga satuan:</span>
                          <div className="text-lg font-bold text-orange-600 font-mono tabular-nums">
                            {formatRupiah(item.price)}
                            <span className="text-xs font-normal text-stone-500"> / porsi</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-stone-500">Subtotal ({qty} porsi):</span>
                          <div className="text-base font-bold text-[#291811] font-mono tabular-nums">
                            {formatRupiah(subtotal)}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Add to Cart button */}
                      <div className="flex items-center gap-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, item.minOrder, -5)}
                            className="p-1.5 hover:bg-white rounded-lg text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-40"
                            disabled={!item.available || qty <= item.minOrder}
                            title={`Kurangi 5 (Min ${item.minOrder})`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-bold text-xs sm:text-sm text-[#291811] font-mono tabular-nums">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, item.minOrder, 5)}
                            className="p-1.5 hover:bg-white rounded-lg text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-40"
                            disabled={!item.available}
                            title="Tambah 5 porsi"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={() => addToCart(item, qty)}
                          disabled={!item.available}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>+ Keranjang</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
