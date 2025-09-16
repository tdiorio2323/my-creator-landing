import { prisma } from '../../../lib/prisma'
import { createSupabaseServerClient } from '../../../lib/supabase'
import { storageHelpers } from '../../../lib/storage'
import { STORAGE_CONFIG } from '../../../lib/config'
import formidable from 'formidable'
import { promises as fs } from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  try {
    // Get user from Supabase auth
    const supabase = createSupabaseServerClient({ req, res })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Find user in database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { creator: true }
    })

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (req.method === 'GET') {
      // Get creator profile
      if (!dbUser.creator) {
        return res.status(404).json({ error: 'Creator profile not found' })
      }

      return res.status(200).json({
        creator: {
          id: dbUser.creator.id,
          displayName: dbUser.creator.displayName,
          description: dbUser.creator.description,
          category: dbUser.creator.category,
          bannerUrl: dbUser.creator.bannerUrl,
          isVerified: dbUser.creator.isVerified,
          subscriberCount: dbUser.creator.subscriberCount,
          totalEarnings: dbUser.creator.totalEarnings
        },
        user: {
          id: dbUser.id,
          email: dbUser.email,
          fullName: dbUser.fullName,
          avatarUrl: dbUser.avatarUrl,
          bio: dbUser.bio,
          location: dbUser.location,
          website: dbUser.website
        }
      })
    }

    if (req.method === 'PUT') {
      // Update creator profile
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024, // 10MB for profile images
        keepExtensions: true,
      })

      const [fields, files] = await form.parse(req)

      // Extract fields
      const displayName = Array.isArray(fields.displayName) ? fields.displayName[0] : fields.displayName
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category
      const bio = Array.isArray(fields.bio) ? fields.bio[0] : fields.bio
      const location = Array.isArray(fields.location) ? fields.location[0] : fields.location
      const website = Array.isArray(fields.website) ? fields.website[0] : fields.website

      let avatarUrl = dbUser.avatarUrl
      let bannerUrl = dbUser.creator?.bannerUrl

      // Handle avatar upload
      if (files.avatar) {
        const avatarFile = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar
        const avatarData = await fs.readFile(avatarFile.filepath)
        const avatarName = `avatar_${Date.now()}.${avatarFile.originalFilename?.split('.').pop() || 'jpg'}`

        const avatarPath = `${dbUser.id}/${avatarName}`
        const avatarUpload = await storageHelpers.uploadFile(
          STORAGE_CONFIG.BUCKETS.AVATARS,
          avatarPath,
          avatarData,
          { upsert: true }
        )

        if (!avatarUpload.error) {
          avatarUrl = storageHelpers.getPublicUrl(STORAGE_CONFIG.BUCKETS.AVATARS, avatarPath)
        }

        // Clean up temp file
        try {
          await fs.unlink(avatarFile.filepath)
        } catch (cleanupError) {
          console.warn('Failed to cleanup avatar temp file:', cleanupError)
        }
      }

      // Handle banner upload
      if (files.banner) {
        const bannerFile = Array.isArray(files.banner) ? files.banner[0] : files.banner
        const bannerData = await fs.readFile(bannerFile.filepath)
        const bannerName = `banner_${Date.now()}.${bannerFile.originalFilename?.split('.').pop() || 'jpg'}`

        const bannerPath = `${dbUser.id}/${bannerName}`
        const bannerUpload = await storageHelpers.uploadFile(
          STORAGE_CONFIG.BUCKETS.AVATARS, // Using avatars bucket for now
          bannerPath,
          bannerData,
          { upsert: true }
        )

        if (!bannerUpload.error) {
          bannerUrl = storageHelpers.getPublicUrl(STORAGE_CONFIG.BUCKETS.AVATARS, bannerPath)
        }

        // Clean up temp file
        try {
          await fs.unlink(bannerFile.filepath)
        } catch (cleanupError) {
          console.warn('Failed to cleanup banner temp file:', cleanupError)
        }
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          fullName: displayName || dbUser.fullName,
          avatarUrl,
          bio,
          location,
          website
        }
      })

      // Create or update creator profile
      let creator
      if (dbUser.creator) {
        creator = await prisma.creator.update({
          where: { id: dbUser.creator.id },
          data: {
            displayName: displayName || dbUser.creator.displayName,
            description,
            category,
            bannerUrl
          }
        })
      } else {
        creator = await prisma.creator.create({
          data: {
            userId: dbUser.id,
            displayName: displayName || updatedUser.fullName || 'Creator',
            description: description || 'Welcome to my creator page!',
            category: category || 'General',
            bannerUrl
          }
        })
      }

      return res.status(200).json({
        success: true,
        creator: {
          id: creator.id,
          displayName: creator.displayName,
          description: creator.description,
          category: creator.category,
          bannerUrl: creator.bannerUrl,
          isVerified: creator.isVerified,
          subscriberCount: creator.subscriberCount,
          totalEarnings: creator.totalEarnings
        },
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          avatarUrl: updatedUser.avatarUrl,
          bio: updatedUser.bio,
          location: updatedUser.location,
          website: updatedUser.website
        }
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (error) {
    console.error('Creator profile error:', error)
    return res.status(500).json({
      error: 'Failed to manage creator profile',
      details: error.message
    })
  }
}