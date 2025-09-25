import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import SearchBar from '../components/public/SearchBar'
import CreatorCard from '../components/creator/CreatorCard'
import SeoHead from '../components/SeoHead'
import { Grid, List, TrendingUp, Clock, Star } from 'lucide-react'

// Mock data - in real app this would come from API
const mockCreators = [
  {
    id: 1,
    name: "Sarah Johnson",
    category: "Fitness & Wellness",
    subscribers: "45.2k",
    rating: 4.9,
    likes: "12k",
    price: "$9.99",
    tier: "Premium",
    postCount: 450,
    hasVideos: true,
    hasPhotos: true,
    isLive: false,
    freeContent: true,
    bio: "Certified personal trainer helping you achieve your fitness goals with fun workouts.",
    tags: ["Fitness", "Nutrition", "Wellness"]
  },
  {
    id: 2,
    name: "Mike Chen",
    category: "Cooking & Recipes",
    subscribers: "38.7k",
    rating: 4.8,
    likes: "9.2k",
    price: "$19.99",
    tier: "VIP",
    postCount: 320,
    hasVideos: true,
    hasPhotos: true,
    isLive: true,
    freeContent: false,
    bio: "Professional chef sharing exclusive recipes and cooking techniques.",
    tags: ["Cooking", "Recipes", "Asian Cuisine"]
  },
  {
    id: 3,
    name: "Emma Wilson",
    category: "Art & Design",
    subscribers: "52.1k",
    rating: 4.9,
    likes: "15k",
    price: "$12.99",
    tier: "Premium",
    postCount: 680,
    hasVideos: false,
    hasPhotos: true,
    isLive: false,
    freeContent: true,
    bio: "Digital artist creating stunning illustrations and design tutorials.",
    tags: ["Art", "Design", "Digital Art"]
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    category: "Tech Reviews",
    subscribers: "67.3k",
    rating: 4.7,
    likes: "18k",
    price: "$14.99",
    tier: "Premium",
    postCount: 290,
    hasVideos: true,
    hasPhotos: false,
    isLive: false,
    freeContent: true,
    bio: "In-depth tech reviews and buying guides for the latest gadgets.",
    tags: ["Tech", "Reviews", "Gadgets"]
  }
]

export default function Explore() {
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [creators, setCreators] = useState(mockCreators)

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm)
    // Implement search logic here
  }

  const handleFilter = (filters) => {
    console.log('Applying filters:', filters)
    // Implement filter logic here
  }

  return (
    <>
      <SeoHead
        title="Explore creators"
        description="Discover amazing creators and exclusive content across all categories."
        canonical="https://yourdomain.com/explore"
      />

      <Header />
      
      <main className="min-h-screen bg-gray-50">
        <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
        
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Explore Creators
              </h1>
              <p className="text-gray-600">
                Discover {creators.length} amazing creators across all categories
              </p>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm hover:border-primary-300">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </button>
            <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm hover:border-primary-300">
              <Clock className="h-4 w-4" />
              <span>New This Week</span>
            </button>
            <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm hover:border-primary-300">
              <Star className="h-4 w-4" />
              <span>Top Rated</span>
            </button>
            <button className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm hover:border-primary-300">
              Free Content
            </button>
            <button className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm hover:border-primary-300">
              Live Now
            </button>
          </div>

          {/* Creators Grid/List */}
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }>
            {creators.map((creator, index) => (
              <CreatorCard 
                key={creator.id} 
                creator={creator} 
                size={viewMode === 'list' || (viewMode === 'grid' && index === 0) ? 'large' : 'default'}
              />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn-secondary text-lg px-8 py-3">
              Load More Creators
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
