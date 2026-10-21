import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedMenu } from './components/FeaturedMenu';
import { CateringPackagesSection } from './components/CateringPackages';
import { HowToOrder } from './components/HowToOrder';
import { AboutAndTestimonials } from './components/AboutAndTestimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ReceiptPrintModal } from './components/ReceiptPrintModal';
import { ToastContainer } from './components/ToastContainer';
import { createWhatsAppUrl } from './utils/formatters';
import { MessageCircle } from 'lucide-react';

const MainApp: React.FC = () => {
  const { settings, setIsCartOpen } = useApp();

  const handleOrderNow = () => {
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreMenu = () => {
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const floatingWaUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `Halo Admin ${settings.storeName}, saya ingin konsultasi pemesanan katering...`
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#291811] flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Navbar with 3-zone contract */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero onOrderNow={handleOrderNow} onExploreMenu={handleExploreMenu} />
        <FeaturedMenu />
        <CateringPackagesSection />
        <HowToOrder />
        <AboutAndTestimonials />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <ItemDetailModal />
      <AdminDashboard />
      <ReceiptPrintModal />
      <ToastContainer />

      {/* Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-6 left-6 z-30 no-print">
        <a
          href={floatingWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat WhatsApp Admin"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xl shadow-emerald-600/30 transition-all font-semibold text-xs sm:text-sm group"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Konsultasi WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
