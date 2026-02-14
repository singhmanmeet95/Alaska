# 📄 `mapbox.tsx` — Comprehensive Line-by-Line Documentation

> **File Path:** `frontend/src/pages/map_page/mapbox.tsx`  
> **Purpose:** This file renders an interactive metro map using **Leaflet.js** inside a **React** component. Users can click on metro stations to select two stations, and the app will compute and display the **shortest path** between them using **Dijkstra's algorithm**.

---

## 🏗️ High-Level Overview

| Concept            | Detail                                             |
| ------------------ | -------------------------------------------------- |
| **Library**        | Leaflet.js (open-source mapping library)           |
| **Framework**      | React (with TypeScript)                            |
| **Algorithm**      | Dijkstra's Shortest Path                           |
| **Data Source**    | `/metro_data/metro_data.json` (fetched at runtime) |
| **Component Name** | `MapMetro`                                         |

### What this component does:

1. Initializes a Leaflet map centered on **Delhi, India**.
2. Fetches metro station data from a JSON file.
3. Draws **station markers** (colored circles) and **edge lines** (connections between stations) on the map.
4. Allows the user to **click two stations** to select a source and destination.
5. Runs **Dijkstra's algorithm** to find the shortest path and draws it as a **thick black polyline** on the map.

---

## 📝 Line-by-Line Explanation

---

### Line 1

```tsx
// src/components/MapMetro.tsx
```

- **Kya hai:** Yeh ek **comment** hai.
- **Kya karta hai:** Kuch nahi — sirf developer ke liye ek note hai ki yeh file originally `src/components/MapMetro.tsx` ke roop mein planned thi. Comments ka JavaScript/TypeScript ke behavior pe koi effect nahi hota.

---

### Line 2

```tsx
import { useEffect, useRef, useState } from "react";
```

- **Kya hai:** React ke **3 hooks** import ho rahe hain `react` library se.
- **`useEffect`**: Side effects handle karta hai (jaise API calls, DOM manipulation). Jab component mount hota hai ya koi dependency change hoti hai, tab yeh run hota hai.
- **`useRef`**: Ek mutable reference object create karta hai jo **re-renders ke beech persist** karta hai. Yeh DOM elements ya kisi bhi value ko hold karne ke liye use hota hai bina re-render trigger kiye.
- **`useState`**: Component mein **state** declare karta hai. Jab state change hoti hai, component re-render hota hai.

---

### Line 3

```tsx
import L from "leaflet";
```

- **Kya hai:** **Leaflet.js** library ka default export import ho raha hai as `L`.
- **Kya karta hai:** `L` Leaflet ka main namespace hai. `L.map()`, `L.tileLayer()`, `L.circleMarker()`, `L.polyline()`, `L.layerGroup()` — sab kuch `L` se access hota hai. Yeh puri map rendering engine hai.

---

### Line 4

```tsx
import "leaflet/dist/leaflet.css";
```

- **Kya hai:** Leaflet ka **CSS stylesheet** import ho raha hai.
- **Kya karta hai:** Yeh Leaflet ke map tiles, controls (zoom buttons etc.), popups, aur tooltips ko sahi se style karta hai. Agar yeh import na karo toh map tootaa-phootaa dikhega — tiles overlap honge, zoom buttons galat jagah honge.

---

### Line 5

```tsx
import djikstra from "../../utils/djikstra";
```

- **Kya hai:** Custom **Dijkstra's algorithm** function import ho raha hai `utils/djikstra.tsx` file se.
- **Kya karta hai:** `djikstra(graph, start, end)` — yeh function ek graph, ek start station name, aur ek end station name leta hai aur **shortest path** return karta hai as an array of station names (e.g., `["Station A", "Station B", "Station C"]`).
- **Note:** Filename mein "dijkstra" ki spelling "djikstra" hai — yeh ek typo hai but code ke liye koi issue nahi hai.

---

### Line 6

