import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../contexts/AuthContext'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useEffect } from 'react'

// SuperTokens imports
if (typeof window !== 'undefined') {
  // Only import and initialize on client side
  const SuperTokens = require('supertokens-auth-react').default
  const EmailPassword = require('supertokens-auth-react/recipe/emailpassword').default

  SuperTokens.init({
    appInfo: {
      appName: 'Creator Platform',
      apiDomain: process.env.NEXTAUTH_URL || 'http://localhost:3001',
      websiteDomain: process.env.NEXTAUTH_URL || 'http://localhost:3001',
      apiBasePath: '/api/auth',
      websiteBasePath: '/auth'
    },
    recipeList: [
      EmailPassword.init()
    ]
  })
}

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize SuperTokens on client side
    if (typeof window !== 'undefined') {
      // SuperTokens is already initialized above
    }
  }, [])

  return (
    <AuthProvider>
      <main className={inter.className}>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </main>
    </AuthProvider>
  )
}
