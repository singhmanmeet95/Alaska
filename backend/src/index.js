import express from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import utilRoutes from "./routes/utilsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import friendshipRoutes from "./routes/friendshipRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://alaska-69fq.vercel.app",
];

// ─── CORS: Manually set headers as the VERY FIRST middleware ───────────────
// This runs before anything else — even if something below crashes,
// the browser will still get CORS headers and won't show CORS errors.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight immediately — no need to go further
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(bodyParser.json());
app.use(express.json());

// ─── Socket.IO ──────────────────────────────────────────────────────────────
// Wrapped in try/catch so if it fails on Vercel, it won't crash the whole app
let io = null;
try {
  io = new Server(httpServer, {
    cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
    transports: IS_PRODUCTION ? ["polling"] : ["websocket", "polling"],
  });
} catch (err) {
  console.warn(
    "Socket.IO failed to initialize (expected on serverless):",
    err.message,
  );
}

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/utils", utilRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/friendships", friendshipRoutes);

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Metro Lines API",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      trips: "/api/trips",
      chats: "/api/chats",
      utils: "/api/utils",
      reviews: "/api/reviews",
    },
  });
});

// ─── Socket.IO Logic ─────────────────────────────────────────────────────────
if (io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_user", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, message } = data;
        if (!senderId || !receiverId || !message) return;

        const friendship = await prisma.friendship.findFirst({
          where: {
            OR: [
              { requesterId: senderId, receiverId: receiverId },
              { requesterId: receiverId, receiverId: senderId },
            ],
            status: "ACCEPTED",
          },
        });

        if (!friendship) {
          socket.emit("error", { message: "You can only chat with friends" });
          return;
        }

        const newMessage = await prisma.chat.create({
          data: { senderId, receiverId, message },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
                profile_image: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                username: true,
                profile_image: true,
              },
            },
          },
        });

        io.to(receiverId).emit("receive_message", newMessage);
        io.to(senderId).emit("message_sent", newMessage);
      } catch (error) {
        console.error("Error sending message via socket:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: IS_PRODUCTION ? undefined : error.message,
  });
});

// ─── Start server (local only) ────────────────────────────────────────────────
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

if (!IS_PRODUCTION) {
  startServer();
}

// Export for Vercel
export default app;
