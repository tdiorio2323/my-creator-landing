import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../contexts/AuthContext'
import {
  TrendingUp,
  Users,
  DollarSign,
  MessageCircle,
  Eye,
  Heart,
  Upload,
  Calendar,
  BarChart3,
  Plus,
  Crown
} from 'lucide-react'

export default function CreatorDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [creator, setCreator] = useState(null)
  const [stats, setStats] = useState({
    subscribers: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    newMessages: 0,
    totalViews: 0,
    totalLikes: 0,
    contentCount: 0,
    averageRating: 0
  })
  const [recentContent, setRecentContent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Load real data from API
    const loadDashboardData = async () => {
      try {
        const response = await fetch('/api/creator/dashboard')

        if (response.ok) {
          const data = await response.json()
          setCreator(data.creator)
          setStats(data.stats)
          setRecentContent(data.recentContent || mockRecentContent)
        } else if (response.status === 404) {
          // Creator profile not found, use mock data for demo
          setStats({
            subscribers: 2847,
            monthlyRevenue: 4521,
            totalRevenue: 18642,
            newMessages: 12,
            totalViews: 45678,
            totalLikes: 8932,
            contentCount: 127,
            averageRating: 4.8
          })
          setRecentContent(mockRecentContent)
          setCreator({ id: 'demo', displayName: user?.email || 'Demo Creator' })
        } else {
          throw new Error('Failed to fetch dashboard data')
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
        // Fallback to mock data
        setStats({
          subscribers: 2847,
          monthlyRevenue: 4521,
          totalRevenue: 18642,
          newMessages: 12,
          totalViews: 45678,
          totalLikes: 8932,
          contentCount: 127,
          averageRating: 4.8
        })
        setRecentContent(mockRecentContent)
        setCreator({ id: 'demo', displayName: user?.email || 'Demo Creator' })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user, router])

  // Mock data for the rest of the component
  const mockRecentContent = [
    {
      id: 1,
      title: "Morning Yoga Flow",
      type: "video",
      views: 1230,
      likes: 89,
      revenue: 245.60,
      publishedAt: "2 hours ago"
    },
    {
      id: 2,
      title: "Healthy Breakfast Ideas",
      type: "photo",
      views: 856,
      likes: 67,
      revenue: 156.80,
      publishedAt: "1 day ago"
    },
    {
      id: 3,
      title: "Live Q&A Session",
      type: "live",
      views: 2100,
      likes: 234,
      revenue: 890.40,
      publishedAt: "3 days ago"
    }
  ]

  return (
    <>
      <Head>
        <title>Creator Dashboard - CreatorHub</title>
        <meta name="description" content="Manage your content and track your creator analytics" />
      </Head>

      <Header />
      
      <div className="flex min-h-screen">
        <Sidebar userType="creator" />

        <main className="flex-1 bg-gradient-to-br from-luxury-50 via-primary-50/20 to-secondary-50/10 p-8">
          {/* Welcome Header */}
          <div className="mb-12">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-luxury-900 to-primary-700 bg-clip-text text-transparent">
                      Creator Dashboard
                    </span>
                  </h1>
                  <p className="text-xl text-luxury-600">
                    Welcome back! Here's how your premium content is performing
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="status-premium">
                    Elite Creator
                  </div>
                  <div className="status-online" />
                </div>
              </div>
            </div>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="glass-card p-8 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-2xl group-hover:from-primary-500/30 group-hover:to-primary-600/30 transition-all duration-300">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center text-xs font-medium text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
                    +12% ↗
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-luxury-600 uppercase tracking-wide">Premium Subscribers</p>
                <p className="text-3xl font-bold text-luxury-900 mb-1">{stats.subscribers.toLocaleString()}</p>
                <p className="text-sm text-luxury-500">+342 this month</p>
              </div>
            </div>

            <div className="glass-card p-8 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-2xl group-hover:from-accent-500/30 group-hover:to-accent-600/30 transition-all duration-300">
                  <DollarSign className="h-8 w-8 text-accent-600" />
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center text-xs font-medium text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
                    +8% ↗
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-luxury-600 uppercase tracking-wide">Monthly Revenue</p>
                <p className="text-3xl font-bold text-luxury-900 mb-1">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-luxury-500">+$362 vs last month</p>
              </div>
            </div>

            <div className="glass-card p-8 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 rounded-2xl group-hover:from-secondary-500/30 group-hover:to-secondary-600/30 transition-all duration-300">
                  <Eye className="h-8 w-8 text-secondary-600" />
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center text-xs font-medium text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
                    +5% ↗
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-luxury-600 uppercase tracking-wide">Total Views</p>
                <p className="text-3xl font-bold text-luxury-900 mb-1">{stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-luxury-500">+2.1k this week</p>
              </div>
            </div>

            <div className="glass-card p-8 hover-lift group relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl group-hover:from-amber-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                  <MessageCircle className="h-8 w-8 text-orange-600" />
                </div>
                {stats.newMessages > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                    {stats.newMessages}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-luxury-600 uppercase tracking-wide">New Messages</p>
                <p className="text-3xl font-bold text-luxury-900 mb-1">{stats.newMessages}</p>
                <p className="text-sm text-luxury-500">Respond to premium fans</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart & Recent Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Premium Revenue Chart */}
              <div className="card-premium p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-luxury-900 mb-2">Revenue Overview</h3>
                    <p className="text-luxury-600">Track your premium content earnings</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select className="input-luxury text-sm py-2 px-4">
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last 12 months</option>
                    </select>
                  </div>
                </div>

                {/* Enhanced chart placeholder */}
                <div className="relative h-80 bg-gradient-to-br from-primary-50/50 via-secondary-50/30 to-accent-50/20 rounded-2xl border border-luxury-200/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm" />
                  <div className="relative h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="p-6 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl mb-6">
                        <BarChart3 className="h-20 w-20 text-primary-500 mx-auto" />
                      </div>
                      <h4 className="text-xl font-bold text-luxury-900 mb-2">Premium Analytics Coming Soon</h4>
                      <p className="text-luxury-600 mb-4">Advanced revenue tracking and insights</p>
                      <div className="flex justify-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-primary-500 rounded-full mr-2" />
                          <span className="text-luxury-600">Subscription Revenue</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2" />
                          <span className="text-luxury-600">Tips & Donations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Content Performance */}
              <div className="card-premium p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-luxury-900 mb-2">Recent Content Performance</h3>
                    <p className="text-luxury-600">Your latest premium content analytics</p>
                  </div>
                  <Link href="/creator-dashboard/analytics" className="btn-ghost text-sm">
                    View All Analytics
                  </Link>
                </div>

                <div className="space-y-4">
                  {mockRecentContent.map((content, index) => (
                    <div key={content.id} className="glass-card p-6 hover-lift group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className={`w-4 h-4 rounded-full ${
                              content.type === 'video' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                              content.type === 'photo' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                              'bg-gradient-to-r from-red-500 to-rose-600'
                            } shadow-lg`} />
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-luxury-900 group-hover:text-primary-600 transition-colors">
                              {content.title}
                            </h4>
                            <div className="flex items-center space-x-3 text-sm text-luxury-500">
                              <span>{content.publishedAt}</span>
                              <span>•</span>
                              <span className="capitalize font-medium">{content.type}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-8 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-luxury-900">{content.views.toLocaleString()}</p>
                            <p className="text-luxury-500 text-xs uppercase tracking-wide">Views</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 text-rose-500 mr-1" />
                              <span className="font-bold text-luxury-900">{content.likes}</span>
                            </div>
                            <p className="text-luxury-500 text-xs uppercase tracking-wide">Likes</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-accent-600">${content.revenue}</p>
                            <p className="text-luxury-500 text-xs uppercase tracking-wide">Revenue</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link href="/creator-dashboard/upload" className="btn-primary">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Content
                  </Link>
                </div>
              </div>
            </div>

            {/* Premium Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="card-premium p-8">
                <h3 className="text-xl font-bold text-luxury-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Link href="/creator-dashboard/upload" className="block w-full btn-primary text-center group">
                    <Upload className="h-5 w-5 inline mr-2 group-hover:scale-110 transition-transform" />
                    Upload Premium Content
                  </Link>
                  <Link href="/creator-dashboard/live" className="block w-full btn-secondary text-center group">
                    <Calendar className="h-5 w-5 inline mr-2 group-hover:scale-110 transition-transform" />
                    Go Live
                  </Link>
                  <Link href="/creator-dashboard/messages" className="block w-full btn-secondary text-center group relative">
                    <MessageCircle className="h-5 w-5 inline mr-2 group-hover:scale-110 transition-transform" />
                    Messages
                    {stats.newMessages > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {stats.newMessages}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Premium Supporters */}
              <div className="card-premium p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-luxury-900">Top Supporters</h3>
                  <div className="status-premium text-xs">
                    VIP Tier
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Premium Fan #1', avatar: 'from-primary-400 to-primary-600', amount: 285.60, tier: 'Diamond VIP' },
                    { name: 'Elite Subscriber', avatar: 'from-secondary-400 to-secondary-600', amount: 198.40, tier: 'Gold VIP' },
                    { name: 'Luxury Fan #3', avatar: 'from-accent-400 to-accent-600', amount: 157.80, tier: 'Silver VIP' },
                    { name: 'Premium Member', avatar: 'from-pink-400 to-rose-600', amount: 142.20, tier: 'Premium' }
                  ].map((fan, index) => (
                    <div key={index} className="glass-card p-4 hover-lift group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className={`w-10 h-10 bg-gradient-to-br ${fan.avatar} rounded-full shadow-lg`} />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Crown className="w-2 h-2 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-luxury-900 text-sm">{fan.name}</p>
                            <p className="text-xs text-luxury-500 font-medium">{fan.tier}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-accent-600">${fan.amount}</p>
                          <p className="text-xs text-luxury-500">this month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/creator-dashboard/messages" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View All Supporters →
                  </Link>
                </div>
              </div>

              {/* Premium Content Stats */}
              <div className="card-premium p-8">
                <h3 className="text-xl font-bold text-luxury-900 mb-6">Content Analytics</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-600 font-medium">Total Premium Posts</span>
                    <div className="flex items-center">
                      <span className="metric-value text-2xl mr-2">{stats.contentCount}</span>
                      <div className="w-2 h-2 bg-accent-500 rounded-full" />
                    </div>
                  </div>
                  <div className="divider-luxury" />
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-600 font-medium">Average Rating</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-luxury-900 mr-2">{stats.averageRating}</span>
                      <Heart className="h-5 w-5 text-rose-500 fill-current" />
                    </div>
                  </div>
                  <div className="divider-luxury" />
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-600 font-medium">Total Engagement</span>
                    <span className="metric-value text-2xl">{stats.totalLikes.toLocaleString()}</span>
                  </div>
                  <div className="divider-luxury" />
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-600 font-medium">Response Rate</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-accent-600 mr-2">92%</span>
                      <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Payout Center */}
              <div className="card-premium p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-500/10 to-transparent rounded-full transform translate-x-16 -translate-y-16" />

                <h3 className="text-xl font-bold text-luxury-900 mb-6 relative">Premium Payout</h3>
                <div className="text-center relative">
                  <div className="mb-6">
                    <p className="text-4xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
                        ${(stats.monthlyRevenue * 0.8).toFixed(2)}
                      </span>
                    </p>
                    <p className="text-luxury-600 font-medium">
                      Available for instant withdrawal
                    </p>
                  </div>

                  <button className="w-full btn-primary mb-4 group">
                    <DollarSign className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Request Premium Payout
                  </button>

                  <div className="glass-card p-4">
                    <p className="text-sm text-luxury-600 mb-2">Next auto-payout:</p>
                    <p className="font-semibold text-primary-600">March 1st, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}