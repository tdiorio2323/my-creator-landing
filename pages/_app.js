import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../contexts/AuthContext'
import DefaultLayout from '../components/layout/DefaultLayout'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <main className={inter.className}>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </main>
    </AuthProvider>
  )
}
