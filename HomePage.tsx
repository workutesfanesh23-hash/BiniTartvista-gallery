import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCarousel } from '../components/ArtworkCarousel';
import { ArtworkCard } from '../components/ArtworkCard';
import { 
  Play, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Video, 
  Search, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { Artwork } from '../types';

export const HomePage: React.FC = () => {
  const { 
    t, 
    language, 
    artworks, 
    artists, 
    videos, 
    setActivePage, 
    setSelectedArtistId, 
    setSelectedArtwork,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter artworks for the homepage grid
  const filteredArtworks = artworks.filter(art => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.titleAm && art.titleAm.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  const recentWorks = artworks.filter(a => a.isRecent).slice(0, 4);

  return (
    <div className="w-full">
      {/* 1. Directly Below Header: Horizontally Scrolling Artwork Carousel */}
      <ArtworkCarousel />

      {/* 2. Hero Mission Statement & Visual Anchor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>{t.hero.eyebrow}</span>
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
              {t.hero.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActivePage('art-gallery')}
                className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>{t.hero.exploreGallery}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => setActivePage('video-posts')}
                className="px-5 py-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4 text-amber-700" />
                <span>{t.hero.postVideo}</span>
              </button>

              <button
                onClick={() => setActivePage('commissions')}
                className="px-5 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>{t.hero.commissionArtist}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md group">
              <img
                src="/src/assets/images/hero_art_vista_exhibit_1792961229601.jpg"
                alt="BiniT ArtVista Gallery Exhibition"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                  Exhibition Space
                </span>
                <h3 className="font-serif text-lg font-semibold">
                  Bole Medhanialem Curatorial Pavilion
                </h3>
                <p className="text-xs text-stone-300 mt-0.5">
                  Private viewings & international archival dispatch
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-200">
          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl w-full md:w-auto">
            {['All', 'Painting', 'Photography', 'Digital Art', 'Sculpture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat === 'All' ? t.filters.all : cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.filters.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-stone-900"
            />
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              {selectedCategory === 'All' ? 'Curated Gallery Collection' : `${selectedCategory} Collection`}
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {filteredArtworks.length} works available
            </span>
          </div>

          {filteredArtworks.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
              <p className="font-serif text-lg text-stone-800">No works match your criteria.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-3 text-xs text-amber-800 font-semibold underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredArtworks.map(art => (
                <ArtworkCard key={art.id} artwork={art} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Trending Video Posts Teaser Strip */}
      <section className="bg-stone-900 text-white mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5 mb-1">
                <Video className="w-3.5 h-3.5" />
                <span>Behind the Easel & Lens</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                {t.video.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
                {t.video.subtitle}
              </p>
            </div>

            <button
              onClick={() => setActivePage('video-posts')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Explore All Videos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.slice(0, 3).map((video) => (
              <div 
                key={video.id}
                onClick={() => setActivePage('video-posts')}
                className="group bg-stone-800/80 rounded-xl overflow-hidden border border-stone-700/80 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-stone-900/80 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 text-stone-200 px-1.5 py-0.5 rounded">
                      {video.duration}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <span className="text-[11px] text-amber-400 font-medium block mb-1">
                      {video.category}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {language === 'am' && video.titleAm ? video.titleAm : video.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-700/60">
                    <span className="truncate">{video.artistName}</span>
                    <span className="font-mono">{video.likesCount} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Artists Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block mb-1">
            Master Creators & Visionaries
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Featured Resident Artists
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Meet the painters, sculptors, and photographers representing Ethiopia and the global African renaissance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => {
                setSelectedArtistId(artist.id);
                setActivePage('artist-profile');
              }}
              className="group bg-white rounded-xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-800/40 transition-all cursor-pointer text-center flex flex-col items-center"
            >
              <div className="relative mb-3">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-2 border-stone-100 group-hover:border-amber-600 transition-colors"
                />
                {artist.verified && (
                  <span className="absolute bottom-0 right-0 bg-amber-600 text-white rounded-full p-1" title="Verified Master Artist">
                    <Award className="w-3 h-3" />
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                {language === 'am' && artist.nameAm ? artist.nameAm : artist.name}
              </h3>

              <span className="text-xs text-amber-900/80 font-medium mt-0.5">
                {artist.specialty}
              </span>

              <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                {language === 'am' && artist.bioAm ? artist.bioAm : artist.bio}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 w-full flex items-center justify-between text-xs text-stone-600">
                <span>{artist.artworksCount} Works</span>
                <span className="text-amber-800 font-medium group-hover:underline">
                  View Profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Custom Commissions Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#FAF4EB] border border-amber-200/80 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
              Bespoke Art Curation
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {t.commissions.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {t.commissions.subtitle}
            </p>
          </div>

          <button
            onClick={() => setActivePage('commissions')}
            className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <span>{t.commissions.submitRequest}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </section>
    </div>
  );
};
