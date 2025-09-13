import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
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
  Plus
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

    const fetchCreatorData = async () => {
      try {
        // Get creator profile
        const { data: creatorData, error: creatorError } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (creatorError || !creatorData) {
          // User is not a creator, redirect to become creator page
          router.push('/auth/register?creator=true')
          return
        }

        setCreator(creatorData)

        // Fetch stats
        const [
          { count: subscriberCount },
          { count: contentCount },
          { data: contentData }
        ] = await Promise.all([
          supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', creatorData.id)
            .eq('status', 'active'),
          supabase
            .from('content')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', creatorData.id),
          supabase
            .from('content')
            .select('*')
            .eq('creator_id', creatorData.id)
            .order('created_at', { ascending: false })
            .limit(5)
        ])

        // Calculate total views and likes
        const totalViews = contentData?.reduce((sum, content) => sum + (content.view_count || 0), 0) || 0
        const totalLikes = contentData?.reduce((sum, content) => sum + (content.like_count || 0), 0) || 0

        setStats({
          subscribers: subscriberCount || 0,
          monthlyRevenue: creatorData.total_earnings || 0, // This would be calculated from subscriptions
          totalRevenue: creatorData.total_earnings || 0,
          newMessages: 0, // TODO: Implement message count
          totalViews,
          totalLikes,
          contentCount: contentCount || 0,
          averageRating: 4.8 // TODO: Calculate from reviews
        })

        setRecentContent(contentData || [])
      } catch (error) {
        console.error('Error fetching creator data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCreatorData()
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
      
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar userType="creator" />
        
        <main className="flex-1 p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Creator Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here&apos;s how your content is performing
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Subscribers</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.subscribers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+8% vs last month</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-blue-600">+5% this week</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Messages</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.newMessages}</p>
                  <p className="text-xs text-gray-500">Respond to fans</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart & Recent Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Revenue Chart */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                  <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last 12 months</option>
                  </select>
                </div>
                
                {/* Simple chart placeholder */}
                <div className="h-64 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-primary-400 mx-auto mb-4" />
                    <p className="text-gray-600">Revenue chart would go here</p>
                    <p className="text-sm text-gray-500">Integration with charting library needed</p>
                  </div>
                </div>
              </div>

              {/* Recent Content Performance */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Content Performance</h3>
                
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          content.type === 'video' ? 'bg-blue-500' :
                          content.type === 'photo' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{content.title}</h4>
                          <p className="text-sm text-gray-600">{content.publishedAt}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{content.views.toLocaleString()}</p>
                          <p className="text-gray-600">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{content.likes}</p>
                          <p className="text-gray-600">Likes</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-green-600">${content.revenue}</p>
                          <p className="text-gray-600">Revenue</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/creator-dashboard/upload" className="block w-full btn-primary text-center">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload Content
                  </Link>
                  <Link href="/creator-dashboard/live" className="block w-full btn-secondary text-center">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Go Live
                  </Link>
                  <Link href="/creator-dashboard/messages" className="block w-full btn-secondary text-center">
                    <MessageCircle className="h-4 w-4 inline mr-2" />
                    Messages ({stats.newMessages})
                  </Link>
                </div>
              </div>

              {/* Top Fans */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Top Supporters</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((fan) => (
                    <div key={fan} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Fan #{fan}</p>
                          <p className="text-xs text-gray-600">VIP subscriber</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">${(Math.random() * 200 + 50).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">this month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Stats */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Content Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Posts</span>
                    <span className="font-medium">{stats.contentCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-medium flex items-center">
                      {stats.averageRating}
                      <Heart className="h-4 w-4 text-red-400 ml-1" />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Likes</span>
                    <span className="font-medium">{stats.totalLikes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                </div>
              </div>

              {/* Payout Info */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Next Payout</h3>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    ${(stats.monthlyRevenue * 0.8).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Available for withdrawal
                  </p>
                  <button className="w-full btn-primary text-sm">
                    Request Payout
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Next auto-payout: March 1st
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}