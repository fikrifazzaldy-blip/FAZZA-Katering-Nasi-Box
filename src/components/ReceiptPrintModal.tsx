import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatIndonesianDate, formatIndonesianDateTime } from '../utils/formatters';
import { Printer, X } from 'lucide-react';

export const ReceiptPrintModal: React.FC = () => {
  const { printReceiptOrder, setPrintReceiptOrder, settings } = useApp();

  if (!printReceiptOrder) return null;

  const order = printReceiptOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
        {/* Controls - Hidden during print */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Pratinjau Cetak Nota / Struk Pesanan
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              onClick={() => setPrintReceiptOrder(null)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div className="print-area text-stone-900 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-stone-900 pb-4">
            <div>
              <h1 className="text-2xl font-normal font-brand tracking-wider text-[#291811]">
                {settings.storeName}
              </h1>
              <p className="text-xs text-stone-600 mt-0.5">{settings.tagline}</p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">{settings.address}</p>
              <p className="text-xs text-stone-500">WhatsApp: {settings.displayPhone}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                BUKTI PESANAN KATERING
              </span>
              <span className="text-base font-bold font-mono">{order.id}</span>
              <p className="text-[11px] text-stone-500 mt-1">
                Dibuat: {formatIndonesianDateTime(order.createdAt)}
              </p>
              <div className="mt-2 inline-block px-2.5 py-1 bg-stone-100 rounded text-xs font-bold uppercase font-mono">
                Status: {order.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 font-semibold block uppercase text-[10px]">Penerima / Pemesan</span>
              <p className="font-bold text-stone-900 text-sm mt-0.5">{order.customerName}</p>
              <p className="text-stone-700 mt-0.5">No. Telp / WA: {order.customerPhone}</p>
              <p className="text-stone-700 mt-0.5">Jenis Momentum: {order.eventType}</p>
            </div>
            <div>
              <span className="text-stone-500 font-semibold block uppercase text-[10px]">Jadwal Pengiriman / Ambil</span>
              <p className="font-bold text-stone-900 text-sm mt-0.5">
                {formatIndonesianDate(order.deliveryDate)}
              </p>
              <p className="text-stone-700 mt-0.5">Pukul: {order.deliveryTime} WIB</p>
              <p className="text-stone-700 mt-0.5 font-medium">
                {order.deliveryType === 'delivery' ? `Alamat: ${order.deliveryAddress}` : 'Ambil di Dapur'}
              </p>
            </div>
          </div>

          {order.specialNotes && (
            <div className="text-xs bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
              <span className="font-bold block">Catatan Khusus Pemesan:</span>
              <span className="italic">{order.specialNotes}</span>
            </div>
          )}

          {/* Table of Items */}
          <div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-300 text-stone-600 font-bold uppercase text-[11px]">
                  <th className="py-2">No</th>
                  <th className="py-2">Menu / Paket Katering</th>
                  <th className="py-2 text-center">Porsi</th>
                  <th className="py-2 text-right">Harga Satuan</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2 text-stone-500">{idx + 1}</td>
                    <td className="py-2 font-sans font-semibold text-stone-900">
                      {item.name}
                      {item.notes && (
                        <span className="block text-[11px] text-stone-500 font-normal italic">
                          Catatan: {item.notes}
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-center font-bold">{item.quantity}</td>
                    <td className="py-2 text-right">{formatRupiah(item.price)}</td>
                    <td className="py-2 text-right font-bold">
                      {formatRupiah(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="border-t-2 border-stone-900 pt-3 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal Menu:</span>
                <span className="font-mono">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Ongkos Pengiriman:</span>
                <span className="font-mono">
                  {order.deliveryFee === 0 ? 'GRATIS' : formatRupiah(order.deliveryFee)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Potongan Promo:</span>
                  <span className="font-mono">-{formatRupiah(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-300">
                <span>TOTAL AKHIR:</span>
                <span className="font-mono text-base">{formatRupiah(order.grandTotal)}</span>
              </div>
              <div className="pt-1 text-[11px] text-stone-500 text-right">
                Metode Bayar: {order.paymentMethod.replace('transfer_', 'Transfer ').toUpperCase()}
              </div>
            </div>
          </div>

          {/* Signatures for Kitchen & Courier */}
          <div className="pt-8 border-t border-stone-200 grid grid-cols-2 gap-8 text-center text-xs text-stone-600">
            <div>
              <p className="font-semibold text-stone-800">Petugas Dapur / QC:</p>
              <div className="h-16" />
              <p className="border-t border-stone-400 mx-8 pt-1">( Chef Fazza )</p>
            </div>
            <div>
              <p className="font-semibold text-stone-800">Kurir Pengantar / Penerima:</p>
              <div className="h-16" />
              <p className="border-t border-stone-400 mx-8 pt-1">( Tanda Tangan & Nama )</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-stone-400 pt-2 border-t border-stone-100">
            Terima kasih telah mempercayakan santapan acara Anda kepada {settings.storeName}.
          </div>
        </div>
      </div>
    </div>
  );
};