```tsx
import type { Graph, Station } from "../../utils/djikstra";
```

- **Kya hai:** TypeScript **type imports** hain `djikstra.tsx` se.
- **`Station` type:**
  ```ts
  type Station = {
    lat: number; // latitude (geographical coordinate)
    lng: number; // longitude (geographical coordinate)
    line: string; // metro line ka naam (e.g., "red-400", "blue-400")
    neighbors: Record<string, number>; // { neighborName: distance }
  };
  ```
- **`Graph` type:**
  ```ts
  type Graph = Record<string, Station>;
  // Essentially: { "Rajiv Chowk": Station, "Kashmere Gate": Station, ... }
  ```
- **`import type`** ka matlab: Yeh sirf **compile-time** pe use hota hai TypeScript ke type-checking ke liye. Runtime JavaScript bundle mein yeh include nahi hota — zero cost hai.

---

### Line 7

```tsx
import tailwindColors from "../../components/colors_for_graph";
```

- **Kya hai:** Ek **color mapping object** import ho raha hai.
- **Kya karta hai:** Metro lines ke names (like `"red-400"`, `"blue-400"`) ko actual **hex color codes** mein map karta hai:
  ```ts
  {
    "red-400": "#f87171",
    "blue-400": "#60a5fa",
    "green-400": "#4ade80",
    "black": "#000000",
    // ... aur bhi colors
  }
  ```
- **Usage:** Jab station ya edge draw hota hai, tab `tailwindColors[info.line]` se uski line ka color milta hai.

---

### Line 8

```tsx
import MapOverlay from "../../components/page_based_component/map_overlay/map_overlay";
```

- **Kya hai:** `MapOverlay` React component import ho raha hai.
- **Kya karta hai:** Map ke upar ek semi-transparent white overlay box render karta hai jisme ek heading aur description text hota hai. Yeh ek UI element hai jo map ke top-left corner mein dikhta hai.

---

### Line 9

```tsx
export default function MapMetro() {
```

- **Kya hai:** Yeh file ka **main React component** define aur export ho raha hai.
- **`export default`**: Iska matlab jab koi doosri file `import MapMetro from "./mapbox"` karega toh yeh function milega.
- **`function MapMetro()`**: Yeh ek **functional React component** hai — ek function jo JSX return karta hai.

---

### Line 10

```tsx
const mapRef = useRef<L.Map | null>(null);
```

- **Kya hai:** `useRef` hook se ek **reference** create ho raha hai jo Leaflet `Map` instance ko hold karega.
- **Type:** `L.Map | null` — shuru mein `null` hai, map initialize hone ke baad `L.Map` object store hoga.
- **Kyun `useRef`?** Kyunki:
  1. Map instance ko multiple `useEffect` hooks mein access karna hai.
  2. Map instance change hone pe component ko re-render nahi karna — sirf reference chahiye.
  3. `useState` yahan overkill hoga kyunki humein re-render nahi chahiye jab map object set ho.

---

### Line 11

```tsx
const containerRef = useRef<HTMLDivElement | null>(null);
```

- **Kya hai:** Ek **ref** jo us `<div>` element ko point karega jisme Leaflet map render hoga.
- **Kyun?** Leaflet ko ek DOM element chahiye jisme wo apna map inject kare. React mein DOM elements ko access karne ke liye `useRef` use karte hain, nahi toh `document.getElementById()` use karna padta jo anti-pattern hai React mein.

---

### Line 12

```tsx
const routeGroupRef = useRef<L.LayerGroup | null>(null);
```

- **Kya hai:** Ek **Leaflet LayerGroup** ka reference — yeh shortest path ki polylines ko hold karega.
- **`L.LayerGroup`** kya hai: Yeh ek container hai jisme multiple Leaflet layers (polylines, markers, etc.) group ki ja sakti hain. Iska fayda yeh hai ki `clearLayers()` call karke saari layers ek baar mein hata sakte ho.
- **Purpose:** Jab user naye 2 stations select kare, toh purana route hatao (`clearLayers()`) aur naya route draw karo.

