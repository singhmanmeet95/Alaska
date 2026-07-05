import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all trips
export const getAllTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profile_image: true,
            ratings: true,
            ratingCount: true,
          },
        },
      },
    });
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get trip by ID
export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profile_image: true,
            ratings: true,
            ratingCount: true,
          },
        },
      },
    });

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new trip
export const createTrip = async (req, res) => {
  try {
    const { userId, startTime, stationList, length, startStation, endStation } =
      req.body;

    const trip = await prisma.trip.create({
      data: {
        userId,
        startTime: new Date(startTime),
        stationList,
        length,
        startStation,
        endStation,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profile_image: true,
            ratings: true,
            ratingCount: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    if (error.code === "P2003") {
      res.status(400).json({ success: false, error: "User not found" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Update trip
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, stationList, length, startStation, endStation } =
      req.body;

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        startTime: startTime ? new Date(startTime) : undefined,
        stationList,
        length,
        startStation,
        endStation,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profile_image: true,
            ratings: true,
            ratingCount: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Trip not found" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Delete trip
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.trip.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Trip not found" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
// Get trips by user ID
export const getTripsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await prisma.trip.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profile_image: true,
            ratings: true,
            ratingCount: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    const history = await prisma.tripHistory.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profile_image: true,
            ratings: true,
            ratingCount: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    const allTrips = [...trips, ...history].sort((a, b) => b.startTime - a.startTime);

    res.status(200).json({ success: true, data: allTrips });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get trips by station
export const getTripsByStation = async (req, res) => {
  try {
    const stationId = parseInt(req.params.station, 10);
    
    if (isNaN(stationId)) {
      return res.status(400).json({ success: false, error: "Invalid station ID" });
    }

    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { startStation: stationId },
          { endStation: stationId },
          { stationList: { has: stationId } },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profile_image: true,
            ratings: true,
            ratingCount: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
