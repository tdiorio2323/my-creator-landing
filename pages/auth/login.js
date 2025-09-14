import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import { doesSessionExist } from 'supertokens-auth-react/recipe/session'

const EmailPasswordAuthNoSSR = dynamic(
  new Promise((res) => {
    res(() => {
      const EmailPassword = require('supertokens-auth-react/recipe/emailpassword').default
      return EmailPassword.EmailPasswordAuth
    })
  }),
  { ssr: false }
)

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        // Add a small delay to ensure SuperTokens is initialized
        await new Promise(resolve => setTimeout(resolve, 100))
        if (await doesSessionExist()) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.log('Session check error:', error)
        // If session check fails, just continue to login page
      }
    }

    if (typeof window !== 'undefined') {
      checkSession()
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Sign In - CreatorHub</title>
        <meta name="description" content="Sign in to your CreatorHub account" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-3xl font-bold text-primary-600">CreatorHub</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up for free
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <EmailPasswordAuthNoSSR />

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Accounts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscriber:</span>
                  <span className="font-mono text-gray-900">demo@subscriber.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Creator:</span>
                  <span className="font-mono text-gray-900">demo@creator.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Password:</span>
                  <span className="font-mono text-gray-900">demo123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}