import json
import requests
from bs4 import BeautifulSoup
import time

INPUT_FILE = "stations_merged_v1.json"
OUTPUT_FILE = "stations_with_wiki_coords.json"
NOT_FOUND_FILE = "stations_not_found.json"

def get_wikipedia_coordinates(station_name: str):
    """
    Try multiple Wikipedia URL patterns to fetch decimal coordinates.
    Returns (lat, lng) or (None, None) if not found.
    """
    session = requests.Session()
    candidates = [
        station_name.replace(" ", "_") + "_metro_station",
        station_name.replace(" ", "_") + "_metro",
        station_name.replace(" ", "_"),
    ]
    
    for page_name in candidates:
        url = f"https://en.wikipedia.org/wiki/{page_name}"
        try:
            resp = session.get(url, timeout=10)
            resp.raise_for_status()
        except requests.RequestException:
            continue
        
        soup = BeautifulSoup(resp.content, "html.parser")
        # Primary: <span class="geo">lat; lng</span>
        geo = soup.find("span", class_="geo")
        if geo and ";" in geo.text:
            lat_str, lng_str = geo.text.split(";")
            try:
                return float(lat_str.strip()), float(lng_str.strip())
            except ValueError:
                pass
        
        # Fallback: <span class="geo-dec">lat°N lng°E</span>
        geo_dec = soup.find("span", class_="geo-dec")
        if geo_dec:
            text = geo_dec.text.replace("°", "")
            parts = text.split()
            if len(parts) >= 2:
                lat_part, lng_part = parts[0], parts[1]
                try:
                    lat = float(lat_part[:-1]) * (1 if lat_part[-1] in "Nn" else -1)
                    lng = float(lng_part[:-1]) * (1 if lng_part[-1] in "Ee" else -1)
                    return lat, lng
                except (ValueError, IndexError):
                    pass

        time.sleep(0.5)  # polite pause
    
    return None, None

def main():
    # Load input JSON
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    stations = data.get("stations", {})

    not_found = []

    for name, info in stations.items():
        print(f"Processing: {name}")
        lat, lng = get_wikipedia_coordinates(name)
        if lat is not None and lng is not None:
            print(f"  Found: {lat}, {lng}")
            info["lat"] = lat
            info["lng"] = lng
        else:
            print("  WARNING: Coordinates not found")
            not_found.append(name)
        time.sleep(1)

    # Write enriched stations
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump({"stations": stations}, f, ensure_ascii=False, indent=2)
    print(f"Updated stations written to {OUTPUT_FILE}")

    # Write not-found list
    with open(NOT_FOUND_FILE, "w", encoding="utf-8") as f:
        json.dump({"not_found": not_found}, f, ensure_ascii=False, indent=2)
    print(f"Stations not found written to {NOT_FOUND_FILE}")

if __name__ == "__main__":
    main()
