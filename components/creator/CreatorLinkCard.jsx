import React, { useState } from 'react'
import { ExternalLink, Users, Verified, Eye, Star, TrendingUp, Mail, Copy, Check } from 'lucide-react'

const CreatorLinkCard = ({ profileData }) => {
  const [copiedText, setCopiedText] = useState('')

  const handleCopyLink = async (url, platform) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedText(platform)
      setTimeout(() => setCopiedText(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      'Instagram': '📸',
      'Twitter': '🐦',
      'Facebook': '📘',
      'TikTok': '🎵',
      'YouTube': '📺',
      'Threads': '🧵',
      'Spotify': '🎵',
      'Apple Music': '🍎',
      'SoundCloud': '☁️',
      'Deezer': '🎶',
      'Tidal': '🌊',
      'OnlyFans': '💎'
    }
    return icons[platform] || '🔗'
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{
           backgroundImage: `url(${profileData.bgImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Glassmorphism card */}
      <div className="w-full max-w-lg bg-black/30 border border-white/20 rounded-3xl backdrop-blur-2xl shadow-2xl relative z-20 overflow-hidden">
        {/* Header */}
        <div className="text-center p-8 space-y-6">
          <div className="relative flex items-center justify-center">
            <img
              src={profileData.avatar}
              alt={profileData.title}
              className="h-32 w-32 rounded-full border-4 border-white/30 shadow-2xl object-cover ring-4 ring-purple-500/20"
            />
            {profileData.verified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                <Verified className="h-4 w-4 text-white fill-current" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {profileData.title}
              </h1>
            </div>
            <p className="text-white/90 text-xl font-medium">{profileData.username}</p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-1 text-white/90 mb-1">
                  <Users className="h-4 w-4" />
                </div>
                <div className="text-white font-bold text-lg">{profileData.totalFollowers}</div>
                <div className="text-white/70 text-xs">Followers</div>
              </div>

              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-1 text-white/90 mb-1">
                  <Eye className="h-4 w-4" />
                </div>
                <div className="text-white font-bold text-lg">{profileData.profileVisits}</div>
                <div className="text-white/70 text-xs">Visits</div>
              </div>

              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-1 text-white/90 mb-1">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-white font-bold text-lg">{profileData.analytics?.growthRate || '+12%'}</div>
                <div className="text-white/70 text-xs">Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 space-y-8">
          {/* Top Social Media Platforms */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Top Social Platforms
            </h3>
            <div className="space-y-3">
              {profileData.socialPlatforms
                ?.sort((a, b) => b.followersCount - a.followersCount)
                .slice(0, 4)
                .map((platform, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <button
                    onClick={() => openLink(platform.url)}
                    className={`w-full h-16 ${platform.color} rounded-2xl flex items-center justify-between px-5 text-white font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/10`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPlatformIcon(platform.platform)}</span>
                      <div className="text-left">
                        <div className="font-bold text-sm">{platform.platform}</div>
                        <div className="text-xs opacity-90">{platform.handle}</div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <div className="text-sm font-bold">{formatNumber(platform.followersCount)}</div>
                        <div className="text-xs opacity-80">followers</div>
                      </div>
                      {platform.verified && (
                        <Verified className="h-4 w-4 text-blue-300 fill-current" />
                      )}
                    </div>
                  </button>

                  {/* Copy button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyLink(platform.url, platform.platform)
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg p-1 transition-opacity"
                  >
                    {copiedText === platform.platform ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-white" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Music Streaming */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              🎵 Stream My Music
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {profileData.streamingPlatforms?.map((platform, index) => (
                <button
                  key={index}
                  onClick={() => openLink(platform.url)}
                  className="h-14 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 rounded-xl flex items-center justify-center gap-2 text-white font-medium text-sm transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span>{platform.platform}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exclusive Content */}
          {profileData.exclusivePlatforms?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                💎 Exclusive Content
              </h3>
              <div className="space-y-3">
                {profileData.exclusivePlatforms.map((platform, index) => (
                  <button
                    key={index}
                    onClick={() => openLink(platform.url)}
                    className={`w-full h-14 ${platform.color} rounded-xl flex items-center justify-between px-5 text-white font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/10 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="flex items-center gap-2">
                      <span>💎</span>
                      {platform.handle}
                    </span>
                    <ExternalLink className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Get In Touch
            </h3>
            <div className="grid gap-3">
              <button
                onClick={() => openLink(`mailto:${profileData.contact?.email || 'contact@vrod.com'}`)}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20"
              >
                📧 Email Me
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/20 p-4 bg-black/20 backdrop-blur-sm">
          <div className="text-center text-white/60 text-xs space-y-1">
            <p>Created: {profileData.created} • Updated: {profileData.lastUpdated}</p>
            <p className="text-white/40">Powered by CreatorHub</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatorLinkCard