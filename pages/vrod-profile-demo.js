import Head from 'next/head'
import VRodProfileCard from '../components/creator/VRodProfileCard'

export default function VRodProfileDemo() {
  return (
    <>
      <Head>
        <title>V Rod - Creator Profile Demo</title>
        <meta name="description" content="V Rod's social media and streaming platform links in a beautiful glassmorphism design" />
        <meta property="og:title" content="V Rod - Creator Profile" />
        <meta property="og:description" content="Connect with V Rod across all platforms - 994k+ followers" />
        <meta property="og:type" content="profile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <VRodProfileCard />
    </>
  )
}