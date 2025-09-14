import SuperTokens from 'supertokens-node'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import Session from 'supertokens-node/recipe/session'
import { prisma } from './prisma'

export function initSupertokens() {
  SuperTokens.init({
    framework: 'express',
    supertokens: {
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
      apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
      appName: 'CreatorHub',
      apiDomain: process.env.API_DOMAIN,
      websiteDomain: process.env.WEBSITE_DOMAIN,
      apiBasePath: '/api/auth',
      websiteBasePath: '/auth'
    },
    recipeList: [
      EmailPassword.init({
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async function (input) {
                const response = await originalImplementation.signUpPOST(input)

                if (response.status === 'OK') {
                  // Create user in Prisma when SuperTokens signup succeeds
                  try {
                    await prisma.user.create({
                      data: {
                        id: response.user.id,
                        email: response.user.email,
                        role: 'SUBSCRIBER' // Default role
                      }
                    })
                    console.log('User created in database:', response.user.email)
                  } catch (error) {
                    console.error('Failed to create user in database:', error)
                    // Note: SuperTokens user still exists, manual cleanup may be needed
                  }
                }
                return response
              }
            }
          }
        }
      }),
      Session.init({
        cookieSecure: process.env.NODE_ENV === 'production',
        cookieSameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      })
    ]
  })
}

// Helper function to get user ID from session
export async function getSessionUserId(req) {
  try {
    const session = await Session.getSession(req, null)
    return session?.getUserId() || null
  } catch (error) {
    return null
  }
}