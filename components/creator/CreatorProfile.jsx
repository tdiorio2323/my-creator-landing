import { useState } from 'react'
import { Users, Star, Heart, Share, MessageCircle, Gift, Play, Image as ImageIcon, Lock, Calendar } from 'lucide-react'

export default function CreatorProfile({ creator }) {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-br from-primary-100 to-pink-100 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        
        {/* Creator Avatar */}
        <div className="absolute bottom-6 left-6">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full border-4 border-white" />
        </div>

        {/* Actions */}
        <div className="absolute bottom-6 right-6 flex space-x-3">
          <button className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
            <Share className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
            <Heart className="h-5 w-5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Creator Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {creator.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {creator.category}
                  </p>
                  <p className="text-gray-700 max-w-2xl">
                    {creator.bio}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-medium">{creator.subscribers}</span>
                  <span className="ml-1">subscribers</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="font-medium">{creator.rating}</span>
                  <span className="ml-1">rating</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-400 mr-2" />
                  <span className="font-medium">{creator.likes}</span>
                  <span className="ml-1">likes</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Joined {creator.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'posts', label: 'Posts', count: creator.postCount },
                  { id: 'videos', label: 'Videos', count: creator.videoCount },
                  { id: 'photos', label: 'Photos', count: creator.photoCount },
                  { id: 'live', label: 'Live Streams', count: creator.liveCount }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="card group cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {activeTab === 'videos' ? (
                        <Play className="h-12 w-12 text-gray-400 group-hover:text-primary-600 transition-colors" />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-gray-400 group-hover:text-primary-600 transition-colors" />
                      )}
                    </div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        ${(Math.random() * 20 + 5).toFixed(2)}
                      </span>
                    </div>

                    {/* Lock Overlay for Premium Content */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        <Lock className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Subscribe to unlock</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Exclusive Content #{item}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>2 days ago</span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {Math.floor(Math.random() * 500 + 100)}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {Math.floor(Math.random() * 50 + 10)}
                        </span>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subscribe to {creator.name}
              </h3>
              
              {/* Subscription Tiers */}
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Basic</span>
                    <span className="text-lg font-bold text-gray-900">$9.99/mo</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Access to all posts</li>
                    <li>• Photo galleries</li>
                    <li>• Community chat</li>
                  </ul>
                  <button className="w-full btn-primary">
                    Subscribe
                  </button>
                </div>

                <div className="border-2 border-primary-200 bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">Premium</span>
                      <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                        Popular
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">$19.99/mo</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Everything in Basic</li>
                    <li>• HD video content</li>
                    <li>• Live stream access</li>
                    <li>• Direct messaging</li>
                  </ul>
                  <button className="w-full btn-primary">
                    Subscribe
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">VIP</span>
                    <span className="text-lg font-bold text-gray-900">$49.99/mo</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Everything in Premium</li>
                    <li>• 1-on-1 video calls</li>
                    <li>• Custom content requests</li>
                    <li>• Priority support</li>
                  </ul>
                  <button className="w-full btn-primary">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Send Tip */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Send a Tip
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[5, 10, 25].map((amount) => (
                  <button
                    key={amount}
                    className="border border-gray-300 rounded-lg py-2 px-3 text-center hover:border-primary-300 hover:bg-primary-50"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <button className="w-full btn-secondary flex items-center justify-center">
                <Gift className="h-4 w-4 mr-2" />
                Send Custom Tip
              </button>
            </div>

            {/* Message Creator */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Message {creator.name}
              </h3>
              <button className="w-full btn-secondary flex items-center justify-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Requires active subscription
              </p>
            </div>

            {/* Similar Creators */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Similar Creators
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Creator Name {item}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.floor(Math.random() * 50 + 10)}k subscribers
                      </p>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-700">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}