import { prisma } from '../../../lib/prisma'
import { createSupabaseServerClient } from '../../../lib/supabase'
import { storageHelpers, validateFile } from '../../../lib/storage'
import { APP_CONFIG, STORAGE_CONFIG } from '../../../lib/config'
import formidable from 'formidable'
import { promises as fs } from 'fs'

// Disable default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get user from Supabase auth
    const supabase = createSupabaseServerClient({ req, res })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { creator: true }
    })

    if (!dbUser || !dbUser.creator) {
      return res.status(403).json({ error: 'Creator profile required' })
    }

    // Parse multipart form data
    const form = formidable({
      maxFileSize: APP_CONFIG.MAX_FILE_SIZE,
      keepExtensions: true,
    })

    const [fields, files] = await form.parse(req)

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description
    const contentType = Array.isArray(fields.contentType) ? fields.contentType[0] : fields.contentType
    const requiredTier = Array.isArray(fields.requiredTier) ? fields.requiredTier[0] : fields.requiredTier
    const isFree = Array.isArray(fields.isFree) ? fields.isFree[0] === 'true' : fields.isFree === 'true'
    const price = Array.isArray(fields.price) ? parseFloat(fields.price[0]) : parseFloat(fields.price)

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    let mediaUrl = null
    let thumbnailUrl = null
    let finalContentType = 'TEXT'
    let duration = null

    // Handle file uploads
    if (files.media) {
      const mediaFile = Array.isArray(files.media) ? files.media[0] : files.media

      // Determine content type based on file
      if (mediaFile.mimetype?.startsWith('video/')) {
        finalContentType = 'VIDEO'
        duration = 0 // Placeholder - would use video analysis service
      } else if (mediaFile.mimetype?.startsWith('image/')) {
        finalContentType = 'PHOTO'
      }

      // Validate file
      try {
        validateFile(mediaFile)
      } catch (e) {
        return res.status(400).json({ error: e.message || 'Invalid file' })
      }

      // Read file data
      const fileData = await fs.readFile(mediaFile.filepath)
      const fileName = mediaFile.originalFilename || `content_${Date.now()}`

      // Upload to Supabase Storage
      const filePath = storageHelpers.generateFilePath(dbUser.id, 'content', fileName)
      const uploadResult = await storageHelpers.uploadFile(
        STORAGE_CONFIG.BUCKETS.CREATOR_CONTENT,
        filePath,
        fileData
      )

      if (uploadResult.error) {
        throw new Error(`Upload failed: ${uploadResult.error.message}`)
      }

      mediaUrl = filePath

      // Clean up temporary file
      try {
        await fs.unlink(mediaFile.filepath)
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file:', cleanupError)
      }
    }

    // Handle thumbnail upload
    if (files.thumbnail) {
      const thumbnailFile = Array.isArray(files.thumbnail) ? files.thumbnail[0] : files.thumbnail
      const thumbnailData = await fs.readFile(thumbnailFile.filepath)
      const thumbnailName = thumbnailFile.originalFilename || `thumb_${Date.now()}`

      const thumbPath = storageHelpers.generateFilePath(dbUser.id, 'thumbnails', thumbnailName)
      const thumbUpload = await storageHelpers.uploadFile(
        STORAGE_CONFIG.BUCKETS.CREATOR_THUMBS,
        thumbPath,
        thumbnailData
      )

      if (!thumbUpload.error) {
        thumbnailUrl = storageHelpers.getPublicUrl(STORAGE_CONFIG.BUCKETS.CREATOR_THUMBS, thumbPath)
      }

      // Clean up temp file
      try {
        await fs.unlink(thumbnailFile.filepath)
      } catch (cleanupError) {
        console.warn('Failed to cleanup thumbnail temp file:', cleanupError)
      }
    }

    // Create content in database
    const content = await prisma.content.create({
      data: {
        creatorId: dbUser.creator.id,
        title,
        description,
        contentType: finalContentType,
        mediaUrl,
        thumbnailUrl,
        duration,
        requiredTier: requiredTier || 'BASIC',
        isFree: isFree || false,
        price: !isFree && price ? price : null,
        publishedAt: new Date()
      }
    })

    return res.status(201).json({
      success: true,
      content: {
        id: content.id,
        title: content.title,
        description: content.description,
        contentType: content.contentType,
        thumbnailUrl: content.thumbnailUrl,
        requiredTier: content.requiredTier,
        isFree: content.isFree,
        price: content.price,
        publishedAt: content.publishedAt
      }
    })

  } catch (error) {
    console.error('Content upload error:', error)
    return res.status(500).json({
      error: 'Failed to upload content',
      details: error.message
    })
  }
}
