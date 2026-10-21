import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, AlertCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateCartQuantity,
    updateCartNotes,
    removeFromCart,
    clearCart,
    cartSubtotal,
    settings,
    showToast,
  } = useApp();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
    amount: number;
  } | null>(null);

  if (!isCartOpen) return null;

  // Calculate delivery fee preview
  const isFreeDelivery = cartSubtotal >= settings.freeDeliveryThreshold;
  const estimatedDeliveryFee = isFreeDelivery ? 0 : settings.defaultDeliveryFee;

  // Calculate discount
  const discountAmount = appliedPromo ? appliedPromo.amount : 0;
  const grandTotal = Math.max(0, cartSubtotal + estimatedDeliveryFee - discountAmount);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    const matched = settings.promoCodes.find((p) => p.code.toUpperCase() === code);
    if (!matched) {
      showToast('Kode promo tidak valid atau telah berakhir.', 'error');
      return;
    }

    if (cartSubtotal < matched.minSpend) {
      showToast(
        `Minimal pembelanjaan untuk kode ini adalah ${formatRupiah(matched.minSpend)}`,
        'warning'
      );
      return;
    }

    let calculatedDiscount = (cartSubtotal * matched.discountPercent) / 100;
    if (matched.maxDiscount && calculatedDiscount > matched.maxDiscount) {
      calculatedDiscount = matched.maxDiscount;
    }

    setAppliedPromo({
      code: matched.code,
      discountPercent: matched.discountPercent,
      amount: calculatedDiscount,
    });
    showToast(`Kode promo ${matched.code} berhasil diterapkan! Hemat ${formatRupiah(calculatedDiscount)}`, 'success');
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Keranjang Anda masih kosong!', 'warning');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] shadow-2xl flex flex-col justify-between border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-[#291811]">Keranjang Pesanan</h2>
              <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                {cart.length} Menu
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-800">Keranjang Masih Kosong</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Silakan pilih hidangan lezat dan paket katering kami di halaman menu.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700"
                >
                  Mulai Pilih Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                  <span>Daftar Menu Terpilih</span>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Kosongkan Semua
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#291811] truncate">{item.name}</h4>
                        <div className="text-xs font-mono font-semibold text-orange-600 mt-0.5">
                          {formatRupiah(item.price)}{' '}
                          <span className="text-[10px] text-stone-400 font-normal">/ porsi</span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Min. pesan: {item.minOrder} porsi
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-red-600 p-1 self-start transition-colors"
                        title="Hapus menu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stepper & item subtotal */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded text-stone-600"
                          title="Kurangi"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center font-bold text-xs font-mono tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded text-stone-600"
                          title="Tambah"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">Subtotal</span>
                        <span className="text-xs sm:text-sm font-bold font-mono text-[#291811] tabular-nums">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Quick item notes input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Catatan porsi ini (contoh: sambal dipisah)..."
                        value={item.notes || ''}
                        onChange={(e) => updateCartNotes(item.cartItemId, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                ))}

                {/* Promo Code Input */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-orange-600" />
                      <span>Punya Kode Voucher Promo?</span>
                    </div>
                    <span className="text-[11px] text-orange-600 font-mono">Coba: FAZZABARU</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan kode voucher..."
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 text-xs uppercase font-mono rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Terapkan
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-semibold">
                      <span>Voucher {appliedPromo.code} Aktif</span>
                      <span>-{formatRupiah(appliedPromo.amount)}</span>
                    </div>
                  )}
                </div>

                {/* Free delivery info note */}
                {!isFreeDelivery && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>
                      Tambah belanjaan {formatRupiah(settings.freeDeliveryThreshold - cartSubtotal)} lagi untuk dapatkan <strong>GRATIS ONGKOS KIRIM</strong>!
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal Menu</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    {formatRupiah(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimasi Ongkir</span>
                  <span className="font-mono tabular-nums font-semibold">
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 font-bold">GRATIS</span>
                    ) : (
                      formatRupiah(estimatedDeliveryFee)
                    )}
                  </span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon Promo</span>
                    <span className="font-mono tabular-nums">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-bold text-[#291811]">
                  <span>Total Tagihan</span>
                  <span className="font-mono tabular-nums text-orange-600">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Formulir Pemesanan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
