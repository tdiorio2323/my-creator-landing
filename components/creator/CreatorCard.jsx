import Link from 'next/link'
import { Users, Star, Heart, Lock, Play, Image as ImageIcon } from 'lucide-react'

export default function CreatorCard({ creator, size = 'default' }) {
  const isLarge = size === 'large'
  
  return (
    <div className={`creator-card group ${isLarge ? 'col-span-2' : ''}`}>
      {/* Banner/Preview */}
      <div className={`relative overflow-hidden ${isLarge ? 'h-48' : 'h-32'} bg-gradient-to-br from-primary-100 to-pink-100`}>
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-200" />
        
        {/* Content Type Indicators */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {creator.hasVideos && (
            <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center">
              <Play className="h-3 w-3 mr-1" />
              Videos
            </div>
          )}
          {creator.hasPhotos && (
            <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center">
              <ImageIcon className="h-3 w-3 mr-1" />
              Photos
            </div>
          )}
        </div>

        {/* Tier Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2 py-1 rounded-full text-white ${
            creator.tier === 'VIP' ? 'bg-purple-600' : 'bg-primary-600'
          }`}>
            {creator.tier}
          </span>
        </div>

        {/* Exclusive Content Indicator */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center text-white text-sm">
            <Lock className="h-4 w-4 mr-1" />
            {creator.postCount}+ posts
          </div>
        </div>

        {/* Live Indicator */}
        {creator.isLive && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
              LIVE
            </div>
          </div>
        )}
      </div>

      {/* Creator Info */}
      <div className="p-4">
        <div className="flex items-start space-x-3 mb-3">
          {/* Avatar */}
          <div className={`bg-gradient-to-br from-primary-400 to-pink-400 rounded-full flex-shrink-0 ${
            isLarge ? 'w-16 h-16' : 'w-12 h-12'
          }`} />
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 truncate ${
              isLarge ? 'text-lg' : 'text-base'
            }`}>
              {creator.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {creator.category}
            </p>
            {isLarge && creator.bio && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {creator.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {creator.subscribers}
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            {creator.rating}
          </div>
          <div className="flex items-center">
            <Heart className="h-4 w-4 text-red-400 mr-1" />
            {creator.likes}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className={`font-bold text-gray-900 ${isLarge ? 'text-xl' : 'text-lg'}`}>
              {creator.price}
            </span>
            <span className="text-sm text-gray-500 ml-1">/month</span>
          </div>
          {creator.freeContent && (
            <span className="text-sm text-green-600 font-medium">
              Free content available
            </span>
          )}
        </div>

        {/* Tags */}
        {isLarge && creator.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {creator.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link 
            href={`/creator/${creator.id}`}
            className={`flex-1 btn-primary text-center text-sm ${isLarge ? 'py-3' : 'py-2'}`}
          >
            View Profile
          </Link>
          <button className={`btn-secondary ${isLarge ? 'px-4 py-3' : 'px-3 py-2'}`}>
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}