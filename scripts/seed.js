/**
 * Development seed script
 * Run with: node scripts/seed.js
 * 
 * ONLY FOR DEVELOPMENT - DO NOT RUN IN PRODUCTION
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Validate environment
if (process.env.NODE_ENV === 'production') {
  console.error('❌ Seed script cannot be run in production')
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Sample data
const sampleCreators = [
  {
    email: 'sarah@example.com',
    display_name: 'Sarah Johnson',
    category: 'Fitness & Wellness',
    description: 'Certified personal trainer and nutritionist with 8+ years of experience. I help people transform their lives through fitness, nutrition, and mindset coaching.',
    tiers: [
      { name: 'Basic Fan', tier_type: 'basic', price: 9.99 },
      { name: 'Premium Supporter', tier_type: 'premium', price: 19.99 },
      { name: 'VIP Inner Circle', tier_type: 'vip', price: 49.99 }
    ],
    content: [
      { title: 'Morning Yoga Flow', content_type: 'video', required_tier: 'basic' },
      { title: 'Healthy Breakfast Ideas', content_type: 'photo', required_tier: 'basic', is_free: true },
      { title: 'Advanced HIIT Workout', content_type: 'video', required_tier: 'premium' }
    ]
  },
  {
    email: 'mike@example.com',
    display_name: 'Mike Chen',
    category: 'Cooking & Recipes',
    description: 'Professional chef sharing exclusive recipes and cooking techniques from around the world.',
    tiers: [
      { name: 'Kitchen Basics', tier_type: 'basic', price: 12.99 },
      { name: 'Chef\'s Table', tier_type: 'premium', price: 24.99 },
      { name: 'Master Class', tier_type: 'vip', price: 59.99 }
    ],
    content: [
      { title: 'Perfect Pasta Technique', content_type: 'video', required_tier: 'basic' },
      { title: 'Knife Skills Masterclass', content_type: 'video', required_tier: 'premium' },
      { title: 'Secret Sauce Recipes', content_type: 'text', required_tier: 'vip' }
    ]
  },
  {
    email: 'emma@example.com',
    display_name: 'Emma Wilson',
    category: 'Art & Design',
    description: 'Digital artist and designer creating stunning visual content and teaching creative techniques.',
    tiers: [
      { name: 'Art Lover', tier_type: 'basic', price: 8.99 },
      { name: 'Creative Student', tier_type: 'premium', price: 18.99 },
      { name: 'Artist Community', tier_type: 'vip', price: 39.99 }
    ],
    content: [
      { title: 'Digital Art Basics', content_type: 'video', required_tier: 'basic' },
      { title: 'Color Theory Deep Dive', content_type: 'video', required_tier: 'premium' },
      { title: 'Commission Process', content_type: 'text', required_tier: 'vip' }
    ]
  }
]

async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  try {
    for (const creatorData of sampleCreators) {
      console.log(`\n👤 Creating creator: ${creatorData.display_name}`)

      // Create auth user (this would normally be done via sign up)
      // Note: This requires admin privileges in production
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: creatorData.email,
        password: 'password123',
        email_confirm: true
      })

      if (authError) {
        console.error(`❌ Error creating auth user: ${authError.message}`)
        continue
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.user.id,
          username: creatorData.display_name.toLowerCase().replace(/\s+/g, ''),
          full_name: creatorData.display_name,
          role: 'creator'
        })

      if (profileError) {
        console.error(`❌ Error creating profile: ${profileError.message}`)
        continue
      }

      // Create creator
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .insert({
          user_id: authUser.user.id,
          display_name: creatorData.display_name,
          category: creatorData.category,
          description: creatorData.description,
          is_verified: true,
          is_active: true
        })
        .select()
        .single()

      if (creatorError) {
        console.error(`❌ Error creating creator: ${creatorError.message}`)
        continue
      }

      console.log(`✅ Created creator with ID: ${creator.id}`)

      // Create subscription tiers
      for (const tierData of creatorData.tiers) {
        const { error: tierError } = await supabase
          .from('subscription_tiers')
          .insert({
            creator_id: creator.id,
            name: tierData.name,
            tier_type: tierData.tier_type,
            price: tierData.price,
            description: `${tierData.name} tier for ${creatorData.display_name}`,
            features: {
              'Access to posts': true,
              'Community chat': true,
              'Monthly Q&A': tierData.tier_type !== 'basic',
              'Direct messaging': tierData.tier_type === 'vip',
              'Video calls': tierData.tier_type === 'vip'
            },
            is_active: true
          })

        if (tierError) {
          console.error(`❌ Error creating tier: ${tierError.message}`)
        } else {
          console.log(`  ✅ Created ${tierData.name} tier`)
        }
      }

      // Create sample content
      for (const contentData of creatorData.content) {
        const { error: contentError } = await supabase
          .from('content')
          .insert({
            creator_id: creator.id,
            title: contentData.title,
            content_type: contentData.content_type,
            required_tier: contentData.required_tier,
            is_free: contentData.is_free || false,
            description: `Sample ${contentData.content_type} content: ${contentData.title}`,
            view_count: Math.floor(Math.random() * 1000),
            like_count: Math.floor(Math.random() * 100),
            published_at: new Date().toISOString()
          })

        if (contentError) {
          console.error(`❌ Error creating content: ${contentError.message}`)
        } else {
          console.log(`  ✅ Created content: ${contentData.title}`)
        }
      }
    }

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📧 Sample accounts:')
    sampleCreators.forEach(creator => {
      console.log(`  ${creator.email} (password: password123)`)
    })
    console.log('\n⚠️  Remember to change these passwords in a real application!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('\n✨ Seeding complete')
    process.exit(0)
  }).catch(error => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
}

module.exports = { seedDatabase }