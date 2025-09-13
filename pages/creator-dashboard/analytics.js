import Head from 'next/head'
import AdvancedAnalytics from '../../components/creator-dashboard/AdvancedAnalytics'

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