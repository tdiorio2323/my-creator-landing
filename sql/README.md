# Database Setup for CreatorHub

This directory contains SQL files to set up the Supabase database for the creator subscription platform.

## Files Overview

1. **01_create_tables.sql** - Creates all the necessary tables and types
2. **02_create_policies.sql** - Sets up Row Level Security policies
3. **03_create_functions.sql** - Creates database functions and triggers
4. **04_seed_data.sql** - Sample data structure (reference only)

## Setup Instructions

### 1. Run in Supabase SQL Editor

Copy and paste each SQL file in order into your Supabase SQL editor:

1. First run `01_create_tables.sql`
2. Then run `02_create_policies.sql` 
3. Then run `03_create_functions.sql`
4. Optionally reference `04_seed_data.sql` for data structure examples

### 2. Database Schema

The schema includes these main entities:

- **profiles** - User profiles (extends auth.users)
- **creators** - Creator-specific information
- **subscription_tiers** - Pricing tiers for creators
- **subscriptions** - Active subscriptions between users and creators
- **content** - Creator content (videos, photos, text, live streams)
- **content_interactions** - Likes, views, bookmarks
- **messages** - Direct messaging between users
- **payments** - Payment records and transactions
- **creator_analytics** - Daily analytics for creators

### 3. Key Features

- **Row Level Security** enabled on all tables
- **Automatic profile creation** when users sign up
- **Real-time subscriber counts** via triggers
- **Content interaction tracking** (views, likes)
- **Flexible subscription tiers** (basic, premium, VIP)
- **Payment integration** ready for Stripe

### 4. Authentication Flow

1. User signs up via Supabase Auth
2. Trigger automatically creates profile record
3. User can upgrade to creator by creating creator record
4. Creators can set up subscription tiers
5. Users can subscribe to creators

### 5. Security

- All tables use Row Level Security
- Users can only access their own data
- Creators can only manage their own content
- Public data (profiles, content) is viewable by everyone
- Sensitive data (payments, analytics) is protected

## Environment Variables Required

Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Next Steps

After running the SQL files:

1. Test user signup/login functionality
2. Create sample creators via the application
3. Set up subscription tiers
4. Test content creation and interactions
5. Integrate Stripe for payments