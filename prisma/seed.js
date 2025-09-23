/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Basic seed: one creator with 4 tiers and a few content items
  const user = await prisma.user.upsert({
    where: { email: 'creator@example.com' },
    update: {},
    create: {
      email: 'creator@example.com',
      fullName: 'Demo Creator',
      role: 'CREATOR',
      avatarUrl: '/avatar-demo.png'
    }
  })

  const creator = await prisma.creator.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      displayName: 'Demo Creator',
      category: 'Lifestyle',
      description: 'Premium lifestyle content and behind-the-scenes.',
      isVerified: true
    }
  })

  const tiersData = [
    { name: 'Basic', price: 9.99, tierType: 'BASIC' },
    { name: 'Premium', price: 19.99, tierType: 'PREMIUM' },
    { name: 'VIP', price: 49.99, tierType: 'VIP' },
    { name: 'Ultra', price: 99.99, tierType: 'ULTRA' }
  ]

  for (const t of tiersData) {
    await prisma.subscriptionTier.upsert({
      where: { id: `${creator.id}_${t.tierType}` }, // upsert needs unique, so we emulate via find+create
      update: {},
      create: {
        creatorId: creator.id,
        name: t.name,
        price: t.price,
        tierType: t.tierType
      }
    }).catch(async () => {
      // If upsert by id fails (no unique composite), fallback to find/create
      const existing = await prisma.subscriptionTier.findFirst({
        where: { creatorId: creator.id, tierType: t.tierType }
      })
      if (!existing) {
        await prisma.subscriptionTier.create({
          data: {
            creatorId: creator.id,
            name: t.name,
            price: t.price,
            tierType: t.tierType
          }
        })
      }
    })
  }

  // Seed a few content items
  const now = new Date()
  const contentItems = [
    { title: 'Welcome Post', contentType: 'TEXT', isFree: true, requiredTier: 'BASIC' },
    { title: 'Premium Photo Set', contentType: 'PHOTO', isFree: false, requiredTier: 'PREMIUM' },
    { title: 'VIP Behind-the-Scenes', contentType: 'VIDEO', isFree: false, requiredTier: 'VIP' },
    { title: 'Ultra Exclusive AMA', contentType: 'TEXT', isFree: false, requiredTier: 'ULTRA' }
  ]

  for (const item of contentItems) {
    await prisma.content.create({
      data: {
        creatorId: creator.id,
        title: item.title,
        contentType: item.contentType,
        isFree: item.isFree,
        requiredTier: item.requiredTier,
        publishedAt: now
      }
    })
  }

  // Create a demo subscriber
  const subscriber = await prisma.user.upsert({
    where: { email: 'subscriber@example.com' },
    update: {},
    create: {
      email: 'subscriber@example.com',
      fullName: 'Demo Subscriber',
      role: 'SUBSCRIBER'
    }
  })

  // No active subscription by default; tests can add as needed

  console.log('Seed completed:', { creator: creator.displayName, subscriber: subscriber.email })
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    prisma.$disconnect()
  })
