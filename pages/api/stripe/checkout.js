import { stripe } from '../../../lib/stripe'
import { prisma } from '../../../lib/prisma'
import { withRateLimit } from '../../../lib/rateLimit'
import { validateEnv, STRIPE_CONFIG } from '../../../lib/config'

// Validate environment on module load
validateEnv()

async function checkoutHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { tierId, creatorId, userId } = req.body

    // Validate required fields
    if (!tierId || !creatorId || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: tierId, creatorId, userId' 
      })
    }

    // Get tier details and validate it exists and is active
    const tier = await prisma.subscriptionTier.findFirst({
      where: {
        id: tierId,
        creatorId: creatorId,
        isActive: true,
        creator: {
          user: {
            role: 'CREATOR'
          }
        }
      },
      include: {
        creator: true
      }
    })

    if (!tier) {
      return res.status(404).json({ error: 'Subscription tier not found or not available' })
    }

    // Check if user already has an active subscription to this creator
    const existingSub = await prisma.subscription.findUnique({
      where: {
        subscriberId_creatorId: {
          subscriberId: userId,
          creatorId: creatorId
        }
      }
    })

    if (existingSub && existingSub.status === 'ACTIVE') {
      return res.status(409).json({ error: 'Already subscribed to this creator' })
    }

    // Get user profile
    const profile = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        stripeCustomerId: true
      }
    })

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    let customerId = profile.stripeCustomerId

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        name: profile.fullName,
        metadata: {
          userId: userId,
          username: profile.username || ''
        }
      })
      customerId = customer.id

      // Update profile with customer ID
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId }
        })
      } catch (updateError) {
        console.error('Failed to update customer ID:', updateError)
      }
    }

    // Map tier type to price ID
    const priceId = tier.stripePriceId || STRIPE_CONFIG.PRICE_IDS[tier.tierType]
    
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid tier configuration' })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/creator/${creatorId}?canceled=true`,
      metadata: {
        userId,
        creatorId,
        tierId,
        tierType: tier.tierType
      },
      subscription_data: {
        metadata: {
          userId,
          creatorId,
          tierId
        }
      }
    })

    return res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    
    // Don't expose internal errors in production
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error'
      
    return res.status(500).json({ error: message })
  }
}

export default withRateLimit(checkoutHandler, { 
  max: 10, // 10 requests per window
  windowMs: 60 * 1000 // 1 minute
})