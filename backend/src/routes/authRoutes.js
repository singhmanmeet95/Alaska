import express from "express";
import passport from "../config/passport.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  googleCallback,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/error" }),
  googleCallback
);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.post("/change-password", authenticateToken, changePassword);

// Token verification endpoint
router.get("/verify", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    data: req.user,
  });
});

export default router;
