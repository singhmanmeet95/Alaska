// src/components/MapMetro.tsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import djikstra from "../../utils/djikstra";
import type { Graph, Station } from "../../utils/djikstra";
import tailwindColors from "../../components/colors_for_graph";
import MapOverlay from "../../components/page_based_component/map_overlay/map_overlay";
export default function MapMetro() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const routeGroupRef = useRef<L.LayerGroup | null>(null);
  const edgesGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  const [stations, setStations] = useState<Graph>({});
  const [selected, setSelected] = useState<string[]>([]);

  const handleStationClick = (name: string) => {
    setSelected((prev) => {
      if (prev.includes(name)) return prev;
      if (prev.length >= 2) return [name];
      return [...prev, name];
    });
  };

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current).setView([28.5771, 77.1113], 10.8);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      opacity: 0.2,
    }).addTo(map);

    routeGroupRef.current = L.layerGroup().addTo(map);
    // Create a custom pane for edges with lower z-index
    map.createPane("edgesPane");
    map.getPane("edgesPane")!.style.zIndex = "200"; // lower than default marker zIndex (which is ~400)
    edgesGroupRef.current = L.layerGroup([], { pane: "edgesPane" }).addTo(map);

    map.on("zoomend", () => {
      const z = map.getZoom();
      const newR = Math.max(2, z * 0.4);
      markersRef.current.forEach((m) => m.setRadius(newR));
    });

    fetch("/metro_data/metro_data.json")
      .then((r) => r.json())
      .then((data: { stations: Record<string, Station> }) => {
        const graph: Graph = {};
        for (const [rawName, st] of Object.entries(data.stations)) {
          const name = rawName.trim();
          const nbrs: Record<string, number> = {};
          for (const [rawNbr, d] of Object.entries(st.neighbors)) {
            nbrs[rawNbr.trim()] = d;
          }
          graph[name] = { ...st, neighbors: nbrs };
        }
        setStations(graph);

        // Add station markers
        Object.entries(graph).forEach(([name, info]) => {
          const radius = map.getZoom() * 0.3;
          const m = L.circleMarker([info.lat, info.lng], {
            radius,
            color: tailwindColors[info.line],
            fillColor: tailwindColors[info.line],
            fillOpacity: 1,
          })
            .bindPopup(name)
            .bindTooltip(name, { permanent: false, direction: "top" })
            .addTo(map)
            .on("click", () => handleStationClick(name));

          markersRef.current.push(m);
        });

        // Add edges (connections) in black
        const added = new Set<string>();
        Object.entries(graph).forEach(([from, info]) => {
          Object.entries(info.neighbors).forEach(([to]) => {
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
                weight: 1.2,
                pane: "edgesPane", // ensure it renders in the lower pane
              }).addTo(edgesGroupRef.current!);
            }
          });
        });
      });
  }, []);

  useEffect(() => {
    if (!mapRef.current || !routeGroupRef.current || selected.length !== 2)
      return;

    routeGroupRef.current.clearLayers();
    const path = djikstra(stations, selected[0], selected[1]);
    console.log("Path found:", path);
    for (let i = 0; i + 1 < path.length; i++) {
      const from = path[i];
      const to = path[i + 1];

      const segment: [number, number][] = [
        [stations[from].lat, stations[from].lng],
        [stations[to].lat, stations[to].lng],
      ];
      L.polyline(segment, { color: tailwindColors["black"], weight: 7 }).addTo(
        routeGroupRef.current!
      );
    }
  }, [selected, stations]);

  return (
    <div ref={containerRef} style={{ height: "100vh", width: "100%" }}>
      <MapOverlay />
    </div>
  );
}
