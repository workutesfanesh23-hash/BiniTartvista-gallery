export type Language = 'en' | 'am';
export type ActivePage =
  | 'home'
  | 'art-gallery'
  | 'photography'
  | 'video-posts'
  | 'digital-downloads'
  | 'commissions'
  | 'artist-profile'
  | 'profile'
  | 'messages'
  | 'contact-about';

export interface Artwork {
  id: string;
  title: string;
  titleAm?: string;
  descriptionAm?: string;
  artistName: string;
  artistId?: string;
  artistAvatar?: string;
  category: string;
  type: 'physical' | 'photography' | 'digital';
  medium?: string;
  price: number;
  currency?: string;
  imageUrl: string;
  dimensions?: string;
  year?: number;
  edition?: string;
  description?: string;
  availability?: string;
  isRecent?: boolean;
  isFeatured?: boolean;
  views?: number;
  likes?: number;
  badge?: string;
  sizeLabel?: string;
  primaryColor?: string;
  imageAlt?: string;
  artistNameAm?: string;
}

export interface Artist {
  id: string;
  name: string;
  nameAm?: string;
  specialty: string;
  bio: string;
  bioAm?: string;
  avatar: string;
  verified?: boolean;
  artworksCount?: number;
  location?: string;
  coverImage?: string;
  salesCount?: number;
  socialLinks?: Record<string, string>;
}

export interface VideoPost {
  id: string;
  title: string;
  titleAm?: string;
  descriptionAm?: string;
  artistName: string;
  artistId?: string;
  artistAvatar?: string;
  category: string;
  tags?: string[];
  thumbnailUrl: string;
  videoUrl?: string;
  description?: string;
  duration?: string;
  likesCount: number;
  commentsCount: number;
  comments?: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: string;
  }>;
  uploadDate?: string;
  hasLiked?: boolean;
}

export interface User {
  id: string;
  name: string;
  nameAm?: string;
  email: string;
  avatar: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  billingAddress?: string;
  isArtist?: boolean;
  artistBio?: string;
  socialLinks?: Record<string, string>;
}

export interface CartItem {
  artwork: Artwork;
  licenseType?: 'personal' | 'commercial';
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  shippingAddress: string;
  trackingNumber?: string;
  paymentMethod: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachmentUrl?: string;
}

export interface CommissionRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  artistId?: string;
  artistName?: string;
  title: string;
  artworkType: string;
  budgetRange: string;
  dimensions: string;
  description: string;
  deadline: string;
  status: string;
  createdAt: string;
  referenceImageUrl?: string;
}
