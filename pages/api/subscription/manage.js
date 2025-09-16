import { prisma } from '../../../lib/prisma'
import { createSupabaseServerClient } from '../../../lib/supabase'
import { getTierHierarchy } from '../../../lib/access'

export default async function handler(req, res) {
  try {
    // Get user from Supabase auth
    const supabase = createSupabaseServerClient({ req, res })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (req.method === 'GET') {
      // Get user's subscriptions
      const { creatorId } = req.query

      let whereClause = {
        subscriberId: dbUser.id
      }

      if (creatorId) {
        whereClause.creatorId = creatorId
      }

      const subscriptions = await prisma.subscription.findMany({
        where: whereClause,
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
          tier: true
        },
        orderBy: { createdAt: 'desc' }
      })

      // Process subscriptions to include access info
      const processedSubscriptions = subscriptions.map(sub => ({
        id: sub.id,
        status: sub.status,
        createdAt: sub.createdAt,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        stripeSubscriptionId: sub.stripeSubscriptionId,
        creator: sub.creator,
        tier: {
          id: sub.tier?.id,
          name: sub.tier?.name,
          type: sub.tier?.tierType,
          price: sub.tier?.price,
          features: sub.tier?.features
        },
        access: {
          isActive: sub.status === 'ACTIVE',
          accessibleTiers: sub.tier?.tierType ? getTierHierarchy(sub.tier.tierType) : [],
          daysRemaining: sub.currentPeriodEnd ?
            Math.ceil((new Date(sub.currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24)) : 0
        }
      }))

      return res.status(200).json({
        subscriptions: processedSubscriptions,
        total: subscriptions.length
      })
    }

    if (req.method === 'POST') {
      // Create or update subscription (usually called by Stripe webhook)
      const {
        creatorId,
        tierId,
        stripeSubscriptionId,
        status = 'ACTIVE',
        currentPeriodStart,
        currentPeriodEnd
      } = req.body

      if (!creatorId || !tierId) {
        return res.status(400).json({ error: 'Creator ID and tier ID are required' })
      }

      // Check if subscription already exists
      const existingSubscription = await prisma.subscription.findUnique({
        where: {
          subscriberId_creatorId: {
            subscriberId: dbUser.id,
            creatorId: creatorId
          }
        }
      })

      let subscription

      if (existingSubscription) {
        // Update existing subscription
        subscription = await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            tierId,
            stripeSubscriptionId,
            status,
            currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart) : undefined,
            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : undefined
          },
          include: {
            tier: true,
            creator: {
              select: {
                displayName: true,
                isVerified: true
              }
            }
          }
        })
      } else {
        // Create new subscription
        subscription = await prisma.subscription.create({
          data: {
            subscriberId: dbUser.id,
            creatorId,
            tierId,
            stripeSubscriptionId,
            status,
            currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart) : new Date(),
            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : undefined
          },
          include: {
            tier: true,
            creator: {
              select: {
                displayName: true,
                isVerified: true
              }
            }
          }
        })

        // Update creator subscriber count
        if (status === 'ACTIVE') {
          await prisma.creator.update({
            where: { id: creatorId },
            data: {
              subscriberCount: {
                increment: 1
              }
            }
          })
        }
      }

      return res.status(200).json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          tier: subscription.tier,
          creator: subscription.creator,
          access: {
            isActive: subscription.status === 'ACTIVE',
            accessibleTiers: subscription.tier?.tierType ? getTierHierarchy(subscription.tier.tierType) : []
          }
        }
      })
    }

    if (req.method === 'DELETE') {
      // Cancel subscription
      const { creatorId } = req.body

      if (!creatorId) {
        return res.status(400).json({ error: 'Creator ID is required' })
      }

      const subscription = await prisma.subscription.findUnique({
        where: {
          subscriberId_creatorId: {
            subscriberId: dbUser.id,
            creatorId: creatorId
          }
        }
      })

      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' })
      }

      // Update subscription status
      const updatedSubscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'CANCELLED'
        }
      })

      // Update creator subscriber count
      if (subscription.status === 'ACTIVE') {
        await prisma.creator.update({
          where: { id: creatorId },
          data: {
            subscriberCount: {
              decrement: 1
            }
          }
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Subscription cancelled',
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status
        }
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (error) {
    console.error('Subscription management error:', error)
    return res.status(500).json({
      error: 'Failed to manage subscription',
      details: error.message
    })
  }
}