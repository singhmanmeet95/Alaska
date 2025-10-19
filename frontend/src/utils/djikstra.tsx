export type Station = {
  lat: number;
  lng: number;
  line: string;
  neighbors: Record<string, number>; // neighbor station name → distance (weight)
};

export type Graph = Record<string, Station>;

// Min-heap implementation for priority queue
class MinHeap<T> {
  private heap: [T, number][] = [];
  private comparator: (a: [T, number], b: [T, number]) => number;

  constructor(comparator: (a: [T, number], b: [T, number]) => number) {
    this.comparator = comparator;
  }

  insert(node: T, priority: number) {
    this.heap.push([node, priority]);
    this.bubbleUp();
  }

  extractMin(): [T, number] | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown();
    }
    return min;
  }

  private bubbleUp() {
    let idx = this.heap.length - 1;
    const element = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      if (this.comparator(element, parent) >= 0) break;
      this.heap[parentIdx] = element;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
  }

  private sinkDown() {
    let idx = 0;
    const length = this.heap.length;
    const element = this.heap[0];
    while (true) {
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      let swapIdx: number | null = null;

      if (leftIdx < length) {
        const left = this.heap[leftIdx];
        if (this.comparator(left, element) < 0) swapIdx = leftIdx;
      }
      if (rightIdx < length) {
        const right = this.heap[rightIdx];
        if (
          (swapIdx === null && this.comparator(right, element) < 0) ||
          (swapIdx !== null && this.comparator(right, this.heap[swapIdx]) < 0)
        ) {
          swapIdx = rightIdx;
        }
      }
      if (swapIdx === null) break;
      this.heap[idx] = this.heap[swapIdx];
      this.heap[swapIdx] = element;
      idx = swapIdx;
    }
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

export default function djikstra(
  graph: Graph,
  start: string,
  end: string
): string[] {
  const distances: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();

  // Initialize distances
  for (const node in graph) {
    distances[node] = Infinity;
    prev[node] = null;
  }
  distances[start] = 0;

  // Priority queue orders by smallest distance
  const pq = new MinHeap<string>((a, b) => a[1] - b[1]);
  pq.insert(start, 0);

  while (!pq.isEmpty()) {
    const [current, currDist] = pq.extractMin()!;
    if (visited.has(current)) continue;
    visited.add(current);

    if (current === end) break;

    for (const [neighbor, weight] of Object.entries(graph[current].neighbors)) {
      if (visited.has(neighbor)) continue;
      const alt = currDist + weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = current;
        pq.insert(neighbor, alt);
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = end;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }
  return path;
}
