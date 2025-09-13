import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import PersonalizedFeed from '../../components/subscriber/PersonalizedFeed'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Bell, TrendingUp, Users, Heart, CreditCard } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    totalSpent: 0,
    contentViewed: 0,
    favoriteCreators: 0
  })
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const fetchUserData = async () => {
      try {
        // Get user's active subscriptions
        const { data: subsData, error: subsError } = await supabase
          .from('subscriptions')
          .select(`
            *,
            creators (
              id,
              display_name,
              profiles:user_id (
                full_name,
                avatar_url
              )
            ),
            subscription_tiers (
              name,
              price
            )
          `)
          .eq('subscriber_id', user.id)
          .eq('status', 'active')

        if (subsError) {
          console.error('Error fetching subscriptions:', subsError)
        } else {
          setSubscriptions(subsData || [])
          
          // Calculate total monthly spending
          const totalSpent = subsData?.reduce((sum, sub) => sum + (sub.subscription_tiers?.price || 0), 0) || 0
          
          setStats(prev => ({
            ...prev,
            activeSubscriptions: subsData?.length || 0,
            totalSpent,
            favoriteCreators: subsData?.length || 0
          }))
        }

        // Get content views count
        const { count: viewCount } = await supabase
          .from('content_views')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        setStats(prev => ({
          ...prev,
          contentViewed: viewCount || 0
        }))

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, router])

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex bg-gray-50 min-h-screen">
          <Sidebar userType="subscriber" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard - CreatorHub</title>
        <meta name="description" content="Your personalized creator content feed" />
      </Head>

      <Header />
      
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar userType="subscriber" />
        
        <main className="flex-1 p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600">
              Here&apos;s what your favorite creators have been up to
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Content</p>
                  <p className="text-2xl font-semibold text-gray-900">24</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Liked Posts</p>
                  <p className="text-2xl font-semibold text-gray-900">156</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Bell className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Notifications</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              {/* This will be the main feed */}
            </div>
            
            <div className="space-y-6">
              {/* Live Now */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse" />
                  Live Now
                </h3>
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Creator Name {item}
                        </p>
                        <p className="text-xs text-gray-600">
                          Live Workout Session
                        </p>
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        JOIN
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Creators */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Suggested for You
                </h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          New Creator {item}
                        </p>
                        <p className="text-xs text-gray-600">
                          {Math.floor(Math.random() * 50 + 10)}k subscribers
                        </p>
                      </div>
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Summary */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  This Month
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-medium">$127.92</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content Unlocked</span>
                    <span className="font-medium">43 posts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Messages Sent</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tips Given</span>
                    <span className="font-medium">$45.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your Personalized Feed
              </h2>
              <p className="text-gray-600">
                Latest content from your subscribed creators
              </p>
            </div>
            <PersonalizedFeed />
          </div>
        </main>
      </div>
    </>
  )
}