# Deployment Guide: Docker Compose on Vercel

This guide explains how to deploy the Alaska project using Docker Compose on Vercel. 

## Understanding Vercel's Architecture vs. Docker Compose

Traditionally, Vercel is a serverless platform optimized for frontend frameworks and serverless/edge functions. It does not natively run long-living Docker Compose stacks (which include background services, stateful databases like PostgreSQL, Redis, and MongoDB) as standard deployments.

However, **Vercel Sandboxes** run in their own Firecracker microVMs with a dedicated kernel. According to Vercel documentation, Sandboxes support system-privileged processes, allowing workloads that require system-level access, **including running container runtimes like Docker**.

Below are the two approaches to deploy this project on Vercel:

---

### Approach 1: Using Vercel Sandboxes (Experimental Docker Support)

Using Vercel's new Sandbox CLI (`sbx` / `vercel sandbox`), you can provision a persistent microVM environment, install Docker, and run your `docker-compose.yml`.

#### 1. Install Sandbox CLI

Install the Sandbox CLI globally using your preferred package manager:
```bash
npm i -g sandbox
# OR
vercel sandbox
```

#### 2. Create a Persistent Sandbox

Create a persistent sandbox environment where we can run our system. We will publish the necessary ports for the frontend (8080) and API endpoints if needed.

```bash
sandbox create --name alaska-env --timeout 24h --publish-port 8080
```
*(Note: Adjust the timeout based on your needs. Sandboxes can be made persistent without expiration depending on your Vercel plan).*

#### 3. Connect to the Sandbox and Setup Docker

Connect to the sandbox terminal:
```bash
sandbox connect --name alaska-env
```

Inside the sandbox, install Docker and Docker Compose (standard Linux installation steps):
```bash
# Update packages and install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

#### 4. Run the Project

Copy your project files to the sandbox (run this from your local machine):
```bash
sandbox copy ./ my-sandbox:/app
```

Then inside the sandbox terminal, start the docker-compose stack:
```bash
cd /app
docker compose -f docker-compose.prod.yml up -d
```
Your frontend will now be accessible via the Sandbox's public URL on port 8080.

---

### Approach 2: The Native Vercel Way (Recommended for Production)

If you want a highly scalable, production-ready deployment on Vercel, it is recommended to split the Docker Compose stack into Vercel-native services and managed databases:

1. **Frontend (`frontend`)**: Deploy directly to Vercel as a standard project.
   - Run `vercel` in the `frontend/` directory.
   - Environment variables (`VITE_API_URL`, etc.) should be configured in the Vercel Dashboard to point to your deployed backend URLs.

2. **Backend APIs (`api`, `chat-gateway`, `chat-worker`)**: 
   - These can be deployed as separate Vercel projects using Serverless Functions (or combined into an Express/Next.js API). 
   - Note: Long-running WebSockets (often used in chat gateways) may require adapting to Serverless-friendly alternatives like Pusher, Supabase Realtime, or deploying the Node.js workers to a container platform (like AWS ECS or Render) since Vercel Serverless Functions have execution time limits.

3. **Databases (`db`, `redis`, `mongodb`)**:
   - **PostgreSQL (`db`)**: Use **Vercel Postgres**.
   - **Redis (`redis`)**: Use **Vercel KV**.
   - **MongoDB (`mongodb`)**: Use **MongoDB Atlas**.
   
Update your `.env` variables in Vercel to point to these managed database URIs instead of the local Docker container names.

## Summary
While you *can* run Docker Compose using Vercel's Firecracker-based Sandboxes for development or specific workloads, transforming your architecture to use managed Vercel resources (Vercel Postgres, Vercel KV) will provide a more resilient and idiomatic production deployment on Vercel.
