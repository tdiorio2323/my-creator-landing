import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, Paperclip, Smile, Gift, Image as ImageIcon, Video, Phone, VideoIcon, Search, MoreVertical, Star, Heart, Pin } from 'lucide-react'

export default function MessagingSystem() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      user: {
        name: "Sarah M.",
        avatar: "/api/placeholder/40/40",
        isVip: true,
        isOnline: true,
        tier: "VIP"
      },
      lastMessage: "Thanks for the custom content! 😍",
      timestamp: "2 min ago",
      unread: 3,
      isPinned: true,
      revenue: 125.50
    },
    {
      id: 2,
      user: {
        name: "Mike Johnson",
        avatar: "/api/placeholder/40/40",
        isVip: false,
        isOnline: true,
        tier: "Premium"
      },
      lastMessage: "When is your next live stream?",
      timestamp: "15 min ago",
      unread: 1,
      isPinned: false,
      revenue: 45.99
    },
    {
      id: 3,
      user: {
        name: "Emma W.",
        avatar: "/api/placeholder/40/40",
        isVip: true,
        isOnline: false,
        tier: "VIP"
      },
      lastMessage: "Loved your latest post!",
      timestamp: "1 hour ago",
      unread: 0,
      isPinned: true,
      revenue: 89.97
    }
  ]

  // Mock messages for selected chat
  const messages = useMemo(() => {
    return selectedChat ? [
      {
        id: 1,
        sender: 'user',
        content: "Hey! I absolutely love your content 💕",
        timestamp: "10:30 AM",
        type: 'text'
      },
      {
        id: 2,
        sender: 'creator',
        content: "Thank you so much! That means a lot to me ❤️",
        timestamp: "10:35 AM",
        type: 'text'
      },
      {
        id: 3,
        sender: 'user',
        content: "Could you create some custom content for me? I'd love to tip you for it!",
        timestamp: "10:40 AM",
        type: 'text'
      },
      {
        id: 4,
        sender: 'creator',
        content: "Of course! What kind of content are you thinking? DM me the details",
        timestamp: "10:42 AM",
        type: 'text'
      },
      {
        id: 5,
        sender: 'user',
        content: "$50.00",
        timestamp: "10:45 AM",
        type: 'tip',
        amount: 50
      },
      {
        id: 6,
        sender: 'creator',
        content: "Thank you so much for the generous tip! 🙏 I'll get started on that custom content right away!",
        timestamp: "10:46 AM",
        type: 'text'
      }
    ] : []
  }, [selectedChat])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() || !selectedChat) return

    // Mock API call - leave empty for backend integration
    const mockSendMessage = async (chatId, messageContent) => {
      // TODO: Integrate with messaging API
      console.log('Sending message to chat:', chatId, messageContent)
      // return await fetch('/api/messages', { method: 'POST', body: ... })
    }

    mockSendMessage(selectedChat.id, message)
    setMessage('')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
      {/* Conversations Sidebar */}
      <div className="w-1/3 bg-white/5 backdrop-blur-sm border-r border-white/10">
        {/* Header */}
        <div className="p-4 bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
                <Search className="h-4 w-4 text-white" />
              </button>
              <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
                <MoreVertical className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto h-full">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className={`p-4 cursor-pointer transition-all hover:bg-white/10 ${
                selectedChat?.id === conv.id ? 'bg-white/15 border-r-2 border-primary-400' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full" />
                  {conv.user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-white truncate">{conv.user.name}</h3>
                      {conv.user.isVip && (
                        <Star className="h-3 w-3 text-yellow-400" />
                      )}
                      {conv.isPinned && (
                        <Pin className="h-3 w-3 text-blue-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-white/60">{conv.timestamp}</span>
                      {conv.unread > 0 && (
                        <div className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/70 truncate mt-1">{conv.lastMessage}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      conv.user.tier === 'VIP' ? 'bg-purple-500/30 text-purple-200' : 'bg-blue-500/30 text-blue-200'
                    }`}>
                      {conv.user.tier}
                    </span>
                    <span className="text-xs text-green-400">${conv.revenue}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white/10 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full" />
                    {selectedChat.user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white flex items-center space-x-2">
                      <span>{selectedChat.user.name}</span>
                      {selectedChat.user.isVip && <Star className="h-4 w-4 text-yellow-400" />}
                    </h3>
                    <p className="text-xs text-white/60">
                      {selectedChat.user.isOnline ? 'Online now' : 'Last seen 2h ago'} • {selectedChat.user.tier} subscriber
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
                    <Phone className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
                    <VideoIcon className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
                    <MoreVertical className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'creator' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.sender === 'creator'
                      ? 'bg-primary-500/80 backdrop-blur-sm text-white'
                      : msg.type === 'tip'
                      ? 'bg-green-500/80 backdrop-blur-sm text-white border border-green-400/50'
                      : 'bg-white/20 backdrop-blur-sm text-white border border-white/20'
                  }`}>
                    {msg.type === 'tip' ? (
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4" />
                        <span className="font-medium">Tip: {msg.content}</span>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'creator' ? 'text-white/80' : 'text-white/60'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/10 backdrop-blur-md border-t border-white/10">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                  >
                    <Paperclip className="h-4 w-4 text-white" />
                  </button>
                  <button
                    type="button"
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                  >
                    <ImageIcon className="h-4 w-4 text-white" />
                  </button>
                  <button
                    type="button"
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                  >
                    <Video className="h-4 w-4 text-white" />
                  </button>
                </div>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-all"
                  >
                    <Smile className="h-4 w-4 text-white/60" />
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-3 bg-primary-500/80 backdrop-blur-sm rounded-xl hover:bg-primary-600/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Quick Response Templates */}
              <div className="mt-3 flex flex-wrap gap-2">
                {['Thanks! 😊', 'New content soon!', 'Check your DMs', 'Send tip request'].map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => setMessage(template)}
                    className="px-3 py-1 text-xs bg-white/10 backdrop-blur-sm text-white/80 rounded-full hover:bg-white/20 transition-all border border-white/20"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Statistics Sidebar */}
      <div className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/10 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Message Analytics</h3>
        
        {/* Stats Cards */}
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Response Rate</p>
                <p className="text-2xl font-bold text-white">94%</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Heart className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">12 min</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Send className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tips This Week</p>
                <p className="text-2xl font-bold text-white">$847</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Gift className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Tippers */}
        <div className="mt-6">
          <h4 className="text-white font-medium mb-3">Top Tippers This Month</h4>
          <div className="space-y-3">
            {[
              { name: "Sarah M.", amount: 250, tier: "VIP" },
              { name: "Emma W.", amount: 180, tier: "VIP" },
              { name: "Mike J.", amount: 125, tier: "Premium" }
            ].map((tipper, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full" />
                  <div>
                    <p className="text-white text-sm font-medium">{tipper.name}</p>
                    <p className="text-white/60 text-xs">{tipper.tier}</p>
                  </div>
                </div>
                <p className="text-green-400 font-medium text-sm">${tipper.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}