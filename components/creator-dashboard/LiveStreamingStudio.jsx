import { useState, useRef, useEffect } from 'react'
import { 
  Video, VideoOff, Mic, MicOff, Monitor, Settings, Users, 
  MessageCircle, Gift, Heart, Share, Eye, Clock, Camera,
  Volume2, VolumeX, Maximize, MoreVertical, Star, Crown,
  Send, Smile, TrendingUp, DollarSign
} from 'lucide-react'

export default function LiveStreamingStudio() {
  const [isLive, setIsLive] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenShare, setIsScreenShare] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [streamTitle, setStreamTitle] = useState('')
  const [streamMessage, setStreamMessage] = useState('')
  const videoRef = useRef(null)

  // Mock live stream data
  const liveStats = {
    viewers: 247,
    likes: 1420,
    tips: 89.50,
    duration: '1:23:45',
    messages: 156
  }

  const liveMessages = [
    {
      id: 1,
      user: { name: 'Sarah M.', tier: 'VIP', avatar: '/api/placeholder/32/32' },
      message: 'Looking amazing today! 😍',
      timestamp: '2 min ago',
      type: 'message'
    },
    {
      id: 2,
      user: { name: 'Mike J.', tier: 'Premium', avatar: '/api/placeholder/32/32' },
      message: '$25.00',
      timestamp: '3 min ago',
      type: 'tip',
      amount: 25
    },
    {
      id: 3,
      user: { name: 'Emma W.', tier: 'VIP', avatar: '/api/placeholder/32/32' },
      message: 'Can you do a shoutout for my birthday?',
      timestamp: '5 min ago',
      type: 'message'
    },
    {
      id: 4,
      user: { name: 'Alex R.', tier: 'Basic', avatar: '/api/placeholder/32/32' },
      message: 'First time watching, love the content!',
      timestamp: '7 min ago',
      type: 'message'
    },
    {
      id: 5,
      user: { name: 'Lisa K.', tier: 'Premium', avatar: '/api/placeholder/32/32' },
      message: '$15.00',
      timestamp: '8 min ago',
      type: 'tip',
      amount: 15
    }
  ]

  const startLiveStream = async () => {
    // Mock API call - leave empty for backend integration
    const mockStartStream = async (streamConfig) => {
      // TODO: Integrate with streaming service API (WebRTC, etc.)
      console.log('Starting live stream:', streamConfig)
      // return await fetch('/api/stream/start', { method: 'POST', body: ... })
    }

    await mockStartStream({ title: streamTitle })
    setIsLive(true)
    setViewerCount(1)
  }

  const endLiveStream = async () => {
    // Mock API call - leave empty for backend integration
    const mockEndStream = async () => {
      // TODO: Integrate with streaming service API
      console.log('Ending live stream')
      // return await fetch('/api/stream/end', { method: 'POST' })
    }

    await mockEndStream()
    setIsLive(false)
    setViewerCount(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          
          {/* Main Stream Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Stream Preview/Live Video */}
            <div className="relative aspect-video bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
              {/* Video Stream */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <div className="flex items-center justify-center h-full">
                  {isLive ? (
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-red-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Video className="h-12 w-12" />
                      </div>
                      <p className="text-xl font-semibold">You&apos;re Live!</p>
                      <p className="text-white/70">Streaming to {liveStats.viewers} viewers</p>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="h-12 w-12" />
                      </div>
                      <p className="text-xl font-semibold">Stream Preview</p>
                      <p className="text-white/70">Configure your stream settings below</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Indicator */}
              {isLive && (
                <div className="absolute top-4 left-4 bg-red-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2 border border-red-400/50">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="font-medium">LIVE</span>
                </div>
              )}

              {/* Stream Stats Overlay */}
              {isLive && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center space-x-1 border border-white/20">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">{liveStats.viewers}</span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center space-x-1 border border-white/20">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{liveStats.duration}</span>
                  </div>
                </div>
              )}

              {/* Stream Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20">
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-3 rounded-xl transition-all ${
                      isVideoOn 
                        ? 'bg-white/20 text-white hover:bg-white/30' 
                        : 'bg-red-500/80 text-white hover:bg-red-600/80'
                    }`}
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </button>
                  
                  <button
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className={`p-3 rounded-xl transition-all ${
                      isAudioOn 
                        ? 'bg-white/20 text-white hover:bg-white/30' 
                        : 'bg-red-500/80 text-white hover:bg-red-600/80'
                    }`}
                  >
                    {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>
                  
                  <button
                    onClick={() => setIsScreenShare(!isScreenShare)}
                    className={`p-3 rounded-xl transition-all ${
                      isScreenShare 
                        ? 'bg-blue-500/80 text-white hover:bg-blue-600/80' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Monitor className="h-5 w-5" />
                  </button>
                  
                  <div className="w-px h-8 bg-white/20" />
                  
                  {!isLive ? (
                    <button
                      onClick={startLiveStream}
                      disabled={!streamTitle.trim()}
                      className="bg-red-500/80 backdrop-blur-sm hover:bg-red-600/80 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-red-400/50"
                    >
                      Go Live
                    </button>
                  ) : (
                    <button
                      onClick={endLiveStream}
                      className="bg-gray-500/80 backdrop-blur-sm hover:bg-gray-600/80 text-white px-6 py-3 rounded-xl font-medium transition-all border border-gray-400/50"
                    >
                      End Stream
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stream Configuration */}
            {!isLive && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Stream Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Stream Title
                    </label>
                    <input
                      type="text"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      placeholder="What's your stream about?"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Category
                    </label>
                    <select className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30">
                      <option value="">Select category</option>
                      <option value="fitness">Fitness & Wellness</option>
                      <option value="cooking">Cooking</option>
                      <option value="art">Art & Design</option>
                      <option value="music">Music</option>
                      <option value="gaming">Gaming</option>
                      <option value="chat">Just Chatting</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Stream Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell viewers what to expect..."
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              </div>
            )}

            {/* Live Stream Statistics */}
            {isLive && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Viewers</p>
                      <p className="text-2xl font-bold text-white">{liveStats.viewers}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Likes</p>
                      <p className="text-2xl font-bold text-white">{liveStats.likes}</p>
                    </div>
                    <Heart className="h-8 w-8 text-red-400" />
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Tips</p>
                      <p className="text-2xl font-bold text-white">${liveStats.tips}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Messages</p>
                      <p className="text-2xl font-bold text-white">{liveStats.messages}</p>
                    </div>
                    <MessageCircle className="h-8 w-8 text-purple-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Chat & Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Live Chat */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-96 flex flex-col">
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Live Chat</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded-full">
                      {liveMessages.length} messages
                    </span>
                    <button className="p-1 hover:bg-white/10 rounded">
                      <Settings className="h-4 w-4 text-white/60" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {liveMessages.map((msg) => (
                  <div key={msg.id} className={`flex items-start space-x-2 ${
                    msg.type === 'tip' ? 'bg-green-500/20 backdrop-blur-sm rounded-lg p-2 border border-green-400/30' : ''
                  }`}>
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          msg.user.tier === 'VIP' ? 'text-yellow-300' : 
                          msg.user.tier === 'Premium' ? 'text-purple-300' : 'text-blue-300'
                        }`}>
                          {msg.user.name}
                        </span>
                        {msg.user.tier === 'VIP' && <Crown className="h-3 w-3 text-yellow-400" />}
                        {msg.user.tier === 'Premium' && <Star className="h-3 w-3 text-purple-400" />}
                      </div>
                      
                      {msg.type === 'tip' ? (
                        <div className="flex items-center space-x-1 mt-1">
                          <Gift className="h-4 w-4 text-green-400" />
                          <span className="text-white font-medium">${msg.amount}</span>
                        </div>
                      ) : (
                        <p className="text-white/90 text-sm mt-1">{msg.message}</p>
                      )}
                      
                      <p className="text-white/40 text-xs mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {isLive && (
                <div className="p-4 border-t border-white/20">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={streamMessage}
                      onChange={(e) => setStreamMessage(e.target.value)}
                      placeholder="Send a message..."
                      className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <button className="p-2 bg-primary-500/80 backdrop-blur-sm rounded-lg hover:bg-primary-600/80 transition-all">
                      <Send className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
              <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  <Heart className="h-5 w-5 text-red-400 mx-auto mb-1" />
                  <span className="text-xs text-white">Thank Viewers</span>
                </button>
                <button className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  <Gift className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                  <span className="text-xs text-white">Request Tips</span>
                </button>
                <button className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  <Share className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs text-white">Share Stream</span>
                </button>
                <button className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  <Settings className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-white">Settings</span>
                </button>
              </div>
            </div>

            {/* Stream Goals */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
              <h3 className="font-semibold text-white mb-3">Stream Goals</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-white/80 mb-1">
                    <span>Tip Goal</span>
                    <span>$89/$150</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '59%'}} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-white/80 mb-1">
                    <span>Viewer Goal</span>
                    <span>247/300</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '82%'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}