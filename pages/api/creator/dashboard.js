import { prisma } from '../../../lib/prisma'
import { createSupabaseServerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get user from Supabase auth
    const supabase = createSupabaseServerClient({ req, res })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Find or create user in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      // Create user if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email.split('@')[0],
          role: 'CREATOR',
          avatarUrl: user.user_metadata?.avatar_url
        }
      })
    }

    // Get creator profile
    let creator = await prisma.creator.findUnique({
      where: { userId: dbUser.id },
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

    // Create creator profile if doesn't exist
    if (!creator) {
      creator = await prisma.creator.create({
        data: {
          userId: dbUser.id,
          displayName: dbUser.fullName || dbUser.email.split('@')[0],
          description: 'Welcome to my creator page!',
          category: 'General'
        },
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
      recentContent: content.slice(0, 5).map((item, index) => ({
        id: item.id,
        title: item.title,
        type: item.contentType.toLowerCase(),
        views: item.viewCount,
        likes: item.likeCount,
        revenue: 150 + index * 75,
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
