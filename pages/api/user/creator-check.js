import { prisma } from '../../../lib/prisma'
import { getSessionUserId } from '../../../lib/supertokens'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const userId = await getSessionUserId(req)
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const creator = await prisma.creator.findUnique({
      where: {
        userId: userId
      },
      select: {
        id: true
      }
    })

    return res.status(200).json({
      isCreator: !!creator,
      creatorId: creator?.id || null
    })

  } catch (error) {
    console.error('Error checking creator status:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}