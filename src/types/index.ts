export type MenuCategory = 'nasi_box' | 'prasmanan' | 'snack_minuman' | 'spesial';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  available: boolean;
  minOrder: number;
  spicyLevel?: 0 | 1 | 2 | 3;
  isPopular?: boolean;
  packageContents?: string[];
}

export type EventType =
  | 'Katering Harian'
  | 'Nasi Box Acara'
  | 'Rapat Kantor'
  | 'Ulang Tahun'
  | 'Pernikahan / Prasmanan'
  | 'Acara Keluarga'
  | 'Pengajian / Syukuran'
  | 'Lainnya';

export interface CateringPackage {
  id: string;
  name: string;
  eventType: EventType;
  subtitle: string;
  pricePerPortion: number;
  minPortion: number;
  description: string;
  inclusions: string[];
  image: string;
  available: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  cartItemId: string;
  itemId: string;
  itemType: 'menu' | 'package';
  name: string;
  price: number;
  quantity: number;
  minOrder: number;
  notes?: string;
  image: string;
  categoryName?: string;
}

export type OrderStatus =
  | 'menunggu_konfirmasi'
  | 'dikonfirmasi'
  | 'sedang_dimasak'
  | 'sedang_dikirim'
  | 'selesai'
  | 'dibatalkan';

export type PaymentMethod =
  | 'transfer_bca'
  | 'transfer_mandiri'
  | 'transfer_bri'
  | 'qris'
  | 'cod';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  eventType: EventType;
  totalPortions: number;
  specialNotes?: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  promoCode?: string;
  grandTotal: number;
  status: OrderStatus;
  adminNotes?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minSpend: number;
  maxDiscount?: number;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  holder: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // e.g. "6281234567890" (for wa.me links)
  displayPhone: string;   // e.g. "0812-3456-7890"
  email: string;
  address: string;
  kitchenCity: string;
  openingHours: string;
  instagram: string;
  facebook: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  adminPin: string;
  promoCodes: PromoCode[];
  bankAccounts: BankAccount[];
}
