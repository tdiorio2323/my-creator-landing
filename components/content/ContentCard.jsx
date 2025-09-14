import { useState } from 'react'
import Image from 'next/image'
import { Play, Heart, MessageCircle, Share, Lock, Eye, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
// Removed direct import of access functions - using API routes instead

export default function ContentCard({ content, showStats = false }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!user) return
    
    setLiked(!liked)
    // TODO: Implement like functionality with Supabase
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleView = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login'
      return
    }

    setLoading(true)

    try {
      // Check if user has access via API
      const response = await fetch(`/api/user/${user.id}/subscription/${content.creator_id}`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken || ''}`,
        }
      })
      const data = await response.json()
      const access = data.hasAccess || false

      if (access || content.is_free) {
        // Redirect to content view page
        window.location.href = `/creator/${content.creator_id}/content/${content.id}`
      } else {
        // Show subscription prompt
        window.location.href = `/creator/${content.creator_id}`
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      // On error, redirect to creator page for subscription
      window.location.href = `/creator/${content.creator_id}`
    }

    setLoading(false)
  }

  const formatDuration = (seconds) => {
    if (!seconds) return ''
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getContentTypeIcon = () => {
    switch (content.content_type) {
      case 'video':
        return <Play className="h-8 w-8 text-white" />
      case 'photo':
        return null
      case 'live':
        return <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">LIVE</div>
      default:
        return null
    }
  }

  const isLocked = !content.is_free && !hasAccess

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Content Preview */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group cursor-pointer" onClick={handleView}>
        {content.thumbnail_url ? (
          <Image
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-pink-100">
            <div className="text-center">
              {getContentTypeIcon()}
              <p className="text-sm text-gray-600 mt-2">{content.content_type}</p>
            </div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              {isLocked ? (
                <div className="bg-black bg-opacity-75 rounded-full p-3">
                  <Lock className="h-6 w-6 text-white" />
                </div>
              ) : (
                getContentTypeIcon()
              )}
            </>
          )}
        </div>

        {/* Duration for videos */}
        {content.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(content.duration)}
          </div>
        )}

        {/* Required tier badge */}
        {!content.is_free && (
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              content.required_tier === 'vip' 
                ? 'bg-yellow-500 text-white'
                : content.required_tier === 'premium'
                ? 'bg-purple-500 text-white'
                : 'bg-blue-500 text-white'
            }`}>
              {content.required_tier?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Free badge */}
        {content.is_free && (
          <div className="absolute top-2 left-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              FREE
            </span>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {content.title}
        </h3>
        
        {content.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {content.description}
          </p>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{content.view_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{content.like_count || 0}</span>
            </div>
            {content.published_at && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(content.published_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                liked ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <Share className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Creator Stats (for creator dashboard) */}
        {showStats && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-gray-900">{content.view_count || 0}</div>
                <div className="text-gray-500">Views</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{content.like_count || 0}</div>
                <div className="text-gray-500">Likes</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {content.view_count ? Math.round((content.like_count / content.view_count) * 100) : 0}%
                </div>
                <div className="text-gray-500">Engagement</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}