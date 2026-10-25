import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { 
  Download, 
  FileCheck, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Artwork } from '../types';

export const DigitalDownloadsPage: React.FC = () => {
  const { artworks, t, language, addToCart, showToast } = useApp();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const digitalArtworks = artworks.filter(a => a.type === 'digital' || a.category === 'Digital Art');

  // Trigger simulated instant download of file and certificate
  const handleInstantDemoDownload = (art: Artwork) => {
    setDownloadingId(art.id);
    showToast(language === 'am' ? 'ዲጂታል ፋይሉ በመውረድ ላይ ነው...' : `Preparing high-res download for "${art.title}"...`);

    setTimeout(() => {
      // Create a downloadable certificate & metadata file
      const fileData = `=====================================================
BINIS ART VISTA GALLERY - DIGITAL ASSET LICENSE & CERTIFICATE
=====================================================
Asset Title: ${art.title}
Artist: ${art.artistName}
Year: ${art.year}
Accession Code: BAV-DIG-${art.id.toUpperCase()}
License Grant: Archival Personal & Creative License
Resolution: 8192 x 6144 px (300 DPI)
Color Profile: Display P3 / Adobe RGB (1998)
Cryptographic Hash: 7b89f3a0192e482910fa726d15

TERMS OF USE:
This digital master is authenticated by BiniT ArtVista Gallery. 
You are granted perpetual non-exclusive rights for exhibition, 
architectural installation, and personal publication.

Direct Image Asset URL: ${window.location.origin}${art.imageUrl}

Thank you for supporting African fine art and creators.
=====================================================`;

      const blob = new Blob([fileData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ArtVista_${art.title.replace(/\s+/g, '_')}_License.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadingId(null);
      showToast(language === 'am' ? 'ፋይሉ በተሳካ ሁኔታ ወርዷል!' : 'Digital asset package downloaded!');
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
            <Download className="w-4 h-4" />
            <span>Instant Master File Delivery</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {t.nav.digitalDownloads}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Acquire pristine 8K TIFFs, high-resolution printable vector files, and 3D architectural digital art with full certificate and instant delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-xl px-3.5 py-2 text-xs flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Instant .ZIP bundle with Authenticity Certificate</span>
          </div>
        </div>
      </div>

      {/* Licensing Guide Banner */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
          <h4 className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Personal & Home Print License (Included in Base Price)</span>
          </h4>
          <p className="text-xs text-stone-600">
            For personal wall prints, desktop wallpapers, private interior framing, and non-commercial creative exploration.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
          <h4 className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Commercial Rights (+100% Surcharge at Checkout)</span>
          </h4>
          <p className="text-xs text-stone-600">
            For album covers, book publishing, website branding, advertising campaigns, and public physical spaces.
          </p>
        </div>
      </div>

      {/* Digital Catalog Grid */}
      <div className="py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {digitalArtworks.map(art => (
            <div 
              key={art.id} 
              className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-stone-900/90 text-amber-300 px-2 py-1 rounded text-[10px] font-mono">
                    8K MASTER · TIFF
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-serif text-lg font-bold text-stone-900 line-clamp-1">
                    {language === 'am' && art.titleAm ? art.titleAm : art.title}
                  </h3>
                  <span className="text-xs text-stone-500 block">
                    Created by {art.artistName}
                  </span>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                  <div className="text-[11px] text-stone-500 font-mono pt-1">
                    Dimensions: {art.dimensions || '8192 × 6144 px'}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2">
                <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                  ${art.price} USD
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleInstantDemoDownload(art)}
                    disabled={downloadingId === art.id}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Instant download demo certificate & master link"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingId === art.id ? 'Packaging...' : 'Download'}</span>
                  </button>

                  <button
                    onClick={() => addToCart(art)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
