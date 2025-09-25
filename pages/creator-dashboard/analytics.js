import Head from 'next/head'
import dynamic from 'next/dynamic'

const AdvancedAnalytics = dynamic(
  () => import('../../components/creator-dashboard/AdvancedAnalytics'),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-64 rounded-2xl bg-gray-200 animate-pulse" aria-hidden="true" />
      </div>
    )
  }
)

export default function AnalyticsPage() {
  return (
    <>
      <Head>
        <title>Analytics - Creator Dashboard</title>
        <meta name="description" content="Track your performance and revenue analytics" />
      </Head>

      <AdvancedAnalytics />
    </>
  )
}
