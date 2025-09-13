import Head from 'next/head'
import LiveStreamingStudio from '../../components/creator-dashboard/LiveStreamingStudio'

export default function LiveStreamPage() {
  return (
    <>
      <Head>
        <title>Live Streaming Studio - Creator Dashboard</title>
        <meta name="description" content="Go live and stream to your audience" />
      </Head>

      <LiveStreamingStudio />
    </>
  )
}