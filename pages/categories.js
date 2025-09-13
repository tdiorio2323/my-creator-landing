import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/layout/Header'
import { Users, TrendingUp, Star } from 'lucide-react'

const categories = [
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    description: 'Workouts, nutrition, and healthy lifestyle content',
    creatorCount: 1247,
    subscriberCount: 89000,
    averagePrice: 12.99,
    color: 'bg-green-500',
    gradient: 'from-green-100 to-emerald-100'
  },
  {
    id: 'cooking',
    name: 'Cooking & Recipes',
    description: 'Culinary adventures, recipes, and cooking tutorials',
    creatorCount: 892,
    subscriberCount: 67000,
    averagePrice: 15.99,
    color: 'bg-orange-500',
    gradient: 'from-orange-100 to-amber-100'
  },
  {
    id: 'art',
    name: 'Art & Design',
    description: 'Digital art, illustrations, and design tutorials',
    creatorCount: 1456,
    subscriberCount: 78000,
    averagePrice: 11.99,
    color: 'bg-purple-500',
    gradient: 'from-purple-100 to-pink-100'
  },
  {
    id: 'tech',
    name: 'Tech & Reviews',
    description: 'Latest gadgets, reviews, and technology insights',
    creatorCount: 634,
    subscriberCount: 45000,
    averagePrice: 18.99,
    color: 'bg-blue-500',
    gradient: 'from-blue-100 to-cyan-100'
  },
  {
    id: 'music',
    name: 'Music & Audio',
    description: 'Original music, covers, and audio content',
    creatorCount: 923,
    subscriberCount: 56000,
    averagePrice: 9.99,
    color: 'bg-red-500',
    gradient: 'from-red-100 to-pink-100'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Game streams, reviews, and gaming content',
    creatorCount: 1789,
    subscriberCount: 124000,
    averagePrice: 14.99,
    color: 'bg-indigo-500',
    gradient: 'from-indigo-100 to-purple-100'
  },
  {
    id: 'fashion',
    name: 'Fashion & Style',
    description: 'Style guides, fashion tips, and outfit inspiration',
    creatorCount: 756,
    subscriberCount: 43000,
    averagePrice: 13.99,
    color: 'bg-pink-500',
    gradient: 'from-pink-100 to-rose-100'
  },
  {
    id: 'travel',
    name: 'Travel & Adventure',
    description: 'Travel vlogs, destination guides, and adventures',
    creatorCount: 567,
    subscriberCount: 38000,
    averagePrice: 16.99,
    color: 'bg-teal-500',
    gradient: 'from-teal-100 to-cyan-100'
  },
  {
    id: 'education',
    name: 'Education & Learning',
    description: 'Tutorials, courses, and educational content',
    creatorCount: 1234,
    subscriberCount: 92000,
    averagePrice: 19.99,
    color: 'bg-yellow-500',
    gradient: 'from-yellow-100 to-amber-100'
  },
  {
    id: 'comedy',
    name: 'Comedy & Entertainment',
    description: 'Comedy sketches, entertainment, and fun content',
    creatorCount: 445,
    subscriberCount: 34000,
    averagePrice: 8.99,
    color: 'bg-lime-500',
    gradient: 'from-lime-100 to-green-100'
  },
  {
    id: 'beauty',
    name: 'Beauty & Skincare',
    description: 'Beauty tutorials, skincare routines, and tips',
    creatorCount: 823,
    subscriberCount: 61000,
    averagePrice: 12.99,
    color: 'bg-rose-500',
    gradient: 'from-rose-100 to-pink-100'
  },
  {
    id: 'business',
    name: 'Business & Finance',
    description: 'Business insights, finance tips, and entrepreneurship',
    creatorCount: 389,
    subscriberCount: 29000,
    averagePrice: 24.99,
    color: 'bg-gray-500',
    gradient: 'from-gray-100 to-slate-100'
  }
]

export default function Categories() {
  const totalCreators = categories.reduce((sum, cat) => sum + cat.creatorCount, 0)
  const totalSubscribers = categories.reduce((sum, cat) => sum + cat.subscriberCount, 0)

  return (
    <>
      <Head>
        <title>Categories - CreatorHub</title>
        <meta name="description" content="Explore content categories and find creators in your favorite niches" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-pink-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover amazing creators across all your favorite categories and interests
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {totalCreators.toLocaleString()}+
                </div>
                <div className="text-gray-600">Total Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {Math.round(totalSubscribers / 1000)}k+
                </div>
                <div className="text-gray-600">Active Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">12</div>
                <div className="text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/explore?category=${category.id}`}
                  className="group"
                >
                  <div className="card hover:shadow-lg transition-all duration-200 overflow-hidden">
                    {/* Category Header */}
                    <div className={`h-32 bg-gradient-to-br ${category.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-5 transition-all" />
                      <div className="absolute bottom-4 left-4">
                        <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
                          {category.name[0]}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-white bg-opacity-90 text-gray-700 text-sm px-3 py-1 rounded-full">
                          {category.creatorCount} creators
                        </span>
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {(category.subscriberCount / 1000).toFixed(0)}k subscribers
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          ${category.averagePrice}/mo avg
                        </div>
                      </div>

                      {/* Popular Creators Preview */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-8 h-8 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full border-2 border-white"
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          Popular creators
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                          Explore {category.name}
                        </span>
                        <div className="flex items-center text-yellow-400">
                          <Star className="h-4 w-4 mr-1" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trending This Week
              </h2>
              <p className="text-lg text-gray-600">
                Most popular categories right now
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories
                .sort((a, b) => b.subscriberCount - a.subscriberCount)
                .slice(0, 3)
                .map((category, index) => (
                  <div key={category.id} className="text-center">
                    <div className="relative mb-4">
                      <div className={`w-20 h-20 ${category.color} rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold`}>
                        #{index + 1}
                      </div>
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                        HOT
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {(category.subscriberCount / 1000).toFixed(0)}k subscribers
                    </p>
                    <Link
                      href={`/explore?category=${category.id}`}
                      className="btn-primary text-sm px-6 py-2"
                    >
                      Explore
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}