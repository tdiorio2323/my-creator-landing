import Link from 'next/link'
import { Search, User, Bell, Menu, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              CreatorHub
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/explore" className="text-gray-700 hover:text-primary-600 transition-colors">
              Explore
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
              Categories
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search creators..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
                  <Bell className="h-6 w-6" />
                </button>
                
                {/* User Menu */}
                <div className="relative">
                  <Link href="/dashboard" className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full" />
                    <span className="hidden md:block text-sm font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </Link>
                </div>
                
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:block text-sm">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary">
                  Sign In
                </Link>
                
                <Link href="/auth/register" className="btn-primary">
                  Join Now
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-500">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}