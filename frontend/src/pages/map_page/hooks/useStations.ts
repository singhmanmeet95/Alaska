import { useEffect, useState } from "react";
import L from "leaflet";
import type { Graph, StationsResult } from "../types";
import { fetchStations } from "../utils/stationDataUtils";
import tailwindColors from "../../../components/colors_for_graph";
import { STYLE_CONFIG } from "../constants";

interface UseStationsParams {
  map: L.Map | null;
  edgesGroup: L.LayerGroup | null;
  markers: React.RefObject<L.CircleMarker[]>;
  stationsRef: React.RefObject<Graph>;
  onStationClick: (name: string) => void;
}

export function useStations({
  map,
  edgesGroup,
  markers,
  stationsRef,
  onStationClick,
}: UseStationsParams): StationsResult {
  const [stations, setStations] = useState<Graph>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Wait for map and edgesGroup to be initialized
    if (!map || !edgesGroup || hasLoaded) return;



    // Abort flag to prevent rendering if component unmounts
    let aborted = false;

    fetchStations()
      .then((graph) => {
        // Don't render if component unmounted or map removed
        if (aborted) {

          return;
        }



        // Wait for next frame to ensure map DOM is ready
        requestAnimationFrame(() => {
          if (aborted) return;

          // Check if map container is still valid (not removed)
          const container = (map as any)._container;
          if (!container || !container.parentNode) {

            aborted = true;
            return;
          }

          // Force layout recalculation
          map.invalidateSize();

          // Update both state and ref
          stationsRef.current = graph;
          setStations(graph);

          // Render station markers
          try {

            const markersList: L.CircleMarker[] = [];

            Object.entries(graph).forEach(([name, info]) => {
              if (aborted) return;

              const radius =
                map.getZoom() * STYLE_CONFIG.MARKER_RADIUS_MULTIPLIER;
              const marker = L.circleMarker([info.lat, info.lng], {
                radius,
                color: tailwindColors[info.line],
                fillColor: tailwindColors[info.line],
                fillOpacity: 1,
              });

              marker
                .bindPopup(name)
                .bindTooltip(name, { permanent: false, direction: "top" })
                .on("click", () => onStationClick(name))
                .addTo(map);

              markersList.push(marker);
            });

            // Append all new markers
            markers.current!.push(...markersList);



            // Render connection edges
            const added = new Set<string>();
            Object.entries(graph).forEach(([from, info]) => {
              if (aborted) return;
              Object.entries(info.neighbors).forEach(([to]) => {
                if (aborted) return;
                const edgeKey = [from, to].sort().join("-");
                if (added.has(edgeKey)) return;
                added.add(edgeKey);

                if (graph[to]) {
                  const segment: [number, number][] = [
                    [info.lat, info.lng],
                    [graph[to].lat, graph[to].lng],
                  ];
                  L.polyline(segment, {
                    color: tailwindColors[info.line],
                    weight: STYLE_CONFIG.EDGE_WEIGHT,
                    pane: "edgesPane",
                  }).addTo(edgesGroup);
                }
              });
            });

            setHasLoaded(true);
            setIsLoading(false);
          } catch (err) {
            console.error("Error rendering markers:", err);
            // Don't abort completely if partial render failed, but log it
            setError(err instanceof Error ? err : new Error(String(err)));
            setIsLoading(false);
          }
        });
      })
      .catch((err) => {
        if (!aborted) {
          console.error("Error loading metro data:", err);
          setError(err);
          setIsLoading(false);
        }
      });

    // Cleanup: set abort flag
    return () => {

      aborted = true;
    };
  }, [map, edgesGroup, hasLoaded, markers, stationsRef, onStationClick]);

  return { stations, isLoading, error };
}
