import Link from 'next/link'
import { Users, Heart, Star, Lock } from 'lucide-react'

const featuredCreators = [
  {
    id: 1,
    name: "Sarah Johnson",
    category: "Fitness & Wellness",
    subscribers: "45.2k",
    rating: 4.9,
    avatar: "/api/placeholder/80/80",
    banner: "/api/placeholder/400/200",
    tier: "Premium",
    price: "$9.99/month"
  },
  {
    id: 2,
    name: "Mike Chen",
    category: "Cooking & Recipes",
    subscribers: "38.7k",
    rating: 4.8,
    avatar: "/api/placeholder/80/80",
    banner: "/api/placeholder/400/200",
    tier: "VIP",
    price: "$19.99/month"
  },
  {
    id: 3,
    name: "Emma Wilson",
    category: "Art & Design",
    subscribers: "52.1k",
    rating: 4.9,
    avatar: "/api/placeholder/80/80",
    banner: "/api/placeholder/400/200",
    tier: "Premium",
    price: "$12.99/month"
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    category: "Tech Reviews",
    subscribers: "67.3k",
    rating: 4.7,
    avatar: "/api/placeholder/80/80",
    banner: "/api/placeholder/400/200",
    tier: "Premium",
    price: "$14.99/month"
  }
]

export default function FeaturedCreators() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Creators
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing creators and their exclusive content. Join thousands of fans 
            supporting their favorite creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCreators.map((creator) => (
            <div key={creator.id} className="creator-card group">
              {/* Banner */}
              <div className="relative h-32 bg-gradient-to-br from-primary-100 to-pink-100 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-200" />
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${
                    creator.tier === 'VIP' ? 'bg-purple-600' : 'bg-primary-600'
                  }`}>
                    {creator.tier}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center text-white text-sm">
                    <Lock className="h-4 w-4 mr-1" />
                    Exclusive Content
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {creator.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {creator.category}
                    </p>
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
                    2.1k
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    {creator.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    500+ posts
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link 
                    href={`/creator/${creator.id}`}
                    className="flex-1 btn-primary text-center text-sm py-2"
                  >
                    Subscribe
                  </Link>
                  <button className="btn-secondary px-3 py-2">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/explore" className="btn-secondary text-lg px-8 py-3">
            View All Creators
          </Link>
        </div>
      </div>
    </section>
  )
}