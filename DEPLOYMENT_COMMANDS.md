# DEPLOYMENT COMMANDS - Docker Required

## Prerequisites
- Docker Desktop installed and running
- Current directory: `/Users/tylerdiorio/my-creator-landing`

## Complete Deployment Script

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting self-hosted stack deployment..."

# 1) Verify Docker is available
docker version || { echo "❌ Install & start Docker Desktop first"; exit 1; }

# 2) Generate SuperTokens API key if needed
if grep -q "<GENERATE_32_CHAR_KEY>" .env.local; then
  SUPERTOKENS_KEY=$(openssl rand -base64 32)
  sed -i '' "s/<GENERATE_32_CHAR_KEY>/${SUPERTOKENS_KEY}/" .env.local
  echo "✅ Generated SuperTokens API key"
fi

# 3) Start infrastructure services
echo "🐳 Starting Docker services..."
docker compose -f docker-compose.override.yml up -d

# 4) Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 15

# Health checks
docker compose ps
curl -sS http://localhost:3567/hello | grep -q "Hello" && echo "✅ SuperTokens OK" || echo "❌ SuperTokens not ready"
nc -z localhost 5432 && echo "✅ Postgres OK" || echo "❌ Postgres not listening"
nc -z localhost 9000 && echo "✅ MinIO OK" || echo "❌ MinIO not listening"

# 5) Setup database schema
echo "📊 Setting up database schema..."
npx prisma generate
npx prisma db push

# 6) Create MinIO bucket
echo "🪣 Creating MinIO bucket..."
COMPOSE_NET="$(basename "$PWD")_default"
docker run --rm --network "${COMPOSE_NET}" \
  -e MC_HOST_minio="http://minioadmin:minioadmin@minio:9000" \
  minio/mc mb -p minio/creator-content || echo "Bucket may already exist"

# 7) Start application
echo "🚀 Starting Next.js application..."
npm run dev

echo "✅ Deployment complete!"
echo "📱 Application: http://localhost:3000"
echo "🗄️ MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
echo "🔐 SuperTokens: http://localhost:3567/hello"
```

## Manual Step-by-Step Instructions

### 1. Start Infrastructure
```bash
docker compose -f docker-compose.override.yml up -d
```

### 2. Verify Services
```bash
# Check service status
docker compose ps

# Test SuperTokens
curl http://localhost:3567/hello

# Test MinIO
curl http://localhost:9000/minio/health/live

# Test Postgres
nc -z localhost 5432 && echo "Postgres ready"
```

### 3. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Verify tables created
docker compose exec postgres psql -U postgres -d creatorhub -c "\\dt"
```

### 4. Setup Storage
```bash
# Create bucket via Docker
docker run --rm --network creatorhub_default \
  -e MC_HOST_minio="http://minioadmin:minioadmin@minio:9000" \
  minio/mc mb -p minio/creator-content
```

### 5. Start Application
```bash
npm run dev
```

## Service URLs
- **Application**: http://localhost:3000
- **MinIO Console**: http://localhost:9001 (admin: minioadmin/minioadmin)
- **SuperTokens Health**: http://localhost:3567/hello
- **Postgres**: localhost:5432 (postgres/password)

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker compose logs postgres
docker compose logs supertokens
docker compose logs minio

# Restart services
docker compose down
docker compose up -d
```

### Database Connection Issues
```bash
# Test connection
psql "postgresql://postgres:password@localhost:5432/creatorhub" -c "SELECT now();"

# Reset database
docker compose down -v
docker compose up -d
npx prisma db push
```

### MinIO Access Issues
```bash
# Verify bucket exists
docker compose exec minio mc ls minio/

# Recreate bucket
docker compose exec minio mc mb minio/creator-content
```

## Ready State Verification
- ✅ All Docker services healthy
- ✅ Database tables created (`npx prisma studio`)
- ✅ MinIO bucket `creator-content` exists
- ✅ SuperTokens responding at :3567/hello
- ✅ Next.js app running at :3000
- ✅ No Supabase imports in codebase