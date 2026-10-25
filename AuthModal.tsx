import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserCheck, LogIn, UserPlus, Sparkles, Shield } from 'lucide-react';
import { initialArtists, demoUser } from '../data/initialData';
import { User } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    setCurrentUser, 
    language, 
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isArtist, setIsArtist] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      phone: phone || '+251 900 000 000',
      avatar: '/src/assets/images/photo_omo_portrait_1792961351415.jpg',
      address: 'Bole Sub-City, Addis Ababa',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      isArtist: isArtist,
      artistBio: isArtist ? 'Visual artist exhibiting with BiniT ArtVista Gallery.' : undefined,
      socialLinks: {
        telegram: 'https://t.me/binitartvista'
      }
    };

    setCurrentUser(newUser);
    localStorage.setItem('artvista_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    showToast(language === 'am' ? `እንኳን ደህና መጡ ${newUser.name}!` : `Signed in as ${newUser.name}!`);
  };

  const handleSwitchToDemoArtist = (artistIndex: number) => {
    const artist = initialArtists[artistIndex];
    const switchedUser: User = {
      id: artist.id,
      name: artist.name,
      email: `${artist.name.toLowerCase().replace(' ', '.')}@artvistagallery.com`,
      avatar: artist.avatar,
      phone: '+251 911 234 567',
      address: 'Bole Atlas Studio 4, Addis Ababa',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      isArtist: true,
      artistBio: artist.bio,
      socialLinks: artist.socials
    };

    setCurrentUser(switchedUser);
    localStorage.setItem('artvista_user', JSON.stringify(switchedUser));
    setIsAuthModalOpen(false);
    showToast(`Switched account to artist: ${switchedUser.name}`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div 
        className="bg-[#FAF8F5] border border-stone-200 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-stone-900 text-amber-400 font-serif text-xl font-bold rounded-lg flex items-center justify-center mx-auto mb-2 border border-amber-400/30">
            BV
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            {mode === 'signin' 
              ? (language === 'am' ? 'ወደ መለያዎ ይግቡ' : 'Sign In to ArtVista') 
              : (language === 'am' ? 'አዲስ መለያ ይክፈቱ' : 'Create Collector / Artist Account')}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'am' ? 'ለቪዲዮ ልጥፎች፣ ግዢ እና የጥበብ ትዕዛዞች' : 'Curate, post creator videos, and manage custom commissions'}
          </p>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="mb-6 p-3 bg-stone-100 rounded-xl border border-stone-200">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Instant Demo Account Presets:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleSwitchToDemoArtist(0)}
              className="p-2 rounded-lg bg-white border border-stone-200 text-left hover:border-amber-600 transition-colors cursor-pointer truncate"
            >
              <div className="font-medium text-stone-900 truncate">Biniam Tesfaye</div>
              <div className="text-[10px] text-stone-500">Master Painter</div>
            </button>
            <button
              onClick={() => handleSwitchToDemoArtist(1)}
              className="p-2 rounded-lg bg-white border border-stone-200 text-left hover:border-amber-600 transition-colors cursor-pointer truncate"
            >
              <div className="font-medium text-stone-900 truncate">Meron Hailu</div>
              <div className="text-[10px] text-stone-500">Photographer</div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                {language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dawit Kebede"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
              />
            </div>
          )}

          <div>
            <label className="block text-stone-700 font-medium mb-1">
              {language === 'am' ? 'የኢሜይል አድራሻ' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">
              {language === 'am' ? 'የይለፍ ቃል' : 'Password'}
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              defaultValue="password123"
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
            />
          </div>

          {mode === 'register' && (
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isArtist}
                  onChange={(e) => setIsArtist(e.target.checked)}
                  className="rounded text-stone-900 accent-stone-900"
                />
                <span className="text-stone-700 font-medium">
                  {language === 'am' ? 'እንደ አርቲስት/ቪዲዮ ፈጣሪ መመዝገብ እፈልጋለሁ' : 'I am registering as an Artist / Video Creator'}
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors cursor-pointer mt-2"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-stone-200 text-center text-xs text-stone-600">
          {mode === 'signin' ? (
            <button
              onClick={() => setMode('register')}
              className="hover:underline font-medium text-stone-900 cursor-pointer"
            >
              Don't have an account? Register as collector or artist
            </button>
          ) : (
            <button
              onClick={() => setMode('signin')}
              className="hover:underline font-medium text-stone-900 cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
