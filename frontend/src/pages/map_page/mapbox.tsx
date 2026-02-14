import "leaflet/dist/leaflet.css";
import MapOverlay from "../../components/page_based_component/map_overlay/map_overlay";
import { useMapInitialization } from "./hooks/useMapInitialization";
import { usePathBuilding } from "./hooks/usePathBuilding";
import { useStations } from "./hooks/useStations";
import { usePathRenderer } from "./hooks/usePathRenderer";

export default function MapMetro() {
  // Initialize map and get state
  const { map, containerRef, routeGroup, edgesGroup, markersRef } =
    useMapInitialization();

  // Setup path building logic
  const pathBuilding = usePathBuilding();
  const { customPath, handleStationClick } = pathBuilding;

  // Load and render stations
  const { stations } = useStations({
    map,
    edgesGroup,
    markers: markersRef,
    stationsRef: (pathBuilding as any).stationsRef,
    onStationClick: handleStationClick,
  });

  // Render the custom path
  usePathRenderer(routeGroup, customPath, stations);

  return (
    <div className="relative">
      <MapOverlay />
      <div ref={containerRef} style={{ height: "100vh", width: "100%" }}></div>
    </div>
  );
}
