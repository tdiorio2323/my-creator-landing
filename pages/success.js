import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/layout/Header'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { CheckCircle, Clock, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { session_id } = router.query
  
  const [status, setStatus] = useState('checking') // checking, success, pending, error
  const [subscription, setSubscription] = useState(null)
  const [creator, setCreator] = useState(null)

  useEffect(() => {
    if (!user || !session_id) return

    const checkSubscriptionStatus = async () => {
      try {
        // Poll for subscription status (webhook might be delayed)
        let attempts = 0
        const maxAttempts = 10
        const pollInterval = 2000 // 2 seconds

        const poll = async () => {
          const { data, error } = await supabase
            .from('subscriptions')
            .select(`
              *,
              creators (
                id,
                display_name,
                profiles:user_id (
                  full_name,
                  avatar_url
                )
              ),
              subscription_tiers (
                name,
                price
              )
            `)
            .eq('subscriber_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          if (!error && data) {
            setSubscription(data)
            setCreator(data.creators)
            setStatus('success')
            return true
          }

          attempts++
          if (attempts >= maxAttempts) {
            setStatus('pending')
            return false
          }

          setTimeout(poll, pollInterval)
          return false
        }

        await poll()
      } catch (error) {
        console.error('Error checking subscription status:', error)
        setStatus('error')
      }
    }

    checkSubscriptionStatus()
  }, [user, session_id])

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h1>
            <Link href="/auth/login" className="btn-primary">
              Log In
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Subscription Successful - CreatorHub</title>
        <meta name="description" content="Your subscription has been processed" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {status === 'checking' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Processing your subscription...
              </h1>
              <p className="text-gray-600">
                Please wait while we confirm your payment
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to the community! 🎉
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Your subscription to {creator?.display_name || 'the creator'} is now active
              </p>
              
              {subscription && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Subscription Details</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Tier:</span> {subscription.subscription_tiers?.name}</p>
                    <p><span className="font-medium">Price:</span> ${subscription.subscription_tiers?.price}/month</p>
                    <p><span className="font-medium">Next billing:</span> {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href={creator ? `/creator/${creator.id}` : '/dashboard'}
                  className="btn-primary inline-flex items-center"
                >
                  View Exclusive Content
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/dashboard" className="btn-secondary">
                  Go to Dashboard
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                You can manage your subscription anytime from your dashboard
              </p>
            </div>
          )}

          {status === 'pending' && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Processing
              </h1>
              <p className="text-gray-600 mb-6">
                Your payment is being processed. This usually takes a few minutes.
                You&apos;ll receive an email confirmation once it&apos;s complete.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-secondary"
                >
                  Check Status Again
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">!</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t confirm your subscription. Please check your email for a receipt,
                or contact support if you were charged but don&apos;t see your subscription.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-secondary"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}