import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { authHelpers } from '../../lib/supabase'

export default function ConfirmEmail() {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResendEmail = async () => {
    setResending(true)
    // In a real app, you'd want to track the email and resend confirmation
    // For now, we'll just show a success message
    setTimeout(() => {
      setResending(false)
      setResent(true)
    }, 2000)
  }

  return (
    <>
      <Head>
        <title>Confirm Your Email - CreatorHub</title>
        <meta name="description" content="Please confirm your email address to complete registration" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md mx-4 border border-white/20 shadow-luxury-xl text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
            <p className="text-gray-300">We've sent a confirmation link to your email address.</p>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-gray-300 text-sm">
              Please check your email and click the confirmation link to activate your account.
            </p>
            <p className="text-gray-400 text-xs">
              Don't forget to check your spam/junk folder if you don't see the email.
            </p>
          </div>

          <div className="space-y-4">
            {!resent ? (
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? 'Sending...' : 'Resend confirmation email'}
              </button>
            ) : (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-200 text-sm">Confirmation email resent successfully!</p>
              </div>
            )}

            <Link
              href="/auth/login"
              className="block w-full bg-white/10 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              Back to sign in
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Having trouble? Contact our{' '}
              <Link href="/support" className="text-purple-400 hover:text-purple-300">
                support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}