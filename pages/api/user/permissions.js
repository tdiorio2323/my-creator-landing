import { prisma } from '../../../lib/prisma'
import { getSessionUserId } from '../../../lib/supertokens'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const userId = await getSessionUserId(req)
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { action, creatorId, contentId } = req.body

    if (action === 'checkCreatorAccess') {
      const creator = await prisma.creator.findFirst({
        where: {
          id: creatorId,
          userId: userId
        },
        select: { id: true }
      })

      return res.status(200).json({ hasAccess: !!creator })
    }

    if (action === 'checkContentAccess') {
      const content = await prisma.content.findFirst({
        where: {
          id: contentId,
          creator: {
            userId: userId
          }
        },
        select: { id: true }
      })

      return res.status(200).json({ hasAccess: !!content })
    }

    if (action === 'checkSubscriptionStatus') {
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

      if (!subscription || subscription.status !== 'ACTIVE') {
        return res.status(200).json({ subscription: null })
      }

      const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
      const now = new Date()
      const isActive = currentPeriodEnd > now

      return res.status(200).json({
        subscription: {
          ...subscription,
          isActive,
          daysRemaining: Math.ceil((currentPeriodEnd - now) / (1000 * 60 * 60 * 24))
        }
      })
    }

    return res.status(400).json({ error: 'Invalid action' })

  } catch (error) {
    console.error('Error checking permissions:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}