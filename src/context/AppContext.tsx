import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CateringPackage,
  CartItem,
  Order,
  StoreSettings,
  OrderStatus,
} from '../types';
import {
  INITIAL_MENUS,
  INITIAL_PACKAGES,
  INITIAL_SETTINGS,
  INITIAL_SAMPLE_ORDERS,
} from '../data/initialData';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Data
  menus: MenuItem[];
  packages: CateringPackage[];
  settings: StoreSettings;
  orders: Order[];
  cart: CartItem[];
  
  // Navigation / Modal States
  activeSection: string;
  setActiveSection: (sec: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  selectedDetailItem: MenuItem | CateringPackage | null;
  setSelectedDetailItem: (item: MenuItem | CateringPackage | null) => void;
  latestPlacedOrder: Order | null;
  setLatestPlacedOrder: (order: Order | null) => void;
  printReceiptOrder: Order | null;
  setPrintReceiptOrder: (order: Order | null) => void;

  // Cart operations
  addToCart: (item: MenuItem | CateringPackage, quantity?: number, notes?: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  updateCartNotes: (cartItemId: string, notes: string) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Order operations
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  updateOrderAdminNotes: (orderId: string, notes: string) => void;
  deleteOrder: (orderId: string) => void;

  // Admin Menu & Package CRUD
  addMenuItem: (menu: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, menu: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuAvailability: (id: string) => void;

  addPackage: (pkg: Omit<CateringPackage, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<CateringPackage>) => void;
  deletePackage: (id: string) => void;
  togglePackageAvailability: (id: string) => void;

  // Settings & System
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetToDefaultData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;

  // Feedback Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENUS: 'fazza_food_menus_v1',
  PACKAGES: 'fazza_food_packages_v1',
  SETTINGS: 'fazza_food_settings_v1',
  ORDERS: 'fazza_food_orders_v1',
  CART: 'fazza_food_cart_v1',
  ADMIN_AUTH: 'fazza_food_admin_auth_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Menus
  const [menus, setMenus] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENUS);
      return saved ? JSON.parse(saved) : INITIAL_MENUS;
    } catch {
      return INITIAL_MENUS;
    }
  });

  // 2. Catering Packages
  const [packages, setPackages] = useState<CateringPackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
    } catch {
      return INITIAL_PACKAGES;
    }
  });

  // 3. Store Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.address || parsed.address.includes('Kebayoran') || parsed.address.includes('Jakarta')) {
          parsed.address = INITIAL_SETTINGS.address;
          parsed.kitchenCity = INITIAL_SETTINGS.kitchenCity;
        }
        return { ...INITIAL_SETTINGS, ...parsed };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // 4. Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  // 5. Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // UI States
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | CateringPackage | null>(null);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);
  const [printReceiptOrder, setPrintReceiptOrder] = useState<Order | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage synchronizers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus));
    } catch (e) {
      console.warn('Failed to save menus', e);
    }
  }, [menus]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    } catch (e) {
      console.warn('Failed to save packages', e);
    }
  }, [packages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdminLoggedIn));
    } catch (e) {
      console.warn('Failed to save admin auth', e);
    }
  }, [isAdminLoggedIn]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Cart operations
  const addToCart = (item: MenuItem | CateringPackage, requestedQty?: number, notes?: string) => {
    const isMenu = 'price' in item;
    const minOrder = isMenu ? (item as MenuItem).minOrder : (item as CateringPackage).minPortion;
    const price = isMenu ? (item as MenuItem).price : (item as CateringPackage).pricePerPortion;
    const categoryName = isMenu ? (item as MenuItem).category : (item as CateringPackage).eventType;
    const qty = requestedQty && requestedQty >= minOrder ? requestedQty : minOrder;

    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.itemId === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + (requestedQty || 1);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          notes: notes !== undefined ? notes : updated[existingIndex].notes,
        };
        showToast(`Jumlah "${item.name}" diperbarui menjadi ${newQty} porsi`, 'info');
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          itemId: item.id,
          itemType: isMenu ? 'menu' : 'package',
          name: item.name,
          price,
          quantity: qty,
          minOrder,
          notes: notes || '',
          image: item.image,
          categoryName,
        };
        showToast(`"${item.name}" (${qty} porsi) ditambahkan ke keranjang`, 'success');
        return [...prev, newItem];
      }
    });
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    setCart((prev) => {
      if (newQty <= 0) {
        return prev.filter((item) => item.cartItemId !== cartItemId);
      }
      return prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const updateCartNotes = (cartItemId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, notes } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const item = prev.find((it) => it.cartItemId === cartItemId);
      if (item) {
        showToast(`"${item.name}" dihapus dari keranjang`, 'info');
      }
      return prev.filter((it) => it.cartItemId !== cartItemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Order operations
  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const today = new Date();
    const dateCode = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderId = `FZ-${dateCode}-${randomSuffix}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'menunggu_konfirmasi',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setLatestPlacedOrder(newOrder);
    showToast(`Pesanan #${newOrder.id} berhasil dibuat! Segera konfirmasi via WhatsApp.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
    showToast(`Status pesanan #${orderId} diperbarui`, 'success');
  };

  const updateOrderAdminNotes = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, adminNotes: notes } : order))
    );
    showToast(`Catatan admin untuk #${orderId} disimpan`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Pesanan #${orderId} telah dihapus`, 'info');
  };

  // Menu Admin CRUD
  const addMenuItem = (menu: Omit<MenuItem, 'id'>) => {
    const newId = `menu-${Date.now()}`;
    const newMenu: MenuItem = { ...menu, id: newId };
    setMenus((prev) => [...prev, newMenu]);
    showToast(`Menu "${newMenu.name}" berhasil ditambahkan!`, 'success');
  };

  const updateMenuItem = (id: string, updatedFields: Partial<MenuItem>) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
    showToast('Perubahan menu berhasil disimpan!', 'success');
  };

  const deleteMenuItem = (id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
    showToast('Menu berhasil dihapus!', 'info');
  };

  const toggleMenuAvailability = (id: string) => {
    setMenus((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextState = !m.available;
          showToast(`Menu "${m.name}" kini ${nextState ? 'Tersedia' : 'Habis/Non-aktif'}`, 'info');
          return { ...m, available: nextState };
        }
        return m;
      })
    );
  };

  // Package Admin CRUD
  const addPackage = (pkg: Omit<CateringPackage, 'id'>) => {
    const newId = `pkg-${Date.now()}`;
    const newPkg: CateringPackage = { ...pkg, id: newId };
    setPackages((prev) => [...prev, newPkg]);
    showToast(`Paket "${newPkg.name}" berhasil ditambahkan!`, 'success');
  };

  const updatePackage = (id: string, updatedFields: Partial<CateringPackage>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('Perubahan paket katering berhasil disimpan!', 'success');
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    showToast('Paket berhasil dihapus!', 'info');
  };

  const togglePackageAvailability = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.available;
          showToast(`Paket "${p.name}" kini ${nextState ? 'Tersedia' : 'Non-aktif'}`, 'info');
          return { ...p, available: nextState };
        }
        return p;
      })
    );
  };

  // Settings & System
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Pengaturan bisnis FAZZA FOOD berhasil diperbarui!', 'success');
  };

  const resetToDefaultData = () => {
    setMenus(INITIAL_MENUS);
    setPackages(INITIAL_PACKAGES);
    setSettings(INITIAL_SETTINGS);
    setOrders(INITIAL_SAMPLE_ORDERS);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.MENUS);
    localStorage.removeItem(STORAGE_KEYS.PACKAGES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    showToast('Data berhasil di-reset kembali ke bawaan demo awal', 'info');
  };

  const exportDataJson = (): string => {
    const exportObject = {
      appName: 'FAZZA FOOD',
      exportDate: new Date().toISOString(),
      menus,
      packages,
      settings,
      orders,
    };
    return JSON.stringify(exportObject, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.menus) setMenus(parsed.menus);
      if (parsed.packages) setPackages(parsed.packages);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.orders) setOrders(parsed.orders);
      showToast('Data berhasil diimpor dengan sukses!', 'success');
      return true;
    } catch (e) {
      showToast('Format file JSON tidak valid.', 'error');
      return false;
    }
  };

  // Admin Auth
  const adminLogin = (pin: string): boolean => {
    if (pin.trim() === settings.adminPin || pin.trim() === 'fazza123') {
      setIsAdminLoggedIn(true);
      showToast('Login Admin Berhasil!', 'success');
      return true;
    }
    showToast('PIN / Password Admin salah! (Coba gunakan fazza123)', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    showToast('Telah keluar dari panel Admin', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        menus,
        packages,
        settings,
        orders,
        cart,
        activeSection,
        setActiveSection,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        selectedDetailItem,
        setSelectedDetailItem,
        latestPlacedOrder,
        setLatestPlacedOrder,
        printReceiptOrder,
        setPrintReceiptOrder,
        addToCart,
        updateCartQuantity,
        updateCartNotes,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        placeOrder,
        updateOrderStatus,
        updateOrderAdminNotes,
        deleteOrder,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuAvailability,
        addPackage,
        updatePackage,
        deletePackage,
        togglePackageAvailability,
        updateSettings,
        resetToDefaultData,
        exportDataJson,
        importDataJson,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
