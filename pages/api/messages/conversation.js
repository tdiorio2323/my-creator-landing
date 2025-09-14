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

    const { recipientId } = req.query

    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient ID required' })
    }

    // Fetch messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            recipientId: recipientId
          },
          {
            senderId: recipientId,
            recipientId: userId
          }
        ]
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
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Mark unread messages from recipient as read
    await prisma.message.updateMany({
      where: {
        senderId: recipientId,
        recipientId: userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return res.status(200).json({ messages })

  } catch (error) {
    console.error('Error fetching conversation:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}