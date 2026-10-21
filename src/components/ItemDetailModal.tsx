import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, CateringPackage } from '../types';
import { formatRupiah } from '../utils/formatters';
import { X, ShoppingBag, Plus, Minus, Check, Flame, Users } from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const { selectedDetailItem, setSelectedDetailItem, addToCart } = useApp();

  const isMenu = selectedDetailItem && 'price' in selectedDetailItem;
  const initialMin = selectedDetailItem
    ? isMenu
      ? (selectedDetailItem as MenuItem).minOrder
      : (selectedDetailItem as CateringPackage).minPortion
    : 1;

  const [portion, setPortion] = useState(initialMin);
  const [notes, setNotes] = useState('');

  if (!selectedDetailItem) return null;

  const price = isMenu
    ? (selectedDetailItem as MenuItem).price
    : (selectedDetailItem as CateringPackage).pricePerPortion;

  const subtotal = price * portion;

  const handleAddToCart = () => {
    addToCart(selectedDetailItem, portion, notes);
    setSelectedDetailItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#FFFDF9] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setSelectedDetailItem(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Banner */}
        <div className="relative aspect-[16/9] w-full bg-stone-100">
          <img
            src={selectedDetailItem.image}
            alt={selectedDetailItem.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
              {isMenu
                ? (selectedDetailItem as MenuItem).category.replace('_', ' ')
                : (selectedDetailItem as CateringPackage).eventType}
            </span>
            <h2 className="text-2xl font-bold font-display leading-tight mt-0.5">
              {selectedDetailItem.name}
            </h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 flex-1">
          {/* Description */}
          <p className="text-sm text-stone-700 leading-relaxed">
            {selectedDetailItem.description}
          </p>

          {/* Inclusions or Package Contents */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Kelengkapan & Komposisi Menu:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-800">
              {isMenu ? (
                (selectedDetailItem as MenuItem).packageContents?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-stone-100/70 p-2 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                (selectedDetailItem as CateringPackage).inclusions?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-stone-100/70 p-2 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Special Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Catatan Permintaan Khusus
            </label>
            <input
              type="text"
              placeholder="Contoh: Pisahkan sambal, sambal ekstra pedas, dll."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Portion Stepper & Total */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-stone-500 block">Jumlah Porsi (Min. {initialMin}):</span>
              <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1 mt-1 w-fit">
                <button
                  onClick={() => setPortion((p) => Math.max(initialMin, p - 5))}
                  className="p-1.5 hover:bg-white rounded-lg text-stone-700"
                  disabled={portion <= initialMin}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 text-center font-bold text-sm font-mono tabular-nums">
                  {portion}
                </span>
                <button
                  onClick={() => setPortion((p) => p + 5)}
                  className="p-1.5 hover:bg-white rounded-lg text-stone-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-right sm:self-end">
              <span className="text-xs text-stone-500 block">Total ({portion} porsi):</span>
              <span className="text-xl font-bold font-mono text-orange-600 tabular-nums">
                {formatRupiah(subtotal)}
              </span>
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tambahkan {portion} Porsi ke Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
