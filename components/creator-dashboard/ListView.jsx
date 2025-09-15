import { 
  Eye, Edit, Trash2, Target, Zap, Clock,
  Image as ImageIcon, Video, FileText, Send
} from 'lucide-react'

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

export default function ListView({ scheduledContent, publishNow }) {
  return (
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
  )
}