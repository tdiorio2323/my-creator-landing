import { prisma } from '../../../lib/prisma'
import { getSessionUserId } from '../../../lib/supertokens'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const userId = await getSessionUserId(req)
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { recipientId, content } = req.body

    if (!recipientId || !content?.trim()) {
      return res.status(400).json({ error: 'Recipient ID and content required' })
    }

    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true }
    })

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: userId,
        recipientId: recipientId,
        content: content.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    })

    return res.status(201).json({ message })

  } catch (error) {
    console.error('Error sending message:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}