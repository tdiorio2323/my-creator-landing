import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Header from '../../components/layout/Header'
import CreatorProfile, { CreatorProfileSkeleton } from '../../components/creator/CreatorProfile'
import SeoHead from '../../components/SeoHead'
import { supabase } from '../../lib/supabaseClient'

function buildPlaceholderCreator(id) {
  return {
    id,
    name: 'Featured Creator',
    display_name: 'Featured Creator',
    category: 'Lifestyle',
    bio: 'Creator details will appear here soon.',
    subscribers: 0,
    rating: 0,
    likes: 0,
    joinDate: '2024',
    postCount: 6,
    videoCount: 3,
    photoCount: 3,
    liveCount: 0,
    content_count: 6,
    profile: {
      full_name: 'Featured Creator',
      bio: 'Creator details will appear here soon.'
    },
    subscription_tiers: []
  }
}

export default function CreatorPage() {
  const router = useRouter()
  const { id } = router.query
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchCreator = async () => {
      setLoading(true)
      setError(null)
      if (!supabase) {
        setCreator(buildPlaceholderCreator(id))
        setLoading(false)
        return
      }

      try {
        const { data: creatorData, error: creatorError } = await supabase
          .from('creators')
          .select(`
            *,
            profiles:user_id (
              id,
              username,
              full_name,
              avatar_url,
              bio
            ),
            subscription_tiers (*)
          `)
          .eq('id', id)
          .single()

        if (creatorError || !creatorData) {
          console.error('Creator fetch error:', creatorError)
          setError('Creator not found')
          setCreator(buildPlaceholderCreator(id))
          setLoading(false)
          return
        }

        const { count: contentCount } = await supabase
          .from('content')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', id)
          .eq('published_at', 'not.is.null')

        setCreator({
          ...creatorData,
          profile: creatorData.profiles,
          content_count: contentCount || creatorData.content_count || 0
        })
      } catch (err) {
        console.error('Error fetching creator:', err)
        setError('Failed to load creator')
        setCreator(buildPlaceholderCreator(id))
      } finally {
        setLoading(false)
      }
    }

    fetchCreator()
  }, [id])

  if (loading) {
    return (
      <>
        <SeoHead title="Loading creator" description="Fetching creator details." />
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="section-container py-16">
            <CreatorProfileSkeleton />
          </div>
        </main>
      </>
    )
  }

  if (error || !creator) {
    return (
      <>
        <SeoHead title="Creator not found" description="The creator you are looking for could not be found." />
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Creator Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'This creator profile does not exist.'}</p>
            <button
              onClick={() => router.push('/explore')}
              className="btn-primary"
            >
              Browse Creators
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <SeoHead
        title={creator.profile?.full_name || creator.name || creator.display_name}
        description={`Subscribe to ${creator.profile?.full_name || creator.name || creator.display_name} for exclusive ${creator.category || 'premium'} content.`}
        canonical={id ? `https://yourdomain.com/creator/${id}` : undefined}
      />
      {id && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: creator.profile?.full_name || creator.name || creator.display_name,
              url: `https://yourdomain.com/creator/${id}`
            })
          }}
        />
      )}

      <Header />
      
      <main className="min-h-screen bg-gray-50">
        <CreatorProfile creator={creator} />
      </main>
    </>
  )
}

// This function gets called at build time for static generation
export async function getStaticPaths() {
  // In a real app, you'd fetch all creator IDs from your API
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
    { params: { id: '4' } }
  ]

  return {
    paths,
    fallback: 'blocking' // Enable ISR for new creators
  }
}

// This function gets called at build time
export async function getStaticProps({ params }) {
  // In a real app, you'd fetch creator data from your API
  // const creator = await fetchCreator(params.id)
  
  return {
    props: {
      // creator
    },
    revalidate: 60 // Revalidate every minute
  }
}