---

### Line 13

```tsx
const edgesGroupRef = useRef<L.LayerGroup | null>(null);
```

- **Kya hai:** Ek aur **LayerGroup** reference — yeh **sabhi stations ke beech ki connections** (edges/lines) hold karega.
- **Kyun separate?** Kyunki edges aur route ki lines alag layers mein hain. Edges permanently dikhni chahiye, route change hota rehta hai.

---

### Line 14

```tsx
const markersRef = useRef<L.CircleMarker[]>([]);
```

- **Kya hai:** Ek **array** of all `CircleMarker` objects ka reference.
- **`L.CircleMarker`** kya hai: Leaflet mein ek circular marker hota hai jo map pe ek gol dot dikhata hai — isse station represent kiya ja raha hai.
- **Kyun store kar rahe hain?** Jab user map zoom kare, tab **har marker ka radius** update karna hai (chhote zoom pe chhota dot, bade zoom pe bada dot). Isliye sabhi markers ka reference chahiye.

---

### Lines 16-17

```tsx
const [stations, setStations] = useState<Graph>({});
const [selected, setSelected] = useState<string[]>([]);
```

- **`stations` state:** Poore metro network ka **graph data** store karta hai. Type `Graph` hai yaani `Record<string, Station>` — har station name ki ek Station object.
  - Shuru mein **empty object `{}`** hai — data fetch hone ke baad populate hoga.
- **`selected` state:** User ne jo **stations select kiye** hain unke names ka array. Maximum 2 elements honge (source aur destination).
  - Shuru mein **empty array `[]`** hai.
  - Jab yeh 2 elements ka ho jata hai, tab Dijkstra run hota hai.

---

### Lines 19-25 — `handleStationClick` Function

```tsx
const handleStationClick = (name: string) => {
  setSelected((prev) => {
    if (prev.includes(name)) return prev; // Line 21
    if (prev.length >= 2) return [name]; // Line 22
    return [...prev, name]; // Line 23
  });
};
```

**Yeh function tab call hota hai jab user kisi station marker pe click karta hai.**

- **Line 19:** Function define ho raha hai jo ek `name` (station ka naam) parameter leta hai.
- **Line 20:** `setSelected` call ho raha hai ek **functional updater** ke saath — `prev` purani selected state hai.
- **Line 21:** `if (prev.includes(name)) return prev;`  
  → Agar yeh station **pehle se selected** hai, toh kuch mat karo (same array return karo). Yeh **duplicate selection prevent** karta hai.
- **Line 22:** `if (prev.length >= 2) return [name];`  
  → Agar **already 2 stations selected** hain, toh purani selection hata do aur sirf **naye station** ko rakh do (reset ho jata hai, yeh naya source ban jata hai).
- **Line 23:** `return [...prev, name];`  
  → Otherwise, naye station ko **purani list mein add** kar do. Matlab pehle click pe 1 station select hoga, doosre click pe 2.

**Summary of selection logic:**
| Current `selected` | User Clicks | New `selected` |
|---|---|---|
| `[]` | "Station A" | `["Station A"]` |
| `["Station A"]` | "Station B" | `["Station A", "Station B"]` → Route draw! |
| `["Station A", "Station B"]` | "Station C" | `["Station C"]` → Reset, new selection starts |
| `["Station A"]` | "Station A" | `["Station A"]` → No change (duplicate) |

---

### Lines 27-102 — First `useEffect` (Map Initialization & Data Fetching)

```tsx
useEffect(() => {
```

- **Line 27:** Yeh pehla `useEffect` **sirf ek baar** run hota hai jab component mount hota hai (kyunki dependency array `[]` hai on line 102).
- **Purpose:** Map initialize karna, tile layer add karna, metro data fetch karna, markers aur edges draw karna.

