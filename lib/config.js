// Environment validation
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXTAUTH_SECRET'
]

// Validate required environment variables
export function validateEnv() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
  }
}

// Stripe configuration
export const STRIPE_CONFIG = {
  // Map subscription tiers to Stripe Price IDs
  PRICE_IDS: {
    basic: process.env.STRIPE_PRICE_BASIC || 'price_basic_monthly',
    premium: process.env.STRIPE_PRICE_PREMIUM || 'price_premium_monthly', 
    vip: process.env.STRIPE_PRICE_VIP || 'price_vip_monthly'
  },
  
  // Tier metadata
  TIERS: {
    basic: {
      name: 'Basic',
      price: 9.99,
      level: 1,
      features: [
        'Access to all posts',
        'Photo galleries',
        'Community chat',
        'Monthly live Q&A'
      ]
    },
    premium: {
      name: 'Premium', 
      price: 19.99,
      level: 2,
      features: [
        'Everything in Basic',
        'HD video content',
        'Live stream access',
        'Direct messaging',
        'Weekly exclusive posts'
      ]
    },
    vip: {
      name: 'VIP',
      price: 49.99,
      level: 3,
      features: [
        'Everything in Premium',
        '1-on-1 video calls',
        'Custom content requests',
        'Behind-the-scenes access',
        'Personal shoutouts',
        'Priority support'
      ]
    }
  }
}

// Application configuration
export const APP_CONFIG = {
  APP_NAME: 'CreatorHub',
  APP_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    videos: ['video/mp4', 'video/webm', 'video/mov']
  },
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
}

// Supabase Storage configuration
export const STORAGE_CONFIG = {
  BUCKETS: {
    CREATOR_CONTENT: 'creator-content', // private bucket for original content
    CREATOR_THUMBS: 'creator-thumbs',   // public bucket for thumbnails
    MESSAGE_MEDIA: 'message-media',     // private bucket for message attachments
    AVATARS: 'avatars'                  // public bucket for profile images
  }
}