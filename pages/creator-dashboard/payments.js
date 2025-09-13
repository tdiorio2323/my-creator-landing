import Head from 'next/head'
import PaymentCenter from '../../components/creator-dashboard/PaymentCenter'

export default function PaymentsPage() {
  return (
    <>
      <Head>
        <title>Payment Center - Creator Dashboard</title>
        <meta name="description" content="Manage your earnings, payouts, and payment methods" />
      </Head>

      <PaymentCenter />
    </>
  )
}