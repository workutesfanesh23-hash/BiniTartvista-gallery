import React from 'react';
import { Artwork } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Eye, Download, Image as ImageIcon } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
  compact?: boolean;
  onViewDetails?: (artwork: Artwork) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ 
  artwork, 
  compact = false,
  onViewDetails 
}) => {
  const { 
    language, 
    t, 
    setSelectedArtwork, 
    addToCart, 
    toggleSaveArtwork, 
    savedArtworkIds,
    setSelectedArtistId,
    setActivePage
  } = useApp();

  const isSaved = savedArtworkIds.includes(artwork.id);
  const displayTitle = (language === 'am' && artwork.titleAm) ? artwork.titleAm : artwork.title;
  const displayArtist = (language === 'am' && artwork.artistNameAm) ? artwork.artistNameAm : artwork.artistName;

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(artwork);
    } else {
      setSelectedArtwork(artwork);
    }
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedArtistId(artwork.artistId ?? null);
    setActivePage('artist-profile');
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative flex flex-col bg-white border border-stone-200/90 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
        compact ? 'w-72 sm:w-80 shrink-0' : 'w-full'
      }`}
    >
      {/* Visual Image Container with fallback */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={artwork.imageUrl}
          alt={displayTitle}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // Elegant Zero-broken-image fallback
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        {/* Fallback container */}
        <div 
          className="hidden w-full h-full items-center justify-center flex-col bg-stone-200 text-stone-500 p-4 text-center"
        >
          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs font-serif">{displayTitle}</span>
        </div>

        {/* Hover Quick Actions Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveArtwork(artwork.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-colors cursor-pointer ${
              isSaved 
                ? 'bg-amber-600 text-white' 
                : 'bg-white/90 text-stone-700 hover:text-amber-700 hover:bg-white'
            }`}
            title="Save to Wishlist"
            aria-label="Save Artwork"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quiet Type Marker (clean unboxed text on subtle scrim) */}
        <div className="absolute bottom-2 left-3 text-[11px] font-medium text-white/90 drop-shadow-sm flex items-center gap-1.5">
          <span>{artwork.type === 'digital' ? t.artwork.digitalDownload : artwork.category}</span>
          <span>·</span>
          <span>{artwork.year}</span>
        </div>
      </div>

      {/* Artwork Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {displayTitle}
          </h3>

          <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-500">
            <button
              onClick={handleArtistClick}
              className="text-stone-700 hover:text-amber-800 hover:underline font-medium truncate cursor-pointer text-left"
            >
              {displayArtist}
            </button>
            <span>·</span>
            <span className="truncate">{artwork.medium ? artwork.medium.split(',')[0] : artwork.edition}</span>
          </div>
        </div>

        {/* Price and Action Row */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-stone-600">
              {artwork.type === 'digital' ? 'License From' : 'Price'}
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-stone-900 tabular-nums">
              ${artwork.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              {t.carousel.viewDetails}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(artwork);
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title={t.artwork.addToCart}
            >
              {artwork.type === 'digital' ? (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Get</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Collect</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
