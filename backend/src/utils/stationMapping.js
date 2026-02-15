import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to data.json relative to src/utils
// backend/src/utils -> backend/data.json is ../../data.json
const DATA_PATH = path.resolve(__dirname, "../../data.json");

// Maps to store the static mapping
const stationToId = new Map();
const idToStation = new Map();

/**
 * Normalizes a station name for consistent lookup.
 * Trims whitespace and converts to lowercase.
 * @param {string} name
 * @returns {string}
 */
const normalize = (name) => {
  if (!name) return "";
  return name.toString().trim().toLowerCase();
};

/**
 * Initializes the station mapping by reading data.json.
 * Sorts stations alphabetically to ensure deterministic ID assignment.
 */
const initializeMapping = () => {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      console.error(
        `StationMapping Error: data.json not found at ${DATA_PATH}`,
      );
      return;
    }

    const rawData = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(rawData);

    if (!data.stations) {
      console.error(
        "StationMapping Error: 'stations' key not found in data.json",
      );
      return;
    }

    // Get all station names
    const stationNames = Object.keys(data.stations);

    // Sort alphabetically to verify deterministic order across restarts
    stationNames.sort();

    let idCounter = 1;
    stationNames.forEach((name) => {
      const normalizedName = normalize(name);
      // JSON keys are unique, but normalization might cause collisions if casing differs
      if (!stationToId.has(normalizedName)) {
        stationToId.set(normalizedName, idCounter);
        idToStation.set(idCounter, name); // Store original casing for reverse lookup
        idCounter++;
      } else {
        console.warn(
          `StationMapping Warning: Duplicate station name after normalization: '${name}' converts to '${normalizedName}' which is already mapped.`,
        );
      }
    });

    console.log(
      `Station mapping initialized: ${stationToId.size} stations mapped.`,
    );
  } catch (error) {
    console.error("StationMapping Failed initialization:", error);
  }
};

// Initialize immediately on module load
initializeMapping();

/**
 * Get the integer ID for a given station name.
 * @param {string} name - The station name (case-insensitive)
 * @returns {number|null} - The ID, or null if not found
 */
export const getStationId = (name) => {
  const normalized = normalize(name);
  return stationToId.get(normalized) || null;
};

/**
 * Get the original station name for a given integer ID.
 * @param {number} id
 * @returns {string|null} - The station name, or null if not found
 */
export const getStationName = (id) => {
  return idToStation.get(id) || null;
};

/**
 * Get all mapped station names (original casing).
 * @returns {Array<string>}
 */
export const getAllStationNames = () => {
  return Array.from(idToStation.values());
};

/**
 * Debug: Get the entire mapping object.
 */
export const getMappingObject = () => {
  const obj = {};
  for (const [name, id] of stationToId) {
    obj[name] = id;
  }
  return obj;
};
