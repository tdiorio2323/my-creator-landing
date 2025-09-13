# CLAUDE.md

## Project Overview

- **Name**: creator-subscription-platform
- **Version**: 0.1.0
- **Primary Language**: JavaScript
- **Next.js Router**: Pages Router

### Key Technologies
- Next.js Pages Router
- Supabase
- NextAuth.js
- Stripe
- Tailwind CSS
- Framer Motion
- Lucide React

## Directory Structure
```
.
├── AGENTS.md
├── CLAUDE.md
├── COMPONENT_STRUCTURE.md
├── components
│   ├── common
│   ├── content
│   ├── creator
│   ├── creator-dashboard
│   ├── layout
│   ├── messaging
│   ├── public
│   └── subscriber
├── contexts
│   └── AuthContext.js
├── DEPLOYMENT.md
├── legacy
│   ├── index.html
│   ├── src
│   └── vite.config.js
├── lib
│   ├── access.js
│   ├── auth-guards.js
│   ├── config.js
│   ├── rateLimit.js
│   ├── storage.js
│   ├── stripe.js
│   └── supabase.js
├── next.config.js
├── package-lock.json
├── package.json
├── pages
│   ├── _app.js
│   ├── api
│   ├── auth
│   ├── categories.js
│   ├── creator
│   ├── creator-dashboard
│   ├── dashboard
│   ├── explore.js
│   ├── index.js
│   └── success.js
├── postcss.config.js
├── public
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── README.md
├── scripts
│   └── seed.js
├── sql
│   ├── 01_create_tables.sql
│   ├── 02_create_policies.sql
│   ├── 03_create_functions.sql
│   ├── 04_seed_data.sql
│   └── README.md
├── src
├── styles
│   └── globals.css
├── tailwind.config.js
└── utils
    └── auth.js

26 directories, 38 files
```

## Development Commands
```
dev: next dev
build: next build
start: next start
lint: next lint
```

## Environment Variables
**Defined keys**
```
AWS_ACCESS_KEY_ID
AWS_REGION
AWS_S3_BUCKET
AWS_SECRET_ACCESS_KEY
DATABASE_URL
EMAIL_FROM
EMAIL_SERVER_HOST
EMAIL_SERVER_PASSWORD
EMAIL_SERVER_PORT
EMAIL_SERVER_USER
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```
- Check .env*.example for defaults if present.

## API Architecture
- API routes present
- Authentication: NextAuth.js
- Supabase client present; add RLS notes if applicable.
- Payments: Stripe; ensure webhook route configured.

### Image Optimization
- Next.js image domains configured: `domains: ['localhost', 'example.com']`

## Database
- SQL migration files in /sql
- Supabase detected. Confirm RLS policies.

## Build & Run
```bash
npm ci
npm run build
npm start # or: next start / vite preview
```

## Checks
- Lint: `npm run lint` if available
- Typecheck: `npm run typecheck` if TS
- Test: `npm test`

## Notes
- Update sections above as needed. This file is generated and then hand-edited.
