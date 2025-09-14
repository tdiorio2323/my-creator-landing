import React from 'react'
import { ExternalLink, Users, Verified, Eye } from 'lucide-react'

const VRodProfileCard = () => {
  const profileData = {
    username: '@vrod',
    title: 'V Rod',
    verified: true,
    totalFollowers: '994.1k',
    profileVisits: '42.6k',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=300&h=300&fit=crop&crop=face',
    bgImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=800&fit=crop',
    socialPlatforms: [
      { label: 'Instagram @vrodmusic', followers: '9.1k', url: 'https://instagram.com/vrodmusic', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
      { label: 'Instagram @vrodlive', followers: '385.6k', url: 'https://instagram.com/vrodlive', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
      { label: 'Twitter @lilveronicar', followers: '455.2k', url: 'https://twitter.com/lilveronicar', color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
      { label: 'Facebook teamvrod', followers: '51k', url: 'https://facebook.com/teamvrod', color: 'bg-gradient-to-r from-blue-600 to-blue-800' },
      { label: 'TikTok @vrodlive', followers: '10.9k', url: 'https://tiktok.com/@vrodlive', color: 'bg-gradient-to-r from-black to-red-500' },
      { label: 'YouTube @VRodd', followers: '43.8k', url: 'https://youtube.com/@VRodd', color: 'bg-gradient-to-r from-red-500 to-red-700' },
      { label: 'Threads @vrodlive', followers: '38.6k', url: 'https://threads.net/@vrodlive', color: 'bg-gradient-to-r from-gray-800 to-black' }
    ],
    streamingPlatforms: [
      { label: 'Spotify', url: 'https://spotify.com/artist/vrod', icon: '🎵' },
      { label: 'Apple Music', url: 'https://music.apple.com/artist/vrod', icon: '🍎' },
      { label: 'SoundCloud', url: 'https://soundcloud.com/vrod', icon: '☁️' },
      { label: 'Deezer', url: 'https://deezer.com/artist/vrod', icon: '🎶' },
      { label: 'Tidal', url: 'https://tidal.com/artist/vrod', icon: '🌊' }
    ],
    exclusivePlatforms: [
      { label: 'OnlyFans @lilveronicar', url: 'https://onlyfans.com/lilveronicar', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
      { label: 'OnlyFans @lilvrod', url: 'https://onlyfans.com/lilvrod', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' }
    ]
  }

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{
           backgroundImage: `url(${profileData.bgImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Glassmorphism card */}
      <div className="w-full max-w-lg bg-black/20 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl relative z-20 overflow-hidden">
        {/* Header */}
        <div className="text-center p-8 space-y-6">
          <div className="flex items-center justify-center">
            <img
              src={profileData.avatar}
              alt={profileData.title}
              className="h-28 w-28 rounded-full border-4 border-white/30 shadow-xl object-cover"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-bold text-white">{profileData.title}</h1>
              {profileData.verified && (
                <Verified className="h-6 w-6 text-blue-400 fill-current" />
              )}
            </div>
            <p className="text-white/80 text-lg">{profileData.username}</p>

            {/* Stats */}
            <div className="flex justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{profileData.totalFollowers} followers</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">{profileData.profileVisits} visits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 space-y-6">
          {/* Social Media Platforms */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Social Media</h3>
            <div className="space-y-2">
              {profileData.socialPlatforms.map((platform, index) => (
                <button
                  key={index}
                  onClick={() => openLink(platform.url)}
                  className={`w-full h-14 ${platform.color} rounded-xl flex items-center justify-between px-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  <span className="text-left">
                    <div className="text-sm font-medium">{platform.label}</div>
                    <div className="text-xs opacity-80">{platform.followers} followers</div>
                  </span>
                  <ExternalLink className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Streaming Platforms */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Music Streaming</h3>
            <div className="grid grid-cols-2 gap-2">
              {profileData.streamingPlatforms.map((platform, index) => (
                <button
                  key={index}
                  onClick={() => openLink(platform.url)}
                  className="h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center gap-2 text-white font-medium text-sm transition-all duration-300 hover:scale-105"
                >
                  <span>{platform.icon}</span>
                  <span>{platform.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exclusive Content */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Exclusive Content</h3>
            <div className="space-y-2">
              {profileData.exclusivePlatforms.map((platform, index) => (
                <button
                  key={index}
                  onClick={() => openLink(platform.url)}
                  className={`w-full h-12 ${platform.color} rounded-xl flex items-center justify-between px-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  <span>{platform.label}</span>
                  <ExternalLink className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact/Join Button */}
          <button
            onClick={() => openLink('mailto:contact@vrod.com')}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20"
          >
            📧 Contact V Rod
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 text-center">
          <p className="text-white/60 text-xs">
            Created: April 3, 2024 • Last Updated: May 12, 2025
          </p>
        </div>
      </div>
    </div>
  )
}

export default VRodProfileCard