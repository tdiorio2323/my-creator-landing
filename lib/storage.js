import { supabase } from './supabase'
import { prisma } from './prisma'
import { STORAGE_CONFIG, APP_CONFIG } from './config'

/**
 * Content management functions for Supabase storage
 */

// Get user's accessible content based on subscription
export async function getUserAccessibleContent(userId, creatorId) {
  try {
    // Get user's subscription status with the creator
    const subscription = await prisma.subscription.findUnique({
      where: {
        subscriberId_creatorId: {
          subscriberId: userId,
          creatorId: creatorId
        }
      },
      include: {
        tier: true
      }
    })

    // Get free content
    const freeContent = await prisma.content.findMany({
      where: {
        creatorId: creatorId,
        isFree: true,
        publishedAt: { not: null }
      },
      orderBy: { publishedAt: 'desc' }
    })

    let paidContent = []

    // Get paid content if user has active subscription
    if (subscription && subscription.status === 'ACTIVE') {
      const tierType = subscription.tier?.tierType || 'BASIC'

      paidContent = await prisma.content.findMany({
        where: {
          creatorId: creatorId,
          isFree: false,
          requiredTier: {
            in: getTierHierarchy(tierType)
          },
          publishedAt: { not: null }
        },
        orderBy: { publishedAt: 'desc' }
      })
    }

    return [...freeContent, ...paidContent]
  } catch (error) {
    console.error('Error getting accessible content:', error)
    return []
  }
}

// Storage bucket management
export const storageHelpers = {
  // Create all required storage buckets
  async createBuckets() {
    const buckets = Object.values(STORAGE_CONFIG.BUCKETS)
    const results = []

    for (const bucketName of buckets) {
      try {
        const { data, error } = await supabase.storage.createBucket(bucketName, {
          public: bucketName === STORAGE_CONFIG.BUCKETS.CREATOR_THUMBS ||
                 bucketName === STORAGE_CONFIG.BUCKETS.AVATARS,
          allowedMimeTypes: this.getAllowedMimeTypes(bucketName),
          fileSizeLimit: this.getFileSizeLimit(bucketName)
        })

        if (error && !error.message.includes('already exists')) {
          console.error(`Error creating bucket ${bucketName}:`, error)
          results.push({ bucket: bucketName, success: false, error })
        } else {
          console.log(`Bucket ${bucketName} ready`)
          results.push({ bucket: bucketName, success: true })
        }
      } catch (error) {
        console.error(`Failed to create bucket ${bucketName}:`, error)
        results.push({ bucket: bucketName, success: false, error })
      }
    }

    return results
  },

  // Get allowed MIME types for each bucket
  getAllowedMimeTypes(bucketName) {
    switch (bucketName) {
      case STORAGE_CONFIG.BUCKETS.CREATOR_CONTENT:
        return ['image/*', 'video/*', 'audio/*']
      case STORAGE_CONFIG.BUCKETS.CREATOR_THUMBS:
        return ['image/jpeg', 'image/png', 'image/webp']
      case STORAGE_CONFIG.BUCKETS.MESSAGE_MEDIA:
        return ['image/*', 'video/*', 'audio/*', 'application/pdf']
      case STORAGE_CONFIG.BUCKETS.AVATARS:
        return ['image/jpeg', 'image/png', 'image/webp']
      default:
        return ['*']
    }
  },

  // Get file size limits for each bucket
  getFileSizeLimit(bucketName) {
    switch (bucketName) {
      case STORAGE_CONFIG.BUCKETS.CREATOR_CONTENT:
        return 500 * 1024 * 1024 // 500MB for main content
      case STORAGE_CONFIG.BUCKETS.CREATOR_THUMBS:
        return 5 * 1024 * 1024 // 5MB for thumbnails
      case STORAGE_CONFIG.BUCKETS.MESSAGE_MEDIA:
        return 100 * 1024 * 1024 // 100MB for messages
      case STORAGE_CONFIG.BUCKETS.AVATARS:
        return 10 * 1024 * 1024 // 10MB for avatars
      default:
        return 50 * 1024 * 1024 // 50MB default
    }
  },

  // Upload file to specific bucket
  async uploadFile(bucketName, filePath, file, options = {}) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: options.upsert || false,
          ...options
        })

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      console.error(`Upload failed for ${bucketName}/${filePath}:`, error)
      return { data: null, error }
    }
  },

  // Get public URL for file
  getPublicUrl(bucketName, filePath) {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  // Get signed URL for private content
  async getSignedUrl(bucketName, filePath, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, expiresIn)

      if (error) {
        throw error
      }

      return { url: data.signedUrl, error: null }
    } catch (error) {
      console.error(`Failed to get signed URL for ${bucketName}/${filePath}:`, error)
      return { url: null, error }
    }
  },

  // Generate unique file path
  generateFilePath(userId, contentType, originalFileName) {
    const timestamp = Date.now()
    const extension = originalFileName.split('.').pop()
    const sanitizedName = originalFileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50)

    return `${userId}/${contentType}/${timestamp}_${sanitizedName}`
  }
}

// Upload file to Supabase storage
export async function uploadContentFile(file, userId, contentType = 'content') {
  try {
    validateFile(file)

    const filePath = storageHelpers.generateFilePath(userId, contentType, file.name)
    const bucketName = contentType === 'thumbnail'
      ? STORAGE_CONFIG.BUCKETS.CREATOR_THUMBS
      : STORAGE_CONFIG.BUCKETS.CREATOR_CONTENT

    const result = await storageHelpers.uploadFile(bucketName, filePath, file)

    if (result.error) {
      throw result.error
    }

    const url = storageHelpers.getPublicUrl(bucketName, filePath)

    return {
      success: true,
      url: url,
      path: filePath,
      bucket: bucketName
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get signed URL for content access
export async function getContentUrl(bucketName, filePath, expiresIn = 3600) {
  try {
    const result = await storageHelpers.getSignedUrl(bucketName, filePath, expiresIn)
    return {
      success: !result.error,
      url: result.url,
      error: result.error
    }
  } catch (error) {
    console.error('Signed URL error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Delete content file
export async function deleteContentFile(bucketName, filePath) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Create signed URLs for multiple content items
export async function generateContentUrls(contentItems) {
  const urlPromises = contentItems.map(async (content) => {
    if (!content.mediaUrl) return content

    // Extract bucket and path from mediaUrl
    const [bucketName, ...pathParts] = content.mediaUrl.split('/')
    const filePath = pathParts.join('/')

    const { success, url } = await getContentUrl(bucketName, filePath)
    return {
      ...content,
      signedUrl: success ? url : null
    }
  })

  return Promise.all(urlPromises)
}

// File validation
export function validateFile(file) {
  if (!file) {
    throw new Error('No file provided')
  }

  const size = file.size || file.fileSize || 0
  if (size > APP_CONFIG.MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size: ${APP_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`)
  }

  const mime = file.type || file.mimetype || ''
  const allowedTypes = [...APP_CONFIG.ALLOWED_FILE_TYPES.images, ...APP_CONFIG.ALLOWED_FILE_TYPES.videos]
  if (!allowedTypes.includes(mime)) {
    throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`)
  }

  return true
}

// Helper function for tier hierarchy
function getTierHierarchy(tierType) {
  const hierarchy = {
    'ULTRA': ['BASIC', 'PREMIUM', 'VIP', 'ULTRA'],
    'VIP': ['BASIC', 'PREMIUM', 'VIP'],
    'PREMIUM': ['BASIC', 'PREMIUM'],
    'BASIC': ['BASIC']
  }

  return hierarchy[tierType] || ['BASIC']
}
