import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const TIME_WINDOW_MINUTES = 120; // Increased to catch overlapping trips even if start times differ significantly
const AVG_STATION_TIME_MINUTES = 3; // Est. time between stations
const MATCH_THRESHOLD_MINUTES = 20; // Strict window for "meeting" at the overlap

// ---------- Normalize station name ----------
// DB has "Rajiv_Chowk", user types "Rajiv Chowk" — normalize both to same format
function normalizeStation(name) {
  return name.replace(/_/g, " ").toLowerCase().trim();
}

// ---------- Suffix Automaton with Index Tracking ----------
class State {
  constructor() {
    this.len = 0;
    this.link = -1;
    this.next = new Map();
    this.firstEndPos = -1; // 0-based index of end position in reference
  }
}

class SuffixAutomaton {
  constructor(tokens, idmap) {
    this.st = [new State()];
    this.last = 0;
    // Build immediately upon construction
    for (let i = 0; i < tokens.length; i++) {
      // Map token to ID using provided map.
      // If token not in map (should not happen if map built from tokens), fallback?
      // In our usage, map is built from tokens.
      const id = idmap.get(tokens[i]);
      this.extend(id, i);
    }
  }

  extend(c, idx) {
    let cur = this.st.length;
    this.st.push(new State());
    this.st[cur].len = this.st[this.last].len + 1;
    this.st[cur].firstEndPos = idx; // Track end index
    let p = this.last;

    while (p !== -1 && !this.st[p].next.has(c)) {
      this.st[p].next.set(c, cur);
      p = this.st[p].link;
    }

    if (p === -1) {
      this.st[cur].link = 0;
    } else {
      let q = this.st[p].next.get(c);
      if (this.st[p].len + 1 === this.st[q].len) {
        this.st[cur].link = q;
      } else {
        let clone = this.st.length;
        this.st.push(new State());
        this.st[clone].len = this.st[p].len + 1;
        this.st[clone].next = new Map(this.st[q].next);
        this.st[clone].link = this.st[q].link;
        this.st[clone].firstEndPos = this.st[q].firstEndPos; // Clone keeps original's endpos

        while (p !== -1 && this.st[p].next.get(c) === q) {
          this.st[p].next.set(c, clone);
          p = this.st[p].link;
        }

        this.st[q].link = this.st[cur].link = clone;
      }
    }
    this.last = cur;
  }

  // Returns { length: number, startRef: number, startCand: number }
  getLongestCommonWithIndices(candidateTokens, idmap) {
    let v = 0;
    let l = 0;
    let bestLen = 0;
    let bestEndPosRef = -1;
    let bestEndPosCand = -1;

    for (let i = 0; i < candidateTokens.length; i++) {
      const tok = candidateTokens[i];
      if (!idmap.has(tok)) {
        v = 0;
        l = 0;
        continue;
      }
      const c = idmap.get(tok);

      while (v !== -1 && !this.st[v].next.has(c)) {
        v = this.st[v].link;
        if (v !== -1) l = this.st[v].len;
      }

      if (v === -1) {
        v = 0;
        l = 0;
      } else {
        v = this.st[v].next.get(c);
        l++;
      }

      if (l > bestLen) {
        bestLen = l;
        // The state `v` contains longest strings, but we matched length `l`.
        // The end position is `this.st[v].firstEndPos`.
        bestEndPosRef = this.st[v].firstEndPos;
        bestEndPosCand = i;
      }
    }

    // Convert end positions (inclusive) to start positions (inclusive)
    // Start = End - Length + 1
    const startRef = bestEndPosRef !== -1 ? bestEndPosRef - bestLen + 1 : -1;
    const startCand = bestEndPosCand !== -1 ? bestEndPosCand - bestLen + 1 : -1;

    return { length: bestLen, startRef, startCand };
  }
}

// ---------- Express Route ----------

