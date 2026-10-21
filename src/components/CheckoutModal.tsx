import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventType, PaymentMethod, Order } from '../types';
import {
  formatRupiah,
  formatIndonesianDate,
  generateWhatsAppOrderMessage,
  createWhatsAppUrl,
} from '../utils/formatters';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    settings,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    showToast,
  } = useApp();

  // Step 1 = Isi Data, Step 2 = Ringkasan & Konfirmasi Sebelum Kirim
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Date validation: prevent past dates! Minimum date is today
  const todayIso = new Date().toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState(todayIso);
  const [deliveryTime, setDeliveryTime] = useState('11:30');
  const [eventType, setEventType] = useState<EventType>('Rapat Kantor');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer_bca');
  const [promoCode, setPromoCode] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCheckoutOpen) return null;

  const totalPortions = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isFreeDelivery = deliveryType === 'pickup' || cartSubtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = deliveryType === 'pickup' ? 0 : (isFreeDelivery ? 0 : settings.defaultDeliveryFee);

  // Discount calculation if promo code is applied
  let discountAmount = 0;
  if (promoCode.trim().toUpperCase() === 'FAZZABARU' && cartSubtotal >= 100000) {
    discountAmount = Math.min(50000, (cartSubtotal * 10) / 100);
  } else if (promoCode.trim().toUpperCase() === 'HEMAT20' && cartSubtotal >= 300000) {
    discountAmount = Math.min(100000, (cartSubtotal * 20) / 100);
  }

  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  // Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.customerName = 'Nama lengkap pemesan wajib diisi';
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.customerPhone = 'Nomor WhatsApp wajib diisi (minimal 10 angka)';
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      errs.deliveryAddress = 'Alamat lengkap pengiriman wajib diisi untuk layanan antar';
    }

    if (!deliveryDate) {
      errs.deliveryDate = 'Tanggal acara/pengiriman wajib dipilih';
    } else {
      const selected = new Date(deliveryDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < now) {
        errs.deliveryDate = 'Tanggal tidak boleh di masa lalu. Harap pilih hari ini atau tanggal mendatang.';
      }
    }

    if (!deliveryTime) {
      errs.deliveryTime = 'Jam pengiriman wajib diisi';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    } else {
      showToast('Mohon lengkapi kolom yang masih bertanda merah.', 'warning');
    }
  };

  const handleFinalSubmit = () => {
    const orderPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress.trim() : `Ambil di Dapur (${settings.address})`,
      deliveryDate,
      deliveryTime,
      eventType,
      totalPortions,
      specialNotes: specialNotes.trim(),
      deliveryType,
      paymentMethod,
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee,
      discountAmount,
      promoCode: promoCode ? promoCode.toUpperCase() : undefined,
      grandTotal,
    };

    // 1. Place order in context (persisted in localStorage)
    const placedOrder = placeOrder(orderPayload);

    // 2. Build WhatsApp message text & URL
    const message = generateWhatsAppOrderMessage(placedOrder, settings);
    const waUrl = createWhatsAppUrl(settings.whatsappNumber, message);

    // 3. Close checkout modal
    setIsCheckoutOpen(false);

    // 4. Open WhatsApp directly in new window
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#FFFDF9] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <div className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">
              {step === 1 ? 'Langkah 1 dari 2' : 'Langkah 2 dari 2'}
            </div>
            <h2 className="text-xl font-bold text-[#291811]">
              {step === 1 ? 'Formulir Pemesanan Katering' : 'Ringkasan & Konfirmasi Pesanan'}
            </h2>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {step === 1 ? (
            <form onSubmit={handleNextToSummary} className="space-y-5">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
                  <User className="w-4 h-4 text-orange-600" />
                  <span>Informasi Kontak Pemesan</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nama Lengkap Pemesan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Ibu Rina Melati"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 ${
                        errors.customerName
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-stone-200 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 ${
                        errors.customerPhone
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-stone-200 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-red-600 mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Event & Schedule Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>Jadwal & Jenis Acara</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Jenis Momentum Acara <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as EventType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="Rapat Kantor">Rapat Kantor</option>
                      <option value="Katering Harian">Katering Harian</option>
                      <option value="Nasi Box Acara">Nasi Box Acara</option>
                      <option value="Pengajian / Syukuran">Pengajian / Syukuran</option>
                      <option value="Ulang Tahun">Ulang Tahun</option>
                      <option value="Pernikahan / Prasmanan">Pernikahan / Prasmanan</option>
                      <option value="Acara Keluarga">Acara Keluarga</option>
                      <option value="Lainnya">Acara Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tanggal Pengantaran <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      min={todayIso}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 ${
                        errors.deliveryDate
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-stone-200 focus:ring-orange-500/20'
                      }`}
                    />
                    {errors.deliveryDate && (
                      <p className="text-xs text-red-600 mt-1">{errors.deliveryDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Jam Tiba di Lokasi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="07:30">07:30 WIB (Pagi)</option>
                      <option value="09:00">09:00 WIB (Pagi)</option>
                      <option value="10:30">10:30 WIB (Menjelang Siang)</option>
                      <option value="11:30">11:30 WIB (Makan Siang)</option>
                      <option value="12:30">12:30 WIB (Siang)</option>
                      <option value="14:00">14:00 WIB (Sore)</option>
                      <option value="16:00">16:00 WIB (Sore)</option>
                      <option value="17:30">17:30 WIB (Makan Malam)</option>
                      <option value="19:00">19:00 WIB (Malam)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery Method & Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span>Metode Pengambilan & Alamat</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 font-semibold'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">Diantar Kurir Fazza</span>
                    <span className="text-[11px] text-stone-500 mt-1">
                      {isFreeDelivery ? 'Ongkir GRATIS' : `Ongkir ${formatRupiah(settings.defaultDeliveryFee)}`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 font-semibold'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">Ambil Sendiri di Dapur</span>
                    <span className="text-[11px] text-stone-500 mt-1">Tanpa Biaya Pengantaran</span>
                  </button>
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Alamat Lengkap Pengiriman & Patokan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Nama Jalan, No. Rumah/Gedung, Lantai/Unit, Kelurahan, Kecamatan, Patokan lokasi..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 ${
                        errors.deliveryAddress
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-stone-200 focus:ring-orange-500/20'
                      }`}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-xs text-red-600 mt-1">{errors.deliveryAddress}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <span>Pilihan Metode Pembayaran</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'transfer_bca', label: 'Transfer Bank BCA' },
                    { id: 'transfer_mandiri', label: 'Transfer Bank Mandiri' },
                    { id: 'transfer_bri', label: 'Transfer Bank BRI' },
                    { id: 'qris', label: 'QRIS (Gopay/OVO/ShopeePay/BCA)' },
                    { id: 'cod', label: 'Bayar Tunai saat Terima (COD)' },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === pm.id
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id as PaymentMethod)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-xs sm:text-sm">{pm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Notes & Promo Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Catatan Khusus / Permintaan Khusus
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sambal dipisah, tidak pakai MSG, nota resmi..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kode Voucher Promo (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan kode FAZZABARU"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm uppercase font-mono bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs sm:text-sm font-semibold"
                >
                  Kembali ke Keranjang
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Review Ringkasan Pesanan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Ringkasan Sebelum Konfirmasi */
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Periksa Kembali Rincian Anda Sebelum Mengirim</p>
                  <p className="mt-0.5 leading-relaxed text-amber-800">
                    Setelah menekan tombol konfirmasi, pesanan akan tersimpan dan WhatsApp akan terbuka otomatis untuk konfirmasi dengan Admin {settings.storeName}. Pesanan belum dianggap sah sebelum disetujui admin.
                  </p>
                </div>
              </div>

              {/* Summary details card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-stone-500 block">Nama Pemesan:</span>
                    <span className="font-bold text-stone-900 text-sm">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">WhatsApp Pemesan:</span>
                    <span className="font-bold text-stone-900 text-sm">{customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Jenis Acara:</span>
                    <span className="font-bold text-stone-900 text-sm">{eventType}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Waktu Pengantaran:</span>
                    <span className="font-bold text-stone-900 text-sm">
                      {formatIndonesianDate(deliveryDate)}, Pukul {deliveryTime} WIB
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-500 block">Layanan & Alamat:</span>
                    <span className="font-semibold text-stone-900">
                      {deliveryType === 'delivery'
                        ? `Diantar ke: ${deliveryAddress}`
                        : `Ambil di Dapur Sentral (${settings.address})`}
                    </span>
                  </div>
                  {specialNotes && (
                    <div className="sm:col-span-2">
                      <span className="text-stone-500 block">Catatan Khusus:</span>
                      <span className="italic text-stone-700">"{specialNotes}"</span>
                    </div>
                  )}
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">Menu Yang Dipesan:</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cart.map((it) => (
                      <div
                        key={it.cartItemId}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-stone-50"
                      >
                        <div>
                          <span className="font-bold text-stone-900">{it.name}</span>
                          <span className="text-stone-500 ml-2 font-mono">
                            {it.quantity} porsi @ {formatRupiah(it.price)}
                          </span>
                        </div>
                        <span className="font-bold font-mono text-stone-900 tabular-nums">
                          {formatRupiah(it.quantity * it.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Calculation summary */}
                <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal Menu</span>
                    <span className="font-mono font-semibold">{formatRupiah(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Ongkos Kirim</span>
                    <span className="font-mono font-semibold">
                      {deliveryFee === 0 ? 'GRATIS' : formatRupiah(deliveryFee)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Diskon Promo</span>
                      <span className="font-mono">-{formatRupiah(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                    <span>Total Pembayaran</span>
                    <span className="text-orange-600 font-mono tabular-nums">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ubah Data</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Pesanan via WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
