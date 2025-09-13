import { supabase } from './supabase'

// Check if user has active subscription to a creator
export async function hasActiveSubscription(userId, creatorId) {
  if (!userId || !creatorId) return false

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_tiers(*)')
      .eq('subscriber_id', userId)
      .eq('creator_id', creatorId)
      .eq('status', 'active')
      .single()

    if (error || !data) return false

    // Check if subscription is still active
    const currentPeriodEnd = new Date(data.current_period_end)
    const now = new Date()

    return currentPeriodEnd > now
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}

// Check if user can access specific content based on their subscription tier
export async function canAccessContent(userId, contentId) {
  if (!userId || !contentId) return false

  try {
    // Get content details
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('creator_id, required_tier, is_free')
      .eq('id', contentId)
      .single()

    if (contentError || !content) return false

    // If content is free, allow access
    if (content.is_free) return true

    // Check if user has subscription to this creator
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*, subscription_tiers(*)')
      .eq('subscriber_id', userId)
      .eq('creator_id', content.creator_id)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) return false

    // Check if subscription tier is high enough
    const tierLevels = {
      'basic': 1,
      'premium': 2,
      'vip': 3
    }

    const userTierLevel = tierLevels[subscription.subscription_tiers.tier_type] || 0
    const requiredTierLevel = tierLevels[content.required_tier] || 1

    // Check if subscription is still active
    const currentPeriodEnd = new Date(subscription.current_period_end)
    const now = new Date()

    return userTierLevel >= requiredTierLevel && currentPeriodEnd > now
  } catch (error) {
    console.error('Error checking content access:', error)
    return false
  }
}

// Get user's subscription status for a creator
export async function getSubscriptionStatus(userId, creatorId) {
  if (!userId || !creatorId) return null

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_tiers(*)')
      .eq('subscriber_id', userId)
      .eq('creator_id', creatorId)
      .single()

    if (error || !data) return null

    const currentPeriodEnd = new Date(data.current_period_end)
    const now = new Date()

    return {
      ...data,
      isActive: data.status === 'active' && currentPeriodEnd > now,
      daysRemaining: Math.ceil((currentPeriodEnd - now) / (1000 * 60 * 60 * 24))
    }
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return null
  }
}

// Check if user is the owner of content/creator profile
export async function isContentOwner(userId, contentId) {
  if (!userId || !contentId) return false

  try {
    const { data, error } = await supabase
      .from('content')
      .select('creators(user_id)')
      .eq('id', contentId)
      .single()

    if (error || !data) return false

    return data.creators.user_id === userId
  } catch (error) {
    console.error('Error checking content ownership:', error)
    return false
  }
}

// Get user's role (subscriber, creator, admin)
export async function getUserRole(userId) {
  if (!userId) return 'subscriber'

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error || !data) return 'subscriber'

    return data.role
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'subscriber'
  }
}

// Track content view for analytics
export async function trackContentView(userId, contentId) {
  try {
    const { error } = await supabase
      .from('content_views')
      .insert({
        user_id: userId,
        content_id: contentId
      })

    if (error && error.code !== '23505') { // Ignore duplicate key violations
      console.error('Error tracking view:', error)
    }

    // Increment view count
    await supabase.rpc('increment_view_count', { content_id: contentId })
  } catch (error) {
    console.error('Error tracking content view:', error)
  }
}