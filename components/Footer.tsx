import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Database, 
  Globe, 
  Send, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { ActivePage } from '../types';

export const Footer: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    setActivePage, 
    setIsExportModalOpen 
  } = useApp();

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-14 pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Curatorial Vision */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center font-serif text-xl font-bold border border-amber-400/30">
                BV
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                {t.galleryName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 max-w-md leading-relaxed">
              {language === 'am'
                ? 'ቢኒት አርትቪስታ ጋለሪ የኢትዮጵያን እና የአፍሪካን ጥበብ ለዓለም አቀፍ ሰብሳቢዎች የሚያቀርብ ዘመናዊ የጥበብ፣ የፎቶግራፍና የቪዲዮ መድረክ ነው።'
                : 'BiniT ArtVista Gallery is an international fine art marketplace bridging heritage African visual culture with contemporary global collectors through original canvases, limited edition photography, creator video streams, and bespoke commissions.'}
            </p>

            {/* Social Channel Links (Configurable placeholder links) */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block mb-2.5">
                Official Channels & Social Communities
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { name: 'Telegram', url: 'https://t.me/binitartvista' },
                  { name: 'YouTube', url: 'https://youtube.com/@binitartvista' },
                  { name: 'Instagram', url: 'https://instagram.com/binit_artvista' },
                  { name: 'TikTok', url: 'https://tiktok.com/@binitartvista' },
                  { name: 'Facebook', url: 'https://facebook.com/binitartvista' }
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-stone-800 text-stone-300 hover:text-amber-400 hover:bg-stone-700/80 transition-colors flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>{s.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Curatorial Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => handleNav('art-gallery')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.artGallery}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('photography')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.photography}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('video-posts')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.videoPosts}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('digital-downloads')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.digitalDownloads}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('commissions')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.commissions}
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional, Trust & Backend Integration */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Institution & System
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => handleNav('contact-about')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('profile')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.profile}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('messages')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.messages}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-1.5 text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer pt-1"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase & Source Export</span>
                </button>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-stone-500 space-y-1">
              <div>Bole Medhanialem Commercial Blvd</div>
              <div>Addis Ababa, Ethiopia</div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} BiniT ArtVista Gallery. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Certificate of Authenticity Guarantee</span>
            </span>

            <span>·</span>

            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="text-stone-400 hover:text-white cursor-pointer"
            >
              Language: {language === 'en' ? 'English (Switch to አማርኛ)' : 'አማርኛ (Switch to EN)'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
