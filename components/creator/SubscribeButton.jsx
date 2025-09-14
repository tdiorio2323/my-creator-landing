import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '../../contexts/AuthContext'
import { Crown, Check, Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function SubscribeButton({ creator, tier, isSubscribed = false, onSubscribe }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    if (isSubscribed) {
      // Open billing portal for existing subscribers
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/api/stripe/portal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        })

        const data = await response.json()

        if (response.ok) {
          window.location.href = data.url
        } else {
          throw new Error(data.error || 'Failed to open billing portal')
        }
      } catch (err) {
        console.error('Portal error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
      return
    }

    // Create new subscription
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierId: tier.id,
          creatorId: creator.id,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const stripe = await stripePromise
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })

        if (stripeError) {
          throw new Error(stripeError.message)
        }

        if (onSubscribe) {
          onSubscribe(tier)
        }
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getTierIcon = (tierType) => {
    switch (tierType?.toLowerCase()) {
      case 'vip':
        return <Crown className="h-4 w-4 text-purple-600" />
      case 'premium':
        return <Crown className="h-4 w-4 text-primary-600" />
      default:
        return null
    }
  }

  const getTierColor = (tierType) => {
    switch (tierType?.toLowerCase()) {
      case 'vip':
        return 'bg-purple-600 hover:bg-purple-700'
      case 'premium':
        return 'bg-primary-600 hover:bg-primary-700'
      default:
        return 'bg-blue-600 hover:bg-blue-700'
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isSubscribed
            ? 'bg-gray-600 hover:bg-gray-700'
            : getTierColor(tier?.tierType)
        }`}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isSubscribed ? (
          <>
            <Check className="h-5 w-5 mr-2" />
            Manage Subscription
          </>
        ) : (
          <>
            {getTierIcon(tier?.tierType)}
            <span className="ml-2">
              Subscribe for ${tier?.price}/month
            </span>
          </>
        )}
      </button>

      {tier && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          {isSubscribed
            ? 'Click to manage your subscription, update payment method, or cancel'
            : 'Cancel anytime • No long-term commitments'}
        </p>
      )}
    </div>
  )
}