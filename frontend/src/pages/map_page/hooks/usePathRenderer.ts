import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Graph } from "../types";
import tailwindColors from "../../../components/colors_for_graph";
import { STYLE_CONFIG } from "../constants";

export function usePathRenderer(
  routeGroup: L.LayerGroup | null,
  customPath: string[],
  stations: Graph,
) {
  const renderedSegmentsRef = useRef<L.Polyline[]>([]);
  const lastPathLengthRef = useRef(0);

  useEffect(() => {
    if (!routeGroup) return;

    // Handle empty path or reset
    if (customPath.length === 0) {
      routeGroup.clearLayers();
      renderedSegmentsRef.current = [];
      lastPathLengthRef.current = 0;
      return;
    }

    const currentSegments = renderedSegmentsRef.current;

    // Check for path truncation/change that requires clearing
    // If the new path is shorter or the prefix doesn't match, we might need to rebuild
    // But simplistic approach: if shorter, trim. If prefix mismatch, clear & rebuild.
    // For now, let's assume valid prefix match for extension/truncation optimization.

    if (customPath.length < lastPathLengthRef.current + 1) {
      // Truncation: remove lines from the end with animation
      const newSegmentCount = Math.max(0, customPath.length - 1);

      for (let i = currentSegments.length - 1; i >= newSegmentCount; i--) {
        const layer = currentSegments[i];

        // precise removal animation
        const path = layer.getElement() as SVGPathElement | undefined;
        if (path) {
          const length = path.getTotalLength();
          path.style.strokeDasharray = `${length} ${length}`;
          path.style.transition = "stroke-dashoffset 0.5s ease-in"; // ease-in for exit
          // Force reflow
          path.getBoundingClientRect();
          path.style.strokeDashoffset = `${length}`;

          // Remove after animation completes
          setTimeout(() => {
            if (routeGroup.hasLayer(layer)) {
              routeGroup.removeLayer(layer);
            }
          }, 500);
        } else {
          routeGroup.removeLayer(layer);
        }
      }

      renderedSegmentsRef.current = currentSegments.slice(0, newSegmentCount);
      lastPathLengthRef.current = customPath.length;
      return;
    }

    // Extension: add new segments
    // Start index is the number of existing valid segments
    const startIndex = renderedSegmentsRef.current.length;

    for (let i = startIndex; i < customPath.length - 1; i++) {
      const from = customPath[i];
      const to = customPath[i + 1];

      // Skip if stations not loaded yet
      if (!stations[from] || !stations[to]) continue;

      const segmentCoords: [number, number][] = [
        [stations[from].lat, stations[from].lng],
        [stations[to].lat, stations[to].lng],
      ];

      const polyline = L.polyline(segmentCoords, {
        color: tailwindColors[STYLE_CONFIG.PATH_COLOR],
        weight: STYLE_CONFIG.PATH_WEIGHT,
        className: "path-segment-animated",
        pane: "pathPane", // Fix z-index layering
        lineCap: "round", // Fix jagged ends
        lineJoin: "round", // Fix jagged corners
      });

      polyline.addTo(routeGroup);
      renderedSegmentsRef.current.push(polyline);

      // Isolate animation to new segments
      const animate = () => {
        const path = polyline.getElement() as SVGPathElement | undefined;
        if (!path) return;

        const length = path.getTotalLength();
        // Set up initial state (hidden)
        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = `${length}`;

        // Trigger reflow
        path.getBoundingClientRect();

        // Define transition
        path.style.transition = `stroke-dashoffset 0.5s ease-out`;

        // Go to visible state
        path.style.strokeDashoffset = "0";

        // CLEANUP: Remove dasharray after animation to prevent dashed lines on zoom
        setTimeout(() => {
          path.style.strokeDasharray = "";
          path.style.strokeDashoffset = "";
          path.style.transition = "";
        }, 500);
      };

      // Use requestAnimationFrame to ensure DOM element is created by Leaflet
      requestAnimationFrame(() => {
        animate();
      });
    }

    lastPathLengthRef.current = customPath.length;
  }, [routeGroup, customPath, stations]);
}