---

### Line 28

```tsx
if (mapRef.current || !containerRef.current) return;
```

- **Guard clause** — 2 conditions check ho rahi hain:
  1. `mapRef.current` — Agar map **pehle se initialized** hai, toh dubara initialize mat karo (React Strict Mode mein useEffect 2 baar run ho sakta hai).
  2. `!containerRef.current` — Agar container div **abhi DOM mein nahi** hai, toh map create mat karo (safety check).
- Dono cases mein function **early return** kar jata hai.

---

### Lines 30-31

```tsx
const map = L.map(containerRef.current).setView([28.5771, 77.1113], 10.8);
mapRef.current = map;
```

- **Line 30:**
  - `L.map(containerRef.current)` — Leaflet map instance create ho raha hai us `<div>` mein jo `containerRef` point kar raha hai.
  - `.setView([28.5771, 77.1113], 10.8)` — Map ka **initial view** set ho raha hai:
    - `[28.5771, 77.1113]` → **Delhi, India** ka latitude-longitude (yeh coordinates roughly Delhi ke center mein hain).
    - `10.8` → **Zoom level** (0 = world view, 18 = street level). 10.8 se poora Delhi metro network ek baar mein dikhai deta hai.
- **Line 31:** Map instance ko `mapRef` mein store kar diya — taaki baad mein doosre effects mein access ho sake.

---

### Lines 33-35

```tsx
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  opacity: 0.2,
}).addTo(map);
```

- **`L.tileLayer(...)`**: Yeh map ke **background tiles** (yaani actual map images — roads, buildings, etc.) load karta hai.
- **URL Template:**
  - `{s}` → Subdomain (a, b, c — load balancing ke liye).
  - `{z}` → Zoom level.
  - `{x}`, `{y}` → Tile coordinates.
  - Source: **OpenStreetMap** (free, open-source map data).
- **`opacity: 0.2`**: Tiles ko **bahut halka** (20% opacity) dikha raha hai — taaki metro lines clearly dikhein aur background map interfere na kare. Pura opaque hota toh metro lines background mein chup jaatien.
- **`.addTo(map)`**: Tile layer ko map mein add kar diya.

---

### Line 37

```tsx
routeGroupRef.current = L.layerGroup().addTo(map);
```

- **Ek empty LayerGroup** create ho rahi hai aur map mein add ho rahi hai.
- Yeh group **shortest route ki lines** hold karega.
- `routeGroupRef.current` mein store ho gayi reference — taaki baad mein `clearLayers()` use kar sakein.

---

### Lines 38-41

```tsx
// Create a custom pane for edges with lower z-index
map.createPane("edgesPane");
map.getPane("edgesPane")!.style.zIndex = "200";
edgesGroupRef.current = L.layerGroup([], { pane: "edgesPane" }).addTo(map);
```

- **Line 38:** Comment — explain kar raha hai ki **custom pane** bana rahe hain edges ke liye.
- **Line 39:** `map.createPane("edgesPane")` — Leaflet mein ek **custom rendering pane** create ho raha hai named `"edgesPane"`.
  - **Pane kya hai?** Leaflet map ko different layers (tiles, markers, overlays) ko alag-alag `<div>` elements (panes) mein render karta hai. Har pane ka apna z-index hota hai.
- **Line 40:** `map.getPane("edgesPane")!.style.zIndex = "200"` — Is pane ka z-index **200** set kiya.
  - Default marker pane ka z-index ~**400** hota hai.
  - Iska matlab edges **markers ke neeche** render hongi — taaki station dots ke upar edge lines na aayein. Visual clarity ke liye yeh important hai.
  - `!` (non-null assertion) — TypeScript ko bata rahe hain ki `getPane()` `null` return nahi karega kyunki humne abhi abhi pane create kiya hai.
- **Line 41:** Ek **empty LayerGroup** create ho rahi hai jo `"edgesPane"` mein render hogi, aur map mein add ho rahi hai. Isme baad mein saari edge polylines dalenge.

