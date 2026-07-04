# Architecture Migration: Client-Side Station Mapping

> [!IMPORTANT]  
> **Goal:** Migrate station string parsing, mapping, and SAM (String/Sequence aggregation) building from the server-side to the client-side. 
> **Constraint:** The application operates with a fixed list of exactly 260 stations.

This document outlines the architectural changes, API payload updates, and implementation steps required to offload string computations from the backend and rely entirely on integer-based ID resolution.

---

## 1. Overview & Rationale

Currently, the frontend sends station names (strings) to the backend. The backend performs string mapping, filtering, and SAM building before interacting with the database. 

By shifting this logic to the client:
- **Zero String Processing on Backend:** Backend only processes Integer IDs, massively improving CPU performance.
- **Faster DB Queries:** Database queries hit integer indexes instead of performing full-text or string-matching searches.
- **Reduced Payload:** Network requests are smaller (sending arrays of IDs instead of long strings).
- **Instant Search:** With only 260 stations, the frontend can easily keep the entire mapping in memory and perform instant lookups and autocompletes with 0 network latency.

---

## 2. Architecture Comparison

### ❌ Old Architecture (Server-Side Heavy)
1. **Frontend:** User selects "Mumbai", "Delhi". Frontend sends `["Mumbai", "Delhi"]`.
2. **Backend:** Receives strings, iterates over them, looks up IDs, builds the SAM (aggregation), and queries the database.
3. **Backend:** Fetches results, maps DB IDs back to strings, and sends a string-heavy response.
4. **Frontend:** Displays the string results.

### ✅ New Architecture (Client-Side Optimized)
1. **Frontend:** User selects "Mumbai", "Delhi". Frontend uses its local map to convert these to `[45, 12]`. Frontend builds the SAM and sends it to the backend.
2. **Backend:** Receives `[45, 12]`, directly queries the Database using these IDs.
3. **Backend:** Sends the result back using IDs.
4. **Frontend:** Receives IDs, looks them up in the local map, and displays "Mumbai", "Delhi" in the UI.

---

## 3. Frontend Implementation Guide

### A. Static Station Map
Store the 260 stations in a static JSON file or a constant configuration object bundled with the frontend code.

```javascript
// src/config/stationsMap.js
export const STATIONS_MAP = {
  1: "New Delhi",
  2: "Mumbai Central",
  // ... up to 260
};

// Create a reverse map for easy string-to-ID lookup
export const REVERSE_STATIONS_MAP = Object.entries(STATIONS_MAP).reduce(
  (acc, [id, name]) => {
    acc[name] = parseInt(id);
    return acc;
  }, 
  {}
);
```

### B. Encoding before Request (Building SAM)
When the user submits a form, convert the selected stations into their respective IDs and generate the required SAM format.

```javascript
import { REVERSE_STATIONS_MAP } from '../config/stationsMap';

function preparePayload(selectedStationNames) {
  // Encode names to IDs
  const encodedIds = selectedStationNames.map(name => REVERSE_STATIONS_MAP[name]);
  
  // Build SAM (Example: aggregating or sorting IDs if needed)
  const sam = buildSamFromIds(encodedIds);

  return {
    stationsData: sam
  };
}
```

### C. Decoding after Response
When the backend sends the data back, translate the IDs back to human-readable strings for the UI.

```javascript
import { STATIONS_MAP } from '../config/stationsMap';

function processBackendResponse(response) {
  // Assume response contains { results: [{ stationId: 1, status: "Active" }] }
  return response.results.map(item => ({
    ...item,
    stationName: STATIONS_MAP[item.stationId]
  }));
}
```

---

## 4. Backend Implementation Guide

### A. API Contract Updates

> [!WARNING]  
> This is a breaking change for the API. The API endpoints must be updated to expect integers instead of strings.

**Old Request Payload:**
```json
{
  "stations": ["New Delhi", "Mumbai Central"]
}
```

**New Request Payload:**
```json
{
  "sam": [1, 2]
}
```

### B. Logic Cleanup
- **Remove** all hardcoded station lists, Enums, or string-mapping dictionaries from the backend code.
- **Remove** the SAM building logic/functions from the backend controllers/services.
- **Update** database queries to accept arrays of integers (e.g., using `WHERE station_id IN (...)`).

### C. Database Schema
Ensure that the database tables use `station_id` (Integer) as Foreign Keys or Indexed columns rather than storing the actual station names. 

---

## 5. Deployment & Rollout Strategy

1. **Frontend Update (Phase 1):** Deploy the frontend with the static `stationsMap.js` included. Update the UI to rely on this local map for dropdowns and autocompletes.
2. **Backend Update (Phase 2):** Deploy the backend changes to accept IDs and remove the old string logic.
3. **API Switch:** Update the frontend network calls to start sending the ID-based SAM payload to the new/updated backend endpoints.

> [!TIP]  
> Since the station count is strictly 260, you can safely cache the `stationsMap.js` aggressively on the client's browser for maximum performance.
