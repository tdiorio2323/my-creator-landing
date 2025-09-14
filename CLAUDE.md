# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CreatorHub is an OnlyFans-style creator subscription platform built with Next.js, Prisma, Stripe, and SuperTokens authentication. Creators can monetize content through tiered subscriptions while subscribers get exclusive access to content based on their subscription level.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management

- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database inspection
- `npx prisma db seed` - Seed database (if seeding is configured)

## Architecture Overview

### Authentication System
- **SuperTokens** handles auth with email/password authentication
- User creation automatically creates corresponding Prisma user records
- Authentication endpoints at `/api/auth/[[...path]].js` handle all auth flows
- Session management integrated with Prisma for user data

### Database Architecture
- **Prisma ORM** with PostgreSQL database
- **Three-tier subscription system**: Basic ($9.99), Premium ($19.99), VIP ($49.99)
- **Role-based access**: SUBSCRIBER, CREATOR, ADMIN
- **Content access control** based on subscription tiers and user roles

### Key Database Models
- `User` - Core user data, linked to SuperTokens
- `Creator` - Extended creator profile with earnings/analytics
- `SubscriptionTier` - Creator-defined pricing tiers
- `Subscription` - Active subscriptions with Stripe integration
- `Content` - Creator content with tier-based access control
- `Payment` - Transaction records linked to Stripe

### Payment Integration
- **Stripe** for subscription management and payments
- Webhook endpoint at `/api/stripe/webhook.js` handles subscription events
- Checkout flow at `/api/stripe/checkout.js`
- Customer portal at `/api/stripe/portal.js`

### Content Access Control
- `lib/access.js` contains all access control logic
- `hasActiveSubscription()` - Checks active subscription status
- `canAccessContent()` - Validates content access based on tier
- `trackContentView()` - Analytics tracking for content views

## Configuration

### Environment Variables
Core required variables (see `lib/config.js` for validation):
```
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
DATABASE_URL
SUPERTOKENS_CONNECTION_URI
SUPERTOKENS_API_KEY
NEXTAUTH_SECRET
```

### Stripe Configuration
- Subscription tiers configured in `lib/config.js`
- Price IDs map to Stripe products: `price_basic_monthly`, `price_premium_monthly`, `price_vip_monthly`
- Webhook events update local subscription status

## File Structure Patterns

### API Routes
- `/api/auth/[[...path]].js` - SuperTokens authentication
- `/api/stripe/*` - Payment processing
- `/api/user/*` - User data management
- `/api/content/*` - Content management
- `/api/messages/*` - Direct messaging

### Components
- `components/creator/` - Creator-specific UI components
- `components/subscriber/` - Subscriber-facing components
- `components/messaging/` - Chat/messaging components
- `components/layout/` - Shared layout components

### Key Utilities
- `lib/prisma.js` - Database client singleton
- `lib/supertokens.js` - Authentication configuration
- `lib/access.js` - Content access control logic
- `lib/config.js` - Application configuration and validation

## Development Workflow

1. **Database Changes**: Update `prisma/schema.prisma` → `npx prisma db push`
2. **Authentication**: SuperTokens handles all auth flows automatically
3. **Payment Testing**: Use Stripe test mode webhooks for local development
4. **Content Access**: Always check user permissions via `lib/access.js` functions

## Important Notes

- **Database migrations**: Use Prisma's push workflow for development
- **Content security**: All content access goes through tier-based validation
- **Stripe webhooks**: Required for subscription status synchronization
- **SuperTokens integration**: User creation automatically syncs with Prisma
- **Image domains**: Configure `next.config.js` for external image sources