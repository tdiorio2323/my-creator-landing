import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/layout/Header'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — CreatorHub</title>
        <meta name="description" content="Privacy Policy for CreatorHub." />
      </Head>

      <Header />

      <main className="section-container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-luxury-900 to-primary-700 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <div className="glass-card p-6 space-y-6 leading-relaxed text-luxury-700">
            <p>
              We value your privacy. This policy explains what data we collect, how we use it,
              and your choices.
            </p>
            <h2 className="text-xl font-semibold text-luxury-900">Data We Collect</h2>
            <p>
              Account details, subscription status, payment identifiers (via Stripe), and usage
              analytics. We store media in Supabase Storage. Sensitive payment data is handled by Stripe.
            </p>
            <h2 className="text-xl font-semibold text-luxury-900">How We Use Data</h2>
            <p>
              To provide authentication, manage subscriptions, deliver gated content, and improve
              platform reliability and security.
            </p>
            <h2 className="text-xl font-semibold text-luxury-900">Your Choices</h2>
            <p>
              You can update your profile and preferences in your account. Contact support to
              request data export or deletion, subject to legal obligations.
            </p>
            <p className="text-sm text-luxury-500">
              For terms governing platform use, see our{' '}
              <Link href="/legal/terms" className="text-primary-600 hover:underline">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

