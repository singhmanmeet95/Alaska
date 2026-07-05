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

    return [newStation];
  }

  const lastStation = currentPath[currentPath.length - 1];

  // Validate last station exists
  if (!graph[lastStation]) {

    return [newStation];
  }

  const newSegment = djikstra(graph, lastStation, newStation);

  if (newSegment.length === 0) {

    return [newStation];
  }

  // Ensure the first element of newSegment is the lastStation
  if (newSegment[0] !== lastStation) {

    return currentPath;
  }

  // Extend the path (skip first element of newSegment to avoid duplication)
  const extendedPath = [...currentPath, ...newSegment.slice(1)];

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


  return currentPath.slice(0, existingIndex + 1);
}

/**
 * Validates that a station exists in the graph
 */
export function validateStation(station: string, graph: Graph): boolean {
  if (Object.keys(graph).length === 0) {

    return false;
  }

  if (!graph[station]) {

    return false;
  }

  return true;
}
