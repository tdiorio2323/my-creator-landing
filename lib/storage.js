import { uploadFile, getSignedUrl, deleteFile } from './minio'
import { prisma } from './prisma'

/**
 * Content management functions for MinIO storage
 */

export const STORAGE_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],
  SIGNED_URL_EXPIRY: 3600 // 1 hour
}

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

// Upload file to MinIO storage
export async function uploadContentFile(file, key) {
  try {
    validateFile(file)

    const result = await uploadFile(file, key)
    return {
      success: true,
      url: result.Location,
      key: result.Key
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
export async function getContentUrl(key, expiresIn = STORAGE_CONFIG.SIGNED_URL_EXPIRY) {
  try {
    const signedUrl = getSignedUrl(key, expiresIn)
    return {
      success: true,
      url: signedUrl
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
export async function deleteContentFile(key) {
  try {
    await deleteFile(key)
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

    const { success, url } = await getContentUrl(content.mediaUrl)
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

  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size: ${STORAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`)
  }

  if (!STORAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${STORAGE_CONFIG.ALLOWED_TYPES.join(', ')}`)
  }

  return true
}

// Helper function for tier hierarchy
function getTierHierarchy(tierType) {
  const hierarchy = {
    'VIP': ['BASIC', 'PREMIUM', 'VIP'],
    'PREMIUM': ['BASIC', 'PREMIUM'],
    'BASIC': ['BASIC']
  }

  return hierarchy[tierType] || ['BASIC']
}