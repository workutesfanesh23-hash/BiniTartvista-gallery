import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Video, 
  Upload, 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  X,
  FileVideo,
  Clock,
  Sparkles,
  Database
} from 'lucide-react';
import { VideoPost } from '../types';

export const VideoPostsPage: React.FC = () => {
  const { 
    t, 
    language, 
    videos, 
    addVideoPost, 
    updateVideoPost, 
    deleteVideoPost, 
    toggleLikeVideo, 
    addVideoComment,
    currentUser, 
    setSelectedArtistId, 
    setActivePage,
    setIsExportModalOpen,
    showToast 
  } = useApp();

  // Active playing video in main view or modal
  const [activePlayingId, setActivePlayingId] = useState<string | null>(videos[0]?.id || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [newCommentText, setNewCommentText] = useState<{ [key: string]: string }>({});

  // Video Upload / Edit Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form Fields
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoPost['category']>('Studio Process');
  const [tagsInput, setTagsInput] = useState('ethiopianart, process, studio');
  const [thumbnailUrl, setThumbnailUrl] = useState('/src/assets/images/art_coffee_ceremony_1792961230106.jpg');
  
  // Upload status and validation
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const videoElementRef = useRef<HTMLVideoElement>(null);

  // Filter category
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const filteredVideos = videos.filter(v => 
    activeCategoryFilter === 'All' || v.category === activeCategoryFilter
  );

  const activeVideo = videos.find(v => v.id === activePlayingId) || videos[0];

  // Handle Video File Selection with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format (MP4, WebM)
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please select an MP4 or WebM video file.');
      return;
    }

    // Validate size (max 150MB limit for browser evaluation)
    const maxSizeBytes = 150 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadError('File size exceeds 150MB. Please select an optimized clip.');
      return;
    }

    setVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewVideoUrl(objectUrl);
  };

  // Submit Video Post
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please provide a video title.');
      return;
    }

    if (!editingPostId && !previewVideoUrl) {
      setUploadError('Please select a video file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    // Simulated progress sequence
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);

      const parsedTags = tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

      if (editingPostId) {
        updateVideoPost(editingPostId, {
          title,
          description,
          category,
          tags: parsedTags,
          thumbnailUrl
        });
      } else {
        addVideoPost({
          title,
          description,
          artistId: currentUser.id,
          artistName: currentUser.name,
          artistAvatar: currentUser.avatar,
          videoUrl: previewVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnailUrl: thumbnailUrl || '/src/assets/images/art_coffee_ceremony_1792961230106.jpg',
          category,
          tags: parsedTags,
          duration: '03:15'
        });
      }

      // Reset modal
      setIsUploadModalOpen(false);
      setEditingPostId(null);
      setVideoFile(null);
      setPreviewVideoUrl('');
      setTitle('');
      setDescription('');
    }, 1100);
  };

  const handleOpenEdit = (video: VideoPost) => {
    setEditingPostId(video.id);
    setTitle(video.title);
    setDescription(video.description ?? '');
    setCategory(video.category);
    setTagsInput(video.tags?.join(', ') ?? '');
    setThumbnailUrl(video.thumbnailUrl);
    setPreviewVideoUrl(video.videoUrl ?? '');
    setIsUploadModalOpen(true);
  };

  const handleShareVideo = (video: VideoPost) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(t.video.linkCopied);
  };

  const handleTogglePlay = () => {
    if (videoElementRef.current) {
      if (isPlaying) {
        videoElementRef.current.pause();
        setIsPlaying(false);
      } else {
        videoElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleToggleMute = () => {
    if (videoElementRef.current) {
      videoElementRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoElementRef.current) {
      if (videoElementRef.current.requestFullscreen) {
        videoElementRef.current.requestFullscreen();
      }
    }
  };

  const handleAddComment = (videoId: string) => {
    const text = newCommentText[videoId];
    if (!text || !text.trim()) return;
    addVideoComment(videoId, text);
    setNewCommentText(prev => ({ ...prev, [videoId]: '' }));
    showToast(language === 'am' ? 'አስተያየትዎ ተመዝግቧል!' : 'Comment posted!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Post Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
            <Video className="w-4 h-4" />
            <span>Studio & Darkroom Streams</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {t.video.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            {t.video.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingPostId(null);
              setTitle('');
              setDescription('');
              setVideoFile(null);
              setPreviewVideoUrl('');
              setIsUploadModalOpen(true);
            }}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>{t.video.uploadNew}</span>
          </button>
        </div>
      </div>

      {/* Storage Backend Disclosure Notice */}
      <div className="my-5 p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <Database className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold">{t.video.storageNotice}</p>
          <span className="text-[11px] text-amber-800">
            Client video uploads are immediately previewable. For production scale, connect your Supabase Storage bucket <code>artvista_videos</code> with RLS rules.
          </span>
        </div>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="text-amber-900 font-semibold underline text-xs shrink-0 cursor-pointer"
        >
          View Storage Setup
        </button>
      </div>

      {/* Main Focus Feature Player */}
      {activeVideo && (
        <div className="bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* HTML5 Video Player Area */}
            <div className="lg:col-span-8 relative aspect-video bg-black flex items-center justify-center">
              <video
                ref={videoElementRef}
                key={activeVideo.videoUrl}
                src={activeVideo.videoUrl}
                poster={activeVideo.thumbnailUrl}
                controls={false}
                playsInline
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Custom Playback Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-between items-center text-white text-xs pointer-events-auto">
                  <span className="bg-stone-900/80 px-2.5 py-1 rounded text-amber-400 font-medium">
                    {activeVideo.category}
                  </span>
                  <span className="font-mono text-stone-300">
                    Uploaded {activeVideo.uploadDate}
                  </span>
                </div>

                <div className="flex items-center justify-between text-white pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTogglePlay}
                      className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    <button
                      onClick={handleToggleMute}
                      className="p-2 hover:bg-white/10 rounded-lg text-stone-300 hover:text-white transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    onClick={handleFullscreen}
                    className="p-2 hover:bg-white/10 rounded-lg text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Post Information & Comments Sidebar */}
            <div className="lg:col-span-4 bg-stone-900 text-stone-200 p-5 sm:p-6 flex flex-col justify-between max-h-[500px] overflow-y-auto border-t lg:border-t-0 lg:border-l border-stone-800">
              <div>
                {/* Creator Header */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-800">
                  <button
                    onClick={() => {
                      setSelectedArtistId(activeVideo.artistId ?? null);
                      setActivePage('artist-profile');
                    }}
                    className="flex items-center gap-2.5 group cursor-pointer text-left"
                  >
                    <img
                      src={activeVideo.artistAvatar}
                      alt={activeVideo.artistName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {activeVideo.artistName}
                      </h4>
                      <span className="text-[11px] text-stone-400">
                        View Artist Profile →
                      </span>
                    </div>
                  </button>

                  {/* Edit/Delete if post belongs to current user */}
                  {(activeVideo.artistId === currentUser.id || activeVideo.artistName === currentUser.name) && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(activeVideo)}
                        className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors"
                        title={t.video.editBtn}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(t.video.confirmDelete)) {
                            deleteVideoPost(activeVideo.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded transition-colors"
                        title={t.video.deleteBtn}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="font-serif text-lg font-bold text-white mt-4">
                  {language === 'am' && activeVideo.titleAm ? activeVideo.titleAm : activeVideo.title}
                </h3>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  {language === 'am' && activeVideo.descriptionAm ? activeVideo.descriptionAm : activeVideo.description}
                </p>

                {/* Social Interaction Buttons */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-stone-800 text-xs">
                  <button
                    onClick={() => toggleLikeVideo(activeVideo.id)}
                    className={`flex items-center gap-1.5 font-medium cursor-pointer transition-colors ${
                      activeVideo.hasLiked ? 'text-rose-500 font-semibold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${activeVideo.hasLiked ? 'fill-current' : ''}`} />
                    <span>{activeVideo.likesCount}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-stone-300">
                    <MessageCircle className="w-4 h-4" />
                    <span>{activeVideo.commentsCount || 0}</span>
                  </div>

                  <button
                    onClick={() => handleShareVideo(activeVideo)}
                    className="flex items-center gap-1.5 text-stone-300 hover:text-white cursor-pointer ml-auto"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{t.video.share}</span>
                  </button>
                </div>

                {/* Comments List */}
                <div className="mt-4 pt-3 border-t border-stone-800 space-y-2.5">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                    Community Comments ({activeVideo.comments?.length || 0})
                  </span>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {activeVideo.comments && activeVideo.comments.length > 0 ? (
                      activeVideo.comments.map(c => (
                        <div key={c.id} className="text-xs bg-stone-800/60 p-2 rounded-lg">
                          <div className="flex items-center justify-between text-[11px] text-amber-400/90 mb-1">
                            <span className="font-semibold">{c.userName}</span>
                            <span className="text-stone-400">{c.timestamp}</span>
                          </div>
                          <p className="text-stone-200">{c.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-500 italic">No comments yet. Start the conversation!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Comment Input */}
              <div className="mt-4 pt-3 border-t border-stone-800 flex gap-2">
                <input
                  type="text"
                  value={newCommentText[activeVideo.id] || ''}
                  onChange={(e) => setNewCommentText({ ...newCommentText, [activeVideo.id]: e.target.value })}
                  placeholder="Add a constructive comment..."
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(activeVideo.id)}
                />
                <button
                  onClick={() => handleAddComment(activeVideo.id)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter & Videos Feed Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Browse All Artist Video Streams
          </h2>

          <div className="flex flex-wrap gap-1 p-1 bg-stone-200/60 rounded-xl">
            {['All', 'Studio Process', 'Darkroom', 'Exhibition'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500">
            {t.video.noVideosFound}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                onClick={() => {
                  setActivePlayingId(video.id);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`group bg-white rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                  activePlayingId === video.id 
                    ? 'border-stone-900 ring-2 ring-stone-900/10 shadow-md' 
                    : 'border-stone-200 hover:border-amber-700/40 hover:shadow-md'
                }`}
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-stone-900/80 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
                      {video.duration}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
                      {video.category}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2">
                      {language === 'am' && video.titleAm ? video.titleAm : video.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="truncate">{video.artistName}</span>
                    <span className="font-mono">{video.likesCount} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload & Edit Video Modal */}
      {isUploadModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto"
          onClick={() => !isUploading && setIsUploadModalOpen(false)}
        >
          <div 
            className="bg-[#FAF8F5] border border-stone-200 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsUploadModalOpen(false)}
              disabled={isUploading}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pb-3 border-b border-stone-200">
              <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold">
                Creator Studio
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                {editingPostId ? t.video.editBtn : t.video.uploadNew}
              </h3>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handlePublishPost} className="space-y-4 text-xs">
              {/* Video File Picker */}
              {!editingPostId && (
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    {t.video.selectVideo}
                  </label>
                  <label className="border-2 border-dashed border-stone-300 hover:border-amber-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white transition-colors">
                    <FileVideo className="w-8 h-8 text-stone-400 mb-1" />
                    <span className="font-semibold text-stone-800">
                      {videoFile ? videoFile.name : 'Click to select MP4 or WebM video'}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-0.5">
                      Max file size: 150MB · High-definition 1080p / 4K accepted
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Live Video Preview if selected */}
              {previewVideoUrl && (
                <div>
                  <span className="block text-stone-700 font-medium mb-1">
                    {t.video.preview}
                  </span>
                  <div className="aspect-video bg-black rounded-xl overflow-hidden border border-stone-300">
                    <video
                      src={previewVideoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {t.video.videoTitle} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Masterclass: Painting Gold Leaf Glazes on Linen"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {t.video.videoDescription}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your creative process, tools, pigments, or background story..."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                />
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    {t.video.category}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VideoPost['category'])}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                  >
                    <option value="Studio Process">Studio Process</option>
                    <option value="Darkroom">Darkroom</option>
                    <option value="Exhibition">Exhibition Walkthrough</option>
                    <option value="Art Tutorial">Art Tutorial</option>
                    <option value="Artist Interview">Artist Interview</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    {t.video.tags}
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="oilpainting, ethiopianart, beeswax"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-stone-900"
                  />
                </div>
              </div>

              {/* Upload Progress Bar if submitting */}
              {isUploading && (
                <div className="space-y-1.5 p-3 bg-stone-100 rounded-xl">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                    <span>{t.video.uploadProgress}</span>
                    <span className="font-mono">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>{editingPostId ? 'Save Video Changes' : t.video.publishBtn}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
