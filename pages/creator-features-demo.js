import { useState } from 'react'
import Head from 'next/head'
import {
  VideoIcon,
  MessageCircle,
  DollarSign,
  Users,
  BarChart3,
  Upload,
  Settings,
  Calendar,
  Gift,
  Camera,
  Mic,
  Share2,
  Bell,
  Shield,
  CreditCard,
  FileText,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Phone,
  Mail,
  Globe,
  Lock,
  Play,
  Image as ImageIcon,
  Headphones,
  Radio,
  Monitor
} from 'lucide-react'

const CreatorFeaturesDemo = () => {
  const [activeFeature, setActiveFeature] = useState('overview')

  const features = {
    overview: {
      title: 'Creator Dashboard Overview',
      description: 'Complete control center for managing your creator business',
      icon: BarChart3,
      color: 'from-blue-500 to-purple-600'
    },
    messaging: {
      title: 'Direct Messaging & Chat',
      description: 'Connect with your subscribers through private messages',
      icon: MessageCircle,
      color: 'from-green-500 to-blue-500',
      subFeatures: [
        'Private 1-on-1 messaging',
        'Group chat management',
        'Message scheduling',
        'Auto-responders',
        'Media sharing (photos/videos)',
        'Voice messages',
        'Message encryption',
        'Subscriber tiers access control'
      ]
    },
    videoCalls: {
      title: 'Video Calls & Live Sessions',
      description: 'Host premium video calls and live streaming sessions',
      icon: VideoIcon,
      color: 'from-red-500 to-pink-500',
      subFeatures: [
        '1-on-1 premium video calls',
        'Group video sessions',
        'Live streaming to all subscribers',
        'Screen sharing capabilities',
        'Session recording',
        'Scheduling & calendar integration',
        'Payment per session',
        'VIP subscriber exclusive calls'
      ]
    },
    contentCreation: {
      title: 'Content Creation Studio',
      description: 'Professional tools for creating and managing content',
      icon: Upload,
      color: 'from-purple-500 to-indigo-600',
      subFeatures: [
        'Photo & video uploads',
        'Built-in editor tools',
        'Content scheduling',
        'Batch uploads',
        'Multiple format support',
        'Auto-compression',
        'Watermark protection',
        'Content organization'
      ]
    },
    analytics: {
      title: 'Advanced Analytics',
      description: 'Deep insights into your performance and earnings',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      subFeatures: [
        'Revenue tracking & forecasting',
        'Subscriber growth analytics',
        'Content performance metrics',
        'Engagement rate analysis',
        'Geographic insights',
        'Traffic source analysis',
        'Conversion rate tracking',
        'Custom report generation'
      ]
    },
    monetization: {
      title: 'Monetization Tools',
      description: 'Multiple revenue streams and payment options',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      subFeatures: [
        'Subscription tier management',
        'Pay-per-view content',
        'Tips & donations',
        'Custom pricing',
        'Bulk discounts',
        'Limited-time offers',
        'Affiliate programs',
        'Merchandise integration'
      ]
    },
    liveStreaming: {
      title: 'Live Streaming',
      description: 'Professional live streaming with interactive features',
      icon: Radio,
      color: 'from-pink-500 to-rose-500',
      subFeatures: [
        'HD live streaming',
        'Multi-platform broadcasting',
        'Real-time chat integration',
        'Super chat donations',
        'Subscriber-only streams',
        'Stream recording',
        'Interactive polls',
        'Guest appearances'
      ]
    },
    subscriberManagement: {
      title: 'Subscriber Management',
      description: 'Comprehensive tools to manage your audience',
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
      subFeatures: [
        'Subscriber database',
        'Tier-based access control',
        'Mass messaging tools',
        'Subscriber insights',
        'Retention analytics',
        'Churn prevention',
        'VIP member management',
        'Feedback collection'
      ]
    },
    customization: {
      title: 'Profile Customization',
      description: 'Brand your profile and create unique experiences',
      icon: Settings,
      color: 'from-violet-500 to-purple-600',
      subFeatures: [
        'Custom profile themes',
        'Branded pages',
        'Logo & banner uploads',
        'Color scheme customization',
        'Bio & description editing',
        'Social media integration',
        'Custom URLs',
        'Portfolio showcase'
      ]
    }
  }

  const currentFeature = features[activeFeature]
  const FeatureIcon = currentFeature.icon

  return (
    <>
      <Head>
        <title>Creator Features - Everything You Can Do | CreatorHub</title>
        <meta name="description" content="Explore all the powerful features available to creators on CreatorHub - video calls, messaging, analytics, monetization tools and more." />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/20" />

          {/* Animated background elements */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
                Creator Superpowers
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8">
                Unlock the complete suite of professional creator tools designed to grow your audience,
                maximize your earnings, and build your brand.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-white font-medium">
                  💰 Multiple Revenue Streams
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-white font-medium">
                  📊 Advanced Analytics
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-white font-medium">
                  🎥 Professional Tools
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Navigation */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-4 space-x-4">
              {Object.entries(features).map(([key, feature]) => {
                const Icon = feature.icon
                return (
                  <button
                    key={key}
                    onClick={() => setActiveFeature(key)}
                    className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeFeature === key
                        ? 'bg-gradient-to-r ' + feature.color + ' text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="whitespace-nowrap">{feature.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Description */}
            <div className="space-y-8">
              <div>
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${currentFeature.color} mb-6`}>
                  <FeatureIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  {currentFeature.title}
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {currentFeature.description}
                </p>
              </div>

              {currentFeature.subFeatures && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">Key Features:</h3>
                  <div className="grid gap-3">
                    {currentFeature.subFeatures.map((subFeature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentFeature.color}`} />
                        <span className="text-gray-200">{subFeature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button className={`px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r ${currentFeature.color} hover:scale-105 transform transition-all duration-300 shadow-lg`}>
                  Try This Feature
                </button>
                <button className="px-8 py-3 rounded-lg font-semibold text-gray-300 border border-gray-600 hover:bg-gray-800 transition-colors">
                  Learn More
                </button>
              </div>
            </div>

            {/* Feature Preview */}
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                <FeaturePreview activeFeature={activeFeature} />
              </div>

              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
                <div className="text-2xl font-bold">$12,450</div>
                <div className="text-sm opacity-90">This Month</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                <div className="text-2xl font-bold">2,847</div>
                <div className="text-sm opacity-90">Active Subs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Creator Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of creators who are already building their empire with CreatorHub's professional tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Start Creating Now - Free
              </button>
              <button className="px-10 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300">
                View Pricing Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Feature Preview Component
const FeaturePreview = ({ activeFeature }) => {
  const previews = {
    overview: <DashboardPreview />,
    messaging: <MessagingPreview />,
    videoCalls: <VideoCallPreview />,
    contentCreation: <ContentStudioPreview />,
    analytics: <AnalyticsPreview />,
    monetization: <MonetizationPreview />,
    liveStreaming: <LiveStreamPreview />,
    subscriberManagement: <SubscriberPreview />,
    customization: <CustomizationPreview />
  }

  return previews[activeFeature] || <DashboardPreview />
}

const DashboardPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">Creator Dashboard</h3>
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-red-500" />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-blue-500/20">
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign className="h-5 w-5 text-green-400" />
          <span className="text-green-400 font-medium">Revenue</span>
        </div>
        <div className="text-2xl font-bold text-white">$12,450</div>
        <div className="text-sm text-gray-400">+25% from last month</div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/20">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-5 w-5 text-purple-400" />
          <span className="text-purple-400 font-medium">Subscribers</span>
        </div>
        <div className="text-2xl font-bold text-white">2,847</div>
        <div className="text-sm text-gray-400">+156 this week</div>
      </div>
    </div>

    <div className="h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 flex items-center justify-center">
      <BarChart3 className="h-12 w-12 text-blue-400" />
    </div>
  </div>
)

const MessagingPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">Direct Messages</h3>
      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">3 new</div>
    </div>

    <div className="space-y-3">
      {['Sarah M.', 'Mike_fan23', 'Emily Rose'].map((name, i) => (
        <div key={name} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {name[0]}
          </div>
          <div className="flex-1">
            <div className="font-medium text-white">{name}</div>
            <div className="text-sm text-gray-400">Thanks for the amazing content! ❤️</div>
          </div>
          <div className="text-xs text-gray-500">2m</div>
        </div>
      ))}
    </div>

    <div className="flex space-x-2">
      <input
        placeholder="Type a message..."
        className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 placeholder-gray-400"
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  </div>
)

const VideoCallPreview = () => (
  <div className="space-y-4">
    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/20 flex items-center justify-center relative overflow-hidden">
      <VideoIcon className="h-16 w-16 text-purple-400" />

      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span>LIVE</span>
      </div>

      <div className="absolute bottom-4 right-4 space-x-2">
        <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">
          <Mic className="h-4 w-4" />
        </button>
        <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">
          <Camera className="h-4 w-4" />
        </button>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <div className="text-white font-medium">Premium 1-on-1 Session</div>
        <div className="text-sm text-gray-400">with VIP Subscriber</div>
      </div>
      <div className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
        $50 earned
      </div>
    </div>
  </div>
)

const ContentStudioPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">Content Studio</h3>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
        + Upload
      </button>
    </div>

    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-square bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center relative group cursor-pointer">
          <ImageIcon className="h-8 w-8 text-gray-400" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="h-6 w-6 text-white" />
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-between text-sm text-gray-400">
      <span>147 posts this month</span>
      <span>2.3M total views</span>
    </div>
  </div>
)

const AnalyticsPreview = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-white">Analytics Overview</h3>

    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-lg">
        <div className="text-2xl font-bold text-green-400">94%</div>
        <div className="text-sm text-gray-400">Retention Rate</div>
      </div>
      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-lg">
        <div className="text-2xl font-bold text-blue-400">4.8k</div>
        <div className="text-sm text-gray-400">Avg. Views</div>
      </div>
    </div>

    <div className="h-24 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20 flex items-end justify-around px-4 py-2">
      {[40, 65, 45, 80, 92, 75, 88].map((height, i) => (
        <div
          key={i}
          className="bg-gradient-to-t from-blue-500 to-purple-500 w-4 rounded-t"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  </div>
)

const MonetizationPreview = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-white">Revenue Streams</h3>

    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5 text-blue-400" />
          <span className="text-white">Subscriptions</span>
        </div>
        <span className="text-green-400 font-semibold">$8,240</span>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
          <VideoIcon className="h-5 w-5 text-purple-400" />
          <span className="text-white">Video Calls</span>
        </div>
        <span className="text-green-400 font-semibold">$2,150</span>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
          <Gift className="h-5 w-5 text-pink-400" />
          <span className="text-white">Tips & Donations</span>
        </div>
        <span className="text-green-400 font-semibold">$1,060</span>
      </div>
    </div>

    <div className="text-center pt-2 border-t border-gray-600">
      <div className="text-2xl font-bold text-green-400">$11,450</div>
      <div className="text-sm text-gray-400">Total This Month</div>
    </div>
  </div>
)

const LiveStreamPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">Live Stream</h3>
      <div className="flex items-center space-x-2 text-red-400">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">LIVE</span>
      </div>
    </div>

    <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg p-6 border border-red-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Radio className="h-6 w-6 text-red-400" />
          <span className="text-white font-medium">Premium Live Session</span>
        </div>
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          1.2k watching
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Heart className="h-4 w-4 text-pink-400" />
          <span className="text-gray-300">Sarah sent $5 tip</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-gray-300">Mike became VIP subscriber!</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-lg font-bold text-white">$180</div>
        <div className="text-sm text-gray-400">earned this session</div>
      </div>
    </div>
  </div>
)

const SubscriberPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">Subscriber Management</h3>
      <div className="text-sm text-gray-400">2,847 total</div>
    </div>

    <div className="grid grid-cols-3 gap-3 text-center">
      <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/20">
        <div className="text-lg font-bold text-blue-400">1,240</div>
        <div className="text-xs text-gray-400">Basic</div>
      </div>
      <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-500/20">
        <div className="text-lg font-bold text-purple-400">1,456</div>
        <div className="text-xs text-gray-400">Premium</div>
      </div>
      <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/20">
        <div className="text-lg font-bold text-yellow-400">151</div>
        <div className="text-xs text-gray-400">VIP</div>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Retention Rate</span>
        <span className="text-green-400 font-semibold">94%</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Avg. Lifetime Value</span>
        <span className="text-green-400 font-semibold">$340</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Churn Rate</span>
        <span className="text-red-400 font-semibold">2.1%</span>
      </div>
    </div>
  </div>
)

const CustomizationPreview = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-white">Profile Customization</h3>

    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/20">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          VR
        </div>
        <div>
          <div className="text-lg font-bold text-white">V Rod</div>
          <div className="text-sm text-purple-400">@vrod • Music Artist</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-700 p-2 rounded text-center">
          <div className="text-white font-medium">Custom Theme</div>
          <div className="text-gray-400">Purple Gradient</div>
        </div>
        <div className="bg-gray-700 p-2 rounded text-center">
          <div className="text-white font-medium">Custom URL</div>
          <div className="text-gray-400">vrod.creator.hub</div>
        </div>
      </div>
    </div>

    <div className="flex space-x-2">
      <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm">
        Edit Profile
      </button>
      <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm">
        Preview
      </button>
    </div>
  </div>
)

export default CreatorFeaturesDemo