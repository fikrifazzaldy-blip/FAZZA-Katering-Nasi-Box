import React from 'react';
import { useApp } from '../context/AppContext';
import {
  formatRupiah,
  formatIndonesianDate,
  generateWhatsAppOrderMessage,
  createWhatsAppUrl,
} from '../utils/formatters';
import {
  CheckCircle2,
  Printer,
  Copy,
  MessageCircle,
  X,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const {
    latestPlacedOrder,
    setLatestPlacedOrder,
    settings,
    setPrintReceiptOrder,
    showToast,
  } = useApp();

  if (!latestPlacedOrder) return null;

  const order = latestPlacedOrder;
  const waMessage = generateWhatsAppOrderMessage(order, settings);
  const waUrl = createWhatsAppUrl(settings.whatsappNumber, waMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(waMessage);
    showToast('Teks pesanan berhasil disalin ke clipboard!', 'success');
  };

  const handlePrint = () => {
    setPrintReceiptOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#FFFDF9] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-6">
        <button
          onClick={() => setLatestPlacedOrder(null)}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-bold font-display text-[#291811]">
            Pesanan Berhasil Dikirim!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            ID Pesanan Anda:{' '}
            <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              {order.id}
            </span>
          </p>
        </div>

        {/* Important Disclaimer Card */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Pemberitahuan Status Pesanan:</span>
          </div>
          <p className="leading-relaxed">
            Pesanan Anda belum dianggap dikonfirmasi sebelum disetujui oleh admin <strong>{settings.storeName}</strong>. Jika tab WhatsApp tidak terbuka otomatis, silakan klik tombol hijau di bawah ini untuk mengirim pesan.
          </p>
        </div>

        {/* Quick Receipt Summary */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
          <div className="flex justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">Pemesan:</span>
            <span className="font-bold text-stone-900">{order.customerName}</span>
          </div>
          <div className="flex justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">Waktu Kirim:</span>
            <span className="font-semibold text-stone-900">
              {formatIndonesianDate(order.deliveryDate)}, {order.deliveryTime} WIB
            </span>
          </div>
          <div className="flex justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">Total Porsi:</span>
            <span className="font-semibold text-stone-900">{order.totalPortions} Porsi</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-bold text-stone-900">
            <span>Total Tagihan:</span>
            <span className="font-mono text-orange-600 tabular-nums">
              {formatRupiah(order.grandTotal)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Primary WhatsApp Action */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Kirim / Buka Chat WhatsApp Sekarang</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-orange-600" />
              <span>Cetak Bukti Nota</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4 text-stone-600" />
              <span>Salin Teks Pesanan</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setLatestPlacedOrder(null)}
            className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
          >
            Tutup Jendela Ini
          </button>
        </div>
      </div>
    </div>
  );
};
