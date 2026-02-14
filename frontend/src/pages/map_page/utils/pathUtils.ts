import djikstra from "../../../utils/djikstra";
import type { Graph } from "../types";

/**
 * Extends the current path by running Dijkstra from the last station to the new station
 */
export function extendPath(
  currentPath: string[],
  newStation: string,
  graph: Graph,
): string[] {
  if (currentPath.length === 0) {
    console.log("Starting new path with:", newStation);
    return [newStation];
  }

  const lastStation = currentPath[currentPath.length - 1];

  // Validate last station exists
  if (!graph[lastStation]) {
    console.log(`Last station ${lastStation} not found, starting new path`);
    return [newStation];
  }

  console.log(`Finding path from ${lastStation} to ${newStation}`);
  const newSegment = djikstra(graph, lastStation, newStation);
  console.log("Dijkstra result:", newSegment);

  if (newSegment.length === 0) {
    console.log("No path found, starting new path");
    return [newStation];
  }

  // Ensure the first element of newSegment is the lastStation
  if (newSegment[0] !== lastStation) {
    console.error(
      "Dijkstra returned invalid path - first element should be lastStation",
    );
    console.log("Expected:", lastStation, "Got:", newSegment[0]);
    return currentPath;
  }

  // Extend the path (skip first element of newSegment to avoid duplication)
  const extendedPath = [...currentPath, ...newSegment.slice(1)];
  console.log("Previous path:", currentPath);
  console.log("New segment (without first):", newSegment.slice(1));
  console.log("Extended path:", extendedPath);

  return extendedPath;
}

/**
 * Truncates the path to the specified station (inclusive)
 */
export function truncatePath(currentPath: string[], station: string): string[] {
  const existingIndex = currentPath.indexOf(station);
  if (existingIndex === -1) {
    return currentPath;
  }

  console.log("Truncating path to:", station);
  return currentPath.slice(0, existingIndex + 1);
}

/**
 * Validates that a station exists in the graph
 */
export function validateStation(station: string, graph: Graph): boolean {
  if (Object.keys(graph).length === 0) {
    console.log("Stations data not loaded yet");
    return false;
  }

  if (!graph[station]) {
    console.log(`Station ${station} not found in graph`);
    return false;
  }

  return true;
}
