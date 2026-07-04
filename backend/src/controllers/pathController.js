import express from "express";
import { PrismaClient } from "@prisma/client";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

const TIME_WINDOW_MINUTES = 120; // Increased to catch overlapping trips even if start times differ significantly
const AVG_STATION_TIME_MINUTES = 3; // Est. time between stations
const MATCH_THRESHOLD_MINUTES = 20; // Strict window for "meeting" at the overlap

function getLongestCommonWithIndices(st, candidateIds) {
  let v = 0;
  let l = 0;
  let bestLen = 0;
  let bestEndPosRef = -1;
  let bestEndPosCand = -1;

  for (let i = 0; i < candidateIds.length; i++) {
    const c = candidateIds[i];

    while (v !== -1 && !st[v].next.has(c)) {
      v = st[v].link;
      if (v !== -1) l = st[v].len;
    }

    if (v === -1) {
      v = 0;
      l = 0;
    } else {
      v = st[v].next.get(c);
      l++;
    }

    if (l > bestLen) {
      bestLen = l;
      bestEndPosRef = st[v].firstEndPos;
      bestEndPosCand = i;
    }
  }

  const startRef = bestEndPosRef !== -1 ? bestEndPosRef - bestLen + 1 : -1;
  const startCand = bestEndPosCand !== -1 ? bestEndPosCand - bestLen + 1 : -1;

  return { length: bestLen, startRef, startCand };
}

function deserializeSam(serializedSam) {
  if (!serializedSam || !serializedSam.st) return null;
  return serializedSam.st.map(state => ({
    ...state,
    next: new Map(state.next)
  }));
}

// ---------- Express Route ----------



// ---------- POST: User sends custom stationList (and optional startTime), get matching trips ----------
router.post("/match_trips", optionalAuth, async (req, res) => {
  try {
    const { sam, startTime, k, totalStations } = req.body;

    if (!sam) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid SAM payload" });
    }

    const st = deserializeSam(sam);
    if (!st) {
      return res.status(400).json({ success: false, error: "Failed to deserialize SAM" });
    }

    let refTime = null;
    let dateFilter = {};

    if (startTime) {
      refTime = new Date(startTime);
      if (isNaN(refTime.getTime()))
        return res
          .status(400)
          .json({ success: false, error: "Invalid startTime" });

      const minTime = new Date(refTime.getTime() - TIME_WINDOW_MINUTES * 60000);
      const maxTime = new Date(refTime.getTime() + TIME_WINDOW_MINUTES * 60000);
      dateFilter = { startTime: { gte: minTime, lte: maxTime } };
    }

    if (req.user) {
      dateFilter.userId = { not: req.user.id };
    }

    const trips = await prisma.trip.findMany({
      where: dateFilter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profile_image: true,
            ratings: true,
          },
        },
      },
    });

    let userFriendships = [];
    if (req.user) {
      userFriendships = await prisma.friendship.findMany({
        where: {
          OR: [{ requesterId: req.user.id }, { receiverId: req.user.id }],
        },
      });
    }

    const results = trips.map((trip) => {
      // Database has Int[] for stationList
      const candidatePath = trip.stationList;

      // Use SAM to find LCS and indices
      const { length, startRef, startCand } = getLongestCommonWithIndices(st, candidatePath);

      let timeDiffAtOverlap = null;
      let isViable = false;

      if (length > 0) {
        if (refTime) {
          const timeToReachOverlapRef = startRef * AVG_STATION_TIME_MINUTES;
          const timeToReachOverlapCan = startCand * AVG_STATION_TIME_MINUTES;

          const overlapTimeRef = new Date(
            refTime.getTime() + timeToReachOverlapRef * 60000,
          );
          const overlapTimeCan = new Date(
            trip.startTime.getTime() + timeToReachOverlapCan * 60000,
          );

          timeDiffAtOverlap = Math.round(
            (overlapTimeCan - overlapTimeRef) / 60000,
          );

          if (Math.abs(timeDiffAtOverlap) <= MATCH_THRESHOLD_MINUTES) {
            isViable = true;
          }
        } else {
          isViable = true; // Without time constraint, any overlap is viable
        }
      }

      let friendshipStatus = "NONE";
      let friendshipId = null;
      if (req.user) {
        const relationship = userFriendships.find(
          (f) =>
            (f.requesterId === trip.user.id && f.receiverId === req.user.id) ||
            (f.receiverId === trip.user.id && f.requesterId === req.user.id),
        );
        if (relationship) {
          friendshipId = relationship.id;
          if (
            relationship.status === "PENDING" &&
            relationship.receiverId === req.user.id
          ) {
            friendshipStatus = "RECEIVED_REQUEST";
          } else if (
            relationship.status === "PENDING" &&
            relationship.requesterId === req.user.id
          ) {
            friendshipStatus = "SENT_REQUEST";
          } else {
            friendshipStatus = relationship.status;
          }
        }
      }

      return {
        ...trip,
        lcsLen: length,
        startInQuery: startRef,
        startInCandidate: startCand,
        timeDiffAtOverlap,
        isViable,
        friendshipStatus,
        friendshipId,
      };
    });

    let finalResults = results;
    if (refTime) {
      finalResults = results.filter((r) => r.isViable);
    }

    finalResults.sort((a, b) => b.lcsLen - a.lcsLen);

    // Pagination
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedResults = finalResults.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedResults,
      count: paginatedResults.length,
      total: finalResults.length,
      totalPages: Math.ceil(finalResults.length / limit),
      currentPage: page,
      query: {
        totalStations: totalStations || 0,
        startTime: refTime,
        page,
        limit,
      },
      message: `Found ${paginatedResults.length} matching trips (page ${page} of ${Math.ceil(finalResults.length / limit)})`,
    });
  } catch (error) {
    console.error("Error in match_trips:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
