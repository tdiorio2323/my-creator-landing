import { stripe } from '../../../lib/stripe'
import { supabase } from '../../../lib/supabase'
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

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' })
    }

    // Get user's profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('stripe_customer_id, username, full_name')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    let customerId = profile.stripe_customer_id

    // Create customer if they don't have one
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