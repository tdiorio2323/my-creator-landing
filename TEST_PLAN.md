# E2E Test Plan (Auth, Payments, Content)

## Environments
- Local: `npm run dev` at http://localhost:3000
- Staging/Prod: Vercel deployment (custom domain: colombia.cabanagrp.com)
- Test creds: Stripe test card `4242 4242 4242 4242` (any future date / any CVC)

## 1) Authentication Flows
- Email/Password: Register via `/auth/register`, confirm email (mock in dev), sign in/out.
- OAuth: Initiate Google/Apple/X; verify callback to `/auth/callback` and session persistence.
- Access: After login, dashboard loads and `useAuth` provides `user`.

## 2) Creator Onboarding
- Create a creator profile (if not present) via `/creator-dashboard` flow.
- Update profile: display name, bio, avatar upload; verify avatar appears on `/creator/[id]`.

## 3) Subscription Purchase
- From a creator page, choose tier (Basic, Premium, VIP, Ultra).
- Checkout: Redirects to Stripe. Use test card; complete.
- Return: Verify subscription status updates and tier shows active in dashboard.

## 4) Content Upload & Feed
- Upload: Go to `/creator-dashboard/upload`, upload image and video; set `requiredTier`.
- Feed: Hit `/api/content/feed` and homepage feed to see new items (free shows media, paid hides).
- View: Call `/api/content/{id}/view` when subscribed; confirm signed URL provided.

## 5) Access Control
- As unsubscribed user: paid content returns 403 with metadata; free content loads.
- As subscribed user: access granted for required tier and below per hierarchy.

## 6) Payments Management
- Manage subscription via billing portal; cancel and verify `currentPeriodEnd` and access until end.

## 7) Regressions & Health
- `npm run lint` clean; `npm run build` succeeds.
- `/api/healthz` returns `{ status: 'ok' }`.

Notes: If DB schema changed (ULTRA tier), run `npx prisma db push` then `npm run prisma:seed`.
