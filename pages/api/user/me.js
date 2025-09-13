import { verifySession } from 'supertokens-node/recipe/session/framework/express'
import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import { prisma } from '../../../lib/prisma'
import { initSupertokens } from '../../../lib/supertokens'

initSupertokens()

export default async function handler(req, res) {
  await superTokensNextWrapper(
    async (next) => {
      await verifySession()(req, res, async () => {
        try {
          const userId = req.session.getUserId()

          const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              creator: {
                include: {
                  subscriptions: true,
                  content: true
                }
              }
            }
          })

          if (!user) {
            return res.status(404).json({ error: 'User not found' })
          }

          res.json(user)
        } catch (error) {
          console.error('Error fetching user:', error)
          res.status(500).json({ error: 'Internal server error' })
        }
      })
    },
    req, res
  )
}