import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  Home, 
  Compass, 
  Heart, 
  Bookmark, 
  Wallet, 
  Settings, 
  Bell,
  Upload,
  BarChart3,
  MessageSquare,
  Users,
  Video
} from 'lucide-react'

export default function Sidebar({ userType = 'subscriber' }) {
  const router = useRouter()

  const subscriberLinks = [
    { href: '/dashboard', icon: Home, label: 'Home Feed' },
    { href: '/explore', icon: Compass, label: 'Explore' },
    { href: '/dashboard/subscriptions', icon: Heart, label: 'Subscriptions' },
    { href: '/dashboard/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { href: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
    { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' }
  ]

  const creatorLinks = [
    { href: '/creator-dashboard', icon: Home, label: 'Dashboard' },
    { href: '/creator-dashboard/upload', icon: Upload, label: 'Upload Content' },
    { href: '/creator-dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/creator-dashboard/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/creator-dashboard/subscribers', icon: Users, label: 'Subscribers' },
    { href: '/creator-dashboard/live', icon: Video, label: 'Go Live' },
    { href: '/creator-dashboard/settings', icon: Settings, label: 'Settings' }
  ]

  const links = userType === 'creator' ? creatorLinks : subscriberLinks

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
      <div className="p-4">
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = router.pathname === link.href
            const Icon = link.icon
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats for Subscriber */}
        {userType === 'subscriber' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Your Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Subscriptions</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-medium">$127.92</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saved Content</span>
                <span className="font-medium">24</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats for Creator */}
        {userType === 'creator' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subscribers</span>
                <span className="font-medium text-primary-600">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-medium text-green-600">$4,521</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Messages</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">
                    New content from Creator {item}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {item * 2} hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}