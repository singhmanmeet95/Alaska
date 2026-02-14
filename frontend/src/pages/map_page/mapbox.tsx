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

  // Handle path submission
  const handleSubmit = () => {
    console.log("Submitting path to backend:", customPath);
    // Placeholder for API call
    alert(
      `Route confirmed! ${customPath.length} stations selected.\nCheck console for data array.`,
    );
  };

  return (
    <div className="relative">
      <div className="z-100">
        <MapOverlay customPath={customPath} onSubmit={handleSubmit} />
      </div>
      <div
        ref={containerRef}
        style={{ height: "100vh", width: "100%" }}
        className="z-80 bg-zinc-50"
      ></div>
    </div>
  );
}
