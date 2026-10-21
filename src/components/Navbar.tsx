import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Menu as MenuIcon, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen, setIsAdminOpen, isAdminLoggedIn } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Menu', href: '#menu' },
    { label: 'Paket Katering', href: '#paket' },
    { label: 'Cara Pemesanan', href: '#cara-pemesanan' },
    { label: 'Tentang Kami', href: '#tentang' },
    { label: 'Kontak', href: '#kontak' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#EFE7DE] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark with young male chef photo (no text underneath) */}
          <a
            href="#beranda"
            className="flex items-center gap-3 group whitespace-nowrap shrink-0"
          >
            <div className="relative shrink-0">
              <img
                src="/src/assets/images/young_chef_profile_1792499414113.jpg"
                alt="Chef FAZZA FOOD"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#E8C2AC] shadow-sm group-hover:scale-105 transition-transform bg-[#F5EDE4]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl tracking-wider text-[#2C1810] group-hover:text-[#B25938] transition-colors font-brand">
                FAZZA FOOD
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#8C7A6E] font-medium -mt-0.5">
                Katering & Nasi Box
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links with Soft Pastel Styling */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-[#6B5E55]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-[#B25938] hover:bg-[#F5EDE4]/70 transition-all whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Controls with Soft Pastel Palette */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Admin Dashboard Trigger */}
            <button
              onClick={() => setIsAdminOpen(true)}
              title="Panel Admin & Pengaturan"
              className={`px-3 py-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isAdminLoggedIn
                  ? 'bg-[#FBEBDD] text-[#8C4325] border-[#F0D0BA] hover:bg-[#F7DEC7]'
                  : 'bg-[#F5EFE9] text-[#6A5A4F] border-[#E8DFC8] hover:bg-[#ECE4D8]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="hidden lg:inline">{isAdminLoggedIn ? 'Admin Aktif' : 'Admin'}</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3 py-2 rounded-xl bg-[#FDF3EE] border border-[#F5DACD] hover:bg-[#FAE8DE] text-[#9E4528] transition-colors flex items-center gap-2 group"
              aria-label="Buka Keranjang Pesanan"
            >
              <ShoppingBag className="w-4 h-4 text-[#C85A32] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-semibold text-[#6B3724]">Keranjang</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold leading-none text-white bg-[#DE7254] rounded-full shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Order Now CTA Button in Soft Pastel Terracotta */}
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#menu');
              }}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#DE7254] hover:bg-[#CE6244] active:scale-95 rounded-xl shadow-xs transition-all whitespace-nowrap"
            >
              Pesan Sekarang
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#6B5E55] hover:bg-[#F5EDE4]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation in Soft Pastel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EFE7DE] bg-[#FCFAF7] px-4 pt-3 pb-6 space-y-1.5 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="block py-2.5 px-3.5 rounded-xl text-sm font-medium text-[#5C4E45] hover:bg-[#F5EDE4] hover:text-[#B25938] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FDF3EE] text-[#9E4528] border border-[#F5DACD] font-semibold text-xs"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#C85A32]" />
                  <span>Lihat Keranjang</span>
                </div>
                <span className="px-2 py-0.5 text-xs bg-[#DE7254] text-white rounded-full font-bold">
                  {cartCount} item
                </span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#F5EFE9] text-[#6A5A4F] border border-[#E8DFC8] text-xs font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-[#C85A32]" />
                <span>Masuk ke Dashboard Admin</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
