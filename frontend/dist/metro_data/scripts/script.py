import re
import json

INPUT_FILE = "single_json.json"
OUTPUT_FILE = "stations_merged.json"

# Read raw JSON with duplicate keys
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    raw = f.read()

# Regex to extract each station entry from within "stations": { ... }
station_pattern = re.findall(r'"([^"]+)"\s*:\s*({[^{}]+?"neighbors"\s*:\s*{[^{}]*}[^{}]*})', raw)

merged_stations = {}

for station_name, station_block in station_pattern:
    try:
        station_json = json.loads(f'{{"{station_name}": {station_block}}}')
        current = station_json[station_name]

        if station_name not in merged_stations:
            merged_stations[station_name] = current
        else:
            # Merge only new neighbors
            existing_neighbors = merged_stations[station_name]["neighbors"]
            for nbr, dist in current["neighbors"].items():
                if nbr not in existing_neighbors:
                    existing_neighbors[nbr] = dist

    except Exception as e:
        print(f"⚠️ Failed to parse {station_name}: {e}")

# Final output object
output = { "stations": merged_stations }

# Write to a separate file
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

print(f"✅ Merged stations written to: {OUTPUT_FILE}")
