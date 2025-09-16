import { prisma } from './prisma'
import { createSupabaseServerClient } from './supabase'

/**
 * Comprehensive access control system for creator content
 * Supports 4-tier subscription system with Stripe integration
 */

// Helper function to get tier hierarchy
export function getTierHierarchy(tierType) {
  const hierarchy = {
    'ULTRA': ['BASIC', 'PREMIUM', 'VIP', 'ULTRA'],
    'VIP': ['BASIC', 'PREMIUM', 'VIP'],
    'PREMIUM': ['BASIC', 'PREMIUM'],
    'BASIC': ['BASIC']
  }

  return hierarchy[tierType] || ['BASIC']
}

// Check if user has active subscription to a creator
export async function hasActiveSubscription(userId, creatorId) {
  if (!userId || !creatorId) return false

  try {
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
      return false
    }

    // Check if subscription is still active
    const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
    const now = new Date()

    return currentPeriodEnd > now
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}

// Check if user can access specific content based on their subscription tier
export async function canAccessContent(userId, contentId) {
  if (!contentId) return false

  try {
    // Get content details
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        creator: true
      }
    })

    if (!content) return false

    // If content is free, allow access
    if (content.isFree) return true

    // If user is not logged in, deny access to paid content
    if (!userId) return false

    // Check if user has subscription to this creator
    const subscription = await prisma.subscription.findUnique({
      where: {
        subscriberId_creatorId: {
          subscriberId: userId,
          creatorId: content.creatorId
        }
      },
      include: {
        tier: true
      }
    })

    if (!subscription || subscription.status !== 'ACTIVE') {
      return false
    }

    // Use tier hierarchy system for access control
    const userTier = subscription.tier?.tierType
    if (!userTier) return false

    const accessibleTiers = getTierHierarchy(userTier)
    const canAccessTier = accessibleTiers.includes(content.requiredTier)

    // Check if subscription is still active
    const currentPeriodEnd = subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null
    const now = new Date()

    return canAccessTier && (!currentPeriodEnd || currentPeriodEnd > now)
  } catch (error) {
    console.error('Error checking content access:', error)
    return false
  }
}

// Get user's subscription status for a creator
export async function getSubscriptionStatus(userId, creatorId) {
  if (!userId || !creatorId) return null

  try {
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

    if (!subscription) return null

    const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
    const now = new Date()

    return {
      ...subscription,
      isActive: subscription.status === 'ACTIVE' && currentPeriodEnd > now,
      daysRemaining: Math.ceil((currentPeriodEnd - now) / (1000 * 60 * 60 * 24))
    }
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return null
  }
}

// Check if user is the owner of content/creator profile
export async function isContentOwner(userId, contentId) {
  if (!userId || !contentId) return false

  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        creator: {
          include: {
            user: true
          }
        }
      }
    })

    if (!content) return false

    return content.creator.userId === userId
  } catch (error) {
    console.error('Error checking content ownership:', error)
    return false
  }
}

// Get user's role (subscriber, creator, admin)
export async function getUserRole(userId) {
  if (!userId) return 'SUBSCRIBER'

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user) return 'SUBSCRIBER'

    return user.role
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'SUBSCRIBER'
  }
}

// Track content view for analytics
export async function trackContentView(userId, contentId) {
  try {
    // Increment view count
    await prisma.content.update({
      where: { id: contentId },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    // Track interaction if user is logged in
    if (userId) {
      await prisma.contentInteraction.upsert({
        where: {
          userId_contentId_interactionType: {
            userId: userId,
            contentId: contentId,
            interactionType: 'view'
          }
        },
        update: {},
        create: {
          userId: userId,
          contentId: contentId,
          interactionType: 'view'
        }
      })
    }
  } catch (error) {
    console.error('Error tracking content view:', error)
  }
}