router.get("/sorted_trips", async (req, res) => {
  try {
    const tripId = req.query.id;
    if (!tripId) {
      return res
        .status(400)
        .json({ success: false, error: "tripId is required" });
    }

    // 1. Fetch the Reference Trip
    const queryTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!queryTrip) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    // 2. Fetch candidate trips broadly
    const refTime = new Date(queryTrip.startTime);
    const minTime = new Date(refTime.getTime() - TIME_WINDOW_MINUTES * 60000);
    const maxTime = new Date(refTime.getTime() + TIME_WINDOW_MINUTES * 60000);

    const trips = await prisma.trip.findMany({
      where: {
        AND: [
          { id: { not: tripId } },
          { startTime: { gte: minTime, lte: maxTime } },
        ],
      },
      include: {
        user: { select: { id: true, name: true, username: true, email: true } },
      },
    });

    // 3. Match Logic
    const queryPath = queryTrip.stationList.map(normalizeStation);

    // Create ID Map for the Reference Path
    const idmap = new Map();
    let nextId = 1;
    for (const tok of queryPath) {
      if (!idmap.has(tok)) idmap.set(tok, nextId++);
    }

    // Build SAM on Reference Path
    const sa = new SuffixAutomaton(queryPath, idmap);

    const results = trips.map((trip) => {
      const candidatePath = trip.stationList.map(normalizeStation);

      // Use SAM to find LCS and indices
      const { length, startRef, startCand } = sa.getLongestCommonWithIndices(
        candidatePath,
        idmap,
      );

      // Analyze Timing
      let timeDiffAtOverlap = null;
      let isViable = false;

      if (length > 0) {
        // Calculate estimated arrival at the 'start' of the shared segment
        const timeToReachOverlapRef = startRef * AVG_STATION_TIME_MINUTES;
        const timeToReachOverlapCan = startCand * AVG_STATION_TIME_MINUTES;

        const overlapTimeRef = new Date(
          refTime.getTime() + timeToReachOverlapRef * 60000,
        );
        const overlapTimeCan = new Date(
          trip.startTime.getTime() + timeToReachOverlapCan * 60000,
        );

        // Difference in minutes at the meeting point
        timeDiffAtOverlap = Math.round(
          (overlapTimeCan - overlapTimeRef) / 60000,
        );

        // Match if at shared station within strict threshold
        if (Math.abs(timeDiffAtOverlap) <= MATCH_THRESHOLD_MINUTES) {
          isViable = true;
        }
      }

      return {
        ...trip,
        lcsLen: length,
        startInQuery: startRef,
        startInCandidate: startCand,
        timeDiffAtOverlap,
        isViable,
      };
    });

    const viableMatches = results.filter((r) => r.isViable);
    viableMatches.sort((a, b) => b.lcsLen - a.lcsLen);

    res.json({
      success: true,
      data: viableMatches,
      count: viableMatches.length,
      message: `Found ${viableMatches.length} overlapping trips synchronized within ~${MATCH_THRESHOLD_MINUTES} mins`,
    });
  } catch (error) {
    console.error("Error in sorted_trips:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------- POST: User sends custom stationList (and optional startTime), get matching trips ----------
router.post("/match_trips", async (req, res) => {
  try {
    const { stationList, startTime, k } = req.body;

    if (
      !stationList ||
      !Array.isArray(stationList) ||
      stationList.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid stationList" });
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

    const trips = await prisma.trip.findMany({
      where: dateFilter,
      include: {
        user: { select: { id: true, name: true, username: true, email: true } },
      },
    });

    const queryPath = stationList.map(normalizeStation);

    // Create ID Map for the Reference Path
    const idmap = new Map();
    let nextId = 1;
    for (const tok of queryPath) {
      if (!idmap.has(tok)) idmap.set(tok, nextId++);
    }

    // Build SAM on Reference Path
    const sa = new SuffixAutomaton(queryPath, idmap);

    const results = trips.map((trip) => {
      const candidatePath = trip.stationList.map(normalizeStation);

      // Use SAM to find LCS and indices
      const { length, startRef, startCand } = sa.getLongestCommonWithIndices(
        candidatePath,
        idmap,
      );

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

      return {
        ...trip,
        lcsLen: length,
        startInQuery: startRef,
        startInCandidate: startCand,
        timeDiffAtOverlap,
        isViable,
      };
    });

    let finalResults = results;
    if (refTime) {
      finalResults = results.filter((r) => r.isViable);
    }

    finalResults.sort((a, b) => b.lcsLen - a.lcsLen);

    // Limit to top k
    const limit = k ? parseInt(k) : 10;
    const topKResults = finalResults.slice(0, limit);

    res.json({
      success: true,
      data: topKResults,
      count: topKResults.length,
      query: {
        stationList,
        totalStations: stationList.length,
        startTime: refTime,
        k: limit,
      },
      message: `Found ${topKResults.length} matching trips (top ${limit} requested)`,
    });
  } catch (error) {
    console.error("Error in match_trips:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
