import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Artwork, 
  Artist, 
  VideoPost, 
  User, 
  CartItem, 
  Order, 
  Message, 
  CommissionRequest, 
  Language, 
  ActivePage 
} from '../types';
import { translations } from '../data/translations';
import { initialArtists, initialArtworks, initialVideoPosts, demoUser } from '../data/initialData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedArtistId: string | null;
  setSelectedArtistId: (id: string | null) => void;
  selectedArtwork: Artwork | null;
  setSelectedArtwork: (artwork: Artwork | null) => void;
  
  // Artworks
  artworks: Artwork[];
  addArtwork: (artwork: Omit<Artwork, 'id' | 'views' | 'likes'>) => void;
  deleteArtwork: (id: string) => void;
  toggleSaveArtwork: (id: string) => void;
  savedArtworkIds: string[];

  // Videos
  videos: VideoPost[];
  addVideoPost: (video: Omit<VideoPost, 'id' | 'likesCount' | 'commentsCount' | 'uploadDate'>) => void;
  updateVideoPost: (id: string, updates: Partial<VideoPost>) => void;
  deleteVideoPost: (id: string) => void;
  toggleLikeVideo: (id: string) => void;
  addVideoComment: (videoId: string, content: string) => void;

  // Artists
  artists: Artist[];

  // User
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  updateUserProfile: (updates: Partial<User>) => void;

  // Cart & Orders
  cart: CartItem[];
  addToCart: (artwork: Artwork, licenseType?: 'personal' | 'commercial') => void;
  removeFromCart: (artworkId: string) => void;
  updateCartQuantity: (artworkId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orders: Order[];
  placeOrder: (paymentMethod: string, address: string) => Order;

  // Commissions
  commissions: CommissionRequest[];
  addCommissionRequest: (request: Omit<CommissionRequest, 'id' | 'createdAt' | 'status' | 'userId' | 'userName' | 'userEmail'>) => void;

  // Messaging
  messages: Message[];
  activeChatRecipientId: string;
  setActiveChatRecipientId: (id: string) => void;
  sendMessage: (recipientId: string, content: string, attachmentUrl?: string) => void;

  // Search & Modals
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  
  // Toast notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language with localStorage sync
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('artvista_lang');
    return (saved === 'am' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('artvista_lang', lang);
  };

  const t = translations[language];

  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // User state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('artvista_user');
    return saved ? JSON.parse(saved) : demoUser;
  });

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('artvista_user', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'am' ? 'መገለጫዎ በተሳካ ሁኔታ ተሻሽሏል!' : 'Profile updated successfully!');
  };

  // Artworks state
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    const saved = localStorage.getItem('artvista_artworks');
    return saved ? JSON.parse(saved) : initialArtworks;
  });

  useEffect(() => {
    localStorage.setItem('artvista_artworks', JSON.stringify(artworks));
  }, [artworks]);

  const addArtwork = (artData: Omit<Artwork, 'id' | 'views' | 'likes'>) => {
    const newArt: Artwork = {
      ...artData,
      id: `art-${Date.now()}`,
      views: 1,
      likes: 0
    };
    setArtworks(prev => [newArt, ...prev]);
    showToast(language === 'am' ? 'የጥበብ ስራዎ በተሳካ ሁኔታ ተለጥፏል!' : 'Artwork added to gallery catalog!');
  };

  const deleteArtwork = (id: string) => {
    setArtworks(prev => prev.filter(a => a.id !== id));
    showToast(language === 'am' ? 'የጥበብ ስራው ተሰርዟል!' : 'Artwork removed.');
  };

  // Saved Artworks / Favorites
  const [savedArtworkIds, setSavedArtworkIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('artvista_saved_art');
    return saved ? JSON.parse(saved) : ['art-1', 'art-3'];
  });

  const toggleSaveArtwork = (id: string) => {
    setSavedArtworkIds(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('artvista_saved_art', JSON.stringify(updated));
      showToast(exists 
        ? (language === 'am' ? 'ከየተወደዱ ስራዎች ተወግዷል' : 'Removed from saved artworks')
        : (language === 'am' ? 'በተወደዱ ስራዎች ውስጥ ተቀምጧል!' : 'Saved to your collection wishlist!')
      );
      return updated;
    });
  };

  // Videos state
  const [videos, setVideos] = useState<VideoPost[]>(() => {
    const saved = localStorage.getItem('artvista_videos');
    return saved ? JSON.parse(saved) : initialVideoPosts;
  });

  useEffect(() => {
    localStorage.setItem('artvista_videos', JSON.stringify(videos));
  }, [videos]);

  const addVideoPost = (videoData: Omit<VideoPost, 'id' | 'likesCount' | 'commentsCount' | 'uploadDate'>) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const newPost: VideoPost = {
      ...videoData,
      id: `vid-${Date.now()}`,
      uploadDate: formattedDate,
      likesCount: 0,
      hasLiked: false,
      commentsCount: 0,
      comments: []
    };
    setVideos(prev => [newPost, ...prev]);
    showToast(language === 'am' ? 'ቪዲዮው በተሳካ ሁኔታ ተለጥፏል!' : 'Video post published to feed!');
  };

  const updateVideoPost = (id: string, updates: Partial<VideoPost>) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    showToast(language === 'am' ? 'የቪዲዮ ልጥፉ ተሻሽሏል!' : 'Video post updated!');
  };

  const deleteVideoPost = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    showToast(language === 'am' ? 'ቪዲዮው ተሰርዟል!' : 'Video post deleted.');
  };

  const toggleLikeVideo = (id: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === id) {
        const hasLiked = !v.hasLiked;
        return {
          ...v,
          hasLiked,
          likesCount: hasLiked ? v.likesCount + 1 : Math.max(0, v.likesCount - 1)
        };
      }
      return v;
    }));
  };

  const addVideoComment = (videoId: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: content.trim(),
      timestamp: 'Just now'
    };

    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return {
          ...v,
          commentsCount: v.commentsCount + 1,
          comments: [newComment, ...(v.comments || [])]
        };
      }
      return v;
    }));
  };

  // Artists
  const [artists] = useState<Artist[]>(initialArtists);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('artvista_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('artvista_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (artwork: Artwork, licenseType: 'personal' | 'commercial' = 'personal') => {
    setCart(prev => {
      const existing = prev.find(item => item.artwork.id === artwork.id && item.licenseType === licenseType);
      if (existing) {
        return prev.map(item => 
          item.artwork.id === artwork.id && item.licenseType === licenseType 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { artwork, licenseType, quantity: 1 }];
    });
    setIsCartOpen(true);
    showToast(language === 'am' ? 'ወደ ቅርጫት ተጨምሯል!' : 'Added to your collection cart!');
  };

  const removeFromCart = (artworkId: string) => {
    setCart(prev => prev.filter(item => item.artwork.id !== artworkId));
  };

  const updateCartQuantity = (artworkId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(artworkId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.artwork.id === artworkId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('artvista_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ORD-8921',
        date: 'October 18, 2026',
        items: [
          {
            artwork: initialArtworks[1],
            quantity: 1
          }
        ],
        subtotal: 680,
        shipping: 45,
        total: 725,
        status: 'In Transit',
        shippingAddress: 'Bole Atlas, House #402, Addis Ababa, Ethiopia',
        trackingNumber: 'ET-DHL-99281742',
        paymentMethod: 'Chapa / Telebirr Direct'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('artvista_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (paymentMethod: string, address: string): Order => {
    const subtotal = cart.reduce((sum, item) => sum + (item.artwork.price * item.quantity), 0);
    const hasPhysical = cart.some(item => item.artwork.type !== 'digital');
    const shipping = hasPhysical ? 45 : 0;
    const total = subtotal + shipping;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      subtotal,
      shipping,
      total,
      status: hasPhysical ? 'Processing' : 'Ready for Download',
      shippingAddress: address || currentUser.address || '',
      trackingNumber: hasPhysical ? `ART-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      paymentMethod
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Commissions
  const [commissions, setCommissions] = useState<CommissionRequest[]>(() => {
    const saved = localStorage.getItem('artvista_commissions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'comm-1',
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        artistId: 'artist-biniam',
        artistName: 'Biniam Tesfaye',
        title: 'Bespoke Coffee Ceremony in Natural Ochre',
        artworkType: 'Large Oil Painting on Linen',
        budgetRange: '$1,500 - $2,500',
        dimensions: '150 × 120 cm',
        description: 'Large centerpiece canvas for our contemporary residential living space with high ceilings. Desiring warm earth ochres, deep indigo accents, and dramatic morning window light.',
        deadline: 'December 15, 2026',
        status: 'In Progress',
        createdAt: 'October 15, 2026'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('artvista_commissions', JSON.stringify(commissions));
  }, [commissions]);

  const addCommissionRequest = (reqData: Omit<CommissionRequest, 'id' | 'createdAt' | 'status' | 'userId' | 'userName' | 'userEmail'>) => {
    const newReq: CommissionRequest = {
      ...reqData,
      id: `comm-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      status: 'Pending Review',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    setCommissions(prev => [newReq, ...prev]);

    // Also auto-create a message thread if artist was specified
    if (reqData.artistId) {
      sendMessage(
        reqData.artistId,
        `New Commission Request: "${reqData.title}" (${reqData.artworkType}, ${reqData.budgetRange}). Concept: ${reqData.description}`
      );
    }

    showToast(t.commissions.successMsg);
  };

  // Messages
  const [activeChatRecipientId, setActiveChatRecipientId] = useState<string>('artist-biniam');
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('artvista_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 'm-1',
        senderId: 'artist-biniam',
        senderName: 'Biniam Tesfaye',
        recipientId: currentUser.id,
        content: 'Greetings! Welcome to BiniT ArtVista Gallery. If you have any inquiries regarding canvas framing, international museum crating, or custom sizes, I am delighted to assist.',
        timestamp: 'Yesterday at 3:45 PM',
        read: true
      },
      {
        id: 'm-2',
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: 'artist-biniam',
        content: 'Thank you Biniam. I admired "The Ancestral Roast: Buna Ceremony". Could you let me know if it comes with the carved gold leaf frame shown?',
        timestamp: 'Yesterday at 4:10 PM',
        read: true
      },
      {
        id: 'm-3',
        senderId: 'artist-biniam',
        senderName: 'Biniam Tesfaye',
        recipientId: currentUser.id,
        content: 'Yes indeed! It comes with the hand-carved heritage gilded museum frame, fitted with archival UV-protective conservation glass and a signed Certificate of Authenticity.',
        timestamp: 'Yesterday at 4:30 PM',
        read: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('artvista_messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (recipientId: string, content: string, attachmentUrl?: string) => {
    if (!content.trim() && !attachmentUrl) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId,
      content: content.trim(),
      timestamp: 'Just now',
      read: true,
      attachmentUrl
    };

    setMessages(prev => [...prev, newMsg]);

    // Simulated quick artist reply for realistic interactive feel
    setTimeout(() => {
      const recipientArtist = artists.find(a => a.id === recipientId);
      const replyName = recipientArtist ? recipientArtist.name : 'Gallery Curator';
      const autoReply: Message = {
        id: `msg-reply-${Date.now()}`,
        senderId: recipientId,
        senderName: replyName,
        recipientId: currentUser.id,
        content: language === 'am' 
          ? `መልዕክትዎ ደርሶኛል! ጥያቄዎን በደስታ እመልሳለሁ። አሁን በስቱዲዮ ውስጥ ስለሆንኩ ዝርዝሩን በጥቂት ደቂቃዎች ውስጥ እልክልዎታለሁ።`
          : `Thank you for your message! I have received your inquiry and will review the details. Delighted to collaborate with you.`,
        timestamp: 'Just now',
        read: false
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1200);
  };

  // Modals & search
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3500);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activePage,
        setActivePage,
        selectedArtistId,
        setSelectedArtistId,
        selectedArtwork,
        setSelectedArtwork,
        artworks,
        addArtwork,
        deleteArtwork,
        toggleSaveArtwork,
        savedArtworkIds,
        videos,
        addVideoPost,
        updateVideoPost,
        deleteVideoPost,
        toggleLikeVideo,
        addVideoComment,
        artists,
        currentUser,
        setCurrentUser,
        updateUserProfile,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        orders,
        placeOrder,
        commissions,
        addCommissionRequest,
        messages,
        activeChatRecipientId,
        setActiveChatRecipientId,
        sendMessage,
        searchQuery,
        setSearchQuery,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
