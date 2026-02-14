export const MAP_CONFIG = {
  CENTER: [28.5771, 77.1113] as [number, number],
  ZOOM: 10.8,
  TILE_LAYER_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  TILE_LAYER_OPACITY: 0.2,
};

export const DATA_CONFIG = {
  METRO_DATA_URL: "/metro_data/metro_data.json",
};

export const STYLE_CONFIG = {
  EDGES_PANE_Z_INDEX: "200",
  EDGE_WEIGHT: 1.2,
  PATH_WEIGHT: 7,
  MARKER_RADIUS_MULTIPLIER: 0.3,
  MARKER_RADIUS_MIN: 2,
  MARKER_RADIUS_ZOOM_FACTOR: 0.4,
  PATH_COLOR: "black",
  PATH_PANE_Z_INDEX: "350",
};
