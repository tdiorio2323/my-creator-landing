import Footer from './Footer'

export default function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-luxury-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 rounded bg-white px-3 py-2 text-sm font-semibold shadow-lg"
      >
        Skip to content
      </a>
      <main id="main" role="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  )
}
