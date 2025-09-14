import { uploadFile } from '../../../lib/minio'
import { prisma } from '../../../lib/prisma'
import { withRateLimit } from '../../../lib/rateLimit'
import { validateEnv, APP_CONFIG, STORAGE_CONFIG } from '../../../lib/config'
import { validateFile } from '../../../lib/storage'
import formidable from 'formidable'
import { promises as fs } from 'fs'

// Validate environment on module load
validateEnv()

// Disable default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
}

async function uploadHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse multipart form data
    const form = formidable({
      maxFileSize: APP_CONFIG.MAX_FILE_SIZE,
      keepExtensions: true,
    })

    const [fields, files] = await form.parse(req)

    const { userId, creatorId, title, description, contentType, requiredTier, isFree } = fields
    const file = files.file?.[0]

    // Validate required fields
    if (!userId?.[0] || !creatorId?.[0] || !title?.[0] || !file) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, creatorId, title, file' 
      })
    }

    // Validate user is the creator
    const creator = await prisma.creator.findFirst({
      where: {
        id: creatorId[0],
        userId: userId[0]
      },
      select: {
        id: true
      }
    })

    if (!creator) {
      return res.status(403).json({ error: 'Unauthorized: Not the creator' })
    }

    // Validate file type
    const isImage = contentType?.[0] === 'photo'
    const isVideo = contentType?.[0] === 'video'
    
    let allowedTypes = []
    if (isImage) {
      allowedTypes = APP_CONFIG.ALLOWED_FILE_TYPES.images
    } else if (isVideo) {
      allowedTypes = APP_CONFIG.ALLOWED_FILE_TYPES.videos
    } else {
      return res.status(400).json({ error: 'Invalid content type' })
    }

    const validation = validateFile(file, allowedTypes, APP_CONFIG.MAX_FILE_SIZE)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    // Generate unique file path
    const timestamp = Date.now()
    const extension = file.originalFilename?.split('.').pop() || 'bin'
    const filePath = `${creatorId[0]}/${timestamp}-${file.newFilename || 'content'}.${extension}`

    // Read file buffer
    const fileBuffer = await fs.readFile(file.filepath)
    const fileObj = new File([fileBuffer], file.originalFilename || 'content', { 
      type: file.mimetype 
    })

    // Upload to MinIO Storage
    const uploadResult = await uploadFile(fileObj, filePath)

    if (!uploadResult.success) {
      return res.status(500).json({ error: uploadResult.error })
    }

    // TODO: Generate thumbnail for videos/images
    // For now, use a placeholder or the same file path
    const thumbnailPath = uploadResult.key

    // Create content record in database
    const content = await prisma.content.create({
      data: {
        creatorId: creatorId[0],
        title: title[0],
        description: description?.[0] || null,
        contentType: contentType[0].toUpperCase(),
        mediaUrl: uploadResult.key,
        thumbnailUrl: thumbnailPath,
        requiredTier: requiredTier?.[0]?.toUpperCase() || 'BASIC',
        isFree: isFree?.[0] === 'true',
        publishedAt: new Date()
      },
      select: {
        id: true,
        title: true,
        contentType: true,
        createdAt: true
      }
    })

    // Clean up temporary file
    try {
      await fs.unlink(file.filepath)
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError)
    }

    return res.status(201).json({
      success: true,
      content: {
        id: content.id,
        title: content.title,
        contentType: content.contentType,
        createdAt: content.createdAt
      }
    })

  } catch (error) {
    console.error('Upload handler error:', error)
    
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Upload failed'
      
    return res.status(500).json({ error: message })
  }
}

export default withRateLimit(uploadHandler, { 
  max: 20, // 20 uploads per window
  windowMs: 60 * 60 * 1000 // 1 hour
})