import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Database, 
  Download, 
  Code, 
  Server, 
  Check, 
  Copy, 
  Key, 
  ShieldCheck,
  FolderGit2
} from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, language, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'export' | 'supabase' | 'deployment'>('export');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isExportModalOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedSection(sectionId);
    showToast('Code copied to clipboard!');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const supabaseSqlSchema = `-- BiniT ArtVista Gallery: Production Supabase Schema
-- 1. Profiles Table (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  avatar_url text,
  phone text,
  address text,
  is_artist boolean default false,
  artist_bio text,
  social_links jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Artworks Catalog
create table public.artworks (
  id uuid default gen_random_uuid() primary key,
  artist_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  title_am text,
  category text not null,
  type text check (type in ('physical', 'photography', 'digital')),
  medium text,
  price numeric(10, 2) not null,
  currency text default 'USD',
  image_url text not null,
  dimensions text,
  year int,
  edition text,
  description text,
  availability text default 'available',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Video Posts (Persistent Video Storage)
create table public.video_posts (
  id uuid default gen_random_uuid() primary key,
  artist_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  video_url text not null, -- Stored in Supabase Storage bucket 'artvista_videos'
  thumbnail_url text,
  category text not null,
  tags text[],
  likes_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.artworks enable row level security;
alter table public.video_posts enable row level security;

-- Public can view catalog; artists can manage their own works
create policy "Public artworks are viewable by everyone" on public.artworks for select using (true);
create policy "Artists can insert own artworks" on public.artworks for insert with check (auth.uid() = artist_id);
create policy "Artists can manage own videos" on public.video_posts for all using (auth.uid() = artist_id);`;

  const supabaseClientCode = `// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload video file to Supabase Storage Bucket 'artvista_videos'
 */
export async function uploadVideoToSupabase(file: File, artistId: string) {
  const fileExt = file.name.split('.').pop();
  const filePath = \`videos/\${artistId}/\${Date.now()}.\${fileExt}\`;
  
  const { data, error } = await supabase.storage
    .from('artvista_videos')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('artvista_videos')
    .getPublicUrl(filePath);
    
  return publicUrl;
}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-sm overflow-y-auto"
      onClick={() => setIsExportModalOpen(false)}
    >
      <div 
        className="bg-[#FAF8F5] border border-stone-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                Backend Architecture & Source Export
              </h2>
              <p className="text-xs text-stone-300">
                Supabase integration blueprint, persistent storage instructions, and code backup
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 px-6 pt-3 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'export'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Export & Backup Guide
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'supabase'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Supabase Schema & Storage
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`pb-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'deployment'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Production Deployment
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto text-xs sm:text-sm text-stone-700 space-y-4">
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl">
                <h4 className="font-semibold text-amber-900 text-sm mb-1 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-amber-700" />
                  How to Backup & Save All Project Files
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  BiniT ArtVista Gallery is structured as a standard modular React + TypeScript + Vite project. All files are cleanly located in the workspace directory.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-stone-900">Step-by-Step Local Running & Backup:</h5>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-stone-600">
                  <li>
                    <strong className="text-stone-800">Clone or Download Workspace:</strong> Copy the project directory containing <code className="bg-stone-200 px-1 py-0.5 rounded">package.json</code>, <code className="bg-stone-200 px-1 py-0.5 rounded">src/</code>, <code className="bg-stone-200 px-1 py-0.5 rounded">vite.config.ts</code>, and <code className="bg-stone-200 px-1 py-0.5 rounded">index.html</code>.
                  </li>
                  <li>
                    <strong className="text-stone-800">Install Node Dependencies:</strong> Run <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">npm install</code> in your terminal.
                  </li>
                  <li>
                    <strong className="text-stone-800">Start Dev Server:</strong> Run <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">npm run dev</code> to launch at <code className="bg-stone-200 px-1 py-0.5 rounded">http://localhost:3000</code>.
                  </li>
                  <li>
                    <strong className="text-stone-800">Export Build:</strong> Run <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">npm run build</code> to produce a deployable static bundle inside <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">/dist</code>.
                  </li>
                </ol>
              </div>

              <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">Environment Variables (.env.example):</span>
                  <button
                    onClick={() => copyToClipboard('VITE_SUPABASE_URL="https://your-project.supabase.co"\nVITE_SUPABASE_ANON_KEY="your-anon-public-key"', 'env')}
                    className="flex items-center gap-1 text-xs text-amber-800 hover:underline cursor-pointer"
                  >
                    {copiedSection === 'env' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'env' ? 'Copied' : 'Copy Env'}</span>
                  </button>
                </div>
                <pre className="bg-stone-900 text-stone-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Persistent Video & Media Storage:</strong>
                  <p className="mt-0.5">
                    For persistent large video uploads (MP4, WebM up to 500MB), create a Supabase bucket named <code className="font-mono bg-blue-100 px-1 rounded">artvista_videos</code> with public read access. Private credentials remain securely in environment variables.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-stone-900 text-xs">PostgreSQL & RLS Blueprint:</span>
                  <button
                    onClick={() => copyToClipboard(supabaseSqlSchema, 'sql')}
                    className="flex items-center gap-1 text-xs text-amber-800 hover:underline cursor-pointer"
                  >
                    {copiedSection === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'sql' ? 'Copied' : 'Copy SQL Schema'}</span>
                  </button>
                </div>
                <pre className="bg-stone-900 text-stone-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
{supabaseSqlSchema}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-stone-900 text-xs">TypeScript Supabase Storage Client:</span>
                  <button
                    onClick={() => copyToClipboard(supabaseClientCode, 'client')}
                    className="flex items-center gap-1 text-xs text-amber-800 hover:underline cursor-pointer"
                  >
                    {copiedSection === 'client' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'client' ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="bg-stone-900 text-stone-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
{supabaseClientCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="space-y-3">
              <h5 className="font-semibold text-stone-900">Production Deployment Options</h5>
              <p className="text-xs text-stone-600">
                Deploy BiniT ArtVista Gallery directly to Cloud Run, Vercel, Netlify, or any modern web host:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-stone-200 rounded-xl">
                  <strong className="text-stone-900 block mb-1">Vercel / Netlify</strong>
                  <p className="text-stone-500 mb-2">Zero-config Vite SPA hosting with automatic SSL and edge CDN.</p>
                  <code className="block bg-stone-100 p-1.5 rounded font-mono text-[11px]">
                    npm run build → /dist
                  </code>
                </div>

                <div className="p-3 bg-white border border-stone-200 rounded-xl">
                  <strong className="text-stone-900 block mb-1">Google Cloud Run</strong>
                  <p className="text-stone-500 mb-2">Full containerized deployment with Node.js or Nginx static server.</p>
                  <code className="block bg-stone-100 p-1.5 rounded font-mono text-[11px]">
                    gcloud run deploy
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
