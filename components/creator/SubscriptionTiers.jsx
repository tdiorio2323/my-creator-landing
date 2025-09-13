import { useState } from 'react'
import { Plus, Edit, Trash2, Star, Crown, Diamond, Users, DollarSign, Calendar, Gift } from 'lucide-react'

export default function SubscriptionTiers({ isCreator = false, creatorTiers = [] }) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isCreator ? 'Manage Subscription Tiers' : 'Choose Your Support Level'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isCreator 
              ? 'Create and manage your subscription offerings'
              : 'Support this creator and unlock exclusive content'
            }
          </p>
        </div>
        {isCreator && (
          <button
            onClick={() => setShowCreateTier(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Tier</span>
          </button>
        )}
      </div>

      {/* Subscription Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const Icon = tier.icon
          const isLimitedSpots = tier.subscribers >= tier.maxSubscribers * 0.8
          
          return (
            <div
              key={tier.id}
              className={`relative card overflow-hidden ${
                tier.isPopular ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
              }`}
            >
              {/* Popular Badge */}
              {tier.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary-600 text-white text-xs px-4 py-1 rounded-full font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Limited Spots Badge */}
              {isLimitedSpots && (
                <div className="absolute top-3 right-3">
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                    Limited Spots
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Tier Header */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    tier.color === 'blue' ? 'bg-blue-100' :
                    tier.color === 'purple' ? 'bg-purple-100' :
                    tier.color === 'gold' ? 'bg-yellow-100' : 'bg-primary-100'
                  }`}>
                    <Icon className={`h-8 w-8 ${
                      tier.color === 'blue' ? 'text-blue-600' :
                      tier.color === 'purple' ? 'text-purple-600' :
                      tier.color === 'gold' ? 'text-yellow-600' : 'text-primary-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{tier.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${tier.price}
                    <span className="text-lg text-gray-500 font-normal">/month</span>
                  </div>
                  
                  {/* Subscriber Count */}
                  <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{tier.subscribers}/{tier.maxSubscribers} subscribers</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        tier.color === 'blue' ? 'bg-blue-500' :
                        tier.color === 'purple' ? 'bg-purple-500' :
                        tier.color === 'gold' ? 'bg-yellow-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${(tier.subscribers / tier.maxSubscribers) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="space-y-2">
                  {!isCreator ? (
                    <>
                      <button 
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                          tier.subscribers >= tier.maxSubscribers
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : tier.isPopular
                            ? 'bg-primary-600 hover:bg-primary-700 text-white'
                            : 'bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-900'
                        }`}
                        disabled={tier.subscribers >= tier.maxSubscribers}
                      >
                        {tier.subscribers >= tier.maxSubscribers 
                          ? 'Tier Full' 
                          : `Subscribe for $${tier.price}/mo`
                        }
                      </button>
                      <button className="w-full text-sm text-primary-600 hover:text-primary-700 py-2">
                        Gift This Tier
                      </button>
                    </>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingTier(tier.id)}
                        className="flex-1 btn-secondary flex items-center justify-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Creator Stats */}
                {isCreator && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          ${(tier.price * tier.subscribers).toLocaleString()}
                        </div>
                        <div className="text-gray-600">Monthly Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">
                          {Math.round((tier.subscribers / tier.maxSubscribers) * 100)}%
                        </div>
                        <div className="text-gray-600">Capacity</div>
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

      {/* Tier Management Tips for Creators */}
      {isCreator && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Tier Management Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Price tiers progressively higher with more exclusive benefits</li>
            <li>• Limit VIP tiers to create scarcity and exclusivity</li>
            <li>• Update benefits regularly to keep subscribers engaged</li>
            <li>• Consider seasonal or limited-time special tiers</li>
          </ul>
        </div>
      )}
    </div>
  )
}