/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { ExportModal } from './components/ExportModal';

import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { PhotographyPage } from './pages/PhotographyPage';
import { VideoPostsPage } from './pages/VideoPostsPage';
import { DigitalDownloadsPage } from './pages/DigitalDownloadsPage';
import { CommissionsPage } from './pages/CommissionsPage';
import { ArtistProfilePage } from './pages/ArtistProfilePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { ContactAboutPage } from './pages/ContactAboutPage';

const MainLayout: React.FC = () => {
  const { activePage, toastMessage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'art-gallery':
        return <GalleryPage />;
      case 'photography':
        return <PhotographyPage />;
      case 'video-posts':
        return <VideoPostsPage />;
      case 'digital-downloads':
        return <DigitalDownloadsPage />;
      case 'commissions':
        return <CommissionsPage />;
      case 'artist-profile':
        return <ArtistProfilePage />;
      case 'profile':
        return <UserProfilePage />;
      case 'messages':
        return <MessagesPage />;
      case 'contact-about':
        return <ContactAboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-stone-900 text-amber-300 px-4 py-3 rounded-xl shadow-xl border border-amber-500/30 text-xs sm:text-sm font-medium flex items-center gap-2 max-w-sm">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Primary Header */}
      <Header />

      {/* Page Routing */}
      <main className="flex-1">
        {renderActivePage()}
      </main>

      {/* Global Modals & Drawers */}
      <ArtworkDetailModal />
      <CartDrawer />
      <AuthModal />
      <ExportModal />

      {/* Curatorial Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
