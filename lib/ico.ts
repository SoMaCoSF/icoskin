// IcoSkin topology + spatial addressing.
//
// The skin is the address space. A node is a face of a subdivided icosphere on
// a shell; its identity is derived deterministically from its position —
// shell, face index, and the quantised ray direction — never assigned from a
// registry. IDs minted here are PROVISIONAL spatial IDs in UUID form
// (deterministic, reproducible from coordinates alone); production minting
// under the SoMaCo UUID protocol awaits the founder's mint-authority ruling.

export type Vec3 = [number, number, number];

export interface Face {
  /** index within its shell mesh */
  index: number;
  /** unit-sphere vertex indices */
  v: [number, number, number];
  /** unit ray direction of the face centroid — the node's n-hat */
  dir: Vec3;
  /** planar area of the face on the unit sphere (steradians approx via chord area) */
  areaUnit: number;
}

export interface Mesh {
  level: number;
  vertices: Vec3[]; // unit sphere
  faces: Face[];
}

const T = (1 + Math.sqrt(5)) / 2;

const ICO_VERTS: Vec3[] = [
  [-1, T, 0], [1, T, 0], [-1, -T, 0], [1, -T, 0],
  [0, -1, T], [0, 1, T], [0, -1, -T], [0, 1, -T],
  [T, 0, -1], [T, 0, 1], [-T, 0, -1], [-T, 0, 1],
];

const ICO_FACES: [number, number, number][] = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

function norm(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
}

function mid(a: Vec3, b: Vec3): Vec3 {
  return norm([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
}

function triArea(a: Vec3, b: Vec3, c: Vec3): number {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
  return 0.5 * Math.hypot(cx, cy, cz);
}

/** Geodesic icosphere at subdivision level n (each edge split 2^n times). */
export function buildMesh(level: number): Mesh {
  let verts: Vec3[] = ICO_VERTS.map(norm);
  let faces: [number, number, number][] = ICO_FACES.map((f) => [...f] as [number, number, number]);

  for (let s = 0; s < level; s++) {
    const cache = new Map<string, number>();
    const midIdx = (a: number, b: number): number => {
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      const hit = cache.get(key);
      if (hit !== undefined) return hit;
      const idx = verts.length;
      verts.push(mid(verts[a], verts[b]));
      cache.set(key, idx);
      return idx;
    };
    const next: [number, number, number][] = [];
    for (const [a, b, c] of faces) {
      const ab = midIdx(a, b), bc = midIdx(b, c), ca = midIdx(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }

  const out: Face[] = faces.map((f, i) => {
    const [a, b, c] = [verts[f[0]], verts[f[1]], verts[f[2]]];
    const dir = norm([
      (a[0] + b[0] + c[0]) / 3,
      (a[1] + b[1] + c[1]) / 3,
      (a[2] + b[2] + c[2]) / 3,
    ]);
    return { index: i, v: f, dir, areaUnit: triArea(a, b, c) };
  });

  return { level, vertices: verts, faces: out };
}

/** Closed-form counts for subdivision level n. F = 20·4^n, V = 10·4^n + 2, E = 30·4^n. */
export function counts(level: number) {
  const p = Math.pow(4, level);
  const F = 20 * p;
  const V = 10 * p + 2;
  const E = 30 * p;
  return {
    faces: F,
    vertices: V,
    edges: E,
    // Goldberg dual: one cell per primal vertex — always exactly 12 pentagons,
    // every other cell a hexagon. Euler guarantees the 12; no exceptions.
    dualCells: V,
    pentagons: 12,
    hexagons: V - 12,
    meanFaceAreaUnit: (4 * Math.PI) / F, // steradians on unit sphere, exact as a mean
    meanNodeSpacingRad: Math.sqrt((4 * Math.PI) / V),
  };
}

/** Shell display radii along the normal ray R(t) = t·n-hat (estate shells model). */
export const SHELLS = [
  { t: 1.0, name: 'SHELL 0 · INNER LATTICE', role: 'inner CNT structural shell' },
  { t: 1.6, name: 'SHELL 1 · ACTIVE SKIN', role: 'Fe-BMG sensing / flag layer on the hex mesh' },
  { t: 2.05, name: 'SHELL 2 · OUTER LATTICE', role: 'outer CNT protective lattice + OPV' },
] as const;

/** Position of a node: R(t) = t · n-hat. Cells are derived by ray cast, never stored. */
export function nodePosition(dir: Vec3, t: number): Vec3 {
  return [dir[0] * t, dir[1] * t, dir[2] * t];
}

export function latLon(dir: Vec3): { lat: number; lon: number } {
  return {
    lat: (Math.asin(dir[1]) * 180) / Math.PI,
    lon: (Math.atan2(dir[2], dir[0]) * 180) / Math.PI,
  };
}

// --- Deterministic spatial ID (PROVISIONAL, UUID form) -----------------------

function cyrb53(str: string, seed: number): number {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/**
 * Derive a node's spatial ID from its coordinates alone:
 * key = shell t · level · face index · quantised ray (micro-degrees).
 * Same position → same ID, on any machine, with no registry lookup.
 */
export function spatialId(shellT: number, level: number, faceIndex: number, dir: Vec3): string {
  const q = dir.map((x) => Math.round(x * 1e6)).join(',');
  const key = `icoskin|t=${shellT}|n=${level}|f=${faceIndex}|ray=${q}`;
  const words: number[] = [];
  for (let s = 0; s < 4; s++) words.push(cyrb53(key, s * 97 + 11) >>> 0);
  const bytes: number[] = [];
  for (const w of words) bytes.push((w >>> 24) & 0xff, (w >>> 16) & 0xff, (w >>> 8) & 0xff, w & 0xff);
  bytes[6] = (bytes[6] & 0x0f) | 0x50; // version-5 form
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC variant
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/** Face indices sharing an edge with face i (mesh neighbours, always 3). */
export function edgeNeighbours(mesh: Mesh, faceIndex: number): number[] {
  const f = mesh.faces[faceIndex];
  const edges = new Set([
    `${Math.min(f.v[0], f.v[1])}:${Math.max(f.v[0], f.v[1])}`,
    `${Math.min(f.v[1], f.v[2])}:${Math.max(f.v[1], f.v[2])}`,
    `${Math.min(f.v[2], f.v[0])}:${Math.max(f.v[2], f.v[0])}`,
  ]);
  const out: number[] = [];
  mesh.faces.forEach((g, j) => {
    if (j === faceIndex) return;
    const ge = [
      `${Math.min(g.v[0], g.v[1])}:${Math.max(g.v[0], g.v[1])}`,
      `${Math.min(g.v[1], g.v[2])}:${Math.max(g.v[1], g.v[2])}`,
      `${Math.min(g.v[2], g.v[0])}:${Math.max(g.v[2], g.v[0])}`,
    ];
    if (ge.some((e) => edges.has(e))) out.push(j);
  });
  return out;
}
