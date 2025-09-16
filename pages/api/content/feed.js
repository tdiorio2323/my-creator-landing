import { prisma } from '../../../lib/prisma'
import { createSupabaseServerClient } from '../../../lib/supabase'
import { storageHelpers } from '../../../lib/storage'
import { STORAGE_CONFIG } from '../../../lib/config'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { creatorId, page = 1, limit = 10, tier = 'all' } = req.query

    // Get user from Supabase auth (optional for feed)
    const supabase = createSupabaseServerClient({ req, res })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    let currentUserSubscription = null
    let dbUser = null
    if (user && !authError) {
      // Find user's subscription status
      dbUser = await prisma.user.findUnique({
        where: { email: user.email }
      })

      if (dbUser && creatorId) {
        currentUserSubscription = await prisma.subscription.findUnique({
          where: {
            subscriberId_creatorId: {
              subscriberId: dbUser.id,
              creatorId: creatorId
            }
          },
          include: { tier: true }
        })
      }
    }

    const skip = (page - 1) * limit

    // Build query filters
    const where = {
      publishedAt: { not: null }, // Only published content
      ...(creatorId && { creatorId }),
      ...(category && {
        creator: {
          category: category
        }
      })
    }

    // If user is authenticated, prioritize content from their subscriptions
    let priorityCreatorIds = []
    if (userId) {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          subscriberId: userId,
          status: 'ACTIVE'
        },
        select: { creatorId: true }
      })
      priorityCreatorIds = subscriptions.map(sub => sub.creatorId)
    }

    // Get content with creator info
    const content = await prisma.content.findMany({
      where,
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
      },
      orderBy: [
        // Prioritize content from subscribed creators
        ...(priorityCreatorIds.length > 0 ? [{
          creatorId: { in: priorityCreatorIds }
        }] : []),
        { publishedAt: 'desc' }
      ],
      skip,
      take: parseInt(limit)
    })

    // Process each content item to check access and filter data
    const processedContent = await Promise.all(
      content.map(async (item) => {
        const hasAccess = await canAccessContent(userId, item.id)

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          contentType: item.contentType,
          thumbnailUrl: item.thumbnailUrl,
          duration: item.duration,
          viewCount: item.viewCount,
          likeCount: item.likeCount,
          commentCount: item.commentCount,
          creator: {
            id: item.creator.id,
            displayName: item.creator.displayName,
            avatarUrl: item.creator.user?.avatarUrl,
            isVerified: item.creator.isVerified,
            category: item.creator.category
          },
          publishedAt: item.publishedAt,
          requiredTier: item.requiredTier,
          isFree: item.isFree,
          hasAccess,
          // Only include media URL if user has access
          mediaUrl: hasAccess ? item.mediaUrl : null,
          // Indicate what's needed for access
          accessRequired: item.isFree
            ? 'free'
            : hasAccess
              ? 'granted'
              : item.requiredTier.toLowerCase()
        }
      })
    )

    // Get total count for pagination
    const totalCount = await prisma.content.count({ where })

    return res.status(200).json({
      content: processedContent,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        hasNext: skip + content.length < totalCount,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching content feed:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}