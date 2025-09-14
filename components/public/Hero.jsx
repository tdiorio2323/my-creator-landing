import Link from 'next/link'
import { Play, Star, Users, Sparkles, TrendingUp, Crown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Luxurious Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 via-luxury-50 to-secondary-100/30" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-400/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-br from-secondary-400/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-accent-400/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Glassmorphism Overlay Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(157, 102, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="section-container relative z-10">
        <div className="text-center animate-fade-in">
          {/* Premium Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md border border-primary-200/30 rounded-full text-primary-700 font-medium mb-8 animate-slide-down">
            <Crown className="w-4 h-4 mr-2" />
            Premium Creator Platform
            <Sparkles className="w-4 h-4 ml-2" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 animate-slide-up">
            <span className="bg-gradient-to-r from-luxury-900 via-primary-700 to-luxury-900 bg-clip-text text-transparent leading-tight">
              Connect with Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Favorite Creators
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-luxury-700 mb-12 max-w-3xl mx-auto font-medium leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover exclusive content, support creators directly, and join an
            <span className="text-primary-600 font-semibold"> elite community </span>
            of fans who share your passions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/explore" className="btn-primary text-xl px-10 py-4 group">
              <span className="flex items-center">
                Explore Creators
                <Sparkles className="ml-2 w-5 h-5 group-hover:animate-spin" />
              </span>
            </Link>
            <Link href="/auth/register?creator=true" className="btn-secondary text-xl px-10 py-4 group">
              <span className="flex items-center">
                Become a Creator
                <TrendingUp className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Luxury Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {[
              { value: '10k+', label: 'Elite Creators', icon: Crown },
              { value: '1M+', label: 'Premium Subscribers', icon: Users },
              { value: '$2M+', label: 'Creator Earnings', icon: TrendingUp }
            ].map((stat, index) => (
              <div key={stat.label} className="glass-card p-8 hover-lift group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl">
                    <stat.icon className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
                  </div>
                </div>
                <div className="metric-value mb-2">{stat.value}</div>
                <div className="metric-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Featured Content */}
        <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-luxury-900 mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Featured Premium Content
              </span>
            </h2>
            <p className="text-lg text-luxury-600 max-w-2xl mx-auto">
              Experience the highest quality content from our most exclusive creators
            </p>
          </div>

          <div className="content-grid max-w-6xl mx-auto">
            {[
              { title: 'Elite Fitness Training', type: 'Exclusive Series', creator: 'Sarah Mitchell', rating: 4.9, subscribers: '15.2k' },
              { title: 'Culinary Masterclass', type: 'Premium Course', creator: 'Chef Antonio', rating: 4.8, subscribers: '12.8k' },
              { title: 'Art & Design Studio', type: 'Live Sessions', creator: 'Maya Chen', rating: 5.0, subscribers: '18.5k' }
            ].map((content, index) => (
              <div key={index} className="creator-card group animate-scale-in" style={{ animationDelay: `${1 + index * 0.2}s` }}>
                <div className="relative aspect-video bg-gradient-to-br from-primary-400/20 via-secondary-400/20 to-accent-400/20 overflow-hidden">
                  {/* Premium overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-secondary-600/10" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-6 bg-white/20 backdrop-blur-md rounded-full border border-white/30 group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-12 w-12 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="status-premium">
                      <Crown className="w-3 h-3 mr-1 inline" />
                      Premium
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full font-medium">
                      {content.type}
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-white/95 to-white/85">
                  <h3 className="font-bold text-lg text-luxury-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {content.title}
                  </h3>
                  <p className="text-luxury-600 text-sm mb-4 font-medium">by {content.creator}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        <span className="font-semibold">{content.rating}</span>
                      </div>
                      <div className="flex items-center text-luxury-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{content.subscribers}</span>
                      </div>
                    </div>
                    <div className="status-online" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}