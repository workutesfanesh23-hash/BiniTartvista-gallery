import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  User as UserIcon, 
  MessageSquare, 
  Globe, 
  Menu, 
  X, 
  Search,
  Sparkles,
  Database,
  Palette
} from 'lucide-react';
import { ActivePage } from '../types';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    activePage, 
    setActivePage, 
    cart, 
    setIsCartOpen, 
    currentUser, 
    setIsAuthModalOpen,
    setIsExportModalOpen,
    searchQuery,
    setSearchQuery,
    messages
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadMessagesCount = messages.filter(m => !m.read && m.recipientId === currentUser.id).length;

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'art-gallery', label: t.nav.artGallery },
    { id: 'photography', label: t.nav.photography },
    { id: 'video-posts', label: t.nav.videoPosts },
    { id: 'digital-downloads', label: t.nav.digitalDownloads },
    { id: 'commissions', label: t.nav.commissions },
    { id: 'contact-about', label: t.nav.about }
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Curatorial Ribbon */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2 truncate">
          <span className="text-amber-400 font-medium">BiniT ArtVista</span>
          <span className="text-stone-500 hidden sm:inline">·</span>
          <span className="truncate text-stone-400 hidden sm:inline">{t.tagline}</span>
        </div>
        
        <div className="flex items-center gap-4 shrink-0 text-xs">
          {/* Supabase & Export Docs Trigger */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
            title="Supabase & Source Code Export"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline font-mono">Backend & Export</span>
          </button>

          <span className="text-stone-700">|</span>

          {/* Bilingual Language Switcher */}
          <div className="flex items-center gap-1 font-medium">
            <Globe className="w-3.5 h-3.5 text-stone-400" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'en' ? 'text-amber-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              EN
            </button>
            <span className="text-stone-600">/</span>
            <button
              onClick={() => setLanguage('am')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'am' ? 'text-amber-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              አማርኛ
            </button>
          </div>
        </div>
      </div>

      {/* Main Wide Header Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Brand Zone: Prominent Name and Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-serif text-2xl font-bold border border-amber-500/30 group-hover:border-amber-400 transition-colors shadow-sm">
              BV
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors whitespace-nowrap">
                BiniT ArtVista
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-sans -mt-1 hidden sm:block">
                Gallery & Marketplace
              </span>
            </div>
          </button>
        </div>

        {/* Center Zone: Single-line Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-stone-700">
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap py-1 border-b-2 cursor-pointer ${
                  isActive 
                    ? 'border-stone-900 text-stone-900 font-semibold' 
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Interactive Affordances (Search, Messages, Cart, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Bar / Toggle */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 shadow-sm animate-in fade-in duration-200">
                <Search className="w-4 h-4 text-stone-400 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.filters.searchPlaceholder}
                  className="text-xs sm:text-sm bg-transparent outline-none w-36 sm:w-56 text-stone-800 placeholder:text-stone-400"
                  autoFocus
                />
                <button 
                  onClick={() => { setShowSearchInput(false); setSearchQuery(''); }}
                  className="text-stone-400 hover:text-stone-600 p-0.5 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Search artwork, artist, or style"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Messages Affordance */}
          <button
            onClick={() => handleNavClick('messages')}
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title={t.nav.messages}
            aria-label="Messages"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer Toggle */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title={t.nav.cart}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-amber-400 text-[10px] font-bold rounded-full flex items-center justify-center border border-[#FAF8F5]">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Toggle */}
          <button
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer"
            title={currentUser ? currentUser.name : 'Account'}
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-amber-500/40"
            />
            <span className="hidden md:inline truncate max-w-[100px]">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer ml-1"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-stone-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-stone-900 text-white' 
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={() => {
                handleNavClick('profile');
              }}
              className="flex items-center gap-2 text-sm text-stone-800 py-1"
            >
              <UserIcon className="w-4 h-4 text-stone-500" />
              <span>{t.nav.profile} ({currentUser.name})</span>
            </button>
            
            <button
              onClick={() => {
                setIsExportModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-amber-700 font-medium py-1 px-2 border border-amber-300 rounded"
            >
              Backend / Export
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
