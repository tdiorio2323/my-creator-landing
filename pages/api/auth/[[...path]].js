import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import { middleware } from 'supertokens-node/framework/express'
import { initSupertokens } from '../../../lib/supertokens'

initSupertokens()

export default async function superTokens(req, res) {
  await superTokensNextWrapper(
    async (next) => {
      await middleware()(req, res, next)
    },
    req, res
  )
}

export const config = {
  api: {
    bodyParser: false,
  },
}