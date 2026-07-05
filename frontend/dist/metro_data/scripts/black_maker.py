import json

# Replace with the path to your JSON file
input_file = "stations_merged.json"
output_file = "stations_merged_v1.json"

# Load the original data
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# For each station, if it has more than 2 neighbors, set its line to "Black"
for station in data.get("stations", {}).values():
    if isinstance(station.get("neighbors"), dict) and len(station["neighbors"]) > 2:
        station["line"] = "Black"

# Save the modified data
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Processed stations. Output written to {output_file}")
