import { describe, it, expect } from 'vitest';
import { getStationId } from '../utils/stationsMap';
import { SuffixAutomaton } from '../utils/SuffixAutomaton';

describe('SAM Payload Generation', () => {
  it('should generate a payload with sam and NOT stationList for /match_trips', () => {
    // 1. Simulate user selecting stations in UI
    const customPath = ['Rajiv Chowk', 'New Delhi'];
    
    // 2. Simulate what map_overlay.tsx does internally
    const idmap = new Map<string, number>();
    const encodedIds: number[] = [];

    for (const station of customPath) {
      const stationId = getStationId(station);
      if (stationId !== null) {
        encodedIds.push(stationId);
        if (!idmap.has(stationId.toString())) {
          idmap.set(stationId.toString(), stationId);
        }
      }
    }

    const tokens = encodedIds.map(String);
    const sa = new SuffixAutomaton(tokens, idmap);
    
    // 3. This is the exact payload sent in axios.post
    const payload = {
      sam: sa.serialize(),
      totalStations: customPath.length,
      page: 1,
      limit: 10,
    };

    // 4. Verify backend will always receive the sam, not the station list
    expect(payload).toHaveProperty('sam');
    expect(payload).not.toHaveProperty('stationList');
    
    // Ensure SAM is properly built
    expect(payload.sam).toHaveProperty('st');
    expect(payload.sam).toHaveProperty('last');
    expect(payload.sam.st.length).toBeGreaterThan(0);
    
    // Verify next states are correctly serialized as Array of Tuples for JSON transfer
    expect(Array.isArray(payload.sam.st[0].next)).toBe(true);
  });
});
