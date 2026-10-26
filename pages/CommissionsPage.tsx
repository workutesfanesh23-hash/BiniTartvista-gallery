import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CommissionsPage: React.FC = () => {
  const { 
    t, 
    language, 
    artists, 
    addCommissionRequest, 
    commissions, 
    currentUser, 
    setActivePage 
  } = useApp();

  const [selectedArtistId, setSelectedArtistId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [artworkType, setArtworkType] = useState('Oil on Linen');
  const [budgetRange, setBudgetRange] = useState('$1,000 - $2,500');
  const [dimensions, setDimensions] = useState('120 × 90 cm');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('December 2026');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [referenceFileName, setReferenceFileName] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReferenceFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setReferenceImageUrl(objectUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const chosenArtist = artists.find(a => a.id === selectedArtistId);

    addCommissionRequest({
      artistId: selectedArtistId || undefined,
      artistName: chosenArtist ? chosenArtist.name : 'Open Recommendation',
      title,
      artworkType,
      budgetRange,
      dimensions,
      description,
      deadline,
      referenceImageUrl: referenceImageUrl || undefined
    });

    setSubmittedSuccess(true);
    // Reset inputs
    setTitle('');
    setDescription('');
    setReferenceImageUrl('');
    setReferenceFileName('');
  };

  // User's own commissions
  const myCommissions = commissions.filter(c => c.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Bespoke Masterpiece Creation</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          {t.commissions.title}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
          {t.commissions.subtitle}
        </p>
      </div>

      {/* 4-Step Process Guide */}
      <div className="mb-14 bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-6 text-center">
          {t.commissions.howItWorks}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70">
            <span className="font-serif text-xl font-bold text-amber-800 block mb-1">01</span>
            <h4 className="font-semibold text-stone-900 text-sm mb-1">{t.commissions.step1}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.commissions.step1Desc}</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70">
            <span className="font-serif text-xl font-bold text-amber-800 block mb-1">02</span>
            <h4 className="font-semibold text-stone-900 text-sm mb-1">{t.commissions.step2}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.commissions.step2Desc}</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70">
            <span className="font-serif text-xl font-bold text-amber-800 block mb-1">03</span>
            <h4 className="font-semibold text-stone-900 text-sm mb-1">{t.commissions.step3}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.commissions.step3Desc}</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70">
            <span className="font-serif text-xl font-bold text-amber-800 block mb-1">04</span>
            <h4 className="font-semibold text-stone-900 text-sm mb-1">{t.commissions.step4}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.commissions.step4Desc}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Commission Request Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
            {t.commissions.requestFormTitle}
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Provide details about your project. The artist will review and contact you through gallery direct messages.
          </p>

          {submittedSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Brief Submitted!</strong>
                <p className="mt-0.5">{t.commissions.successMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Project Title */}
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Project Title or Concept Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Monumental Heritage Canvas for Dining Pavilion"
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900 text-xs sm:text-sm"
              />
            </div>

            {/* Select Artist */}
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                {t.commissions.selectArtist}
              </label>
              <select
                value={selectedArtistId}
                onChange={(e) => setSelectedArtistId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900"
              >
                <option value="">{t.commissions.anyArtist}</option>
                {artists.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Medium & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {t.commissions.artworkType}
                </label>
                <select
                  value={artworkType}
                  onChange={(e) => setArtworkType(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900"
                >
                  <option value="Oil on Linen">Oil on Linen / Raw Beeswax</option>
                  <option value="Fine Art Photography">Fine Art Photography (Limited Print)</option>
                  <option value="Cast Bronze Sculpture">Cast Bronze Sculpture</option>
                  <option value="Mixed Media Canvas">Mixed Media Canvas with Gold Leaf</option>
                  <option value="Digital Masterwork">Digital 8K Illustration</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {t.commissions.budget}
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900"
                >
                  <option value="$500 - $1,000">$500 – $1,000 USD</option>
                  <option value="$1,000 - $2,500">$1,000 – $2,500 USD</option>
                  <option value="$2,500 - $5,000">$2,500 – $5,000 USD</option>
                  <option value="$5,000+">$5,000+ USD (Major Architectural Project)</option>
                </select>
              </div>
            </div>

            {/* Dimensions & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {t.commissions.dimensions}
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 150 × 120 cm (59 × 47 in)"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {t.commissions.timeline}
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. December 2026"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900"
                />
              </div>
            </div>

            {/* Vision Description */}
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                {t.commissions.description} *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.commissions.descriptionPlaceholder}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900 leading-relaxed"
              />
            </div>

            {/* Reference Image Upload */}
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                {t.commissions.referenceImage}
              </label>
              <label className="border-2 border-dashed border-stone-300 hover:border-amber-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-stone-50 transition-colors">
                <Upload className="w-6 h-6 text-stone-400 mb-1" />
                <span className="font-semibold text-stone-800">
                  {referenceFileName || 'Upload reference photo or architectural interior photo'}
                </span>
                <span className="text-[11px] text-stone-400">JPG, PNG up to 20MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {referenceImageUrl && (
                <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-stone-300">
                  <img src={referenceImageUrl} alt="Reference Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm text-sm"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>{t.commissions.submitRequest}</span>
            </button>
          </form>
        </div>

        {/* Sidebar: Active Commission Status & Recent Requests */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-3 flex items-center justify-between">
              <span>Your Commission Briefs</span>
              <span className="text-xs font-mono font-normal text-stone-500">
                {myCommissions.length} active
              </span>
            </h3>

            {myCommissions.length === 0 ? (
              <p className="text-xs text-stone-500 italic">
                You haven't submitted any commission briefs yet. Use the form to begin!
              </p>
            ) : (
              <div className="space-y-3">
                {myCommissions.map(comm => (
                  <div key={comm.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-stone-900 line-clamp-1">{comm.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                        {comm.status}
                      </span>
                    </div>
                    <div className="text-stone-500">
                      Artist: <span className="text-stone-800 font-medium">{comm.artistName}</span>
                    </div>
                    <div className="text-stone-500 flex justify-between font-mono">
                      <span>{comm.artworkType}</span>
                      <span>{comm.budgetRange}</span>
                    </div>
                    <p className="text-stone-600 line-clamp-2 pt-1 border-t border-stone-200">
                      {comm.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-xs text-amber-950 space-y-2">
            <h4 className="font-serif font-bold text-sm text-amber-900">
              Curatorial Escrow & Guarantee
            </h4>
            <p className="leading-relaxed">
              All commissioned projects are held in milestone escrow. You only release funds upon approving preliminary sketches, canvas updates, and final photographic review before dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
