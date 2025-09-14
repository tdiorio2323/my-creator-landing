import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
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

export default function Register() {
  const router = useRouter()
  const { creator } = router.query

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
        // If session check fails, just continue to register page
      }
    }

    if (typeof window !== 'undefined') {
      checkSession()
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Sign Up - CreatorHub</title>
        <meta name="description" content="Join CreatorHub and start your creator journey" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-3xl font-bold text-primary-600">CreatorHub</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Join CreatorHub
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <EmailPasswordAuthNoSSR />

            {/* Creator vs Subscriber Info */}
            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <h3 className="text-sm font-medium text-primary-900 mb-2">
                After signing up:
              </h3>
              <ul className="text-xs text-primary-700 space-y-1">
                <li>• Choose to become a Creator or stay as a Subscriber</li>
                <li>• Creators can monetize content and build audiences</li>
                <li>• Subscribers get access to exclusive creator content</li>
                <li>• Upgrade or change your role anytime in settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}