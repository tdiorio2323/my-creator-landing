import { createContext, useContext, useEffect, useState } from 'react'
import { doesSessionExist, signOut as stSignOut } from 'supertokens-auth-react/recipe/emailpassword'
import Session from 'supertokens-auth-react/recipe/session'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (await doesSessionExist()) {
          const sessionInfo = await Session.getAccessTokenPayloadSecurely()
          setSession(sessionInfo)

          // Fetch user from our API
          const response = await fetch('/api/user/me')
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          }
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for session changes
    const unsubscribe = Session.addAxiosInterceptors()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  // Sign out
  const signOut = async () => {
    try {
      await stSignOut()
      setUser(null)
      setSession(null)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}