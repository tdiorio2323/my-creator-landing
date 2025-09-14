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

    const { creatorId } = req.query

    // Build where clause based on whether creatorId is provided
    const whereClause = creatorId
      ? {
          subscriberId: userId,
          creatorId: creatorId,
          status: 'ACTIVE'
        }
      : {
          subscriberId: userId,
          status: 'ACTIVE'
        }

    // Get user's active subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: whereClause,
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
            id: true,
            name: true,
            price: true,
            tierType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format subscriptions data
    const formattedSubscriptions = subscriptions.map(sub => ({
      id: sub.id,
      tierId: sub.tierId,
      creatorId: sub.creatorId,
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd,
      creator: {
        id: sub.creator.id,
        displayName: sub.creator.displayName,
        user: sub.creator.user
      },
      tier: sub.tier
    }))

    return res.status(200).json({
      subscriptions: formattedSubscriptions,
      count: formattedSubscriptions.length
    })

  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}