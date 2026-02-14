import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MAP_CONFIG, STYLE_CONFIG } from "../constants";

export function useMapInitialization() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  const [map, setMap] = useState<L.Map | null>(null);
  const [routeGroup, setRouteGroup] = useState<L.LayerGroup | null>(null);
  const [edgesGroup, setEdgesGroup] = useState<L.LayerGroup | null>(null);

  useEffect(() => {
    if (map || !containerRef.current) return;

    // Check if container already has a map (prevents StrictMode double init)
    const container = containerRef.current;
    if ((container as any)._leaflet_id) {
      console.log(
        "useMapInitialization: Container already initialized, skipping",
      );
      return;
    }

    console.log("useMapInitialization: Creating map");

    // Initialize map
    const newMap = L.map(container).setView(MAP_CONFIG.CENTER, MAP_CONFIG.ZOOM);
    setMap(newMap);

    // Add tile layer
    L.tileLayer(MAP_CONFIG.TILE_LAYER_URL, {
      opacity: MAP_CONFIG.TILE_LAYER_OPACITY,
    }).addTo(newMap);

    // Create route layer
    const newRouteGroup = L.layerGroup().addTo(newMap);
    setRouteGroup(newRouteGroup);

    // Create custom pane for edges with lower z-index
    newMap.createPane("edgesPane");
    newMap.getPane("edgesPane")!.style.zIndex = STYLE_CONFIG.EDGES_PANE_Z_INDEX;
    const newEdgesGroup = L.layerGroup([], { pane: "edgesPane" }).addTo(newMap);
    setEdgesGroup(newEdgesGroup);

    // Setup zoom handler for marker resizing
    newMap.on("zoomend", () => {
      const z = newMap.getZoom();
      const newR = Math.max(
        STYLE_CONFIG.MARKER_RADIUS_MIN,
        z * STYLE_CONFIG.MARKER_RADIUS_ZOOM_FACTOR,
      );
      markersRef.current.forEach((m) => m.setRadius(newR));
    });

    console.log("useMapInitialization: Map created successfully");

    // Cleanup function
    return () => {
      console.log("useMapInitialization: Cleaning up map");
      newMap.remove();
      markersRef.current = [];
    };
  }, []); // Remove map from dependency array to prevent infinite loop

  return {
    map,
    containerRef,
    routeGroup,
    edgesGroup,
    markersRef,
  };
}