---

### Lines 43-47

```tsx
map.on("zoomend", () => {
  const z = map.getZoom();
  const newR = Math.max(2, z * 0.4);
  markersRef.current.forEach((m) => m.setRadius(newR));
});
```

- **Line 43:** Map pe **`zoomend`** event listener register ho raha hai — jab bhi user zoom in/out kare aur zoom animation khatam ho, yeh function run hoga.
- **Line 44:** `map.getZoom()` — Current zoom level liya (e.g., 10, 12, 14).
- **Line 45:** `Math.max(2, z * 0.4)` — Naya radius calculate ho raha hai:
  - `z * 0.4` → Zoom level ke 40% — zoom badhne pe radius bhi badhega.
  - `Math.max(2, ...)` → Minimum radius **2 pixels** hai — bahut zoom out karne pe bhi dots disappear nahi honge.
  - Example: Zoom 10 → radius 4, Zoom 15 → radius 6, Zoom 5 → radius 2 (minimum).
- **Line 46:** `markersRef.current.forEach((m) => m.setRadius(newR))` — **Har station marker** ka radius update ho raha hai naye calculated value se.
  - Yeh **responsive design** hai — zoom level ke according station dots ka size adjust hota hai.

---

### Lines 49-51

```tsx
fetch("/metro_data/metro_data.json")
  .then((r) => r.json())
  .then((data: { stations: Record<string, Station> }) => {
```

- **Line 49:** `fetch(...)` — Browser ka built-in **Fetch API** use karke metro data JSON file load ho rahi hai server se.
  - Path `"/metro_data/metro_data.json"` — yeh public folder se serve hoti hai.
- **Line 50:** `.then((r) => r.json())` — Fetch ka response (`r`) aaya, usko **JSON mein parse** kar diya. `.json()` ek promise return karta hai jo parsed JavaScript object deta hai.
- **Line 51:** `.then((data: ...) => { ... })` — Parsed data aagaya. TypeScript type batata hai ki data ka structure hai:
  ```ts
  {
    stations: Record<string, Station>;
  }
  // yaani: { stations: { "Station Name": { lat, lng, line, neighbors }, ... } }
  ```

---

### Lines 52-61 — Graph Data Processing

```tsx
const graph: Graph = {};
for (const [rawName, st] of Object.entries(data.stations)) {
  const name = rawName.trim();
  const nbrs: Record<string, number> = {};
  for (const [rawNbr, d] of Object.entries(st.neighbors)) {
    nbrs[rawNbr.trim()] = d;
  }
  graph[name] = { ...st, neighbors: nbrs };
}
setStations(graph);
```

- **Line 52:** Ek empty `graph` object create ho raha hai jo processed data hold karega.
- **Line 53:** `Object.entries(data.stations)` — Har station ko ek `[name, stationObject]` pair ke roop mein iterate kar rahe hain.
- **Line 54:** `rawName.trim()` — Station ke naam se **leading/trailing whitespace** hata diya. JSON data mein kabhi kabhi extra spaces aa jaate hain — yeh un bugs ko prevent karta hai.
- **Lines 55-58:** Har station ke **neighbors** ko bhi trim kiya:
  - Naya `nbrs` object banaya.
  - Har neighbor key ko `trim()` kiya aur distance `d` ko as-is rakh diya.
  - Yeh ensure karta hai ki `"Rajiv Chowk "` (with space) aur `"Rajiv Chowk"` (without) same treat hon.
- **Line 59:** `graph[name] = { ...st, neighbors: nbrs }` — Original station object ko **spread** kiya (`...st` copies `lat`, `lng`, `line`) aur neighbors ko cleaned version se replace kiya.
- **Line 61:** `setStations(graph)` — Cleaned graph data ko React **state** mein store kiya. Yeh state change baad mein doosre `useEffect` ko trigger karega.

