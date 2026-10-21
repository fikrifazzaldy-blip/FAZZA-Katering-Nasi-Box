import { Order, StoreSettings } from '../types';

export function formatRupiah(amount: number): string {
  return 'Rp' + Math.round(amount).toLocaleString('id-ID');
}

export function formatIndonesianDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export function formatIndonesianDateTime(isoString: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function cleanWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function generateWhatsAppOrderMessage(order: Order, settings: StoreSettings): string {
  const itemList = order.items
    .map(
      (it, idx) =>
        `${idx + 1}. *${it.name}*\n   • Jumlah: ${it.quantity} porsi @ ${formatRupiah(it.price)}\n   • Subtotal: ${formatRupiah(it.quantity * it.price)}${it.notes ? `\n   • Catatan: _${it.notes}_` : ''}`
    )
    .join('\n\n');

  const paymentLabel: Record<string, string> = {
    transfer_bca: 'Transfer Bank BCA',
    transfer_mandiri: 'Transfer Bank Mandiri',
    transfer_bri: 'Transfer Bank BRI',
    qris: 'QRIS (Semua E-Wallet/Mobile Banking)',
    cod: 'Bayar Tunai saat Pengantaran (COD)',
  };

  const deliveryLabel =
    order.deliveryType === 'delivery'
      ? `Pengantaran ke Alamat (Biaya: ${order.deliveryFee === 0 ? 'GRATIS' : formatRupiah(order.deliveryFee)})`
      : 'Ambil Sendiri di Dapur Fazza Food (Gratis)';

  const message = `Halo Admin *${settings.storeName}*, saya ingin melakukan pemesanan katering secara online.

📋 *DETAIL PESANAN (${order.id})*
---------------------------------------
• *Nama Pemesan:* ${order.customerName}
• *Nomor WhatsApp:* ${order.customerPhone}
• *Jenis Acara:* ${order.eventType}
• *Tanggal Pengiriman:* ${formatIndonesianDate(order.deliveryDate)}
• *Jam Pengantaran:* ${order.deliveryTime} WIB
• *Metode Layanan:* ${deliveryLabel}
${order.deliveryType === 'delivery' ? `• *Alamat Lengkap:* ${order.deliveryAddress}\n` : ''}${order.specialNotes ? `• *Catatan Tambahan:* ${order.specialNotes}\n` : ''}
🍱 *RINCIAN MENU & PORSI:*
${itemList}

💰 *RINGKASAN PEMBAYARAN:*
• Subtotal: ${formatRupiah(order.subtotal)}
• Ongkos Kirim: ${order.deliveryFee === 0 ? 'GRATIS' : formatRupiah(order.deliveryFee)}
${order.discountAmount > 0 ? `• Diskon Promo (${order.promoCode || 'DISKON'}): -${formatRupiah(order.discountAmount)}\n` : ''}• *TOTAL TAGIHAN: ${formatRupiah(order.grandTotal)}*
• *Metode Bayar:* ${paymentLabel[order.paymentMethod] || order.paymentMethod}

⚠️ *Catatan:* Pesanan ini diajukan via website dan menunggu konfirmasi ketersediaan & jadwal dari Admin ${settings.storeName}. Mohon informasikan langkah selanjutnya dan nomor rekening pembayaran. Terima kasih!`;

  return message;
}

export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = cleanWhatsAppNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
