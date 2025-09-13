# 🚀 Production Deployment Checklist

## 🔐 Security & Environment Setup

### 1. Rotate Exposed Keys (URGENT)
- [ ] **Stripe Keys**: Create new secret & publishable keys in Stripe Dashboard
- [ ] **Supabase Keys**: Regenerate anon key in Project Settings → API
- [ ] **NextAuth Secret**: Generate strong random string for production
- [ ] Update all keys in production environment variables

### 2. Environment Variables
Set these in your hosting platform (Vercel/Netlify/etc.):

```bash
# Stripe (use production keys)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase 
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Application
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secure-secret

# Optional: Custom Stripe Price IDs
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_VIP=price_...
```

## 🗄️ Database Setup

### 1. Run SQL Files in Supabase
Execute in order in Supabase SQL Editor:
```sql
-- 1. Create tables and types
sql/01_create_tables.sql

-- 2. Set up Row Level Security policies  
sql/02_create_policies.sql

-- 3. Create helper functions
sql/03_create_functions.sql

-- 4. (Optional) Seed sample data for testing
sql/04_seed_data.sql
```

### 2. Verify RLS Policies
- [ ] All tables have RLS enabled
- [ ] Users can only access their own data
- [ ] Content access is properly gated by subscription

## 💳 Stripe Configuration

### 1. Create Products & Prices
In Stripe Dashboard → Products:
- [ ] Basic Tier: $9.99/month
- [ ] Premium Tier: $19.99/month  
- [ ] VIP Tier: $49.99/month

### 2. Webhook Setup
- [ ] Endpoint: `https://your-domain.com/api/stripe/webhook`
- [ ] Events to send:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
  - `invoice.payment_succeeded`

### 3. Billing Portal Configuration
- [ ] Configure customer portal settings in Stripe Dashboard
- [ ] Set allowed features (update payment methods, cancel subscription, etc.)

## 📁 Supabase Storage Setup

### 1. Create Storage Buckets
```sql
-- In Supabase Dashboard → Storage
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('creator-content', 'creator-content', false),
  ('creator-thumbs', 'creator-thumbs', true),
  ('message-media', 'message-media', false),
  ('avatars', 'avatars', true);
```

### 2. Storage Policies
Set up RLS policies for each bucket:
- `creator-content`: Private, access via signed URLs
- `creator-thumbs`: Public read, creator write
- `message-media`: Private, sender/recipient access
- `avatars`: Public read, user write own

## 🔧 Application Build & Deploy

### 1. Final Build Test
```bash
npm run build
# Should complete without errors
```

### 2. Deploy Application
```bash
# For Vercel
vercel --prod

# For Netlify
netlify deploy --prod

# For other platforms, follow their deployment guide
```

### 3. Post-Deploy Verification
- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Stripe checkout redirects properly
- [ ] Webhook endpoint responds (test in Stripe Dashboard)
- [ ] Content access gating works
- [ ] Storage uploads function

## 🧪 Testing Checklist

### User Flows
- [ ] **Registration**: Create account → verify email → access platform
- [ ] **Creator Setup**: Register as creator → create tiers → upload content
- [ ] **Subscription**: Browse creator → select tier → complete checkout → access content
- [ ] **Content Access**: Verify gated content requires subscription
- [ ] **Billing**: Manage subscription via billing portal
- [ ] **Messaging**: Send/receive messages between users

### Payment Testing
- [ ] Use Stripe test cards for checkout flow
- [ ] Verify webhook processing creates subscription record
- [ ] Test subscription cancellation
- [ ] Verify billing portal functionality

## 🚨 Security Verification

### Final Security Checks
- [ ] No secrets committed to repository
- [ ] All API endpoints have rate limiting
- [ ] Database has proper RLS policies
- [ ] File uploads have size/type validation
- [ ] User input is sanitized
- [ ] Error messages don't expose internal details

### Performance
- [ ] Images optimized (consider next/image upgrades)
- [ ] Database queries indexed properly
- [ ] CDN configured for static assets
- [ ] Lighthouse score > 90

## 📊 Monitoring & Analytics

### Post-Launch Setup
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Google Analytics, Mixpanel, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure database backups
- [ ] Set up log aggregation

## 📞 Support & Documentation

### User Documentation
- [ ] Create help center/FAQ
- [ ] Document subscription management
- [ ] Content upload guidelines
- [ ] Community guidelines

### Admin Documentation  
- [ ] Deployment procedures
- [ ] Troubleshooting guide
- [ ] Database backup/restore procedures
- [ ] Incident response playbook

---

## 🎯 MVP Launch Readiness

The platform is ready for MVP launch when:
- ✅ All security items completed
- ✅ Payment processing working end-to-end
- ✅ Content gating functional
- ✅ User registration/authentication stable
- ✅ Core user flows tested
- ✅ Production environment configured

**Estimated Setup Time**: 2-4 hours for technical setup + testing time

**Next Steps After Launch**:
1. Monitor user feedback and error rates
2. Implement additional content moderation
3. Add analytics and user insights
4. Scale infrastructure as needed
5. Implement advanced features (live streaming, tips, etc.)