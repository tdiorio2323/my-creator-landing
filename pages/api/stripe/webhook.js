import { stripe } from '../../../lib/stripe'
import { supabase } from '../../../lib/supabase'
import { validateEnv } from '../../../lib/config'

// Validate environment on module load
validateEnv()

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}

// In-memory store for processed events (use Redis in production)
const processedEvents = new Set()

// Helper function to get raw body
const getRawBody = (req) => {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0)
    req.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk])
    })
    req.on('end', () => {
      resolve(buffer)
    })
    req.on('error', (err) => {
      reject(err)
    })
  })
}

// Idempotency check
function isEventProcessed(eventId) {
  return processedEvents.has(eventId)
}

function markEventProcessed(eventId) {
  processedEvents.add(eventId)
  
  // Clean up old events (keep last 1000)
  if (processedEvents.size > 1000) {
    const eventsArray = Array.from(processedEvents)
    processedEvents.clear()
    eventsArray.slice(-500).forEach(id => processedEvents.add(id))
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig) {
    console.error('Missing Stripe signature')
    return res.status(400).json({ error: 'Missing webhook signature' })
  }

  if (!webhookSecret) {
    console.error('Missing webhook secret in environment')
    return res.status(500).json({ error: 'Webhook not configured' })
  }

  let event

  try {
    const rawBody = await getRawBody(req)
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ 
      error: 'Invalid signature',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }

  // Idempotency check
  if (isEventProcessed(event.id)) {
    console.log(`Event ${event.id} already processed, skipping`)
    return res.status(200).json({ received: true, skipped: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const { userId, creatorId, tierId } = session.metadata

        if (!userId || !creatorId || !tierId) {
          console.error('Missing metadata in checkout session:', session.id)
          break
        }

        // Get subscription from Stripe to get period dates
        const subscription = await stripe.subscriptions.retrieve(session.subscription)

        // Create subscription record with conflict resolution
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert({
            subscriber_id: userId,
            creator_id: creatorId,
            tier_id: tierId,
            stripe_subscription_id: session.subscription,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }, {
            onConflict: 'subscriber_id,creator_id'
          })

        if (subError) {
          console.error('Error creating subscription:', subError)
          throw subError
        }

        // Update creator subscriber count
        const { error: countError } = await supabase.rpc('increment_subscriber_count', { 
          creator_id: creatorId 
        })

        if (countError) {
          console.error('Error updating subscriber count:', countError)
        }

        console.log(`Subscription created: ${session.subscription} for creator ${creatorId}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription:', error)
          throw error
        }

        console.log(`Subscription updated: ${subscription.id} status: ${subscription.status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Get subscription details before marking as cancelled
        const { data: subData, error: getError } = await supabase
          .from('subscriptions')
          .select('creator_id, status')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (getError) {
          console.error('Error finding subscription to cancel:', getError)
          break
        }

        const { error } = await supabase
          .from('subscriptions')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error cancelling subscription:', error)
          throw error
        }

        // Only decrement count if subscription was previously active
        if (subData && subData.status === 'active') {
          const { error: countError } = await supabase.rpc('decrement_subscriber_count', { 
            creator_id: subData.creator_id 
          })

          if (countError) {
            console.error('Error updating subscriber count:', countError)
          }
        }

        console.log(`Subscription cancelled: ${subscription.id}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        
        if (invoice.subscription) {
          const { error } = await supabase
            .from('subscriptions')
            .update({ 
              status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription)

          if (error) {
            console.error('Error updating subscription to past_due:', error)
            throw error
          }

          console.log(`Subscription marked past due: ${invoice.subscription}`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        
        if (invoice.subscription) {
          const { error } = await supabase
            .from('subscriptions')
            .update({ 
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription)

          if (error) {
            console.error('Error updating subscription to active:', error)
          } else {
            console.log(`Subscription payment succeeded: ${invoice.subscription}`)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark event as processed
    markEventProcessed(event.id)

    res.status(200).json({ received: true, eventType: event.type })
  } catch (error) {
    console.error('Webhook handler error:', error)
    
    // Return 500 so Stripe retries the webhook
    res.status(500).json({ 
      error: 'Webhook processing failed',
      eventId: event.id,
      eventType: event.type
    })
  }
}