import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Package, 
  Heart, 
  Video, 
  Palette, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  LogOut, 
  ExternalLink,
  Trash2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ArtworkCard } from '../components/ArtworkCard';

export const UserProfilePage: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    orders, 
    artworks, 
    savedArtworkIds, 
    videos, 
    deleteArtwork, 
    deleteVideoPost, 
    t, 
    language, 
    setIsAuthModalOpen,
    setActivePage 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'saved' | 'myArt' | 'myVideos'>('orders');

  // Form state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [city, setCity] = useState(currentUser.city);
  const [country, setCountry] = useState(currentUser.country);
  const [isArtist, setIsArtist] = useState(currentUser.isArtist);
  const [artistBio, setArtistBio] = useState(currentUser.artistBio || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      address,
      city,
      country,
      isArtist,
      artistBio: isArtist ? artistBio : undefined
    });
  };

  const savedArtworks = artworks.filter(a => savedArtworkIds.includes(a.id));
  const myUploadedArtworks = artworks.filter(a => a.artistId === currentUser.id || a.artistName === currentUser.name);
  const myVideoPosts = videos.filter(v => v.artistId === currentUser.id || v.artistName === currentUser.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-stone-200"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif text-2xl font-bold text-stone-900">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-semibold bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                  {currentUser.isArtist ? 'Artist & Collector' : 'Collector Account'}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono">
                {currentUser.email} · {currentUser.phone}
              </p>
              <p className="text-xs text-stone-600 max-w-md pt-1">
                {currentUser.address}, {currentUser.city}, {currentUser.country}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch / Sign In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 sm:gap-6 border-b border-stone-200 overflow-x-auto no-scrollbar text-xs sm:text-sm font-semibold mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.profile.myOrders} ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{t.profile.savedItems} ({savedArtworks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('myArt')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'myArt'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{t.profile.myUploads} ({myUploadedArtworks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('myVideos')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'myVideos'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{t.profile.myVideos} ({myVideoPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>{t.profile.editProfile}</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {/* 1. Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-500">
                <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="font-serif text-lg text-stone-800">{t.profile.noOrders}</p>
                <button
                  onClick={() => setActivePage('art-gallery')}
                  className="mt-3 text-xs text-amber-800 font-semibold underline cursor-pointer"
                >
                  Explore gallery to make acquisitions
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                    <div>
                      <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
                      <span className="text-stone-400 ml-2">Placed on {order.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded font-semibold">
                        {order.status}
                      </span>
                      {order.trackingNumber && (
                        <span className="font-mono text-stone-500 text-[11px]">
                          Track: {order.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.artwork.imageUrl}
                            alt={item.artwork.title}
                            className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                          />
                          <div>
                            <h4 className="font-serif font-semibold text-stone-900">{item.artwork.title}</h4>
                            <span className="text-stone-500">{item.artwork.artistName} · Qty {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-stone-900 tabular-nums">
                          ${(item.artwork.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2">
                    <div>Delivery to: <span className="text-stone-800 font-medium">{order.shippingAddress}</span></div>
                    <div className="font-bold text-stone-900 font-mono text-sm">
                      Total: ${order.total.toLocaleString()} USD
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. Saved Items */}
        {activeTab === 'saved' && (
          <div>
            {savedArtworks.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-500">
                <Heart className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="font-serif text-lg text-stone-800">{t.profile.noSaved}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {savedArtworks.map(art => (
                  <ArtworkCard key={art.id} artwork={art} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. My Uploaded Artworks */}
        {activeTab === 'myArt' && (
          <div>
            {myUploadedArtworks.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-500">
                <Palette className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="font-serif text-lg text-stone-800">{t.profile.noUploads}</p>
                <button
                  onClick={() => setActivePage('art-gallery')}
                  className="mt-3 text-xs text-amber-800 font-semibold underline cursor-pointer"
                >
                  Go to gallery to list artwork
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myUploadedArtworks.map(art => (
                  <div key={art.id} className="relative">
                    <ArtworkCard artwork={art} />
                    <button
                      onClick={() => deleteArtwork(art.id)}
                      className="absolute top-2 left-2 z-10 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors"
                      title="Remove artwork"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. My Video Posts */}
        {activeTab === 'myVideos' && (
          <div>
            {myVideoPosts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-500">
                <Video className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="font-serif text-lg text-stone-800">You haven't posted any creator studio videos yet.</p>
                <button
                  onClick={() => setActivePage('video-posts')}
                  className="mt-3 text-xs text-amber-800 font-semibold underline cursor-pointer"
                >
                  Upload a studio video now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myVideoPosts.map(vid => (
                  <div key={vid.id} className="bg-white rounded-xl overflow-hidden border border-stone-200 p-4 space-y-3">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-stone-900">{vid.title}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">{vid.description}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
                      <span className="font-mono text-stone-500">{vid.likesCount} likes</span>
                      <button
                        onClick={() => deleteVideoPost(vid.id)}
                        className="text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Edit Profile Form */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 max-w-2xl">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              {t.profile.editProfile}
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    {t.profile.displayName}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    {t.profile.phone}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {t.profile.address}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    {t.profile.city}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    {t.profile.country}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                  />
                </div>
              </div>

              {/* Artist toggle */}
              <div className="pt-2 border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isArtist}
                    onChange={(e) => setIsArtist(e.target.checked)}
                    className="rounded text-stone-900 accent-stone-900"
                  />
                  <span className="font-semibold text-stone-800">
                    {t.profile.isArtistToggle}
                  </span>
                </label>
              </div>

              {isArtist && (
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    {t.profile.artistBio}
                  </label>
                  <textarea
                    rows={3}
                    value={artistBio}
                    onChange={(e) => setArtistBio(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900 leading-relaxed"
                    placeholder="Tell collectors about your aesthetic philosophy, mediums, and studio location..."
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>{t.profile.saveChanges}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
