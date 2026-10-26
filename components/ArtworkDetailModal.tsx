import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Calendar, 
  Maximize2, 
  Layers, 
  MessageSquare,
  Download,
  Share2
} from 'lucide-react';

export const ArtworkDetailModal: React.FC = () => {
  const { 
    selectedArtwork, 
    setSelectedArtwork, 
    language, 
    t, 
    addToCart, 
    toggleSaveArtwork, 
    savedArtworkIds,
    setSelectedArtistId,
    setActivePage,
    sendMessage,
    showToast
  } = useApp();

  const [licenseType, setLicenseType] = useState<'personal' | 'commercial'>('personal');
  const [isZoomed, setIsZoomed] = useState(false);

  if (!selectedArtwork) return null;

  const isSaved = savedArtworkIds.includes(selectedArtwork.id);
  const displayTitle = (language === 'am' && selectedArtwork.titleAm) ? selectedArtwork.titleAm : selectedArtwork.title;
  const displayArtist = (language === 'am' && selectedArtwork.artistNameAm) ? selectedArtwork.artistNameAm : selectedArtwork.artistName;
  const displayDesc = (language === 'am' && selectedArtwork.descriptionAm) ? selectedArtwork.descriptionAm : selectedArtwork.description;

  const handleArtistClick = () => {
    setSelectedArtistId(selectedArtwork.artistId ?? null);
    setSelectedArtwork(null);
    setActivePage('artist-profile');
  };

  const handleDirectInquiry = () => {
    if (!selectedArtwork.artistId) {
      showToast(language === 'am' ? 'የአርቲስቱ መለያ አልተገኘም።' : 'This artist is not available for direct inquiry.');
      return;
    }

    sendMessage(
      selectedArtwork.artistId,
      `Hello! I am inquiring about "${selectedArtwork.title}" (${selectedArtwork.edition || selectedArtwork.category}, $${selectedArtwork.price}). Is this currently available for private viewing or immediate shipment?`
    );
    setSelectedArtwork(null);
    setActivePage('messages');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(language === 'am' ? 'የጥበብ ስራው አድራሻ ተቀድቷል!' : 'Artwork link copied to clipboard!');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setSelectedArtwork(null)}
    >
      <div 
        className="relative bg-[#FAF8F5] w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedArtwork(null)}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Artwork Visual Container */}
          <div className="relative bg-stone-900 flex items-center justify-center min-h-[300px] sm:min-h-[420px] p-6 overflow-hidden">
            <img
              src={selectedArtwork.imageUrl}
              alt={displayTitle}
              referrerPolicy="no-referrer"
              className={`max-h-[500px] w-auto max-w-full object-contain rounded shadow-lg transition-transform duration-300 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/80 text-xs">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="flex items-center gap-1.5 bg-stone-800/80 hover:bg-stone-800 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{isZoomed ? 'Zoom Out' : 'Zoom Inspection'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-stone-800/80 hover:bg-stone-800 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Right: Curatorial Details & Purchase Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="uppercase tracking-widest font-semibold text-amber-800">
                  {selectedArtwork.category}
                </span>
                <span className="text-emerald-700 font-medium">
                  {selectedArtwork.availability === 'available' ? t.artwork.inStock : selectedArtwork.availability}
                </span>
              </div>

              {/* Title & Artist */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {displayTitle}
              </h2>

              <div className="flex items-center gap-3 mt-3 pb-4 border-b border-stone-200">
                <button
                  onClick={handleArtistClick}
                  className="flex items-center gap-2.5 group cursor-pointer text-left"
                >
                  <img
                    src={selectedArtwork.artistAvatar}
                    alt={displayArtist}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-amber-500/30"
                  />
                  <div>
                    <span className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors block">
                      {displayArtist}
                    </span>
                    <span className="text-xs text-stone-500">
                      View Artist Portfolio & Videos
                    </span>
                  </div>
                </button>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                {displayDesc}
              </p>

              {/* Museum Accession Metadata Specifications */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs bg-stone-100/70 p-3.5 rounded-xl border border-stone-200/80">
                {selectedArtwork.dimensions && (
                  <div>
                    <span className="text-stone-600 block">{t.artwork.dimensions}</span>
                    <span className="font-medium text-stone-800">{selectedArtwork.dimensions}</span>
                  </div>
                )}
                {selectedArtwork.medium && (
                  <div>
                    <span className="text-stone-600 block">{t.artwork.medium}</span>
                    <span className="font-medium text-stone-800 line-clamp-1">{selectedArtwork.medium}</span>
                  </div>
                )}
                <div>
                  <span className="text-stone-600 block">{t.artwork.year}</span>
                  <span className="font-medium text-stone-800">{selectedArtwork.year}</span>
                </div>
                <div>
                  <span className="text-stone-600 block">{t.artwork.edition}</span>
                  <span className="font-medium text-stone-800">{selectedArtwork.edition || 'Original'}</span>
                </div>
              </div>

              {/* Digital Download License Switcher if applicable */}
              {selectedArtwork.type === 'digital' && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-xs font-semibold text-amber-900 block mb-2">
                    Select Digital Usage License:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setLicenseType('personal')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        licenseType === 'personal'
                          ? 'border-amber-700 bg-white font-medium text-stone-900 shadow-xs'
                          : 'border-transparent text-stone-600 hover:bg-white/50'
                      }`}
                    >
                      <div className="font-semibold">{t.cart.personalLicense}</div>
                      <div className="text-[10px] text-stone-500">For home print & non-commercial</div>
                    </button>
                    <button
                      onClick={() => setLicenseType('commercial')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        licenseType === 'commercial'
                          ? 'border-amber-700 bg-white font-medium text-stone-900 shadow-xs'
                          : 'border-transparent text-stone-600 hover:bg-white/50'
                      }`}
                    >
                      <div className="font-semibold">{t.cart.commercialLicense}</div>
                      <div className="text-[10px] text-stone-500">+100% Commercial rights</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-4 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{t.artwork.certificate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{t.artwork.shippingNote}</span>
                </div>
              </div>
            </div>

            {/* Price & Primary CTA */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-stone-500">
                  {selectedArtwork.type === 'digital' ? 'Download Investment' : 'Artwork Price'}
                </span>
                <span className="font-mono text-2xl font-bold text-stone-900">
                  ${(selectedArtwork.type === 'digital' && licenseType === 'commercial' 
                      ? selectedArtwork.price * 2 
                      : selectedArtwork.price).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addToCart(selectedArtwork, licenseType);
                    setSelectedArtwork(null);
                  }}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  {selectedArtwork.type === 'digital' ? (
                    <>
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>{t.artwork.addToCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      <span>{t.artwork.addToCart}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDirectInquiry}
                  className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-stone-600" />
                  <span>{t.artwork.inquireArtist}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
