import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    let subscription

    const bootstrap = async () => {
      if (!supabase) {
        if (isMounted) {
          setLoading(false)
        }
        return
      }

      const { data } = await supabase.auth.getSession()
      if (isMounted) {
        setSession(data?.session ?? null)
        setUser(data?.session?.user ?? null)
        setLoading(false)
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!isMounted) return
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
      })

      subscription = listener.subscription
    }

    bootstrap()

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    if (!supabase) {
      setSession(null)
      setUser(null)
      return { error: null }
    }

    const { error } = await supabase.auth.signOut()
    if (!error) {
      setSession(null)
      setUser(null)
    }
    return { error }
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
