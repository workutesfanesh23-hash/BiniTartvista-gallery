# BiniT ArtVista Gallery

> **Modern, Curated Fine Art & Photography Marketplace**  
> *Bilingual Platform (English & Amharic / አማርኛ)*

BiniT ArtVista Gallery is a production-ready art and photography web application that connects international collectors with original canvas paintings, archival photography, creator video streams, digital downloads, and custom commissions.

---

## 🌟 Key Features

1. **Homepage & Strictly Contained Artwork Carousel**:
   - Prominent brand header with wordmark and logo.
   - Horizontally scrolling artwork carousel directly below the header with snap alignment (`overflow-x-auto`, strictly no page-level sideways scroll).
   - Curated collections, segmented categories, featured artists, and trending video stream previews.

2. **Dedicated Video Posts Section**:
   - Creator studio video feed with HTML5 video player and custom playback controls.
   - Video upload workflow with client-side file validation (MP4, WebM formats, max size constraints).
   - Video title, description, category selection, and tags.
   - Live video preview before publishing.
   - Edit, delete, like, comment, and share capabilities.
   - Direct creator profile linkage.
   - Explicit persistent storage disclosure (ready for Supabase Storage `artvista_videos`).

3. **Art & Photography Marketplace**:
   - **Art Gallery**: Physical oil on linen, encaustic beeswax, acrylics, and bronze/wood sculptures with medium, availability, and price filters.
   - **Photography**: Signed, numbered limited editions on Hahnemühle cotton rag, monochrome architectural studies, and landscape panoramas.
   - **Digital Downloads**: Instant 8K master TIFF and vector assets with demo certificate generation and personal vs. commercial licensing options.
   - **Custom Commissions**: 4-step collaborative workflow with concept description, budget estimation, target dimensions, and reference image upload.

4. **Collector & Artist Profiles**:
   - User profile with editable display name, phone, delivery addresses, and artist biography toggle.
   - Order history with tracking numbers, status badges, and itemized receipts.
   - Saved wishlist artworks.
   - Uploaded artworks and video posts management.

5. **Direct Messaging & Curatorial Contact**:
   - Interactive messaging between customers and artists with quick inquiry presets.
   - Configurable social links for Telegram, YouTube, TikTok, Facebook, and Instagram with live in-app editing and testing.

6. **Bilingual Support (English & Amharic / አማርኛ)**:
   - Full translation coverage for navigation, buttons, forms, status badges, and modals.
   - Persisted language preference in `localStorage`.

7. **Backend Readiness & Demo Checkout**:
   - Simulated checkout flow with clear demo badges and order history persistence.
   - In-app Supabase and SQL Schema blueprint viewer (`Backend & Export`).

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 1. Installation
Clone or download the repository, then install project dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Available environment variables:
```env
# Optional Supabase Integration:
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

### 3. Start Development Server
```bash
npm run dev
```
The app will run at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be output to `/dist`.

---

## 🗄️ Supabase Backend Setup

To connect persistent PostgreSQL database and persistent file storage:

1. **Create a Supabase Project**:
   Sign in to [supabase.com](https://supabase.com) and create a new project.

2. **Execute Database Schema**:
   Run the following SQL in the Supabase SQL Editor:
   ```sql
   -- Profiles
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

   -- Artworks Catalog
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

   -- Video Posts
   create table public.video_posts (
     id uuid default gen_random_uuid() primary key,
     artist_id uuid references public.profiles(id) on delete cascade,
     title text not null,
     description text,
     video_url text not null,
     thumbnail_url text,
     category text not null,
     tags text[],
     likes_count int default 0,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```

3. **Configure Storage Buckets**:
   - Create a public bucket named `artvista_videos` with 150MB upload limit.
   - Create a public bucket named `artvista_images` for artwork and photography assets.

---

## 💾 Exporting & Backing Up the Source Code

To back up and export all source files:
1. All files are standard Git repository files in the project root (`src/`, `public/`, `index.html`, `package.json`, `tsconfig.json`, `vite.config.ts`).
2. You can create a compressed archive of the project:
   ```bash
   tar -czvf binit-artvista-gallery.tar.gz --exclude='node_modules' --exclude='.git' .
   ```
3. Alternatively, click the **Backend & Export** button in the top navigation ribbon for instant access to the database blueprints and configuration instructions.
