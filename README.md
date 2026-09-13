# MinPractice THPT

MinPractice THPT is a multi-subject exam practice system for students preparing for Vietnamese high-school exams.

The product direction is:

- Frontend: Next.js
- Backend: NestJS
- Database: MongoDB

## Current Scope

- `apps/web`: Next.js frontend skeleton
- `apps/api`: NestJS API skeleton
- `ARCHITECTURE.md`: product architecture, workflows, API draft, and MongoDB schema
- `DEPLOYMENT.md`: Vercel, API hosting, and MongoDB Atlas setup

## Local Development

Install dependencies from the project root:

```bash
npm install
```

Run the frontend:

```bash
npm run dev:web
```

Run the backend:

```bash
npm run dev:api
```

The API expects:

```bash
MONGODB_URI=mongodb://localhost:27017/minpractice
JWT_SECRET=change-me
```
