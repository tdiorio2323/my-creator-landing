import { storageHelpers } from '../../../lib/storage'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Initializing Supabase storage buckets...')

    const results = await storageHelpers.createBuckets()

    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    console.log(`Storage initialization complete:`)
    console.log(`- Successful: ${successful.length}`)
    console.log(`- Failed: ${failed.length}`)

    if (failed.length > 0) {
      console.error('Failed buckets:', failed)
    }

    return res.status(200).json({
      success: true,
      message: 'Storage buckets initialized',
      results: {
        successful: successful.length,
        failed: failed.length,
        details: results
      }
    })
  } catch (error) {
    console.error('Storage initialization error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to initialize storage buckets',
      details: error.message
    })
  }
}