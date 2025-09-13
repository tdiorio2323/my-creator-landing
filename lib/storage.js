import { supabase } from './supabase'
import { canAccessContent } from './access'
import { STORAGE_CONFIG } from './config'

/**
 * Get signed URL for content if user is authorized
 * @param {string} userId - User ID requesting access
 * @param {string} contentId - Content ID being requested
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise<{url: string | null, error: string | null}>}
 */
export async function getSignedUrlIfAuthorized(userId, contentId, expiresIn = 3600) {
  try {
    // Check if user can access this content
    const hasAccess = await canAccessContent(userId, contentId)
    
    if (!hasAccess) {
      return { url: null, error: 'Access denied' }
    }

    // Get content details
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('media_url, content_type')
      .eq('id', contentId)
      .single()

    if (contentError || !content || !content.media_url) {
      return { url: null, error: 'Content not found' }
    }

    // For free content, return the URL directly
    const { data: freeContent } = await supabase
      .from('content')
      .select('is_free')
      .eq('id', contentId)
      .single()

    if (freeContent?.is_free) {
      return { url: content.media_url, error: null }
    }

    // Generate signed URL for private content
    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKETS.CREATOR_CONTENT)
      .createSignedUrl(content.media_url, expiresIn)

    if (error) {
      console.error('Error creating signed URL:', error)
      return { url: null, error: 'Failed to generate access URL' }
    }

    return { url: data.signedUrl, error: null }
  } catch (error) {
    console.error('Error in getSignedUrlIfAuthorized:', error)
    return { url: null, error: 'Internal error' }
  }
}

/**
 * Get signed URL for thumbnail (public bucket)
 * @param {string} thumbnailPath - Path to thumbnail in storage
 * @param {number} expiresIn - URL expiration time in seconds
 * @returns {Promise<{url: string | null, error: string | null}>}
 */
export async function getThumbnailSignedUrl(thumbnailPath, expiresIn = 86400) {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKETS.CREATOR_THUMBS)
      .createSignedUrl(thumbnailPath, expiresIn)

    if (error) {
      console.error('Error creating thumbnail signed URL:', error)
      return { url: null, error: 'Failed to generate thumbnail URL' }
    }

    return { url: data.signedUrl, error: null }
  } catch (error) {
    console.error('Error in getThumbnailSignedUrl:', error)
    return { url: null, error: 'Internal error' }
  }
}

/**
 * Upload file to Supabase Storage
 * @param {File} file - File to upload
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path in bucket
 * @returns {Promise<{path: string | null, error: string | null}>}
 */
export async function uploadFile(file, bucket, path) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { path: null, error: error.message }
    }

    return { path: data.path, error: null }
  } catch (error) {
    console.error('Error in uploadFile:', error)
    return { path: null, error: 'Upload failed' }
  }
}

/**
 * Delete file from Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path in bucket
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export async function deleteFile(bucket, path) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error in deleteFile:', error)
    return { success: false, error: 'Delete failed' }
  }
}

/**
 * Get public URL for files in public buckets
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path in bucket
 * @returns {string | null}
 */
export function getPublicUrl(bucket, path) {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  } catch (error) {
    console.error('Error getting public URL:', error)
    return null
  }
}

/**
 * Validate file type and size
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {{valid: boolean, error: string | null}}
 */
export function validateFile(file, allowedTypes, maxSize) {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` }
  }

  return { valid: true, error: null }
}