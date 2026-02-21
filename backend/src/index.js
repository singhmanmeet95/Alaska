import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
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

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for now
    methods: ["GET", "POST"],
  },
});

const env = process.env;
const PORT = env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/utils", utilRoutes);
app.use("/api/reviews", reviewRoutes);

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

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins their personal room to receive messages
  socket.on("join_user", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message) {
        return;
      }

      // Save message to database
      const newMessage = await prisma.chat.create({
        data: {
          senderId,
          receiverId,
          message,
        },
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

      // Emit to receiver
      io.to(receiverId).emit("receive_message", newMessage);

      // Emit back to sender (for confirmation/UI update if needed)
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    httpServer.listen(PORT, () => {
      console.log(`Metro Lines API server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
