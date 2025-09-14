import { prisma } from '../../../lib/prisma'
import { getSessionUserId } from '../../../lib/supertokens'
import { canAccessContent, trackContentView } from '../../../lib/access'

export default async function handler(req, res) {
  const { contentId } = req.query

  if (req.method === 'GET') {
    return handleGetContent(req, res, contentId)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

async function handleGetContent(req, res, contentId) {
  try {
    const userId = await getSessionUserId(req)

    // Get content details
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        creator: {
          include: {
            user: {
              select: {
                fullName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    })

    if (!content) {
      return res.status(404).json({ error: 'Content not found' })
    }

    // Check access permissions
    const hasAccess = await canAccessContent(userId, contentId)

    if (!hasAccess) {
      // Return limited content info for unauthenticated/unauthorized users
      return res.status(200).json({
        id: content.id,
        title: content.title,
        description: content.description,
        thumbnailUrl: content.thumbnailUrl,
        creator: {
          displayName: content.creator.displayName,
          avatarUrl: content.creator.user?.avatarUrl
        },
        requiredTier: content.requiredTier,
        isFree: content.isFree,
        hasAccess: false,
        accessRequired: content.isFree ? 'free' : content.requiredTier.toLowerCase()
      })
    }

    // Track the view if user has access
    if (userId) {
      await trackContentView(userId, contentId)
    }

    // Return full content for authorized users
    return res.status(200).json({
      id: content.id,
      title: content.title,
      description: content.description,
      contentType: content.contentType,
      mediaUrl: content.mediaUrl,
      thumbnailUrl: content.thumbnailUrl,
      duration: content.duration,
      viewCount: content.viewCount,
      likeCount: content.likeCount,
      commentCount: content.commentCount,
      creator: {
        id: content.creator.id,
        displayName: content.creator.displayName,
        avatarUrl: content.creator.user?.avatarUrl,
        isVerified: content.creator.isVerified
      },
      publishedAt: content.publishedAt,
      hasAccess: true,
      requiredTier: content.requiredTier,
      isFree: content.isFree
    })

  } catch (error) {
    console.error('Error fetching content:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}