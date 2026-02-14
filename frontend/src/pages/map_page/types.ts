export type Station = {
  lat: number;
  lng: number;
  line: string;
  neighbors: Record<string, number>; // neighbor station name → distance (weight)
};

export type Graph = Record<string, Station>;

export interface MapConfig {
  center: [number, number];
  zoom: number;
  tileLayerUrl: string;
  tileLayerOpacity: number;
}

export interface PathBuildingResult {
  customPath: string[];
  handleStationClick: (name: string) => void;
}

export interface StationsResult {
  stations: Graph;
  isLoading: boolean;
  error: Error | null;
}
