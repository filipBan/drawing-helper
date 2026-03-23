import type * as THREE from "three";

// Quantize a float to avoid floating point comparison issues
function quantize(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}

function posKey(positions: ArrayLike<number>, idx: number): string {
  const i = idx * 3;
  return `${quantize(positions[i])},${quantize(positions[i + 1])},${quantize(positions[i + 2])}`;
}

function edgeKey(
  positions: ArrayLike<number>,
  a: number,
  b: number,
): [string, number, number] {
  const ka = posKey(positions, a);
  const kb = posKey(positions, b);
  // Sort by string key for canonical ordering
  if (ka < kb) return [`${ka}|${kb}`, a, b];
  return [`${kb}|${ka}`, b, a];
}

/**
 * Extract crease edges from a BufferGeometry based on dihedral angle threshold.
 * Returns a flat Float32Array of line segment vertex pairs: [x1,y1,z1, x2,y2,z2, ...]
 */
export function extractCreaseEdges(
  geometry: THREE.BufferGeometry,
  angleThreshold: number,
): Float32Array {
  const position = geometry.getAttribute("position");
  if (!position) return new Float32Array(0);

  const index = geometry.getIndex();
  if (!index) return new Float32Array(0);

  const thresholdRad = (angleThreshold * Math.PI) / 180;
  const indices = index.array;
  const positions = position.array;
  const faceCount = indices.length / 3;

  // Compute face normals
  const faceNormals: [number, number, number][] = [];
  for (let f = 0; f < faceCount; f++) {
    const i0 = indices[f * 3] * 3;
    const i1 = indices[f * 3 + 1] * 3;
    const i2 = indices[f * 3 + 2] * 3;

    const ax = positions[i1] - positions[i0];
    const ay = positions[i1 + 1] - positions[i0 + 1];
    const az = positions[i1 + 2] - positions[i0 + 2];

    const bx = positions[i2] - positions[i0];
    const by = positions[i2 + 1] - positions[i0 + 1];
    const bz = positions[i2 + 2] - positions[i0 + 2];

    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;

    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (len > 0) {
      nx /= len;
      ny /= len;
      nz /= len;
    }

    faceNormals.push([nx, ny, nz]);
  }

  // Build edge map keyed by position, storing face indices and one representative vertex pair
  const edgeFaces = new Map<string, { faces: number[]; v0: number; v1: number }>();

  for (let f = 0; f < faceCount; f++) {
    const a = indices[f * 3];
    const b = indices[f * 3 + 1];
    const c = indices[f * 3 + 2];

    const triEdges: [number, number][] = [
      [a, b],
      [b, c],
      [c, a],
    ];

    for (const [va, vb] of triEdges) {
      const [key, sv0, sv1] = edgeKey(positions, va, vb);
      let entry = edgeFaces.get(key);
      if (!entry) {
        entry = { faces: [], v0: sv0, v1: sv1 };
        edgeFaces.set(key, entry);
      }
      entry.faces.push(f);
    }
  }

  // Collect crease edges
  const segments: number[] = [];

  for (const { faces, v0, v1 } of edgeFaces.values()) {
    let isCrease = false;

    if (faces.length === 1) {
      // Boundary edge — always include
      isCrease = true;
    } else if (faces.length >= 2) {
      // Check first two adjacent faces
      const [n0, n1] = [faceNormals[faces[0]], faceNormals[faces[1]]];
      const dot = n0[0] * n1[0] + n0[1] * n1[1] + n0[2] * n1[2];
      const clampedDot = Math.max(-1, Math.min(1, dot));
      const angle = Math.acos(clampedDot);
      if (angle > thresholdRad) {
        isCrease = true;
      }
    }

    if (isCrease) {
      const p0 = v0 * 3;
      const p1 = v1 * 3;
      segments.push(
        positions[p0],
        positions[p0 + 1],
        positions[p0 + 2],
        positions[p1],
        positions[p1 + 1],
        positions[p1 + 2],
      );
    }
  }

  return new Float32Array(segments);
}
