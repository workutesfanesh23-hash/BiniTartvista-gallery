import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCard } from './ArtworkCard';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

export const ArtworkCarousel: React.FC = () => {
  const { t, artworks, setActivePage, setSelectedArtwork } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Take featured artworks
  const featuredArtworks = artworks.filter(a => a.isFeatured).concat(artworks.filter(a => !a.isFeatured));

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#F5F2EB]/60 border-b border-stone-200 py-6 sm:py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.hero.eyebrow}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t.carousel.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {t.carousel.subtitle}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-sm cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-sm cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActivePage('art-gallery')}
              className="ml-2 text-xs font-semibold text-stone-800 hover:text-amber-800 flex items-center gap-1 transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-stone-200/60"
            >
              <span>{t.carousel.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Strictly Contained Horizontally Scrolling Carousel Rail */}
        {/* Only this div scrolls horizontally; page body remains strictly constrained */}
        <div 
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {featuredArtworks.map((artwork) => (
            <div key={artwork.id} className="snap-start shrink-0">
              <ArtworkCard 
                artwork={artwork} 
                compact={true} 
                onViewDetails={(item) => setSelectedArtwork(item)} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
