import Link from 'next/link'
import { Play, Star, Users } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-white via-pink-50 to-pink-100 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Connect with Your
            <span className="text-primary-600 block">Favorite Creators</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover exclusive content, support creators directly, and join a community 
            of fans who share your passions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/explore" className="btn-primary text-lg px-8 py-3">
              Explore Creators
            </Link>
            <Link href="/auth/register?creator=true" className="btn-secondary text-lg px-8 py-3">
              Become a Creator
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">10k+</div>
              <div className="text-gray-600">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">1M+</div>
              <div className="text-gray-600">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">$2M+</div>
              <div className="text-gray-600">Creator Earnings</div>
            </div>
          </div>
        </div>

        {/* Featured Content Preview */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Featured Content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="creator-card group">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-pink-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-16 w-16 text-primary-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                      Premium
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Creator Name {item}</h3>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      4.9
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      12.5k
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}