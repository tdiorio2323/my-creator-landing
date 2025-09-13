# CreatorHub - OnlyFans-Style Creator Platform

A fully functional creator subscription platform built with Next.js, Supabase, and Stripe. This platform allows creators to monetize their content through subscription tiers while providing subscribers with exclusive content access.

## 🚀 Features

### Core Features
- **User Authentication** - Supabase-powered auth with email/password
- **Creator Profiles** - Customizable profiles with bio, categories, and social links
- **Subscription Tiers** - Basic, Premium, and VIP tiers with different pricing and benefits
- **Content Management** - Upload and manage photos, videos, and text content
- **Gated Content** - Tier-based access control for exclusive content
- **Payment Processing** - Stripe checkout and subscription management
- **Real-time Messaging** - Direct messaging between creators and subscribers
- **Analytics Dashboard** - Revenue tracking, subscriber metrics, and content performance

### User Types
- **Subscribers** - Browse creators, subscribe to tiers, access exclusive content
- **Creators** - Manage subscription tiers, upload content, track analytics
- **Admin** - Platform oversight and management (future feature)

## 🛠 Tech Stack

- **Framework**: Next.js 14 with Pages Router
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth
- **Payments**: Stripe (Checkout + Billing Portal)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-creator-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL files in order in the Supabase SQL editor:
     ```
     sql/01_create_tables.sql
     sql/02_create_policies.sql
     sql/03_create_functions.sql
     sql/04_seed_data.sql (optional)
     ```

5. **Set up Stripe**
   - Create Stripe products and prices for subscription tiers
   - Set up webhook endpoint for your domain
   - Update environment variables with your keys

## 🚀 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Key User Flows

### For Subscribers
1. Registration → Browse creators → Subscribe to tier → Access content
2. Dashboard → View feed → Manage subscriptions → Message creators

### For Creators
1. Registration → Set up profile → Create tiers → Upload content
2. Creator Dashboard → View analytics → Manage content → Message subscribers

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
├── components/           # React components
├── contexts/            # React contexts (Auth)
├── lib/                # Utility libraries
├── pages/              # Next.js pages and API routes
├── sql/                # Database schema
└── styles/             # Global styles
```

## 🚨 Important Notes

- Ensure Supabase database is set up before running
- Configure Stripe webhooks for payment processing
- Update environment variables for production
- Implement content moderation for safety

Built with ❤️ using Next.js, Supabase, and Stripe.
