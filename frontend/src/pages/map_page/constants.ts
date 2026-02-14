export const MAP_CONFIG = {
  // Map ka default center point (Latitude, Longitude) - Delhi focus
  CENTER: [28.5971, 77.2113] as [number, number],
  // Starting zoom level (jitna bada number, utna close view)
  ZOOM: 11.87,
  // Map ka skin/design URL (CartoDB Light - "Positron" style to remove black overlay look)
  TILE_LAYER_URL:
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  // Map ki transparency (1.0 = fully visible map)
  TILE_LAYER_OPACITY: 1,
};

export const DATA_CONFIG = {
  // Metro stations aur lines ka data file source
  METRO_DATA_URL: "/metro_data/metro_data.json",
};

export const STYLE_CONFIG = {
  // Background lines ki layering depth (sabse neeche)
  EDGES_PANE_Z_INDEX: "200",
  // Background lines ki motai (patli lines)
  EDGE_WEIGHT: 1,
  // Selected path ki motai (Highlighter effect ke liye mota rakha hai)
  PATH_WEIGHT: 5,
  // Station circle size calculate karne ka base multiplier
  MARKER_RADIUS_MULTIPLIER: 0.4,
  // Station marker ka minimum size (isse chhota nahi hoga)
  MARKER_RADIUS_MIN: 5,
  // Zoom karne par marker kis rate se bada hoga
  MARKER_RADIUS_ZOOM_FACTOR: 0.4,
  // Selected path ka color (Dark Blue for visibility on light map)
  PATH_COLOR: "blue-700",
  // Selected path ki layering position (Background ke upar, Stations ke neeche)
  PATH_PANE_Z_INDEX: "350",
};
