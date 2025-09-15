import { useState } from 'react'
import { 
  Calendar, Clock, Eye, Edit, Trash2, 
  Play, Pause, Settings, BarChart3, Users, Target,
  Image as ImageIcon, Video, FileText, Send, RefreshCw,
  Zap, Timer, AlertCircle, CheckCircle, Globe, Smartphone,
  Gift, TrendingUp, Heart, Trophy
} from 'lucide-react'

import ListView from './ListView'
import AutomationView from './AutomationView'

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
        {activeView === 'list' && <ListView scheduledContent={scheduledContent} publishNow={publishNow} />}

        {/* Automation Rules */}
        {activeView === 'automation' && <AutomationView automationRules={automationRules} createAutomation={createAutomation} />}
      </div>
    </div>
  )
}