---

### Lines 63-78 — Station Markers Drawing

```tsx
// Add station markers
Object.entries(graph).forEach(([name, info]) => {
  const radius = map.getZoom() * 0.3;
  const m = L.circleMarker([info.lat, info.lng], {
    radius,
    color: tailwindColors[info.line],
    fillColor: tailwindColors[info.line],
    fillOpacity: 1,
  })
    .bindPopup(name)
    .bindTooltip(name, { permanent: false, direction: "top" })
    .addTo(map)
    .on("click", () => handleStationClick(name));

  markersRef.current.push(m);
});
```

- **Line 64:** Har station pe loop chal raha hai — `name` station ka naam hai, `info` uska `Station` object.
- **Line 65:** Initial radius calculate ho raha hai based on current zoom level (zoom \* 0.3).
- **Lines 66-71:** `L.circleMarker(...)` — Ek **circular marker** create ho raha hai:
  - `[info.lat, info.lng]` → Station ki geographical position.
  - `radius` → Dot ka size.
  - `color` → Border color — `tailwindColors[info.line]` se station ki metro line ka color milta hai (e.g., red line ka red color).
  - `fillColor` → Fill color — same as border (solid colored dot).
  - `fillOpacity: 1` → Fully opaque fill — no transparency.
- **Line 72:** `.bindPopup(name)` — Jab user marker pe click kare toh ek **popup bubble** dikhega station ke naam ke saath.
- **Line 73:** `.bindTooltip(name, { permanent: false, direction: "top" })` — Jab user **hover** kare marker pe toh ek chhota tooltip dikhega station ke naam ke saath upar ki taraf. `permanent: false` matlab sirf hover pe dikhega, hamesha nahi.
- **Line 74:** `.addTo(map)` — Marker ko map mein add kiya.
- **Line 75:** `.on("click", () => handleStationClick(name))` — Click event listener add kiya — station click hone pe `handleStationClick` call hoga jo station ko select karega.
- **Line 77:** `markersRef.current.push(m)` — Marker ka reference `markersRef` array mein store kiya — taaki zoom pe radius update ho sake.

---

### Lines 80-100 — Edge (Connection) Lines Drawing

```tsx
// Add edges (connections) in black
const added = new Set<string>();
Object.entries(graph).forEach(([from, info]) => {
  Object.entries(info.neighbors).forEach(([to]) => {
    const edgeKey = [from, to].sort().join("-");
    if (added.has(edgeKey)) return;
    added.add(edgeKey);

    if (graph[to]) {
      const segment: [number, number][] = [
        [info.lat, info.lng],
        [graph[to].lat, graph[to].lng],
      ];
      L.polyline(segment, {
        color: tailwindColors[info.line],
        weight: 1.2,
        pane: "edgesPane",
      }).addTo(edgesGroupRef.current!);
    }
  });
});
```

- **Line 81:** `new Set<string>()` — Ek **Set** banaya duplicate edges track karne ke liye. Set mein unique values hi store hoti hain.
- **Line 82:** Har station (`from`) pe loop.
- **Line 83:** Har station ke har **neighbor** (`to`) pe inner loop.
- **Line 84:** `[from, to].sort().join("-")` — Ek **unique edge key** generate ho rahi hai:
  - Dono station names ko sort kiya (alphabetically) aur `-` se join kiya.
  - Example: `"Rajiv Chowk"` ↔ `"Patel Chowk"` → key = `"Patel Chowk-Rajiv Chowk"` (dono directions ka same key).
  - **Kyun sort?** Kyunki A→B aur B→A same connection hai — bina sort ke dono baar draw hoti.
