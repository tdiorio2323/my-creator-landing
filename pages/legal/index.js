import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/layout/Header'

export default function Legal() {
  return (
    <>
      <Head>
        <title>Legal — CreatorHub</title>
        <meta name="description" content="CreatorHub legal information, terms, and privacy." />
      </Head>
      <Header />
      <main className="section-container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-luxury-900 to-primary-700 bg-clip-text text-transparent">
            Legal
          </h1>
          <div className="glass-card p-6 leading-relaxed text-luxury-700">
            <p className="mb-4">Find key legal documents below:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link href="/legal/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}

