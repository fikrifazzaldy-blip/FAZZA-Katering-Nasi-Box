import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus, MenuItem, CateringPackage, EventType, MenuCategory } from '../types';
import { ASSET_IMAGES } from '../assets/imagesMap';
import { formatRupiah, formatIndonesianDate, formatIndonesianDateTime, createWhatsAppUrl } from '../utils/formatters';
import {
  X,
  Search,
  CheckCircle,
  Clock,
  Truck,
  CookingPot,
  Ban,
  Printer,
  Edit,
  Trash2,
  Plus,
  Settings,
  BarChart3,
  Utensils,
  ShoppingBag,
  MessageCircle,
  Database,
  Lock,
  Download,
  Upload,
  RefreshCw,
  Eye,
  AlertCircle,
  Save,
  DollarSign,
  Users,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    orders,
    updateOrderStatus,
    updateOrderAdminNotes,
    deleteOrder,
    menus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuAvailability,
    packages,
    addPackage,
    updatePackage,
    deletePackage,
    togglePackageAvailability,
    settings,
    updateSettings,
    resetToDefaultData,
    exportDataJson,
    importDataJson,
    setPrintReceiptOrder,
    showToast,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState<'pesanan' | 'menu' | 'paket' | 'laporan' | 'pengaturan'>('pesanan');

  // Search & Filter for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Menu Form Modal
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState<{
    name: string;
    price: number;
    category: MenuCategory;
    description: string;
    minOrder: number;
    image: string;
    available: boolean;
  }>({
    name: '',
    price: 20000,
    category: 'nasi_box',
    description: '',
    minOrder: 5,
    image: ASSET_IMAGES.nasiAyamGoreng,
    available: true,
  });

  // Package Form Modal
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageForm, setPackageForm] = useState({
    name: '',
    eventType: 'Rapat Kantor' as EventType,
    subtitle: '',
    pricePerPortion: 25000,
    minPortion: 10,
    description: '',
    inclusions: 'Nasi Pulen, Lauk Utama, Sayur Segar, Air Mineral',
    image: ASSET_IMAGES.nasiAyamBakar,
    available: true,
  });

  // Store Settings Form
  const [settingsForm, setSettingsForm] = useState(settings);
  const [jsonImportInput, setJsonImportInput] = useState('');

  if (!isAdminOpen) return null;

  // 1. If not logged in, show clean PIN login modal
  if (!isAdminLoggedIn) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      adminLogin(pinInput);
      setPinInput('');
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#FFFDF9] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-6">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold font-display text-[#291811]">
              Masuk Dashboard Admin
            </h2>
            <p className="text-xs text-stone-600">
              Akses pengelolaan pesanan, menu, harga, dan pengaturan FAZZA FOOD.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                PIN / Password Admin:
              </label>
              <input
                type="password"
                placeholder="Masukkan PIN Admin..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-center font-mono tracking-widest text-lg"
                autoFocus
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
              <span className="font-bold block">Kredensial Demo Awal:</span>
              <p>
                PIN bawaan adalah: <code className="font-bold text-amber-900 bg-amber-200/60 px-1 py-0.5 rounded">fazza123</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm shadow-md transition-all"
            >
              Buka Panel Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Filter orders
  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchName = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.customerPhone.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  // Calculate statistics
  const totalOmzet = orders.reduce((sum, o) => (o.status !== 'dibatalkan' ? sum + o.grandTotal : sum), 0);
  const completedOrders = orders.filter((o) => o.status === 'selesai').length;
  const activeOrders = orders.filter((o) => o.status !== 'selesai' && o.status !== 'dibatalkan').length;
  const pendingOrders = orders.filter((o) => o.status === 'menunggu_konfirmasi').length;

  const handleOpenMenuModal = (menu?: MenuItem) => {
    if (menu) {
      setEditingMenuId(menu.id);
      setMenuForm({
        name: menu.name,
        price: menu.price,
        category: menu.category,
        description: menu.description,
        minOrder: menu.minOrder,
        image: menu.image,
        available: menu.available,
      });
    } else {
      setEditingMenuId(null);
      setMenuForm({
        name: '',
        price: 20000,
        category: 'nasi_box',
        description: '',
        minOrder: 5,
        image: ASSET_IMAGES.nasiAyamGoreng,
        available: true,
      });
    }
    setIsMenuModalOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.name.trim()) {
      showToast('Nama menu wajib diisi', 'error');
      return;
    }
    if (editingMenuId) {
      updateMenuItem(editingMenuId, menuForm);
    } else {
      addMenuItem(menuForm);
    }
    setIsMenuModalOpen(false);
  };

  const handleOpenPackageModal = (pkg?: CateringPackage) => {
    if (pkg) {
      setEditingPackageId(pkg.id);
      setPackageForm({
        name: pkg.name,
        eventType: pkg.eventType,
        subtitle: pkg.subtitle,
        pricePerPortion: pkg.pricePerPortion,
        minPortion: pkg.minPortion,
        description: pkg.description,
        inclusions: pkg.inclusions.join(', '),
        image: pkg.image,
        available: pkg.available,
      });
    } else {
      setEditingPackageId(null);
      setPackageForm({
        name: '',
        eventType: 'Rapat Kantor',
        subtitle: '',
        pricePerPortion: 25000,
        minPortion: 10,
        description: '',
        inclusions: 'Nasi Pulen, Lauk Utama, Sayur Segar, Air Mineral',
        image: ASSET_IMAGES.nasiAyamBakar,
        available: true,
      });
    }
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.name.trim()) {
      showToast('Nama paket katering wajib diisi', 'error');
      return;
    }
    const inclusionsArr = packageForm.inclusions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: packageForm.name,
      eventType: packageForm.eventType,
      subtitle: packageForm.subtitle,
      pricePerPortion: Number(packageForm.pricePerPortion),
      minPortion: Number(packageForm.minPortion),
      description: packageForm.description,
      inclusions: inclusionsArr,
      image: packageForm.image,
      available: packageForm.available,
    };

    if (editingPackageId) {
      updatePackage(editingPackageId, payload);
    } else {
      addPackage(payload);
    }
    setIsPackageModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const handleExportDownload = () => {
    const dataStr = exportDataJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fazza_food_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('File backup JSON berhasil diunduh', 'success');
  };

  const handleImportSubmit = () => {
    if (!jsonImportInput.trim()) return;
    const success = importDataJson(jsonImportInput);
    if (success) setJsonImportInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-[#FFFDF9] rounded-3xl max-w-6xl w-full h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              FZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#291811]">
                  Dashboard Admin {settings.storeName}
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Online
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Penyimpanan: Browser LocalStorage (Demo Mode Aktif)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={adminLogout}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Keluar Admin
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-100/70 border-b border-stone-200 px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'pesanan', label: `Pesanan Masuk (${orders.length})`, icon: ShoppingBag },
            { id: 'menu', label: `Kelola Menu (${menus.length})`, icon: Utensils },
            { id: 'paket', label: `Paket Katering (${packages.length})`, icon: Users },
            { id: 'laporan', label: 'Laporan & Omzet', icon: BarChart3 },
            { id: 'pengaturan', label: 'Pengaturan Bisnis & Data', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  active
                    ? 'border-orange-600 text-orange-600 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: KELOLA PESANAN */}
        {activeTab === 'pesanan' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari ID, nama pemesan, no telepon..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'menunggu_konfirmasi', label: 'Menunggu' },
                  { id: 'dikonfirmasi', label: 'Dikonfirmasi' },
                  { id: 'sedang_dimasak', label: 'Dimasak' },
                  { id: 'sedang_dikirim', label: 'Dikirim' },
                  { id: 'selesai', label: 'Selesai' },
                  { id: 'dibatalkan', label: 'Batal' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      statusFilter === st.id
                        ? 'bg-stone-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-600 font-semibold text-sm">Tidak ada pesanan yang sesuai filter.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[11px]">
                      <tr>
                        <th className="p-3.5">ID & Waktu</th>
                        <th className="p-3.5">Pemesan</th>
                        <th className="p-3.5">Jadwal Acara</th>
                        <th className="p-3.5">Menu / Porsi</th>
                        <th className="p-3.5 text-right">Total</th>
                        <th className="p-3.5">Status Pesanan</th>
                        <th className="p-3.5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.map((order) => {
                        let statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
                        if (order.status === 'dikonfirmasi') statusColor = 'bg-blue-100 text-blue-800 border-blue-300';
                        if (order.status === 'sedang_dimasak') statusColor = 'bg-orange-100 text-orange-800 border-orange-300';
                        if (order.status === 'sedang_dikirim') statusColor = 'bg-purple-100 text-purple-800 border-purple-300';
                        if (order.status === 'selesai') statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                        if (order.status === 'dibatalkan') statusColor = 'bg-rose-100 text-rose-800 border-rose-300';

                        return (
                          <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-stone-900 block">{order.id}</span>
                              <span className="text-[10px] text-stone-400">
                                {formatIndonesianDateTime(order.createdAt)}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-stone-900 block">{order.customerName}</span>
                              <span className="text-stone-500 font-mono text-[11px]">
                                {order.customerPhone}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-semibold text-stone-800 block">
                                {formatIndonesianDate(order.deliveryDate)}
                              </span>
                              <span className="text-stone-500 text-[11px]">
                                Pukul {order.deliveryTime} WIB · {order.eventType}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-stone-900">{order.totalPortions} Porsi</span>
                              <span className="text-[11px] text-stone-500 block truncate max-w-xs">
                                {order.items.map((it) => `${it.name} (${it.quantity})`).join(', ')}
                              </span>
                            </td>
                            <td className="p-3.5 text-right font-mono font-bold text-orange-600">
                              {formatRupiah(order.grandTotal)}
                            </td>
                            <td className="p-3.5">
                              {/* Quick status selector */}
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${statusColor}`}
                              >
                                <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                                <option value="dikonfirmasi">Dikonfirmasi</option>
                                <option value="sedang_dimasak">Sedang Dimasak</option>
                                <option value="sedang_dikirim">Sedang Dikirim</option>
                                <option value="selesai">Selesai</option>
                                <option value="dibatalkan">Dibatalkan</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setPrintReceiptOrder(order)}
                                  className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                                  title="Cetak Nota / Struk"
                                >
                                  <Printer className="w-4 h-4 text-orange-600" />
                                </button>
                                <a
                                  href={createWhatsAppUrl(
                                    order.customerPhone,
                                    `Halo ${order.customerName}, kami dari Admin ${settings.storeName} terkait pesanan Anda (${order.id})...`
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50"
                                  title="Hubungi Pelanggan via WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                                <button
                                  onClick={() => {
                                    if (confirm(`Yakin ingin menghapus pesanan #${order.id}?`)) {
                                      deleteOrder(order.id);
                                    }
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                  title="Hapus Pesanan"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KELOLA MENU */}
        {activeTab === 'menu' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Daftar Menu Katering</h3>
                <p className="text-xs text-stone-500">
                  Ubah nama, harga, status stok ketersediaan, atau tambah menu baru.
                </p>
              </div>
              <button
                onClick={() => handleOpenMenuModal()}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Menu Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={menu.image}
                      alt={menu.name}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-orange-700">
                          {menu.category}
                        </span>
                        <button
                          onClick={() => toggleMenuAvailability(menu.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            menu.available
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {menu.available ? 'Tersedia' : 'Habis'}
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 truncate mt-0.5">{menu.name}</h4>
                      <div className="text-xs font-bold font-mono text-orange-600 mt-1">
                        {formatRupiah(menu.price)}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2">{menu.description}</p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 text-[11px]">Min: {menu.minOrder} porsi</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenMenuModal(menu)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 flex items-center gap-1 font-semibold text-xs"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus menu "${menu.name}"?`)) deleteMenuItem(menu.id);
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KELOLA PAKET KATERING */}
        {activeTab === 'paket' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Kelola Paket Katering Acara</h3>
                <p className="text-xs text-stone-500">
                  Sesuaikan paket katering harian, rapat kantor, pernikahan, pengajian, dan ulang tahun.
                </p>
              </div>
              <button
                onClick={() => handleOpenPackageModal()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Paket Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {pkg.eventType}
                      </span>
                      <h4 className="text-base font-bold text-stone-900 mt-1">{pkg.name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{pkg.subtitle}</p>
                    </div>
                    <button
                      onClick={() => togglePackageAvailability(pkg.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        pkg.available ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {pkg.available ? 'Aktif' : 'Non-Aktif'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div>
                      <span className="text-stone-500 block">Harga per Porsi:</span>
                      <span className="font-bold text-orange-600 font-mono text-sm">
                        {formatRupiah(pkg.pricePerPortion)}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Minimal Pemesanan:</span>
                      <span className="font-bold text-stone-900">{pkg.minPortion} Porsi</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleOpenPackageModal(pkg)}
                      className="px-3 py-1.5 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Paket</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus paket "${pkg.name}"?`)) deletePackage(pkg.id);
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LAPORAN & STATISTIK */}
        {activeTab === 'laporan' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Statistik & Laporan Penjualan</h3>
              <p className="text-xs text-stone-500">
                Ringkasan performa pesanan dan estimasi omzet katering FAZZA FOOD.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs font-semibold text-stone-500 uppercase">Total Omzet Valid</div>
                <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
                  {formatRupiah(totalOmzet)}
                </div>
                <p className="text-[11px] text-stone-400">Di luar pesanan dibatalkan</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs font-semibold text-stone-500 uppercase">Pesanan Aktif</div>
                <div className="text-2xl font-bold font-mono text-orange-600 tabular-nums">
                  {activeOrders}
                </div>
                <p className="text-[11px] text-stone-400">Dalam proses masak & kirim</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs font-semibold text-stone-500 uppercase">Menunggu Persetujuan</div>
                <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
                  {pendingOrders}
                </div>
                <p className="text-[11px] text-stone-400">Perlu konfirmasi WhatsApp</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs font-semibold text-stone-500 uppercase">Pesanan Selesai</div>
                <div className="text-2xl font-bold font-mono text-stone-800 tabular-nums">
                  {completedOrders}
                </div>
                <p className="text-[11px] text-stone-400">Tuntas terkirim ke pelanggan</p>
              </div>
            </div>

            {/* Event Distribution breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-stone-900">Distribusi Pemesanan Berdasarkan Jenis Acara:</h4>
              <div className="space-y-3">
                {[
                  'Rapat Kantor',
                  'Pengajian / Syukuran',
                  'Ulang Tahun',
                  'Katering Harian',
                  'Pernikahan / Prasmanan',
                  'Acara Keluarga',
                ].map((ev) => {
                  const count = orders.filter((o) => o.eventType === ev).length;
                  const percent = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                  return (
                    <div key={ev} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-stone-700">
                        <span>{ev}</span>
                        <span className="font-mono">{count} pesanan ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-orange-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PENGATURAN BISNIS & DATA */}
        {activeTab === 'pengaturan' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Friendly Beginner Note */}
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-900 flex items-start gap-3">
              <Database className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Penyimpanan Data Lokal Browser (Local Storage)</p>
                <p className="mt-0.5 text-stone-700 leading-relaxed">
                  Semua perubahan harga, menu baru, status pesanan, dan nomor WhatsApp tersimpan aman di browser Anda saat ini. Untuk menguji pesanan riil pada WhatsApp Anda, silakan ubah nomor WhatsApp bisnis di bawah ini!
                </p>
              </div>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                Identitas Bisnis & Kontak Pemesanan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Usaha Katering
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor WhatsApp Tujuan Pesanan (Tanpa +, contoh: 6281234567890)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 font-mono text-emerald-700 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tampilan Nomor Telepon di Website
                  </label>
                  <input
                    type="text"
                    value={settingsForm.displayPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, displayPhone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Alamat Lengkap Dapur Utama
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Biaya Ongkir Default (Rp)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.defaultDeliveryFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultDeliveryFee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Batas Minimum Belanja Bebas Ongkir (Rp)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Keamanan Admin Baru
                  </label>
                  <input
                    type="text"
                    value={settingsForm.adminPin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={settingsForm.openingHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Pengaturan</span>
                </button>
              </div>
            </form>

            {/* Backup & Reset Options */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                Backup, Restore & Reset Data
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-stone-800 text-xs">
                    <Download className="w-4 h-4 text-orange-600" />
                    <span>Export / Unduh Cadangan JSON</span>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Unduh seluruh data pesanan, konfigurasi menu, dan pengaturan toko dalam satu berkas file JSON.
                  </p>
                  <button
                    onClick={handleExportDownload}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Unduh File Backup JSON
                  </button>
                </div>

                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-rose-900 text-xs">
                    <RefreshCw className="w-4 h-4 text-rose-600" />
                    <span>Reset Data Demo Awal</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Kembalikan seluruh menu, harga, dan pesanan ke pengaturan contoh bawaan awal aplikasi.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin mereset seluruh data kembali ke kondisi demo awal?')) {
                        resetToDefaultData();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Reset ke Data Bawaan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDIT / TAMBAH MENU */}
        {isMenuModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-stone-900 text-base">
                  {editingMenuId ? 'Edit Menu Katering' : 'Tambah Menu Baru'}
                </h3>
                <button
                  onClick={() => setIsMenuModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMenu} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nama Menu</label>
                  <input
                    type="text"
                    required
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Harga Satuan (Rp)</label>
                    <input
                      type="number"
                      required
                      value={menuForm.price}
                      onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Min. Porsi Pesan</label>
                    <input
                      type="number"
                      required
                      value={menuForm.minOrder}
                      onChange={(e) => setMenuForm({ ...menuForm, minOrder: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  >
                    <option value="nasi_box">Nasi Box</option>
                    <option value="prasmanan">Prasmanan</option>
                    <option value="spesial">Spesial Tumpeng</option>
                    <option value="snack_minuman">Snack & Minuman</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Deskripsi Menu</label>
                  <textarea
                    rows={3}
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">URL / Path Foto Makanan</label>
                  <input
                    type="text"
                    value={menuForm.image}
                    onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-[11px] focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMenuModalOpen(false)}
                    className="px-4 py-2 border rounded-xl text-stone-600 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 text-white rounded-xl font-bold"
                  >
                    Simpan Menu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDIT / TAMBAH PAKET */}
        {isPackageModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-stone-900 text-base">
                  {editingPackageId ? 'Edit Paket Katering' : 'Tambah Paket Baru'}
                </h3>
                <button
                  onClick={() => setIsPackageModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Jenis Acara</label>
                    <select
                      value={packageForm.eventType}
                      onChange={(e) => setPackageForm({ ...packageForm, eventType: e.target.value as EventType })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                    >
                      <option value="Katering Harian">Katering Harian</option>
                      <option value="Rapat Kantor">Rapat Kantor</option>
                      <option value="Nasi Box Acara">Nasi Box Acara</option>
                      <option value="Pengajian / Syukuran">Pengajian / Syukuran</option>
                      <option value="Ulang Tahun">Ulang Tahun</option>
                      <option value="Pernikahan / Prasmanan">Pernikahan / Prasmanan</option>
                      <option value="Acara Keluarga">Acara Keluarga</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Harga per Porsi (Rp)</label>
                    <input
                      type="number"
                      required
                      value={packageForm.pricePerPortion}
                      onChange={(e) => setPackageForm({ ...packageForm, pricePerPortion: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Min. Porsi</label>
                    <input
                      type="number"
                      required
                      value={packageForm.minPortion}
                      onChange={(e) => setPackageForm({ ...packageForm, minPortion: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Subtitle / Slogan</label>
                    <input
                      type="text"
                      value={packageForm.subtitle}
                      onChange={(e) => setPackageForm({ ...packageForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Deskripsi Paket</label>
                  <textarea
                    rows={2}
                    value={packageForm.description}
                    onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kelengkapan / Fasilitas (pisahkan tanda koma)</label>
                  <input
                    type="text"
                    value={packageForm.inclusions}
                    onChange={(e) => setPackageForm({ ...packageForm, inclusions: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPackageModalOpen(false)}
                    className="px-4 py-2 border rounded-xl text-stone-600 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 text-white rounded-xl font-bold"
                  >
                    Simpan Paket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
