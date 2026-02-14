import { useEffect } from "react";
import L from "leaflet";
import type { Graph } from "../types";
import tailwindColors from "../../../components/colors_for_graph";
import { STYLE_CONFIG } from "../constants";

export function usePathRenderer(
  routeGroup: L.LayerGroup | null,
  customPath: string[],
  stations: Graph,
) {
  useEffect(() => {
    if (!routeGroup || customPath.length === 0) return;

    routeGroup.clearLayers();
    console.log("Custom path:", customPath);

    // Draw the custom path
    for (let i = 0; i + 1 < customPath.length; i++) {
      const from = customPath[i];
      const to = customPath[i + 1];

      const segment: [number, number][] = [
        [stations[from].lat, stations[from].lng],
        [stations[to].lat, stations[to].lng],
      ];

      L.polyline(segment, {
        color: tailwindColors[STYLE_CONFIG.PATH_COLOR],
        weight: STYLE_CONFIG.PATH_WEIGHT,
      }).addTo(routeGroup);
    }
  }, [routeGroup, customPath, stations]);
}
