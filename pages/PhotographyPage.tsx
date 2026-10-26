import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { Camera, Sparkles, Filter, Award } from 'lucide-react';

export const PhotographyPage: React.FC = () => {
  const { artworks, t, language, searchQuery } = useApp();
  const [photoType, setPhotoType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const photoArtworks = artworks.filter(a => a.type === 'photography' || a.category === 'Photography');

  const filtered = photoArtworks.filter(photo => {
    const matchesType = photoType === 'All' || 
      (photoType === 'Monochrome' && photo.description?.toLowerCase().includes('monochrome')) ||
      (photoType === 'Landscape' && photo.description?.toLowerCase().includes('landscape')) ||
      (photoType === 'Limited Edition' && photo.edition?.includes('Limited'));

    const matchesSearch = !searchQuery || 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.artistName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return (b.year ?? 0) - (a.year ?? 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
            <Camera className="w-4 h-4" />
            <span>Archival Darkroom & Digital Prints</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {t.nav.photography}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Signed and numbered fine art prints on museum rag, capturing monumental landscapes, monolithic heritage, and intimate documentary portraits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
          <Award className="w-4 h-4 text-amber-800 shrink-0" />
          <span>Every print includes Hahnemühle Certificate & Hologram</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl">
          {['All', 'Landscape', 'Monochrome', 'Limited Edition'].map(type => (
            <button
              key={type}
              onClick={() => setPhotoType(type)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                photoType === type 
                  ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-mono">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-stone-900"
          >
            <option value="newest">Latest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Photography Grid */}
      <div className="py-8">
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500 font-mono">
          <span>{sorted.length} Archival Prints Available</span>
        </div>

        {sorted.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
            <Camera className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="font-serif text-lg text-stone-800">No photography matches your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map(photo => (
              <ArtworkCard key={photo.id} artwork={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
