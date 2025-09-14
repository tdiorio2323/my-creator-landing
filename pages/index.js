import Head from 'next/head'
import Header from '../components/layout/Header'
import Hero from '../components/public/Hero'
import FeaturedCreators from '../components/public/FeaturedCreators'

export default function Home() {
  return (
    <>
      <Head>
        <title>CreatorHub - Connect with Your Favorite Creators</title>
        <meta name="description" content="Discover exclusive content, support creators directly, and join a community of fans." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main>
        <Hero />
        <FeaturedCreators />
        
        {/* Categories Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-50/50 to-primary-50/30" />

          <div className="section-container relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-luxury-900 to-primary-700 bg-clip-text text-transparent">
                  Browse by Category
                </span>
              </h2>
              <p className="text-xl text-luxury-600 max-w-2xl mx-auto">
                Find premium creators in your favorite niches and discover exclusive content
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { name: 'Fitness', emoji: '💪', gradient: 'from-red-400 to-pink-500' },
                { name: 'Cooking', emoji: '👨‍🍳', gradient: 'from-orange-400 to-yellow-500' },
                { name: 'Art', emoji: '🎨', gradient: 'from-purple-400 to-pink-500' },
                { name: 'Tech', emoji: '💻', gradient: 'from-blue-400 to-cyan-500' },
                { name: 'Music', emoji: '🎵', gradient: 'from-indigo-400 to-purple-500' },
                { name: 'Gaming', emoji: '🎮', gradient: 'from-green-400 to-blue-500' },
                { name: 'Fashion', emoji: '👗', gradient: 'from-pink-400 to-rose-500' },
                { name: 'Travel', emoji: '✈️', gradient: 'from-cyan-400 to-teal-500' },
                { name: 'Education', emoji: '📚', gradient: 'from-emerald-400 to-green-500' },
                { name: 'Comedy', emoji: '😂', gradient: 'from-yellow-400 to-orange-500' },
                { name: 'Beauty', emoji: '💄', gradient: 'from-rose-400 to-pink-500' },
                { name: 'Business', emoji: '💼', gradient: 'from-slate-400 to-gray-600' }
              ].map((category) => (
                <div key={category.name} className="glass-card p-6 text-center hover-lift cursor-pointer group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {category.emoji}
                  </div>
                  <h3 className="font-semibold text-luxury-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-luxury-500 mt-1 uppercase tracking-wide">Premium</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-primary-50/20" />

          <div className="section-container relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-luxury-900 to-primary-700 bg-clip-text text-transparent">
                  How It Works
                </span>
              </h2>
              <p className="text-xl text-luxury-600 max-w-2xl mx-auto">
                Join our premium platform in three simple steps and unlock exclusive content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting lines */}
              <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200" />

              {[
                {
                  step: 1,
                  title: 'Discover',
                  description: 'Browse thousands of premium creators and find exclusive content you love',
                  icon: '🔍',
                  gradient: 'from-primary-500 to-primary-600'
                },
                {
                  step: 2,
                  title: 'Subscribe',
                  description: 'Choose a premium subscription tier that perfectly fits your preferences',
                  icon: '💎',
                  gradient: 'from-secondary-500 to-secondary-600'
                },
                {
                  step: 3,
                  title: 'Enjoy',
                  description: 'Access exclusive content and connect directly with your favorite creators',
                  icon: '✨',
                  gradient: 'from-accent-500 to-accent-600'
                }
              ].map((item, index) => (
                <div key={item.step} className="text-center relative">
                  <div className="glass-card p-8 hover-lift group">
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-luxury group-hover:scale-110 transition-all duration-300`}>
                      {item.icon}
                    </div>

                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-luxury-900 to-luxury-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {item.step}
                    </div>

                    <h3 className="text-2xl font-bold text-luxury-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-luxury-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium CTA */}
            <div className="text-center mt-16">
              <div className="glass-card p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-luxury-900 mb-4">
                  Ready to Experience Premium Content?
                </h3>
                <p className="text-luxury-600 mb-6">
                  Join thousands of subscribers who enjoy exclusive access to the world's best creators.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/explore" className="btn-primary">
                    Start Exploring
                  </Link>
                  <Link href="/auth/register?creator=true" className="btn-secondary">
                    Become a Creator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}