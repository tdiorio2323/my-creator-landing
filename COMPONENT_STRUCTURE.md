# Subscription Platform Component Structure

## Core Layout Components
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx           // Navigation, auth buttons
│   │   ├── Footer.jsx           // Links, legal
│   │   └── Sidebar.jsx          // Dashboard navigation
│   
│   ├── public/
│   │   ├── Hero.jsx             // Landing hero section
│   │   ├── FeaturedCreators.jsx // Trending creators grid
│   │   ├── CategoryGrid.jsx     // Content categories
│   │   └── SearchBar.jsx        // Global search
│   
│   ├── creator/
│   │   ├── CreatorCard.jsx      // Creator preview card
│   │   ├── CreatorProfile.jsx   // Full profile view
│   │   ├── ContentFeed.jsx      // Creator's content grid
│   │   ├── SubscriptionTiers.jsx // Pricing options
│   │   └── TipButton.jsx        // Donation component
│   
│   ├── subscriber/
│   │   ├── PersonalizedFeed.jsx // Main subscriber feed
│   │   ├── BookmarksList.jsx    // Saved content
│   │   ├── NotificationCenter.jsx // Alerts & updates
│   │   └── Wallet.jsx           // Purchase history
│   
│   ├── creator-dashboard/
│   │   ├── UploadCenter.jsx     // Drag-drop media upload
│   │   ├── ContentManager.jsx   // Manage posts/pricing
│   │   ├── Analytics.jsx        // Revenue & engagement stats
│   │   ├── MessagingPanel.jsx   // Fan communication
│   │   └── PayoutTracker.jsx    // Earnings overview
│   
│   ├── content/
│   │   ├── MediaPlayer.jsx      // Video/image viewer
│   │   ├── ContentCard.jsx      // Post preview
│   │   ├── PaywallModal.jsx     // PPV unlock interface
│   │   └── CommentSection.jsx   // Engagement area
│   
│   └── common/
│       ├── Button.jsx           // Reusable button styles
│       ├── Modal.jsx            // Popup container
│       ├── LoadingSpinner.jsx   // Loading states
│       └── PriceTag.jsx         // Pricing display
```

## Page Structure
```
pages/
├── index.js                     // Landing page
├── explore.js                   // Browse all creators
├── creator/
│   └── [id].js                  // Creator profile page
├── dashboard/
│   ├── index.js                 // Subscriber dashboard
│   ├── bookmarks.js             // Saved content
│   └── wallet.js                // Purchase history
├── creator-dashboard/
│   ├── index.js                 // Creator overview
│   ├── upload.js                // Content upload
│   ├── analytics.js             // Stats & earnings
│   └── messages.js              // Fan communication
├── auth/
│   ├── login.js                 // Sign in
│   └── register.js              // Sign up
└── _app.js                      // Global layout & providers
```