import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";
import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import utilRoutes from "./routes/utilsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const env = process.env;
const PORT = env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Session configuration for OAuth
app.use(
  session({
    secret: env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/utils", utilRoutes);

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
    },
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

app.listen(PORT, () => {
  console.log(`Metro Lines API server is running on port ${PORT}`);
});
