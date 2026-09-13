# Deployment Guide

## Recommended Deployment

Use this setup for the real MinPractice system:

| Part | Recommended service | Notes |
|---|---|---|
| Frontend | Vercel | Best fit for Next.js |
| Backend API | Render, Railway, Fly.io, or VPS | Better for long-running NestJS API |
| Database | MongoDB Atlas | Managed MongoDB with backups |
| File storage | S3/R2 later | For images, audio, imported exam files |

## Why This Split

Vercel is excellent for Next.js pages, routing, SSR, and static assets. The NestJS API can run on Vercel serverless, but for this project it is better to deploy the API separately because the platform will need:

- stable API process
- MongoDB connection pooling
- autosave requests during tests
- background jobs later
- import processing later
- easier logs/debugging

## Vercel Frontend Setup

### Option A - Import From Repository Root

This repo already includes `vercel.json`, so this is the preferred setup.

1. Push this project to GitHub.
2. Go to Vercel.
3. Click **Add New Project**.
4. Import the GitHub repo.
5. Keep the project root as the repository root.
6. Vercel will use:

```bash
npm install
npm run build:web
```

Output directory:

```text
apps/web/.next
```

7. Add environment variable:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Option B - Import Only `apps/web`

Use this if you want Vercel to treat the frontend as a standalone app.

1. Set project root to:

```text
apps/web
```

2. Set build command:

```bash
npm run build
```

3. Add environment variable:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

For local development:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## NestJS API Setup

Deploy `apps/api` to a Node.js hosting service.

Required environment variables:

```bash
PORT=3001
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/minpractice
JWT_SECRET=change-me
WEB_ORIGIN=https://your-vercel-domain.vercel.app
```

Build command:

```bash
npm install
npm run build
```

Start command:

```bash
npm run start
```

If deploying from the monorepo root, use:

```bash
npm install
npm run build:api
npm run start -w apps/api
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas project.
2. Create a free or shared cluster.
3. Create a database user.
4. Allow network access from the API hosting provider.
5. Copy the connection string into `MONGODB_URI`.

Database name:

```text
minpractice
```

## Deployment Flow

```mermaid
flowchart TD
  A["Push code to GitHub"] --> B["Vercel builds Next.js"]
  A --> C["API host builds NestJS"]
  C --> D["NestJS connects MongoDB Atlas"]
  B --> E["Next.js calls API URL"]
```

## First Production Checklist

- GitHub repo has latest source
- Vercel project imports `apps/web`
- API hosting imports `apps/api`
- MongoDB Atlas connection string is configured
- `NEXT_PUBLIC_API_URL` points to API production URL
- API `WEB_ORIGIN` points to Vercel domain
- Test these URLs:
  - `/`
  - `/exams/demo-math-01`
  - `/take-test/demo-math-01`
  - `/admin`
  - `GET /api/subjects`
  - `GET /api/exams`
