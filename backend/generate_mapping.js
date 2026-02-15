import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

console.log("Script starting...");

try {
  const { getStationId, getStationName, getAllStationNames } =
    await import("./src/utils/stationMapping.js");
  console.log("Imported stationMapping.js");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const OUTPUT_PATH = path.join(__dirname, "station_codes.json");
  console.log(`Writing output to ${OUTPUT_PATH}`);

  const mapping = {};
  const allStations = getAllStationNames();
  console.log(`Found ${allStations.length} stations.`);

  allStations.forEach((station) => {
    const id = getStationId(station);
    if (id) {
      mapping[station] = id;
    }
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mapping, null, 2));

  console.log(`Generated station codes mapping at ${OUTPUT_PATH}`);
  console.log(`Total stations mapped: ${Object.keys(mapping).length}`);
} catch (error) {
  console.error("Script failed:", error);
}
