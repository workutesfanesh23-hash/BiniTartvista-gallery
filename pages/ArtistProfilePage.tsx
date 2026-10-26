import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { 
  Award, 
  MapPin, 
  MessageSquare, 
  Sparkles, 
  Video, 
  Palette, 
  Play, 
  ExternalLink,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

export const ArtistProfilePage: React.FC = () => {
  const { 
    selectedArtistId, 
    artists, 
    artworks, 
    videos, 
    language, 
    setActivePage, 
    setSelectedArtistId, 
    sendMessage 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'artworks' | 'videos' | 'about'>('artworks');

  // Fallback to first artist if none selected
  const artist = artists.find(a => a.id === selectedArtistId) || artists[0];

  const artistArtworks = artworks.filter(a => a.artistId === artist.id || a.artistName === artist.name);
  const artistVideos = videos.filter(v => v.artistId === artist.id || v.artistName === artist.name);

  const handleMessageArtist = () => {
    setActivePage('messages');
  };

  const handleCommissionArtist = () => {
    setActivePage('commissions');
  };

  return (
    <div className="w-full pb-16">
      {/* Cover Banner */}
      <div className="relative h-48 sm:h-64 lg:h-80 w-full bg-stone-900 overflow-hidden">
        <img
          src={artist.coverImage}
          alt={artist.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
        
        <button
          onClick={() => setActivePage('home')}
          className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gallery</span>
        </button>
      </div>

      {/* Profile Header Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
                {artist.verified && (
                  <span className="absolute bottom-1 right-1 bg-amber-600 text-white rounded-full p-1 shadow-xs" title="Verified Master Artist">
                    <Award className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    {language === 'am' && artist.nameAm ? artist.nameAm : artist.name}
                  </h1>
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    Resident Master
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-stone-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{artist.location}</span>
                  </span>
                  <span>·</span>
                  <span className="text-amber-800 font-semibold">{artist.specialty}</span>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 max-w-2xl pt-1 leading-relaxed">
                  {language === 'am' && artist.bioAm ? artist.bioAm : artist.bio}
                </p>

                {/* Social Links */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-[11px] font-mono">
                  {artist.socialLinks?.telegram && (
                    <a href={artist.socialLinks.telegram} target="_blank" rel="noreferrer" className="text-amber-800 hover:underline">
                      Telegram ↗
                    </a>
                  )}
                  {artist.socialLinks?.instagram && (
                    <a href={artist.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-amber-800 hover:underline">
                      Instagram ↗
                    </a>
                  )}
                  {artist.socialLinks?.youtube && (
                    <a href={artist.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-amber-800 hover:underline">
                      YouTube ↗
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={handleMessageArtist}
                className="flex-1 md:flex-none px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Message Artist</span>
              </button>

              <button
                onClick={handleCommissionArtist}
                className="flex-1 md:flex-none px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Request Commission</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Strip */}
          <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="font-mono text-lg sm:text-xl font-bold text-stone-900 tabular-nums">
                {artistArtworks.length}
              </span>
              <span className="text-[11px] text-stone-500 block uppercase tracking-wider">Artworks</span>
            </div>
            <div>
              <span className="font-mono text-lg sm:text-xl font-bold text-stone-900 tabular-nums">
                {artistVideos.length}
              </span>
              <span className="text-[11px] text-stone-500 block uppercase tracking-wider">Studio Videos</span>
            </div>
            <div>
              <span className="font-mono text-lg sm:text-xl font-bold text-stone-900 tabular-nums">
                {artist.salesCount ?? 0}
              </span>
              <span className="text-[11px] text-stone-500 block uppercase tracking-wider">Acquisitions</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-4 mt-8 border-b border-stone-200 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('artworks')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'artworks'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Exhibited Artworks ({artistArtworks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'videos'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Feeds ({artistVideos.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'artworks' && (
            artistArtworks.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No works currently listed.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artistArtworks.map(art => (
                  <ArtworkCard key={art.id} artwork={art} />
                ))}
              </div>
            )
          )}

          {activeTab === 'videos' && (
            artistVideos.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No video streams posted yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artistVideos.map(vid => (
                  <div
                    key={vid.id}
                    onClick={() => setActivePage('video-posts')}
                    className="bg-white rounded-xl overflow-hidden border border-stone-200 hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-stone-900/80 text-amber-400 flex items-center justify-center">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif text-sm font-semibold text-stone-900 line-clamp-1">
                        {vid.title}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        {vid.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
