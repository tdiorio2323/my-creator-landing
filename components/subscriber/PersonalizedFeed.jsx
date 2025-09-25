import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share, Bookmark, Play, Image as ImageIcon, Clock, User, Lock, Crown } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '../../contexts/AuthContext'

const MOCK_FEED_ITEMS = [
  {
    id: 1,
    creator: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      tier: 'Premium'
    },
    type: 'video',
    title: 'Morning Yoga Flow for Beginners',
    description: 'Start your day with this energizing 20-minute yoga sequence perfect for all levels.',
    thumbnail: '/api/placeholder/600/400',
    duration: '20:15',
    likes: 234,
    comments: 18,
    timeAgo: '2 hours ago',
    isNew: true
  },
  {
    id: 2,
    creator: {
      name: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      tier: 'VIP'
    },
    type: 'photo',
    title: 'Behind the Scenes: Kitchen Setup',
    description: 'Take a look at my professional kitchen setup and the tools I use daily.',
    thumbnail: '/api/placeholder/600/400',
    likes: 156,
    comments: 24,
    timeAgo: '4 hours ago',
    isNew: false
  },
  {
    id: 3,
    creator: {
      name: 'Emma Wilson',
      avatar: '/api/placeholder/40/40',
      tier: 'Premium'
    },
    type: 'live',
    title: 'Live Art Session - Digital Portraits',
    description: 'Join me live as I create a digital portrait from start to finish!',
    thumbnail: '/api/placeholder/600/400',
    likes: 89,
    comments: 45,
    timeAgo: 'Live now',
    isLive: true
  }
]

export default function PersonalizedFeed() {
  const { user } = useAuth()
  const [feedFilter, setFeedFilter] = useState('all')
  const [feedItems, setFeedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const response = await fetch(`/api/content/feed?page=${page}&limit=10`)

        if (response.ok) {
          const data = await response.json()

          // Transform API data to component format
          const transformedContent = data.content.map(item => ({
            id: item.id,
            creator: {
              name: item.creator.displayName,
              avatar: item.creator.avatarUrl,
              tier: item.requiredTier || 'Basic',
              isVerified: item.creator.isVerified
            },
            type: item.contentType.toLowerCase(),
            title: item.title,
            description: item.description,
            thumbnail: item.thumbnailUrl,
            mediaUrl: item.mediaUrl,
            duration: item.duration,
            likes: item.likeCount,
            comments: item.commentCount,
            timeAgo: new Date(item.publishedAt).toLocaleDateString(),
            hasAccess: item.hasAccess,
            accessRequired: item.accessRequired,
            isFree: item.isFree,
            isNew: false // Could calculate based on date
          }))

          setFeedItems(transformedContent)
        } else {
          // Use mock data on API failure
          setFeedItems(MOCK_FEED_ITEMS)
        }
      } catch (error) {
        console.error('Failed to load feed:', error)
        // Use mock data on error
        setFeedItems(MOCK_FEED_ITEMS)
      } finally {
        setLoading(false)
      }
    }

    loadFeed()
  }, [page])

  const filteredItems = feedFilter === 'all'
    ? feedItems
    : feedItems.filter(item => item.type === feedFilter)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading your personalized feed...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Filter Tabs */}
      <div className="flex items-center space-x-6 mb-6 border-b border-gray-200">
        {[
          { id: 'all', label: 'All Content', count: feedItems.length },
          { id: 'video', label: 'Videos', count: feedItems.filter(i => i.type === 'video').length },
          { id: 'photo', label: 'Photos', count: feedItems.filter(i => i.type === 'photo').length },
          { id: 'live', label: 'Live', count: feedItems.filter(i => i.type === 'live').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFeedFilter(tab.id)}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              feedFilter === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Feed Items */}
      <div className="space-y-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            {/* Creator Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full" />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.creator.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className={`px-2 py-0.5 rounded-full text-xs text-white ${
                        item.creator.tier === 'VIP' ? 'bg-purple-600' : 'bg-primary-600'
                      }`}>
                        {item.creator.tier}
                      </span>
                      <span>{item.timeAgo}</span>
                      {item.isNew && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                          New
                        </span>
                      )}
                      {item.isLive && (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative">
              <div className="aspect-video bg-gray-100 relative overflow-hidden group cursor-pointer">
                {/* Background image or placeholder */}
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    priority={false}
                  />
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  {!item.hasAccess ? (
                    // Show lock for restricted content
                    <div className="text-center text-white">
                      <Lock className="h-16 w-16 mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-medium">
                        {item.accessRequired === 'basic' && 'Basic Subscription Required'}
                        {item.accessRequired === 'premium' && 'Premium Subscription Required'}
                        {item.accessRequired === 'vip' && 'VIP Subscription Required'}
                      </p>
                    </div>
                  ) : item.type === 'video' ? (
                    <Play className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : item.type === 'photo' ? (
                    <ImageIcon className="h-16 w-16 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  ) : (
                    <div className="text-center text-white">
                      <User className="h-16 w-16 mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-medium">JOIN LIVE</p>
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className={`absolute inset-0 ${
                  !item.hasAccess
                    ? 'bg-black/60'
                    : item.type === 'live'
                      ? 'bg-gradient-to-br from-red-500/80 to-pink-500/80'
                      : 'bg-black/20 group-hover:bg-black/10'
                } transition-all`} />

                {/* Access indicator badge */}
                {!item.hasAccess && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      {item.accessRequired.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Duration/Time */}
                {item.duration && item.hasAccess && (
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                    {item.duration}
                  </div>
                )}
              </div>
            </div>

            {/* Content Info */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {item.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                    <span className="text-sm">{item.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">{item.comments}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                    <Share className="h-5 w-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {item.timeAgo}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="btn-secondary px-6 py-3">
          Load More Content
        </button>
      </div>
    </div>
  )
}
