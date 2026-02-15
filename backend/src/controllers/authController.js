import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Register new user
export const register = async (req, res) => {
  try {
    const { name, username, email, password, about, bio } = req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, username, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or username",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        about: about || "",
        bio: bio || "",
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profile_image: true,
        about: true,
        bio: true,
        images: true,
        ratings: true,
        ratingCount: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user; // Set by auth middleware

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, about, bio, image, images } = req.body;

    // Check if username is taken by another user
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username is already taken",
        });
      }
    }

    // Update user
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(about !== undefined && { about }),
        ...(bio !== undefined && { bio }),
        ...(image !== undefined && { profile_image: image }), // Map 'image' input to 'profile_image'
        ...(images !== undefined && { images }), // Add images array support
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profile_image: true,
        about: true,
        bio: true,
        images: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

// Google OAuth callback

// Add image to profile gallery
export const addProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        images: {
          push: imageUrl,
        },
      },
      select: {
        id: true,
        images: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Image added successfully",
      data: updatedUser.images,
    });
  } catch (error) {
    console.error("Add image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add image",
      error: error.message,
    });
  }
};

// Delete image from profile gallery
export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    // 1. Get current images
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { images: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2. Filter out the image to delete
    const newImages = user.images.filter((img) => img !== imageUrl);

    // 3. Update with new array
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        images: newImages,
      },
      select: {
        id: true,
        images: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: updatedUser.images,
    });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

// Logout (client-side token removal, but we can blacklist tokens if needed)
export const logout = async (req, res) => {
  try {
    // In a more complex setup, you might want to blacklist the token
    // For now, just return success as the client will remove the token

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
