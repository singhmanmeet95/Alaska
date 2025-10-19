import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ---------- Suffix Automaton Logic ----------
class State {
  constructor() {
    this.len = 0;
    this.link = -1;
    this.next = new Map();
  }
}

class SuffixAutomaton {
  constructor() {
    this.st = [];
    this.init();
  }

  init() {
    this.st = [new State()];
    this.last = 0;
  }

  extend(c) {
    let cur = this.st.length;
    this.st.push(new State());
    this.st[cur].len = this.st[this.last].len + 1;
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

        while (p !== -1 && this.st[p].next.get(c) === q) {
          this.st[p].next.set(c, clone);
          p = this.st[p].link;
        }

        this.st[q].link = this.st[cur].link = clone;
      }
    }
    this.last = cur;
  }

  longestCommonWithRow(row, idmap) {
    let v = 0,
      l = 0,
      best = 0;
    for (const tok of row) {
      if (!idmap.has(tok)) {
        v = 0;
        l = 0;
        continue;
      }
      const c = idmap.get(tok);
      if (this.st[v].next.has(c)) {
        v = this.st[v].next.get(c);
        l++;
      } else {
        while (v !== -1 && !this.st[v].next.has(c)) {
          v = this.st[v].link;
        }
        if (v === -1) {
          v = 0;
          l = 0;
        } else {
          l = this.st[v].len + 1;
          v = this.st[v].next.get(c);
        }
      }
      best = Math.max(best, l);
    }
    return best;
  }
}

// ---------- Sorting Function ----------
export function sortTripsByTripId(trips, queryTripId) {
  const queryTrip = trips.find((t) => t.id === queryTripId);
  if (!queryTrip) return trips; // agar trip id invalid hai to same data return karo

  const queryTokens = queryTrip.stationList;
  const idmap = new Map();
  let nextId = 1;

  for (const tok of queryTokens) {
    if (!idmap.has(tok)) idmap.set(tok, nextId++);
  }

  const sa = new SuffixAutomaton();
  for (const tok of queryTokens) {
    sa.extend(idmap.get(tok));
  }

  const scoredTrips = trips.map((trip) => {
    const lcsLen = sa.longestCommonWithRow(trip.stationList, idmap);
    return { ...trip, lcsLen };
  });

  scoredTrips.sort((a, b) => b.lcsLen - a.lcsLen);
  return scoredTrips;
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

    // Fetch trips directly from database instead of making HTTP request
    const trips = await prisma.trip.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const sortedTrips = sortTripsByTripId(trips, tripId);

    res.json({
      success: true,
      data: sortedTrips,
      message: `Trips sorted by similarity to trip ${tripId}`,
    });
  } catch (error) {
    console.error("Error in sorted_trips:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