- **Lines 85-86:** Agar yeh edge **pehle se draw** ho chuki hai (`added.has(edgeKey)`) toh skip karo. Otherwise `added` mein dal do.
- **Line 88:** `if (graph[to])` — Safety check — kya neighbor station **graph mein exist** karta hai. Agar data mein koi broken reference ho toh crash na ho.
- **Lines 89-92:** `segment` define ho raha hai — yeh ek array hai 2 points ka:
  - Point 1: `from` station ki position `[lat, lng]`
  - Point 2: `to` station ki position `[lat, lng]`
- **Lines 93-97:** `L.polyline(segment, options)` — Do stations ke beech ek **line draw** ho rahi hai:
  - `color: tailwindColors[info.line]` → Line ka color station ki metro line ka color hai.
  - `weight: 1.2` → Line ki **thickness** 1.2 pixels — patli line, subtle dikhegi.
  - `pane: "edgesPane"` → Yeh line `edgesPane` mein render hogi (z-index 200) — markers ke **neeche**.
- **Line 97:** `.addTo(edgesGroupRef.current!)` — Polyline ko edges LayerGroup mein add kiya. `!` se TypeScript ko bata rahe hain ki yeh `null` nahi hoga.

---

### Line 102

```tsx
}, []);
```

- **`[]` empty dependency array** — Iska matlab yeh `useEffect` **sirf ek baar** run hoga jab component **pehli baar mount** hota hai. Kisi state ya prop ke change pe dobara nahi chalega. Map initialization sirf ek baar hona chahiye.

---

### Lines 104-123 — Second `useEffect` (Route Drawing)

```tsx
useEffect(() => {
  if (!mapRef.current || !routeGroupRef.current || selected.length !== 2)
    return;

  routeGroupRef.current.clearLayers();
  const path = djikstra(stations, selected[0], selected[1]);
  console.log("Path found:", path);
  for (let i = 0; i + 1 < path.length; i++) {
    const from = path[i];
    const to = path[i + 1];

    const segment: [number, number][] = [
      [stations[from].lat, stations[from].lng],
      [stations[to].lat, stations[to].lng],
    ];
    L.polyline(segment, { color: tailwindColors["black"], weight: 7 }).addTo(
      routeGroupRef.current!,
    );
  }
}, [selected, stations]);
```

- **Line 104:** Doosra `useEffect` — yeh **route draw** karta hai jab user 2 stations select kare.
- **Lines 105-106:** Guard clause — 3 conditions check:
  1. `!mapRef.current` — Map initialized nahi? Return.
  2. `!routeGroupRef.current` — Route layer group nahi hai? Return.
  3. `selected.length !== 2` — 2 stations select nahi hue? Return.
  - Teeno mein se koi bhi true ho toh function early return karega aur route draw nahi hoga.
- **Line 108:** `routeGroupRef.current.clearLayers()` — **Purana route hata diya** — taaki naye route se overlap na ho. Har baar fresh route draw hota hai.
- **Line 109:** `djikstra(stations, selected[0], selected[1])` — **Dijkstra's algorithm** run ho raha hai:
  - `stations` → Graph data (saari stations aur unke connections/distances).
  - `selected[0]` → Source station.
  - `selected[1]` → Destination station.
  - Return: Array of station names representing the **shortest path** (e.g., `["A", "B", "C", "D"]`).
- **Line 110:** `console.log("Path found:", path)` — Debugging ke liye path browser console mein print ho raha hai.
- **Line 111:** `for (let i = 0; i + 1 < path.length; i++)` — Path ke har **consecutive pair** pe loop:
  - `i = 0`: from=path[0], to=path[1]
  - `i = 1`: from=path[1], to=path[2]
  - ... aur aage tak.
  - Condition `i + 1 < path.length` ensure karta hai ki `path[i + 1]` exist kare.
