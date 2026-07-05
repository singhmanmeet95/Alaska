import json
import requests
from bs4 import BeautifulSoup

INPUT_JSON = "stations_merged_v1.json"
MISSING_TXT = "missing_stations.txt"
MATCHED_JSON = "stations_matched.json"
WIKI_URL = "https://en.wikipedia.org/wiki/List_of_Delhi_Metro_stations"

def fetch_wiki_station_names():
    resp = requests.get(WIKI_URL, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    names = set()
    for tbl in soup.find_all("table", class_="wikitable"):
        for row in tbl.find_all("tr")[1:]:  # skip header
            cell = row.find("td")
            if not cell:
                continue
            name = cell.get_text(strip=True)
            if name:
                names.add(name.strip().lower())
    return names

def main():
    # 1. Load JSON stations
    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
    stations = data.get("stations", {})

    # 2. Scrape Wikipedia
    wiki_names = fetch_wiki_station_names()
    print(f"✅ Found {len(wiki_names)} stations on Wikipedia.")

    # 3. Compare
    missing = []
    matched = {}

    for raw_name, info in stations.items():
        key = raw_name.strip().lower()
        if key in wiki_names:
            matched[raw_name] = info
        else:
            missing.append(raw_name)

    # 4. Output missing
    with open(MISSING_TXT, "w", encoding="utf-8") as f:
        for name in missing:
            f.write(name + "\n")
    print(f"ℹ️ {len(missing)} station(s) missing. See {MISSING_TXT}")

    # 5. Output matched JSON
    with open(MATCHED_JSON, "w", encoding="utf-8") as f:
        json.dump({"stations": matched}, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved matched stations in {MATCHED_JSON}")

if __name__ == "__main__":
    main()
