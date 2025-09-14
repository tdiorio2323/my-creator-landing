import { useState, useEffect } from 'react'
import Head from 'next/head'
import CreatorLinkCard from '../components/creator/CreatorLinkCard'

export default function VRodEnhancedDemo() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data (in production, this would be an API call)
    const loadProfileData = async () => {
      try {
        // Import the JSON data
        const data = await import('../data/vrod-profile.json')
        setProfileData(data.default)
      } catch (error) {
        console.error('Failed to load profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading V Rod's profile...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>V Rod - Enhanced Creator Profile</title>
        <meta name="description" content="V Rod's complete social media presence - 994k+ followers across all platforms" />
        <meta property="og:title" content="V Rod - Music Artist & Content Creator" />
        <meta property="og:description" content="Connect with V Rod on Instagram (385k), Twitter (455k), YouTube (43k) and more. Stream music on Spotify, Apple Music & exclusive content." />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1494790108755-2616b612b789?w=1200&h=630&fit=crop&crop=face" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8B5CF6" />
      </Head>

      <CreatorLinkCard profileData={profileData} />

      {/* Custom styles for enhanced effects */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        /* Enhanced button hover effects */
        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </>
  )
}

// Static generation for better performance
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600 // Revalidate every hour
  }
}