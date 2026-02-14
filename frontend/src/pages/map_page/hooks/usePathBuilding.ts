import { useRef, useState, useCallback } from "react";
import type { Graph, PathBuildingResult } from "../types";
import { extendPath, truncatePath, validateStation } from "../utils/pathUtils";

export function usePathBuilding(): PathBuildingResult {
  const stationsRef = useRef<Graph>({});
  const [customPath, setCustomPath] = useState<string[]>([]);

  const handleStationClick = useCallback((name: string) => {
    setCustomPath((prev) => {
      const currentStations = stationsRef.current;

      // Validate station exists
      if (!validateStation(name, currentStations)) {
        return prev;
      }

      // If empty, start a new path
      if (prev.length === 0) {
        console.log("Starting new path with:", name);
        return [name];
      }

      // Check if clicked station is already in the path (truncate)
      const existingIndex = prev.indexOf(name);
      if (existingIndex !== -1) {
        return truncatePath(prev, name);
      }

      // Extend the path using Dijkstra
      return extendPath(prev, name, currentStations);
    });
  }, []);

  return {
    customPath,
    handleStationClick,
    stationsRef, // Expose ref so it can be updated by useStations
  } as PathBuildingResult & { stationsRef: React.RefObject<Graph> };
}
