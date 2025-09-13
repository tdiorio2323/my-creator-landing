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
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Browse by Category
              </h2>
              <p className="text-lg text-gray-600">
                Find creators in your favorite niches
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                'Fitness', 'Cooking', 'Art', 'Tech', 'Music', 'Gaming',
                'Fashion', 'Travel', 'Education', 'Comedy', 'Beauty', 'Business'
              ].map((category) => (
                <div key={category} className="card p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {category[0]}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{category}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Get started in just a few simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover</h3>
                <p className="text-gray-600">
                  Browse thousands of creators and find content you love
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Subscribe</h3>
                <p className="text-gray-600">
                  Choose a subscription tier that fits your budget
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Enjoy</h3>
                <p className="text-gray-600">
                  Access exclusive content and connect with creators
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}