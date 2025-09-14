import { stripe } from '../../../lib/stripe'
import { prisma } from '../../../lib/prisma'
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
        try {
          await prisma.subscription.upsert({
            where: {
              subscriberId_creatorId: {
                subscriberId: userId,
                creatorId: creatorId
              }
            },
            create: {
              subscriberId: userId,
              creatorId: creatorId,
              tierId: tierId,
              stripeSubscriptionId: session.subscription,
              status: subscription.status.toUpperCase(),
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000)
            },
            update: {
              tierId: tierId,
              stripeSubscriptionId: session.subscription,
              status: subscription.status.toUpperCase(),
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
          })
        } catch (subError) {
          console.error('Error creating subscription:', subError)
          throw subError
        }

        // Update creator subscriber count
        try {
          await prisma.creator.update({
            where: { id: creatorId },
            data: {
              subscriberCount: {
                increment: 1
              }
            }
          })
        } catch (countError) {
          console.error('Error updating subscriber count:', countError)
        }

        console.log(`Subscription created: ${session.subscription} for creator ${creatorId}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object

        try {
          await prisma.subscription.updateMany({
            where: {
              stripeSubscriptionId: subscription.id
            },
            data: {
              status: subscription.status.toUpperCase(),
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
          })
        } catch (error) {
          console.error('Error updating subscription:', error)
          throw error
        }

        console.log(`Subscription updated: ${subscription.id} status: ${subscription.status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        try {
          // Get subscription details before marking as cancelled
          const subData = await prisma.subscription.findFirst({
            where: {
              stripeSubscriptionId: subscription.id
            },
            select: {
              creatorId: true,
              status: true
            }
          })

          if (!subData) {
            console.error('Error finding subscription to cancel:', subscription.id)
            break
          }

          await prisma.subscription.updateMany({
            where: {
              stripeSubscriptionId: subscription.id
            },
            data: {
              status: 'CANCELLED'
            }
          })

          // Only decrement count if subscription was previously active
          if (subData.status === 'ACTIVE') {
            await prisma.creator.update({
              where: { id: subData.creatorId },
              data: {
                subscriberCount: {
                  decrement: 1
                }
              }
            })
          }

          console.log(`Subscription cancelled: ${subscription.id}`)
        } catch (error) {
          console.error('Error cancelling subscription:', error)
          throw error
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object

        if (invoice.subscription) {
          try {
            await prisma.subscription.updateMany({
              where: {
                stripeSubscriptionId: invoice.subscription
              },
              data: {
                status: 'PAST_DUE'
              }
            })
            console.log(`Subscription marked past due: ${invoice.subscription}`)
          } catch (error) {
            console.error('Error updating subscription to past_due:', error)
            throw error
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object

        if (invoice.subscription) {
          try {
            await prisma.subscription.updateMany({
              where: {
                stripeSubscriptionId: invoice.subscription
              },
              data: {
                status: 'ACTIVE'
              }
            })
            console.log(`Subscription payment succeeded: ${invoice.subscription}`)
          } catch (error) {
            console.error('Error updating subscription to active:', error)
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