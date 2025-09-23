import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-luxury-200/30">
      <div className="section-container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-luxury-500">© {new Date().getFullYear()} CreatorHub</p>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/legal/terms" className="text-luxury-600 hover:text-primary-600">Terms</Link>
          <span className="text-luxury-300">•</span>
          <Link href="/legal/privacy" className="text-luxury-600 hover:text-primary-600">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}

