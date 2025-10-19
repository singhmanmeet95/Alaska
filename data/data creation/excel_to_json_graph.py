import pandas as pd
import json
import os

def excel_to_json_graph(excel_path):
    xls = pd.ExcelFile(excel_path)
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name)
        stations = df.to_dict(orient="records")
        graph = {"stations": {}}

        for i, row in enumerate(stations):
            name = str(row["Station Name"]).strip()
            dist = float(row["Distance from Start (km)"])
            lat = float(row["Latitude"])
            lng = float(row["Longitude"])

            neighbors = {}
            if i > 0:
                prev = stations[i - 1]
                neighbors[str(prev["Station Name"]).strip()] = round(dist - prev["Distance from Start (km)"], 2)
            if i < len(stations) - 1:
                nxt = stations[i + 1]
                neighbors[str(nxt["Station Name"]).strip()] = round(nxt["Distance from Start (km)"] - dist, 2)

            graph["stations"][name] = {
                "lat": lat,
                "lng": lng,
                "line": sheet_name,
                "neighbors": neighbors
            }

        json_path = f"delhi_{sheet_name.lower().replace(' ', '_')}.json"
        with open(json_path, "w") as f:
            json.dump(graph, f, indent=2)
        print(f"✅ Saved: {json_path}")

if __name__ == "__main__":
    excel_file = "delhi_metro_lines.xlsx"  # change if needed
    excel_to_json_graph(excel_file)