- **Lines 112-113:** `from` aur `to` station names assign hue.
- **Lines 115-118:** `segment` define ho raha hai — from aur to stations ke coordinates.
- **Lines 119-121:** `L.polyline(segment, { color: tailwindColors["black"], weight: 7 })` — Route ki line draw ho rahi hai:
  - `color: tailwindColors["black"]` → **Black color** (`#000000`) — route ko distinguish karne ke liye edges se, jo colored hoti hain.
  - `weight: 7` → **Moti line** (7 pixels) — edges sirf 1.2 pixels thick hain, route 7 pixels. Yeh route ko clearly highlight karta hai.
  - `.addTo(routeGroupRef.current!)` → Route layer group mein add kiya.

---

### Line 123

```tsx
}, [selected, stations]);
```

- **Dependency array:** `[selected, stations]`
- Yeh `useEffect` tab re-run hoga jab:
  1. `selected` change ho (user ne koi station click kiya).
  2. `stations` change ho (initial data load ho gaya).
- Dono changes pe route recalculate aur redraw hoga.

---

### Lines 125-130 — JSX Return (Component Render)

```tsx
return (
  <div ref={containerRef} style={{ height: "100vh", width: "100%" }}>
    <MapOverlay />
  </div>
);
```

- **Line 125:** `return (...)` — Component ka **JSX output** — yeh React DOM mein render hoga.
- **Line 126:** `<div ref={containerRef} ...>` — Yeh woh **`<div>`** hai jisme Leaflet apna map inject karega.
  - `ref={containerRef}` → React is div ka DOM reference `containerRef` mein store karega. Line 30 pe `L.map(containerRef.current)` isi div ko use karta hai.
  - `style={{ height: "100vh", width: "100%" }}`:
    - `height: "100vh"` → **Pura viewport height** — map poori screen ki height lega (100% of viewport height).
    - `width: "100%"` → **Puri width** — parent container ki width fill karega.
- **Line 127:** `<MapOverlay />` — Map ke upar overlay component render ho raha hai. Kyunki yeh div ke andar hai aur MapOverlay mein `absolute` positioning use ho rahi hai, yeh map ke upar float karega.
- **Lines 128-129:** Div aur function close ho rahe hain.

---

### Line 131

```tsx
(empty line)
```

- File ke end mein ek **empty line** — yeh ek coding convention hai ("newline at end of file"). Koi functional impact nahi hai.

---

## 🔄 Data Flow Summary

```
                    ┌─────────────────────┐
                    │  metro_data.json     │
                    │  (station data)      │
                    └──────────┬──────────┘
                               │ fetch()
                               ▼
                    ┌─────────────────────┐
                    │  Graph Processing   │
                    │  (trim names, clean │
                    │   neighbors)         │
                    └──────────┬──────────┘
                               │ setStations()
                               ▼
              ┌────────────────────────────────────┐
              │         React State                │
              │  stations: Graph    selected: []   │
              └────────┬───────────────┬───────────┘
                       │               │
            useEffect #1          useEffect #2
            (mount only)          (on selection)
                       │               │
                       ▼               ▼
              ┌──────────────┐  ┌─────────────────┐
              │ Draw markers │  │ Dijkstra's algo  │
              │ Draw edges   │  │ → Draw route     │
              │ Setup zoom   │  │   (black, thick) │
              └──────────────┘  └─────────────────┘
```

---

## 🎯 Key Concepts Used

| Concept                     | Where Used    | Why                                        |
| --------------------------- | ------------- | ------------------------------------------ |
| **useRef**                  | Lines 10-14   | DOM/Leaflet references without re-renders  |
| **useState**                | Lines 16-17   | Reactive state for stations & selection    |
| **useEffect**               | Lines 27, 104 | Side effects: map init & route drawing     |
| **Leaflet.js**              | Throughout    | Map rendering, markers, polylines          |
| **Dijkstra's Algorithm**    | Line 109      | Shortest path finding between stations     |
| **Custom Panes**            | Lines 39-41   | Z-index control for layering               |
| **Fetch API**               | Line 49       | Loading metro data from server             |
| **Set (dedup)**             | Line 81       | Preventing duplicate edge rendering        |
| **Functional State Update** | Line 20       | Safe state updates based on previous state |
