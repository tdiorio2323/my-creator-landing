import { prisma } from '../../../lib/prisma'
import { getSessionUserId } from '../../../lib/supertokens'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const userId = await getSessionUserId(req)
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Get user's active subscriptions with creator details
    const subscriptions = await prisma.subscription.findMany({
      where: {
        subscriberId: userId,
        status: 'ACTIVE'
      },
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
        },
        tier: {
          select: {
            name: true,
            price: true
          }
        }
      }
    })

    // Get content interaction count (views)
    const contentViewCount = await prisma.contentInteraction.count({
      where: {
        userId: userId,
        interactionType: 'view'
      }
    })

    // Calculate stats
    const totalSpent = subscriptions.reduce((sum, sub) => sum + (sub.tier?.price || 0), 0)

    return res.status(200).json({
      subscriptions,
      stats: {
        activeSubscriptions: subscriptions.length,
        totalSpent,
        favoriteCreators: subscriptions.length,
        contentViewed: contentViewCount
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}