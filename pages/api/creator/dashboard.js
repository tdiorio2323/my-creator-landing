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

    // Get creator profile
    const creator = await prisma.creator.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    })

    if (!creator) {
      return res.status(404).json({ error: 'Creator profile not found' })
    }

    // Get subscription stats
    const subscriptions = await prisma.subscription.findMany({
      where: {
        creatorId: creator.id,
        status: 'ACTIVE'
      },
      include: {
        tier: true,
        subscriber: {
          select: {
            fullName: true,
            avatarUrl: true
          }
        }
      }
    })

    // Get content stats
    const content = await prisma.content.findMany({
      where: { creatorId: creator.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Calculate revenue (mock calculation)
    const monthlyRevenue = subscriptions.reduce((sum, sub) => {
      return sum + (sub.tier?.price || 0)
    }, 0)

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      where: { creatorId: creator.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        payer: {
          select: {
            fullName: true,
            avatarUrl: true
          }
        }
      }
    })

    // Calculate total stats
    const totalViews = content.reduce((sum, item) => sum + item.viewCount, 0)
    const totalLikes = content.reduce((sum, item) => sum + item.likeCount, 0)

    return res.status(200).json({
      creator,
      stats: {
        subscribers: subscriptions.length,
        monthlyRevenue,
        totalRevenue: creator.totalEarnings,
        newMessages: 0, // TODO: Implement message counting
        totalViews,
        totalLikes,
        contentCount: content.length,
        averageRating: 4.8 // TODO: Calculate from reviews
      },
      recentContent: content.slice(0, 5).map(item => ({
        id: item.id,
        title: item.title,
        type: item.contentType.toLowerCase(),
        views: item.viewCount,
        likes: item.likeCount,
        revenue: Math.random() * 200 + 50, // Mock revenue calculation
        publishedAt: item.createdAt
      })),
      topSubscribers: subscriptions.slice(0, 5).map(sub => ({
        id: sub.id,
        name: sub.subscriber.fullName || 'Anonymous',
        avatarUrl: sub.subscriber.avatarUrl,
        tier: sub.tier?.name || 'Basic',
        monthlySpend: sub.tier?.price || 0
      })),
      recentPayments: recentPayments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        payer: payment.payer.fullName || 'Anonymous',
        createdAt: payment.createdAt
      }))
    })

  } catch (error) {
    console.error('Error fetching creator dashboard data:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}