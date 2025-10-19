import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        about: true,
        bio: true,
        trips: true,
      },
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        trips: true,
        sentChats: true,
        receivedChats: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name, username, email, password, image, about, bio } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password,
        image,
        about,
        bio,
      },
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    if (error.code === "P2002") {
      res
        .status(400)
        .json({ success: false, error: "Username or email already exists" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, email, password, image, about, bio } = req.body;

    // Check if user is updating their own profile
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    // Don't allow password updates through this endpoint
    const updateData = {
      ...(name && { name }),
      ...(username && { username }),
      ...(email && { email }),
      ...(image !== undefined && { image }),
      ...(about !== undefined && { about }),
      ...(bio !== undefined && { bio }),
    };

    // Check if username is taken by another user
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username is already taken",
        });
      }
    }

    // Check if email is taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        about: true,
        bio: true,
      },
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is deleting their own account
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own account",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        trips: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
