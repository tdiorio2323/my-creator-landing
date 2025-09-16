import { prisma } from '../../../../lib/prisma'
import { createSupabaseServerClient } from '../../../../lib/supabase'
import { canAccessContent, trackContentView } from '../../../../lib/access'
import { storageHelpers } from '../../../../lib/storage'
import { STORAGE_CONFIG } from '../../../../lib/config'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { contentId } = req.query

  if (!contentId) {
    return res.status(400).json({ error: 'Content ID is required' })
  }

  try {
    // Get user from Supabase auth
    const supabase = createSupabaseServerClient({ req, res })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    let userId = null
    if (user && !authError) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true }
      })
      userId = dbUser?.id
    }

    // Check if user can access this content
    const hasAccess = await canAccessContent(userId, contentId)

    if (!hasAccess) {
      // Get content info for error message
      const content = await prisma.content.findUnique({
        where: { id: contentId },
        select: {
          title: true,
          requiredTier: true,
          isFree: true,
          price: true,
          creator: {
            select: {
              displayName: true
            }
          }
        }
      })

      if (!content) {
        return res.status(404).json({ error: 'Content not found' })
      }

      return res.status(403).json({
        error: 'Access denied',
        reason: content.isFree ? 'UNKNOWN_ERROR' : 'SUBSCRIPTION_REQUIRED',
        content: {
          title: content.title,
          requiredTier: content.requiredTier,
          isFree: content.isFree,
          price: content.price,
          creator: content.creator.displayName
        }
      })
    }

    // Get full content with creator info
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            isVerified: true,
            user: {
              select: {
                avatarUrl: true
              }
            }
          }
        },
        interactions: {
          where: userId ? { userId } : undefined,
          select: {
            interactionType: true
          }
        }
      }
    })

    if (!content) {
      return res.status(404).json({ error: 'Content not found' })
    }

    // Generate signed URL for private content
    let mediaUrl = null
    if (content.mediaUrl) {
      if (content.isFree && content.thumbnailUrl) {
        // For free content, use thumbnail if available
        mediaUrl = content.thumbnailUrl
      } else {
        // Generate signed URL for private content
        const { url, error } = await storageHelpers.getSignedUrl(
          STORAGE_CONFIG.BUCKETS.CREATOR_CONTENT,
          content.mediaUrl,
          3600 // 1 hour
        )
        if (!error) {
          mediaUrl = url
        }
      }
    }

    // Track the view
    await trackContentView(userId, contentId)

    // Get interaction stats
    const interactions = await prisma.contentInteraction.groupBy({
      by: ['interactionType'],
      where: { contentId },
      _count: {
        interactionType: true
      }
    })

    const stats = {
      views: content.viewCount + 1, // Include the current view
      likes: interactions.find(i => i.interactionType === 'like')?._count?.interactionType || 0,
      comments: interactions.find(i => i.interactionType === 'comment')?._count?.interactionType || 0,
      userLiked: content.interactions.some(i => i.interactionType === 'like'),
      userCommented: content.interactions.some(i => i.interactionType === 'comment')
    }

    return res.status(200).json({
      content: {
        id: content.id,
        title: content.title,
        description: content.description,
        contentType: content.contentType,
        mediaUrl,
        thumbnailUrl: content.thumbnailUrl,
        duration: content.duration,
        requiredTier: content.requiredTier,
        isFree: content.isFree,
        price: content.price,
        publishedAt: content.publishedAt,
        creator: {
          id: content.creator.id,
          displayName: content.creator.displayName,
          isVerified: content.creator.isVerified,
          avatarUrl: content.creator.user?.avatarUrl
        }
      },
      stats,
      access: {
        granted: true,
        userId: userId || null
      }
    })

  } catch (error) {
    console.error('Content view error:', error)
    return res.status(500).json({
      error: 'Failed to load content',
      details: error.message
    })
  }
}