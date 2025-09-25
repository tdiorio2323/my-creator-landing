import Head from 'next/head'

export default function SeoHead({ title, description, image, canonical }) {
  const pageTitle = title ? `${title} | CreatorHub` : 'CreatorHub'
  const pageDescription = description || 'Discover and support luxury creators with premium experiences on CreatorHub.'
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
