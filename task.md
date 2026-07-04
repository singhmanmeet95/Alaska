# Chat Microservice Implementation Tasks

- `[x]` Refactor Main Backend
  - `[x]` Remove chat logic from `backend/src/index.js`
  - `[x]` Remove Chat models from `backend/prisma/schema.prisma`
  - `[x]` Delete `chatController.js` and `chatRoutes.js`
- `[x]` Setup Dedicated Node.js Gateway (`chat-gateway`)
  - `[x]` Create `package.json`
  - `[x]` Create `index.js` (Express, Socket.IO, Redis Pub/Sub, Axios)
  - `[x]` Create `Dockerfile`
- `[x]` Setup Hono.js Serverless Workers (`chat-worker`)
  - `[x]` Create `package.json`
  - `[x]` Create Mongoose models (`models/Chat.js`)
  - `[x]` Create `src/index.js` (Hono routes, MongoDB connect, Redis Pub/Sub)
  - `[x]` Create `Dockerfile`
- `[x]` Update Orchestration
  - `[x]` Add services to `docker-compose.yml`
  - `[x]` Add services to `docker-compose.prod.yml`
