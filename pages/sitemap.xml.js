const STATIC_ROUTES = ['/', '/explore', '/categories', '/legal/terms', '/legal/privacy']

export async function getServerSideProps({ res }) {
  const urls = STATIC_ROUTES.map((route) => `    <url><loc>https://yourdomain.com${route}</loc></url>`).join('\n')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n  </urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.write(sitemap.trim())
  res.end()

  return { props: {} }
}

export default function SiteMap() {
  return null
}
