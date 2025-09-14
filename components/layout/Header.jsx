import Link from 'next/link'
import { Search, User, Bell, Menu, LogOut, Crown, Sparkles } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-luxury-200/30">
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Premium Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-luxury group-hover:scale-110 transition-transform duration-300">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-luxury-900 to-primary-700 bg-clip-text text-transparent">
                  CreatorHub
                </span>
                <span className="text-xs font-medium text-primary-600 -mt-1">Premium Platform</span>
              </div>
            </Link>
          </div>

          {/* Luxury Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/explore" className="nav-link">
              Explore
            </Link>
            <Link href="/categories" className="nav-link">
              Categories
            </Link>
            <div className="w-px h-6 bg-luxury-300 mx-4" />
            <Link href="/premium" className="nav-link text-primary-600 font-semibold">
              <Crown className="w-4 h-4 mr-1 inline" />
              Premium
            </Link>
          </nav>

          {/* Premium Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-luxury-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search premium creators..."
                className="input-luxury pl-12 pr-4 py-3 text-sm placeholder:text-luxury-400"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="flex items-center space-x-1 text-xs text-luxury-500">
                  <kbd className="px-2 py-1 bg-luxury-100 rounded text-luxury-600">⌘</kbd>
                  <kbd className="px-2 py-1 bg-luxury-100 rounded text-luxury-600">K</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Premium User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Premium Notifications */}
                <button className="btn-icon relative group">
                  <Bell className="h-5 w-5 text-luxury-600 group-hover:text-primary-600 transition-colors" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                </button>

                {/* Premium User Menu */}
                <div className="relative">
                  <Link href="/dashboard" className="flex items-center space-x-3 btn-icon group">
                    <div className="relative">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-luxury" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Crown className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <div className="hidden xl:block">
                      <p className="text-sm font-semibold text-luxury-900 group-hover:text-primary-600 transition-colors">
                        {user.user_metadata?.full_name || 'Premium User'}
                      </p>
                      <p className="text-xs text-luxury-500">Elite Creator</p>
                    </div>
                  </Link>
                </div>

                {/* Premium Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="btn-icon group"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5 text-luxury-600 group-hover:text-red-600 transition-colors" />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary">
                  Sign In
                </Link>

                <Link href="/auth/register" className="btn-primary group">
                  <span>Join Premium</span>
                  <Sparkles className="w-4 h-4 ml-2 group-hover:animate-spin" />
                </Link>
              </>
            )}

            {/* Premium Mobile Menu */}
            <button className="lg:hidden btn-icon">
              <Menu className="h-5 w-5 text-luxury-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}