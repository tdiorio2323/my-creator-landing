import { stripe } from '../../../lib/stripe'
import { prisma } from '../../../lib/prisma'
import { withRateLimit } from '../../../lib/rateLimit'
import { validateEnv } from '../../../lib/config'

// Validate environment on module load
validateEnv()

async function portalHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    // Get user's profile
    const profile = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        stripeCustomerId: true,
        username: true,
        fullName: true
      }
    })

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    let customerId = profile.stripeCustomerId

    // Create customer if they don't have one
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

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Portal session error:', error)
    
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error'
      
    return res.status(500).json({ error: message })
  }
}

export default withRateLimit(portalHandler, { 
  max: 5, // 5 requests per window
  windowMs: 60 * 1000 // 1 minute
})