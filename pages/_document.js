import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://*.supabase.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://*.supabase.co" />
      </Head>
      <body className="bg-gray-50 text-luxury-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
