import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../../../../components/layout/Header'
import { useAuth } from '../../../../contexts/AuthContext'
// Removed direct import of access functions - using API routes instead
import { Heart, Share, MessageCircle, Lock, Play, ArrowLeft } from 'lucide-react'

export default function ContentPage() {
  const router = useRouter()
  const { id: creatorId, postId } = router.query
  const { user } = useAuth()
  
  const [content, setContent] = useState(null)
  const [creator, setCreator] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!postId || !creatorId) return

    const fetchContent = async () => {
      try {
        // Fetch content details
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select(`
            *,
            creators (
              id,
              display_name,
              profiles:user_id (
                full_name,
                avatar_url
              )
            )
          `)
          .eq('id', postId)
          .eq('creator_id', creatorId)
          .single()

        if (contentError) {
          console.error('Content fetch error:', contentError)
          setError('Content not found')
          return
        }

        setContent(contentData)
        setCreator(contentData.creators)

        // Check access if user is logged in
        if (user) {
          try {
            const accessRes = await fetch(`/api/content/${postId}/access`, {
              headers: {
                'Authorization': `Bearer ${user.accessToken || ''}`,
              }
            })
            const accessData = await accessRes.json()
            const access = accessData.hasAccess || false
            setHasAccess(access)

            // Track view if user has access
            if (access || contentData.is_free) {
              fetch(`/api/content/${postId}/track-view`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.accessToken || ''}`,
                },
                body: JSON.stringify({ userId: user.id })
              }).catch(err => console.error('Failed to track view:', err))
            }
          } catch (err) {
            console.error('Error checking access:', err)
            setHasAccess(contentData.is_free || false)
          }
        } else if (contentData.is_free) {
          setHasAccess(true)
        }
      } catch (err) {
        console.error('Error fetching content:', err)
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [postId, creatorId, user])

  const handleSubscribe = () => {
    router.push(`/creator/${creatorId}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </main>
      </>
    )
  }

  if (error || !content) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'This content does not exist.'}</p>
            <button 
              onClick={() => router.push(`/creator/${creatorId}`)}
              className="btn-primary"
            >
              Back to Creator
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{content.title} - {creator.display_name} - CreatorHub</title>
        <meta name="description" content={content.description} />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:image" content={content.thumbnail_url} />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <button
            onClick={() => router.push(`/creator/${creatorId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to {creator.display_name}
          </button>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Media */}
            <div className="relative aspect-video bg-black">
              {hasAccess ? (
                <>
                  {content.content_type === 'video' && content.media_url ? (
                    <video 
                      controls 
                      className="w-full h-full"
                      poster={content.thumbnail_url}
                    >
                      <source src={content.media_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : content.content_type === 'photo' && content.media_url ? (
                    <Image
                      src={content.media_url}
                      alt={content.title}
                      className="w-full h-full object-contain"
                      fill
                      sizes="100vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <Play className="h-16 w-16 mx-auto mb-4" />
                        <p>Content Preview</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                  <div className="text-center max-w-md px-6">
                    <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                    <p className="text-gray-300 mb-6">
                      Subscribe to {creator.display_name} to access this exclusive content
                    </p>
                    <button
                      onClick={handleSubscribe}
                      className="btn-primary"
                    >
                      View Subscription Options
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Content Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {content.title}
                  </h1>
                  {content.description && (
                    <p className="text-gray-600 mb-4">
                      {content.description}
                    </p>
                  )}
                  
                  {/* Creator Info */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {creator.profiles?.full_name || creator.display_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Published {new Date(content.published_at || content.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
                  >
                    <Share className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-1">
                  <span>{content.view_count || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{content.like_count || 0} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{content.comment_count || 0} comments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Content */}
          {hasAccess && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                More from {creator.display_name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* TODO: Add related content */}
                <div className="bg-white rounded-lg shadow-sm p-4 text-center text-gray-500">
                  More content coming soon...
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}