import { useState } from 'react'
import { Plus, Edit, Trash2, Star, Crown, Diamond, Users, DollarSign, Calendar, Gift } from 'lucide-react'
import SubscribeButton from './SubscribeButton'

export default function SubscriptionTiers({ isCreator = false, creatorTiers = [], creator = null, userSubscriptions = [], onSubscribe = null }) {
  const [showCreateTier, setShowCreateTier] = useState(false)
  const [editingTier, setEditingTier] = useState(null)
  const [newTier, setNewTier] = useState({
    name: '',
    price: '',
    description: '',
    benefits: [''],
    isPopular: false,
    maxSubscribers: '',
    color: 'primary'
  })

  const defaultTiers = [
    {
      id: 1,
      name: "Basic Fan",
      price: 9.99,
      description: "Access to all my regular content",
      benefits: [
        "All public posts",
        "Photo galleries",
        "Community access",
        "Monthly live Q&A"
      ],
      subscribers: 234,
      maxSubscribers: 500,
      isPopular: false,
      color: 'blue',
      icon: Star
    },
    {
      id: 2,
      name: "Premium Supporter",
      price: 19.99,
      description: "Enhanced access with exclusive content",
      benefits: [
        "Everything in Basic",
        "Exclusive premium content",
        "HD video access",
        "Direct messaging",
        "Weekly exclusive posts",
        "Priority customer support"
      ],
      subscribers: 156,
      maxSubscribers: 300,
      isPopular: true,
      color: 'purple',
      icon: Crown
    },
    {
      id: 3,
      name: "VIP Inner Circle",
      price: 49.99,
      description: "Ultimate access with personal perks",
      benefits: [
        "Everything in Premium",
        "1-on-1 video calls (monthly)",
        "Custom content requests",
        "Behind-the-scenes access",
        "Personal shoutouts",
        "Exclusive merchandise",
        "Birthday surprises"
      ],
      subscribers: 42,
      maxSubscribers: 50,
      isPopular: false,
      color: 'gold',
      icon: Diamond
    }
  ]

  const tiers = creatorTiers.length > 0 ? creatorTiers : defaultTiers

  const handleCreateTier = () => {
    console.log('Creating new tier:', newTier)
    setShowCreateTier(false)
    setNewTier({
      name: '',
      price: '',
      description: '',
      benefits: [''],
      isPopular: false,
      maxSubscribers: '',
      color: 'primary'
    })
  }

  const addBenefit = () => {
    setNewTier(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }))
  }

  const updateBenefit = (index, value) => {
    setNewTier(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }))
  }

  const removeBenefit = (index) => {
    setNewTier(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md border border-primary-200/30 rounded-full text-primary-700 font-medium mb-6">
          <Crown className="w-4 h-4 mr-2" />
          {isCreator ? 'Premium Tier Management' : 'Exclusive Membership Tiers'}
          <Diamond className="w-4 h-4 ml-2" />
        </div>

        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-luxury-900 to-primary-700 bg-clip-text text-transparent">
            {isCreator ? 'Manage Premium Tiers' : 'Choose Your Membership'}
          </span>
        </h2>
        <p className="text-xl text-luxury-600 max-w-3xl mx-auto">
          {isCreator
            ? 'Create exclusive subscription tiers to maximize your creator revenue and fan engagement'
            : 'Join an exclusive community and unlock premium content tailored just for you'
          }
        </p>

        {isCreator && (
          <div className="mt-8">
            <button
              onClick={() => setShowCreateTier(true)}
              className="btn-primary text-lg px-8 py-4 group"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Create Premium Tier
            </button>
          </div>
        )}
      </div>

      {/* Premium Tiers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier, index) => {
          const Icon = tier.icon
          const isLimitedSpots = tier.subscribers >= tier.maxSubscribers * 0.8
          const gradients = {
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-primary-500 to-primary-600',
            gold: 'from-secondary-400 to-secondary-600'
          }

          return (
            <div
              key={tier.id}
              className={`relative group ${
                tier.isPopular
                  ? 'card-premium transform hover:scale-105 shadow-luxury-lg'
                  : 'card-premium hover:scale-105'
              } overflow-hidden transition-all duration-300`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Luxury Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 68, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(232, 108, 71, 0.15) 0%, transparent 50%)`,
                  backgroundSize: '100px 100px'
                }} />
              </div>

              {/* Premium Badge */}
              {tier.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="status-premium px-6 py-2 shadow-luxury">
                    <Crown className="w-3 h-3 mr-1 inline" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Limited Spots Badge */}
              {isLimitedSpots && (
                <div className="absolute top-6 right-6 z-10">
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-2 rounded-full font-medium shadow-lg animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full inline-block mr-1 animate-pulse" />
                    Limited Spots
                  </span>
                </div>
              )}

              <div className="relative p-8">
                {/* Luxury Tier Header */}
                <div className="text-center mb-8">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-luxury bg-gradient-to-br ${
                      tier.color === 'blue' ? gradients.blue :
                      tier.color === 'purple' ? gradients.purple :
                      tier.color === 'gold' ? gradients.gold : gradients.purple
                    } group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-luxury-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {tier.name}
                  </h3>
                  <p className="text-luxury-600 leading-relaxed">{tier.description}</p>
                </div>

                {/* Premium Pricing */}
                <div className="text-center mb-8">
                  <div className="relative mb-4">
                    <div className="text-5xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-luxury-900 to-primary-700 bg-clip-text text-transparent">
                        ${tier.price}
                      </span>
                      <span className="text-xl text-luxury-500 font-medium">/month</span>
                    </div>
                  </div>

                  {/* Subscriber Analytics */}
                  <div className="glass-card p-4 mb-4">
                    <div className="flex items-center justify-center text-luxury-600 mb-2">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="font-medium">{tier.subscribers}/{tier.maxSubscribers} premium members</span>
                    </div>

                    {/* Luxury Progress Bar */}
                    <div className="relative w-full bg-luxury-200/50 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${
                          tier.color === 'blue' ? 'from-blue-400 to-blue-600' :
                          tier.color === 'purple' ? 'from-primary-400 to-primary-600' :
                          tier.color === 'gold' ? 'from-secondary-400 to-secondary-600' : 'from-primary-400 to-primary-600'
                        } shadow-inner transition-all duration-300`}
                        style={{ width: `${(tier.subscribers / tier.maxSubscribers) * 100}%` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                    </div>

                    <div className="flex justify-between text-xs text-luxury-500 mt-2">
                      <span>Exclusive</span>
                      <span>{Math.round((tier.subscribers / tier.maxSubscribers) * 100)}% full</span>
                    </div>
                  </div>
                </div>

                {/* Premium Benefits */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-luxury-700 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <span className="text-sm font-medium leading-relaxed group-hover:text-primary-600 transition-colors">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Premium Action Buttons */}
                <div className="space-y-4">
                  {!isCreator ? (
                    <>
                      {tier.subscribers >= tier.maxSubscribers ? (
                        <div className="text-center">
                          <button
                            className="w-full py-4 px-6 rounded-xl font-semibold transition-all bg-luxury-200 text-luxury-500 cursor-not-allowed"
                            disabled
                          >
                            Membership Full - Join Waitlist
                          </button>
                        </div>
                      ) : (
                        <SubscribeButton
                          creator={creator}
                          tier={tier}
                          isSubscribed={userSubscriptions?.some(sub => sub.tierId === tier.id) || false}
                          onSubscribe={onSubscribe}
                        />
                      )}
                      <div className="text-center">
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium py-2 px-4 rounded-lg hover:bg-primary-50/50 transition-colors flex items-center mx-auto group">
                          <Gift className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Gift This Membership
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditingTier(tier.id)}
                        className="flex-1 btn-secondary flex items-center justify-center space-x-2 group"
                      >
                        <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span>Edit Tier</span>
                      </button>
                      <button className="btn-icon text-red-600 hover:text-red-700 group">
                        <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Premium Creator Analytics */}
                {isCreator && (
                  <div className="mt-6">
                    <div className="divider-luxury mb-6" />
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">
                          <span className="bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
                            ${(tier.price * tier.subscribers).toLocaleString()}
                          </span>
                        </div>
                        <div className="metric-label">Monthly Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">
                          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            {Math.round((tier.subscribers / tier.maxSubscribers) * 100)}%
                          </span>
                        </div>
                        <div className="metric-label">Capacity Filled</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create New Tier Modal */}
      {showCreateTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Tier</h3>
                <button
                  onClick={() => setShowCreateTier(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateTier(); }} className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tier Name
                    </label>
                    <input
                      type="text"
                      value={newTier.name}
                      onChange={(e) => setNewTier(prev => ({...prev, name: e.target.value}))}
                      placeholder="e.g., VIP Access"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Price ($)
                    </label>
                    <input
                      type="number"
                      value={newTier.price}
                      onChange={(e) => setNewTier(prev => ({...prev, price: e.target.value}))}
                      placeholder="19.99"
                      min="1"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTier.description}
                    onChange={(e) => setNewTier(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe what this tier offers..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits
                  </label>
                  {newTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        placeholder="Enter a benefit..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {newTier.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Benefit</span>
                  </button>
                </div>

                {/* Additional Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Subscribers
                    </label>
                    <input
                      type="number"
                      value={newTier.maxSubscribers}
                      onChange={(e) => setNewTier(prev => ({...prev, maxSubscribers: e.target.value}))}
                      placeholder="100"
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tier Color
                    </label>
                    <select
                      value={newTier.color}
                      onChange={(e) => setNewTier(prev => ({...prev, color: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="primary">Primary</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="gold">Gold</option>
                    </select>
                  </div>
                </div>

                {/* Popular Tier Toggle */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTier.isPopular}
                    onChange={(e) => setNewTier(prev => ({...prev, isPopular: e.target.checked}))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Mark as &quot;Most Popular&quot;
                  </span>
                </label>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateTier(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Create Tier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Premium Creator Insights */}
      {isCreator && (
        <div className="mt-16">
          <div className="card-premium p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-full text-primary-700 font-medium mb-4">
                <Diamond className="w-4 h-4 mr-2" />
                Premium Creator Insights
              </div>
              <h4 className="text-2xl font-bold text-luxury-900 mb-2">Maximize Your Revenue Potential</h4>
              <p className="text-luxury-600">Expert strategies to optimize your subscription tiers and boost fan engagement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h5 className="font-semibold text-luxury-900 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-primary-600" />
                  Tier Optimization
                </h5>
                <ul className="space-y-2 text-luxury-700">
                  <li className="flex items-start">
                    <span className="text-accent-500 mr-2 mt-1">✓</span>
                    <span className="text-sm">Price tiers progressively with 2-3x multipliers for maximum value perception</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-500 mr-2 mt-1">✓</span>
                    <span className="text-sm">Limit premium tiers to create genuine scarcity and exclusivity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-500 mr-2 mt-1">✓</span>
                    <span className="text-sm">Include 1-on-1 perks in highest tiers for personal connection</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold text-luxury-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-secondary-600" />
                  Engagement Strategies
                </h5>
                <ul className="space-y-2 text-luxury-700">
                  <li className="flex items-start">
                    <span className="text-accent-500 mr-2 mt-1">✓</span>
                    <span className="text-sm">Update benefits monthly to maintain subscriber interest</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-500 mr-2 mt-1">✓</span>
                    <span className="text-sm">Create seasonal or limited-time special access tiers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-500 mr-2 mt-1">✓</span>
                    <span className="text-sm">Offer birthday surprises and anniversary rewards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fan Engagement CTA */}
      {!isCreator && (
        <div className="mt-16 text-center">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h4 className="text-2xl font-bold text-luxury-900 mb-4">
              Can't decide which tier is perfect for you?
            </h4>
            <p className="text-luxury-600 mb-6">
              Join our community and get personalized recommendations based on your interests and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">Get Personalized Recommendations</button>
              <button className="btn-secondary">View All Creator Content</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}