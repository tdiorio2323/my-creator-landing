import { stripe } from '../../../lib/stripe'
import { supabase } from '../../../lib/supabase'
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

    // Validate UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(tierId) || !uuidRegex.test(creatorId) || !uuidRegex.test(userId)) {
      return res.status(400).json({ error: 'Invalid ID format' })
    }

    // Get tier details and validate it exists and is active
    const { data: tier, error: tierError } = await supabase
      .from('subscription_tiers')
      .select('*, creators!inner(id, is_active)')
      .eq('id', tierId)
      .eq('creator_id', creatorId)
      .eq('is_active', true)
      .eq('creators.is_active', true)
      .single()

    if (tierError || !tier) {
      return res.status(404).json({ error: 'Subscription tier not found or not available' })
    }

    // Check if user already has an active subscription to this creator
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('subscriber_id', userId)
      .eq('creator_id', creatorId)
      .eq('status', 'active')
      .single()

    if (existingSub) {
      return res.status(409).json({ error: 'Already subscribed to this creator' })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, full_name, stripe_customer_id')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    let customerId = profile.stripe_customer_id

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        name: profile.full_name,
        metadata: {
          userId: userId,
          username: profile.username || ''
        }
      })
      customerId = customer.id

      // Update profile with customer ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)

      if (updateError) {
        console.error('Failed to update customer ID:', updateError)
      }
    }

    // Map tier type to price ID
    const priceId = tier.stripe_price_id || STRIPE_CONFIG.PRICE_IDS[tier.tier_type]
    
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
        tierType: tier.tier_type
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