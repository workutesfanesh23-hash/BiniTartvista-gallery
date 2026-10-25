import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { Palette, Filter, SlidersHorizontal, Plus, Sparkles } from 'lucide-react';
import { Artwork } from '../types';

export const GalleryPage: React.FC = () => {
  const { artworks, t, language, addArtwork, currentUser, searchQuery } = useApp();

  const [selectedMedium, setSelectedMedium] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // New artwork listing modal
  const [isAddArtModalOpen, setIsAddArtModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(1200);
  const [newMedium, setNewMedium] = useState('Oil on linen');
  const [newDimensions, setNewDimensions] = useState('100 × 80 cm');
  const [newDescription, setNewDescription] = useState('');

  // Physical artworks only
  const physicalArtworks = artworks.filter(a => a.type === 'physical' || a.category === 'Painting' || a.category === 'Sculpture');

  const filtered = physicalArtworks.filter(art => {
    // Medium filter
    const matchesMedium = selectedMedium === 'All' || 
      (art.medium && art.medium.toLowerCase().includes(selectedMedium.toLowerCase())) ||
      art.category.toLowerCase().includes(selectedMedium.toLowerCase());

    // Price filter
    let matchesPrice = true;
    if (priceFilter === 'under500') matchesPrice = art.price < 500;
    else if (priceFilter === '500-1500') matchesPrice = art.price >= 500 && art.price <= 1500;
    else if (priceFilter === 'above1500') matchesPrice = art.price > 1500;

    // Availability
    const matchesAvailability = !onlyAvailable || art.availability === 'available';

    // Search query
    const matchesSearch = !searchQuery || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artistName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMedium && matchesPrice && matchesAvailability && matchesSearch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return b.year - a.year;
  });

  const handleCreateArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addArtwork({
      title: newTitle,
      artistId: currentUser.id,
      artistName: currentUser.name,
      artistAvatar: currentUser.avatar,
      category: 'Painting',
      type: 'physical',
      medium: newMedium,
      price: Number(newPrice),
      currency: 'USD',
      imageUrl: '/src/assets/images/art_coffee_ceremony_1792961230106.jpg',
      dimensions: newDimensions,
      year: new Date().getFullYear(),
      edition: 'Original 1 of 1',
      description: newDescription || 'Original physical artwork curated by registered artist.',
      availability: 'available',
      isRecent: true
    });

    setIsAddArtModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
            <Palette className="w-4 h-4" />
            <span>Curated Original Collection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {t.nav.artGallery}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Original canvases, hand-carved wood, cast bronze, and mixed media masterworks created by established and emerging Ethiopian artists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddArtModalOpen(true)}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>List Artwork</span>
          </button>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="py-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-stone-200">
        {/* Medium Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl">
          {['All', 'Oil', 'Acrylic', 'Sculpture', 'Charcoal', 'Mixed'].map(m => (
            <button
              key={m}
              onClick={() => setSelectedMedium(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedMedium === m 
                  ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Filter Controls (Price, Availability, Sort) */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Price Range */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-stone-900"
          >
            <option value="all">{t.filters.priceAll}</option>
            <option value="under500">{t.filters.under500}</option>
            <option value="500-1500">{t.filters.from500to1500}</option>
            <option value="above1500">{t.filters.above1500}</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-stone-900"
          >
            <option value="newest">{t.filters.newest}</option>
            <option value="price-asc">{t.filters.priceAsc}</option>
            <option value="price-desc">{t.filters.priceDesc}</option>
          </select>

          {/* Availability Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-stone-900 accent-stone-900"
            />
            <span>{t.filters.inStockOnly}</span>
          </label>
        </div>
      </div>

      {/* Grid */}
      <div className="py-8">
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500 font-mono">
          <span>Displaying {sorted.length} physical artworks</span>
        </div>

        {sorted.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
            <Palette className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="font-serif text-lg text-stone-800">No artworks match your selected filters.</p>
            <button
              onClick={() => {
                setSelectedMedium('All');
                setPriceFilter('all');
                setOnlyAvailable(false);
              }}
              className="mt-3 text-xs text-amber-800 font-semibold underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map(art => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
          </div>
        )}
      </div>

      {/* List Artwork Modal */}
      {isAddArtModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto"
          onClick={() => setIsAddArtModalOpen(false)}
        >
          <div 
            className="bg-[#FAF8F5] border border-stone-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              List Artwork in Gallery Catalog
            </h3>

            <form onSubmit={handleCreateArtwork} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Artwork Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Monolithic Shadows of Roha"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Medium</label>
                  <input
                    type="text"
                    value={newMedium}
                    onChange={(e) => setNewMedium(e.target.value)}
                    placeholder="Oil on linen, 24K gold"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Dimensions</label>
                <input
                  type="text"
                  value={newDimensions}
                  onChange={(e) => setNewDimensions(e.target.value)}
                  placeholder="120 × 90 cm (47.2 × 35.4 in)"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Curatorial Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the conceptual background, symbolism, and pigments used..."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Publish to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddArtModalOpen(false)}
                  className="py-2.5 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
