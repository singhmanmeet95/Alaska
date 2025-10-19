import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all chats
export const getAllChats = async (req, res) => {
  try {
    const chats = await prisma.chat.findMany({
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get chat by ID
export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new chat message
export const createChat = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const chat = await prisma.chat.create({
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
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: chat });
  } catch (error) {
    if (error.code === "P2003") {
      res
        .status(400)
        .json({ success: false, error: "Sender or receiver not found" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Update chat message
export const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const chat = await prisma.chat.update({
      where: { id },
      data: {
        message,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Chat not found" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Delete chat message
export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.chat.delete({
      where: { id },
    });
    res
      .status(200)
      .json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Chat not found" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Get chats between two users
export const getChatsBetweenUsers = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get chats for a specific user (sent or received)
export const getChatsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
