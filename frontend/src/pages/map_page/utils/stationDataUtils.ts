import type { Graph, Station } from "../types";
import { DATA_CONFIG } from "../constants";

/**
 * Normalizes station data by trimming all station and neighbor names
 */
export function normalizeStationData(data: {
  stations: Record<string, Station>;
}): Graph {
  const graph: Graph = {};

  for (const [rawName, st] of Object.entries(data.stations)) {
    const name = rawName.trim();
    const nbrs: Record<string, number> = {};

    for (const [rawNbr, d] of Object.entries(st.neighbors)) {
      nbrs[rawNbr.trim()] = d;
    }

    graph[name] = { ...st, neighbors: nbrs };
  }

  return graph;
}

/**
 * Fetches and processes station data from the JSON file
 */
export async function fetchStations(): Promise<Graph> {
  const response = await fetch(DATA_CONFIG.METRO_DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch metro data: ${response.statusText}`);
  }
  const data = await response.json();
  const graph = normalizeStationData(data);
  return graph;
}
