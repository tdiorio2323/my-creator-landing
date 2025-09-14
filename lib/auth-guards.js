import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

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
          const response = await fetch('/api/user/creator-check')
          const result = await response.json()

          if (!response.ok || !result.isCreator) {
            router.replace('/auth/register?creator=true')
            return
          }
        }

        if (requireSubscriber) {
          // Note: SuperTokens/Prisma doesn't use profile role checking like Supabase
          // All authenticated users are considered subscribers unless they're creators
          // This check may not be needed with the new auth system
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

    try {
      const response = await fetch('/api/user/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkCreatorAccess', creatorId })
      })
      const result = await response.json()
      return response.ok && result.hasAccess
    } catch (error) {
      console.error('Error checking creator access:', error)
      return false
    }
  }

  const checkContentAccess = async (contentId) => {
    if (!user || !contentId) return false

    try {
      const response = await fetch('/api/user/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkContentAccess', contentId })
      })
      const result = await response.json()
      return response.ok && result.hasAccess
    } catch (error) {
      console.error('Error checking content access:', error)
      return false
    }
  }

  const checkSubscriptionStatus = async (creatorId) => {
    if (!user || !creatorId) return null

    try {
      const response = await fetch('/api/user/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkSubscriptionStatus', creatorId })
      })
      const result = await response.json()
      return response.ok ? result.subscription : null
    } catch (error) {
      console.error('Error checking subscription status:', error)
      return null
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