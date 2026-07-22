# Welcome

Welcome to the **Alaska** repository! This project is a intiative to make a social media platform based upon your daily routes you take on your metro journey.

currently it supports on only delhi metro .

here you can enlist your path onto the website and it will match you with  travellers who match most of your path with you you can also connect with them add them as your friends and chat with them.

The architecture has been carefully designed as a set of decoupled services using modern technologies to ensure **maximum performance, high availability, and extreme durability** under heavy load.

---

## 🏗️ Architecture Overview

The system is broken down into distinct services, orchestrated via Docker Compose, separating concerns to allow independent scaling and fault tolerance.

### 1. Core API (Backend)

- **Location:** `/backend`
- **Role:** Handles all core business logic, including user authentication, trip management, friendships, and reviews.
- **Key Tech:** Node.js, Express, Prisma ORM.
- **Why?** Express provides a lightweight and robust framework for building REST APIs. Prisma ensures type-safe database queries, reducing runtime errors and improving developer velocity. By separating core logic from real-time chat, the API remains highly responsive even when chat traffic spikes.

### 2. Real-Time Chat System (Gateway & Worker)

To ensure chat performance doesn't degrade the core API, real-time messaging is split into two specialized microservices:

* **Chat Gateway (`/chat-gateway`)**

  - **Role:** Manages persistent WebSocket connections using `Socket.io`.
  - **Why?** WebSockets hold open connections, which can quickly exhaust server resources. By isolating connection management to a dedicated gateway, we can scale it horizontally using the Redis adapter. It immediately offloads incoming messages to a queue, keeping the event loop unblocked and ensuring ultra-fast message acknowledgment.
* **Chat Worker (`/chat-worker`)**

  - **Role:** Processes the messages queued by the Gateway. It handles validation, database persistence (saving messages via Prisma), and routing.
  - **Why?** Database writes are relatively slow compared to WebSocket communication. If the database experiences latency, the Worker absorbs the shock by processing the Redis queue at its own pace. This prevents the Gateway from crashing and ensures zero message loss (high durability).

### 3. Frontend

- **Location:** `/frontend`
- **Role:** The user-facing application providing interactive maps, trip planning, and chat interfaces.
- **Key Tech:** React 19, Vite, Tailwind CSS v4, shadcn/ui, Zustand, Framer Motion, Mapbox GL.
- **Why?**
  - **Vite** replaces Webpack for incredibly fast Hot Module Replacement (HMR) and optimized, smaller production builds.
  - **Zustand** provides centralized state management that is much faster and requires less boilerplate than Redux, minimizing unnecessary re-renders.
  - **Tailwind v4 & shadcn/ui** ensure a highly consistent, accessible, and performant UI without heavy runtime CSS-in-JS overhead.

### 4. Infrastructure & Data Layer

- **PostgreSQL:** The primary relational database for strong data integrity (ACID compliance) and complex querying for trips and social graphs.
- **PgBouncer:** A lightweight connection pooler for PostgreSQL.
  - *Performance Impact:* Node.js services (Core API, Chat Worker) open many database connections. PgBouncer multiplexes these connections, preventing PostgreSQL from running out of memory or connection slots. This massively increases the durability and stability of the data layer under load.
- **Redis:** Acts as an in-memory cache and message broker.
  - *Performance Impact:* Facilitates the Socket.io adapter for scaling the Chat Gateway across multiple instances, and serves as the high-speed queue decoupling the Gateway from the Worker.

---

## 🚀 How Our Stack Increases Performance & Durability

### 1. Decoupled Chat Processing (Extreme Durability)

In a traditional monolithic architecture, a flood of chat messages can overwhelm the server, block the event loop, and cause regular API requests (like loading a trip) to timeout. By using a **Gateway-Worker-Queue pattern (Redis)**, we guarantee durability. If the database goes down or slows down, messages simply wait safely in Redis. The Gateway continues accepting connections seamlessly.

### 2. Connection Pooling with PgBouncer (High Availability)

Serverless or microservice architectures easily hit PostgreSQL connection limits (usually ~100 max). PgBouncer sits in front of the database and manages a smart pool of connections. This ensures that even if our backend and workers scale up to dozens of instances, the database remains stable, responsive, and protected from connection exhaustion.

### 3. Frontend Optimization (Perceived Performance)

By leveraging **React 19** and **Vite**, the time-to-interactive (TTI) is drastically reduced. **Zustand** prevents the React tree from over-rendering during rapid state changes (e.g., incoming real-time chat messages). Combined with **Tailwind CSS** (which compiles down to minimal static CSS), the client-side experience remains incredibly fluid even on lower-end devices.

---

## 🛠️ Getting Started

The entire application environment is containerized using Docker, ensuring that it runs identically on every machine.

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed.

### Running Local Development

1. Clone the repository.
2. Ensure you have the required `.env` files in each service directory (you can copy `.env.example` to `.env`).
3. Start the entire stack:
   ```bash
   docker-compose up --build
   ```
4. **Access the services:**
   - Frontend: `http://localhost:8000`
   - Core API: `http://localhost:3000`
   - Chat Gateway: `http://localhost:4001`
   - PostgreSQL / PgBouncer / Redis run in the background on their respective ports.

Enjoy building with Alaska!
