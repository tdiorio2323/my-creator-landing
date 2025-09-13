import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from './supabase'

/**
 * HOC to protect routes that require authentication
 * @param {React.Component} WrappedComponent - Component to protect
 * @param {Object} options - Configuration options
 * @returns {React.Component}
 */
export function withAuth(WrappedComponent, options = {}) {
  const { 
    redirectTo = '/auth/login',
    requireCreator = false,
    requireSubscriber = false 
  } = options

  return function AuthGuard(props) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
      const checkAuth = async () => {
        if (loading) return

        if (!user) {
          const returnTo = router.asPath
          router.replace(`${redirectTo}?returnTo=${encodeURIComponent(returnTo)}`)
          return
        }

        // Check role-specific requirements
        if (requireCreator) {
          const { data, error } = await supabase
            .from('creators')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (error || !data) {
            router.replace('/auth/register?creator=true')
            return
          }
        }

        if (requireSubscriber) {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          if (error || data?.role !== 'subscriber') {
            router.replace('/dashboard')
            return
          }
        }

        setAuthorized(true)
        setChecking(false)
      }

      checkAuth()
    }, [user, loading, router])

    if (loading || checking) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      )
    }

    if (!authorized) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

/**
 * Hook to check if user has specific permissions
 * @returns {Object} Permission checking functions
 */
export function usePermissions() {
  const { user } = useAuth()

  const checkCreatorAccess = async (creatorId) => {
    if (!user || !creatorId) return false

    const { data, error } = await supabase
      .from('creators')
      .select('id')
      .eq('id', creatorId)
      .eq('user_id', user.id)
      .single()

    return !error && !!data
  }

  const checkContentAccess = async (contentId) => {
    if (!user || !contentId) return false

    const { data, error } = await supabase
      .from('content')
      .select('creators!inner(user_id)')
      .eq('id', contentId)
      .single()

    return !error && data?.creators?.user_id === user.id
  }

  const checkSubscriptionStatus = async (creatorId) => {
    if (!user || !creatorId) return null

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_tiers(*)')
      .eq('subscriber_id', user.id)
      .eq('creator_id', creatorId)
      .eq('status', 'active')
      .single()

    if (error || !data) return null

    const currentPeriodEnd = new Date(data.current_period_end)
    const now = new Date()

    return {
      ...data,
      isActive: currentPeriodEnd > now,
      daysRemaining: Math.ceil((currentPeriodEnd - now) / (1000 * 60 * 60 * 24))
    }
  }

  return {
    checkCreatorAccess,
    checkContentAccess,
    checkSubscriptionStatus
  }
}

/**
 * Hook to redirect authenticated users from auth pages
 */
export function useAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      const returnTo = router.query.returnTo || '/dashboard'
      router.replace(returnTo)
    }
  }, [user, loading, router])

  return { loading, redirecting: !loading && !!user }
}