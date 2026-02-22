import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Send friend request
export const sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const requesterId = req.user.id;

    if (requesterId === receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot send request to yourself" });
    }

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Friendship interaction already exists",
      });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        receiverId,
        status: "PENDING",
      },
    });

    res.status(201).json({ success: true, data: friendship });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Accept friend request
export const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params; // friendship ID
    const userId = req.user.id;

    const friendship = await prisma.friendship.findUnique({ where: { id } });

    if (!friendship)
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });

    if (friendship.receiverId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updated = await prisma.friendship.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reject/Delete friend request
export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const friendship = await prisma.friendship.findUnique({ where: { id } });

    if (!friendship)
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });

    if (friendship.receiverId !== userId && friendship.requesterId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await prisma.friendship.delete({ where: { id } });

    res
      .status(200)
      .json({ success: true, message: "Request rejected/deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get pending requests (received)
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      include: {
        requester: {
          select: { id: true, name: true, username: true, profile_image: true },
        },
      },
    });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get friends
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { receiverId: userId }],
        status: "ACCEPTED",
      },
      include: {
        requester: {
          select: { id: true, name: true, username: true, profile_image: true },
        },
        receiver: {
          select: { id: true, name: true, username: true, profile_image: true },
        },
      },
    });

    // Extract the other user from each friendship
    const friends = requests.map((f) =>
      f.requesterId === userId ? f.receiver : f.requester,
    );

    res.status(200).json({ success: true, data: friends });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove friend by user ID
export const removeFriendByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, receiverId: friendId },
          { requesterId: friendId, receiverId: userId },
        ],
      },
    });

    if (!friendship) {
      return res
        .status(404)
        .json({ success: false, message: "Friendship not found" });
    }

    await prisma.friendship.delete({
      where: { id: friendship.id },
    });

    res
      .status(200)
      .json({ success: true, message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
