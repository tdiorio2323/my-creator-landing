import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/layout/Header'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — CreatorHub</title>
        <meta name="description" content="Terms of Service for CreatorHub." />
      </Head>

      <Header />

      <main className="section-container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-luxury-900 to-primary-700 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <div className="glass-card p-6 space-y-6 leading-relaxed text-luxury-700">
            <p>
              Welcome to CreatorHub. By accessing or using our platform, you agree to these
              Terms of Service. If you do not agree, please refrain from using the site.
            </p>
            <h2 className="text-xl font-semibold text-luxury-900">Accounts & Eligibility</h2>
            <p>
              You must be at least 18 years old to use CreatorHub. You are responsible for
              maintaining the confidentiality of your account and for all activities under it.
            </p>
            <h2 className="text-xl font-semibold text-luxury-900">Subscriptions & Payments</h2>
            <p>
              Subscriptions are billed via Stripe under the selected tier. Charges are non-refundable
              except where required by law. Manage billing in your account or via the customer portal.
            </p>
            <h2 className="text-xl font-semibold text-luxury-900">Content & Acceptable Use</h2>
            <p>
              You may not upload illegal content or violate others’ rights. We may remove content
              that breaches these terms. Access to content is governed by your subscription tier.
            </p>
            <h2 className="text-xl font-semibold text-luxury-900">Termination</h2>
            <p>
              We may suspend or terminate accounts that violate these terms. You may cancel
              anytime; access continues until the end of the current billing period.
            </p>
            <p className="text-sm text-luxury-500">
              For questions, contact support via your dashboard. See our{' '}
              <Link href="/legal/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

