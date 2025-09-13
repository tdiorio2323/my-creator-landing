import { useState } from 'react'
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Eye, Heart, 
  MessageCircle, Calendar, Download, Filter, Share, Star,
  BarChart3, PieChart, Activity, Target, Gift, Clock,
  ArrowUp, ArrowDown, Globe, Smartphone, Monitor, Crown
} from 'lucide-react'

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [activeMetric, setActiveMetric] = useState('revenue')

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 15247.50,
      revenueChange: 12.3,
      subscribers: 2847,
      subscribersChange: 5.7,
      totalViews: 89420,
      viewsChange: -2.1,
      engagement: 94.2,
      engagementChange: 8.9
    },
    revenue: {
      subscriptions: 12450.00,
      tips: 2145.50,
      payPerView: 652.00,
      merchandise: 0,
      breakdown: [
        { tier: 'VIP', revenue: 8250.00, subscribers: 165, avgPerUser: 50.00 },
        { tier: 'Premium', revenue: 3150.00, subscribers: 315, avgPerUser: 10.00 },
        { tier: 'Basic', revenue: 1050.00, subscribers: 420, avgPerUser: 2.50 }
      ]
    },
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 25, count: 712 },
        { range: '25-34', percentage: 45, count: 1281 },
        { range: '35-44', percentage: 20, count: 569 },
        { range: '45+', percentage: 10, count: 285 }
      ],
      genders: [
        { type: 'Male', percentage: 65, count: 1850 },
        { type: 'Female', percentage: 32, count: 911 },
        { type: 'Other', percentage: 3, count: 86 }
      ],
      locations: [
        { country: 'United States', percentage: 45, flag: '🇺🇸' },
        { country: 'Canada', percentage: 15, flag: '🇨🇦' },
        { country: 'United Kingdom', percentage: 12, flag: '🇬🇧' },
        { country: 'Australia', percentage: 8, flag: '🇦🇺' },
        { country: 'Germany', percentage: 6, flag: '🇩🇪' },
        { country: 'Others', percentage: 14, flag: '🌍' }
      ]
    },
    content: {
      topPerforming: [
        { 
          id: 1, 
          title: 'Morning Workout Routine', 
          type: 'video', 
          views: 5420, 
          likes: 890, 
          revenue: 245.50,
          engagement: 16.4 
        },
        { 
          id: 2, 
          title: 'Healthy Breakfast Ideas', 
          type: 'photo', 
          views: 3280, 
          likes: 654, 
          revenue: 156.80,
          engagement: 19.9 
        },
        { 
          id: 3, 
          title: 'Q&A Live Session', 
          type: 'live', 
          views: 2100, 
          likes: 432, 
          revenue: 890.40,
          engagement: 20.6 
        }
      ],
      uploadSchedule: [
        { day: 'Mon', posts: 3, avgViews: 2100 },
        { day: 'Tue', posts: 2, avgViews: 1800 },
        { day: 'Wed', posts: 4, avgViews: 2500 },
        { day: 'Thu', posts: 2, avgViews: 1900 },
        { day: 'Fri', posts: 5, avgViews: 3200 },
        { day: 'Sat', posts: 3, avgViews: 2800 },
        { day: 'Sun', posts: 4, avgViews: 3100 }
      ]
    },
    engagement: {
      daily: [
        { date: '2024-01-01', views: 1200, likes: 180, comments: 45, shares: 12 },
        { date: '2024-01-02', views: 1450, likes: 220, comments: 62, shares: 18 },
        { date: '2024-01-03', views: 1100, likes: 165, comments: 38, shares: 9 },
        { date: '2024-01-04', views: 1800, likes: 290, comments: 75, shares: 25 },
        { date: '2024-01-05', views: 2100, likes: 340, comments: 89, shares: 32 },
        { date: '2024-01-06', views: 1900, likes: 310, comments: 71, shares: 28 },
        { date: '2024-01-07', views: 2300, likes: 380, comments: 95, shares: 38 }
      ],
      devices: [
        { type: 'Mobile', percentage: 68, icon: Smartphone },
        { type: 'Desktop', percentage: 27, icon: Monitor },
        { type: 'Tablet', percentage: 5, icon: Monitor }
      ]
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, trend, isCurrency = false, subtitle }) => (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
          {trend === 'up' && <ArrowUp className="h-4 w-4" />}
          {trend === 'down' && <ArrowDown className="h-4 w-4" />}
          <span>{change}%</span>
        </div>
      </div>
      <div>
        <h3 className="text-white/60 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">
          {isCurrency && '$'}{typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-white/60">Track your performance and optimize your content strategy</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            
            <button className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all">
              <Download className="h-5 w-5 text-white" />
            </button>
            
            <button className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all">
              <Share className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={analyticsData.overview.totalRevenue}
            change={analyticsData.overview.revenueChange}
            icon={DollarSign}
            trend="up"
            isCurrency
            subtitle="This month"
          />
          <StatCard
            title="Subscribers"
            value={analyticsData.overview.subscribers}
            change={analyticsData.overview.subscribersChange}
            icon={Users}
            trend="up"
            subtitle="Active subscribers"
          />
          <StatCard
            title="Total Views"
            value={analyticsData.overview.totalViews}
            change={analyticsData.overview.viewsChange}
            icon={Eye}
            trend="down"
            subtitle="All content"
          />
          <StatCard
            title="Engagement Rate"
            value={`${analyticsData.overview.engagement}%`}
            change={analyticsData.overview.engagementChange}
            icon={Heart}
            trend="up"
            subtitle="Avg engagement"
          />
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue Sources */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Revenue Sources</h3>
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <PieChart className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="text-white font-medium">Subscriptions</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${analyticsData.revenue.subscriptions.toLocaleString()}</p>
                  <p className="text-white/60 text-sm">81.7%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full" />
                  <span className="text-white font-medium">Tips</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${analyticsData.revenue.tips.toLocaleString()}</p>
                  <p className="text-white/60 text-sm">14.1%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full" />
                  <span className="text-white font-medium">Pay-per-view</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${analyticsData.revenue.payPerView.toLocaleString()}</p>
                  <p className="text-white/60 text-sm">4.2%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Tiers Performance */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Tier Performance</h3>
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              {analyticsData.revenue.breakdown.map((tier) => (
                <div key={tier.tier} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {tier.tier === 'VIP' && <Crown className="h-4 w-4 text-yellow-400" />}
                      {tier.tier === 'Premium' && <Star className="h-4 w-4 text-purple-400" />}
                      <span className="text-white font-medium">{tier.tier}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-sm">${tier.revenue.toLocaleString()}</p>
                      <p className="text-white/60 text-xs">{tier.subscribers} subs</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        tier.tier === 'VIP' ? 'bg-yellow-400' : 
                        tier.tier === 'Premium' ? 'bg-purple-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${(tier.revenue / analyticsData.revenue.subscriptions) * 100}%` }}
                    />
                  </div>
                  <p className="text-white/40 text-xs">Avg: ${tier.avgPerUser}/user</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Performing Content</h3>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm hover:bg-white/20 transition-all">
                All Time
              </button>
              <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all">
                <Filter className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Content</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Views</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Engagement</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.content.topPerforming.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-pink-400 rounded-lg" />
                        <span className="text-white font-medium">{item.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'video' ? 'bg-blue-500/30 text-blue-200' :
                        item.type === 'photo' ? 'bg-green-500/30 text-green-200' :
                        'bg-red-500/30 text-red-200'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white">{item.views.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{item.engagement}%</span>
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-white/60 text-sm">{item.likes}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-green-400 font-medium">${item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demographics & Audience Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Age Demographics */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Age Groups</h3>
            <div className="space-y-3">
              {analyticsData.demographics.ageGroups.map((group) => (
                <div key={group.range} className="flex items-center justify-between">
                  <span className="text-white/80">{group.range}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-primary-400 h-2 rounded-full"
                        style={{ width: `${group.percentage}%` }}
                      />
                    </div>
                    <span className="text-white text-sm w-8">{group.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Top Locations</h3>
            <div className="space-y-3">
              {analyticsData.demographics.locations.map((location) => (
                <div key={location.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{location.flag}</span>
                    <span className="text-white/80">{location.country}</span>
                  </div>
                  <span className="text-white text-sm">{location.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Usage */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Device Usage</h3>
            <div className="space-y-4">
              {analyticsData.engagement.devices.map((device) => {
                const Icon = device.icon
                return (
                  <div key={device.type} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-white/60" />
                      <span className="text-white">{device.type}</span>
                    </div>
                    <span className="text-white font-medium">{device.percentage}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Goals & Targets */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Monthly Goals</h3>
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-white/20 rounded-full" />
                <div className="absolute inset-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">87%</span>
                </div>
              </div>
              <h4 className="text-white font-medium">Revenue Goal</h4>
              <p className="text-white/60 text-sm">$15,247 / $17,500</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-white/20 rounded-full" />
                <div className="absolute inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">94%</span>
                </div>
              </div>
              <h4 className="text-white font-medium">Subscriber Goal</h4>
              <p className="text-white/60 text-sm">2,847 / 3,000</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-white/20 rounded-full" />
                <div className="absolute inset-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">76%</span>
                </div>
              </div>
              <h4 className="text-white font-medium">Content Goal</h4>
              <p className="text-white/60 text-sm">23 / 30 posts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}