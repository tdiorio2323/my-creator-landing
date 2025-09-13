import { useState } from 'react'
import { 
  Calendar, Clock, Upload, Eye, Edit, Trash2, Copy, 
  Play, Pause, Settings, BarChart3, Users, Target,
  Image as ImageIcon, Video, FileText, Send, RefreshCw,
  Zap, Timer, AlertCircle, CheckCircle, Globe, Smartphone
} from 'lucide-react'

export default function ContentScheduler() {
  const [activeView, setActiveView] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showNewPost, setShowNewPost] = useState(false)

  // Mock scheduled content data
  const scheduledContent = [
    {
      id: 1,
      title: 'Morning Workout Routine',
      type: 'video',
      scheduledFor: '2024-01-16T08:00:00Z',
      status: 'scheduled',
      tier: 'Premium',
      preview: '/api/placeholder/200/150',
      description: 'Start your day with an energizing workout...',
      engagement: { likes: 0, comments: 0, estimated: 450 },
      autoPromote: true
    },
    {
      id: 2,
      title: 'Healthy Breakfast Tips',
      type: 'photo',
      scheduledFor: '2024-01-16T10:30:00Z',
      status: 'scheduled',
      tier: 'Basic',
      preview: '/api/placeholder/200/150',
      description: 'Quick and nutritious breakfast ideas...',
      engagement: { likes: 0, comments: 0, estimated: 230 },
      autoPromote: false
    },
    {
      id: 3,
      title: 'Q&A Session Announcement',
      type: 'text',
      scheduledFor: '2024-01-16T15:00:00Z',
      status: 'draft',
      tier: 'VIP',
      preview: null,
      description: 'Join me for an exclusive Q&A session this Friday...',
      engagement: { likes: 0, comments: 0, estimated: 120 },
      autoPromote: true
    },
    {
      id: 4,
      title: 'Live Stream Tonight!',
      type: 'announcement',
      scheduledFor: '2024-01-16T19:00:00Z',
      status: 'published',
      tier: 'All',
      preview: null,
      description: 'Going live at 8PM for a special workout session...',
      engagement: { likes: 23, comments: 5, estimated: 200 },
      autoPromote: true
    }
  ]

  const automationRules = [
    {
      id: 1,
      name: 'Morning Motivation',
      trigger: 'Daily at 7:00 AM',
      action: 'Post motivational quote',
      isActive: true,
      tier: 'All'
    },
    {
      id: 2,
      name: 'Weekly Workout Plan',
      trigger: 'Every Monday at 6:00 AM',
      action: 'Share weekly workout schedule',
      isActive: true,
      tier: 'Premium'
    },
    {
      id: 3,
      name: 'Thank You Messages',
      trigger: 'New VIP subscriber',
      action: 'Send personalized welcome DM',
      isActive: true,
      tier: 'VIP'
    },
    {
      id: 4,
      name: 'Re-engagement Campaign',
      trigger: 'Subscriber inactive 7 days',
      action: 'Send exclusive offer',
      isActive: false,
      tier: 'All'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-200 border-blue-400/30'
      case 'published': return 'bg-green-500/20 text-green-200 border-green-400/30'
      case 'draft': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
      case 'failed': return 'bg-red-500/20 text-red-200 border-red-400/30'
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return Video
      case 'photo': return ImageIcon
      case 'text': return FileText
      default: return Send
    }
  }

  const publishNow = async (contentId) => {
    // Mock API call - leave empty for backend integration
    const mockPublishContent = async (id) => {
      // TODO: Integrate with content publishing API
      console.log('Publishing content immediately:', id)
      // return await fetch(`/api/content/${id}/publish`, { method: 'POST' })
    }

    await mockPublishContent(contentId)
  }

  const createAutomation = async (rule) => {
    // Mock API call - leave empty for backend integration
    const mockCreateAutomation = async (automationRule) => {
      // TODO: Integrate with automation API
      console.log('Creating automation rule:', automationRule)
      // return await fetch('/api/automations', { method: 'POST', body: ... })
    }

    await mockCreateAutomation(rule)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Content Scheduler</h1>
            <p className="text-white/60">Plan, schedule, and automate your content strategy</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-1">
              <button
                onClick={() => setActiveView('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === 'calendar' 
                    ? 'bg-primary-500/80 text-white' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === 'list' 
                    ? 'bg-primary-500/80 text-white' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setActiveView('automation')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === 'automation' 
                    ? 'bg-primary-500/80 text-white' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Automation
              </button>
            </div>
            
            <button
              onClick={() => setShowNewPost(true)}
              className="px-6 py-2 bg-primary-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-primary-600/80 transition-all border border-primary-400/50"
            >
              Schedule Post
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Scheduled</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Published Today</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Automations</p>
                <p className="text-2xl font-bold text-white">4</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Avg Engagement</p>
                <p className="text-2xl font-bold text-white">12.4%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Content Calendar</h3>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30">
                  <option>January 2024</option>
                  <option>February 2024</option>
                  <option>March 2024</option>
                </select>
                <button className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all">
                  <Calendar className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            
            {/* Simple Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center py-2 text-white/60 font-medium">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: 35 }, (_, i) => (
                <div key={i} className="aspect-square bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-2">
                  <div className="text-white/80 text-sm mb-1">{((i % 31) + 1)}</div>
                  {/* Mock scheduled content indicators */}
                  {i === 15 && (
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-blue-400/60 rounded-full" />
                      <div className="w-full h-2 bg-green-400/60 rounded-full" />
                    </div>
                  )}
                  {i === 20 && (
                    <div className="w-full h-2 bg-purple-400/60 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {activeView === 'list' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Scheduled Content</h3>
              <div className="flex items-center space-x-2">
                <select className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30">
                  <option>All Status</option>
                  <option>Scheduled</option>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
                <select className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30">
                  <option>All Types</option>
                  <option>Video</option>
                  <option>Photo</option>
                  <option>Text</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {scheduledContent.map((content) => {
                const TypeIcon = getTypeIcon(content.type)
                
                return (
                  <div key={content.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-start space-x-4">
                      {/* Preview */}
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TypeIcon className="h-8 w-8 text-white" />
                      </div>
                      
                      {/* Content Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-white truncate">{content.title}</h4>
                            <p className="text-white/60 text-sm mt-1 line-clamp-2">{content.description}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(content.status)}`}>
                              {content.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              content.tier === 'VIP' ? 'bg-yellow-500/20 text-yellow-200' :
                              content.tier === 'Premium' ? 'bg-purple-500/20 text-purple-200' :
                              'bg-blue-500/20 text-blue-200'
                            }`}>
                              {content.tier}
                            </span>
                          </div>
                        </div>
                        
                        {/* Meta Information */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-white/60">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(content.scheduledFor).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              <span>Est. {content.engagement.estimated} views</span>
                            </div>
                            {content.autoPromote && (
                              <div className="flex items-center space-x-1 text-green-400">
                                <Zap className="h-3 w-3" />
                                <span>Auto-promote</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all">
                              <Eye className="h-4 w-4 text-white/60" />
                            </button>
                            <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all">
                              <Edit className="h-4 w-4 text-white/60" />
                            </button>
                            {content.status === 'scheduled' && (
                              <button 
                                onClick={() => publishNow(content.id)}
                                className="px-3 py-1 bg-green-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-green-600/80 transition-all text-sm"
                              >
                                Publish Now
                              </button>
                            )}
                            <button className="p-2 bg-red-500/20 backdrop-blur-sm rounded-lg hover:bg-red-500/30 transition-all">
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Automation Rules */}
        {activeView === 'automation' && (
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
                {[
                  { name: 'Welcome Series', description: 'Automatically welcome new subscribers', icon: Users },
                  { name: 'Birthday Messages', description: 'Send birthday wishes to VIP fans', icon: Gift },
                  { name: 'Content Promotion', description: 'Cross-promote your best content', icon: TrendingUp },
                  { name: 'Re-engagement', description: 'Win back inactive subscribers', icon: RefreshCw },
                  { name: 'Tip Thank You', description: 'Thank fans for tips automatically', icon: Heart },
                  { name: 'Milestone Celebrations', description: 'Celebrate subscriber milestones', icon: Trophy }
                ].map((template, index) => {
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
                      <button className="mt-3 px-4 py-2 bg-primary-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-primary-600/80 transition-all text-sm">
                        Use Template
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}