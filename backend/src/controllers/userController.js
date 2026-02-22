import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        profile_image: true,
        about: true,
        bio: true,
        images: true,
        ratings: true,
        ratingCount: true,
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
        receivedReviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                profile_image: true,
                username: true,
              },
            },
          },
        },
        writtenReviews: {
          include: {
            reviewee: {
              select: {
                id: true,
                name: true,
                profile_image: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    // Fetch friendships to compile a friends list
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: id }, { receiverId: id }],
        status: "ACCEPTED",
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
            bio: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
            bio: true,
          },
        },
      },
    });

    const friendsList = friendships.map((f) =>
      f.requesterId === id ? f.receiver : f.requester,
    );

    userWithoutPassword.friends = friendsList;

    res.status(200).json({ success: true, data: userWithoutPassword });
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
        profile_image: image,
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
    const { name, username, email, password, image, about, bio, images } =
      req.body;

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
      ...(image !== undefined && { profile_image: image }),
      ...(about !== undefined && { about }),
      ...(bio !== undefined && { bio }),
      ...(images !== undefined && { images }),
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
        profile_image: true,
        about: true,
        bio: true,
        images: true,
        ratings: true,
        ratingCount: true,
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

// Upload gallery image
export const uploadGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own gallery",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "alaska_gallery" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, error: error.message });
        }

        try {
          // fetch current user to add the image to the list
          const user = await prisma.user.findUnique({ where: { id } });
          const updatedImages = [...(user.images || []), result.secure_url];

          const updatedUser = await prisma.user.update({
            where: { id },
            data: { images: updatedImages },
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              profile_image: true,
              images: true,
            },
          });

          res.status(200).json({ success: true, data: updatedUser });
        } catch (dbError) {
          res.status(500).json({ success: false, error: dbError.message });
        }
      },
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
