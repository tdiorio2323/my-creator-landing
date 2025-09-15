import { 
  Settings, Users, Gift, TrendingUp, 
  RefreshCw, Heart, Trophy, Zap 
} from 'lucide-react'

export default function AutomationView({ automationRules, createAutomation }) {
  const automationTemplates = [
    { name: 'Welcome Series', description: 'Automatically welcome new subscribers', icon: Users },
    { name: 'Birthday Messages', description: 'Send birthday wishes to VIP fans', icon: Gift },
    { name: 'Content Promotion', description: 'Cross-promote your best content', icon: TrendingUp },
    { name: 'Re-engagement', description: 'Win back inactive subscribers', icon: RefreshCw },
    { name: 'Tip Thank You', description: 'Thank fans for tips automatically', icon: Heart },
    { name: 'Milestone Celebrations', description: 'Celebrate subscriber milestones', icon: Trophy }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Automation Rules</h3>
          <button 
            onClick={() => createAutomation()}
            className="px-6 py-2 bg-yellow-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-yellow-600/80 transition-all border border-yellow-400/50"
          >
            Create Rule
          </button>
        </div>
        
        <div className="space-y-4">
          {automationRules.map((rule) => (
            <div key={rule.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    rule.isActive ? 'bg-green-500/20' : 'bg-gray-500/20'
                  }`}>
                    <Zap className={`h-5 w-5 ${
                      rule.isActive ? 'text-green-400' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white">{rule.name}</h4>
                    <p className="text-white/60 text-sm mt-1">
                      {rule.trigger} → {rule.action}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rule.tier === 'VIP' ? 'bg-yellow-500/20 text-yellow-200' :
                    rule.tier === 'Premium' ? 'bg-purple-500/20 text-purple-200' :
                    'bg-blue-500/20 text-blue-200'
                  }`}>
                    {rule.tier}
                  </span>
                  
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    rule.isActive 
                      ? 'bg-green-500/20 text-green-200 hover:bg-green-500/30' 
                      : 'bg-gray-500/20 text-gray-200 hover:bg-gray-500/30'
                  }`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </button>
                  
                  <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all">
                    <Settings className="h-4 w-4 text-white/60" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Templates */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Automation Templates</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automationTemplates.map((template, index) => {
            const Icon = template.icon
            return (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-primary-500/20 rounded-lg">
                    <Icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <h4 className="font-medium text-white">{template.name}</h4>
                </div>
                <p className="text-white/60 text-sm">{template.description}</p>
                <button 
                  onClick={() => createAutomation(template)}
                  className="mt-3 px-4 py-2 bg-primary-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-primary-600/80 transition-all text-sm"
                >
                  Use Template
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
