import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { extractCreaseEdges } from "./extract-crease-edges";

describe("extractCreaseEdges", () => {
  describe("BoxGeometry", () => {
    it("returns 12 edges at 30° threshold (all faces meet at 90°)", () => {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const result = extractCreaseEdges(geo, 30);
      // 12 edges * 2 vertices * 3 coords = 72
      expect(result.length).toBe(72);
      expect(result).toBeInstanceOf(Float32Array);
    });

    it("returns 0 edges at 91° threshold", () => {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const result = extractCreaseEdges(geo, 91);
      expect(result.length).toBe(0);
    });
  });

  describe("SphereGeometry", () => {
    it("returns 0 edges at 30° threshold (smooth surface)", () => {
      const geo = new THREE.SphereGeometry(1, 32, 16);
      const result = extractCreaseEdges(geo, 30);
      expect(result.length).toBe(0);
    });
  });

  describe("ConeGeometry (square pyramid)", () => {
    it("returns 8 crease edges at 30° threshold", () => {
      // 4 radial segments = square pyramid
      // 4 base edges (~113°) + 4 ridge edges (~81°) = 8
      const geo = new THREE.ConeGeometry(0.6, 1, 4);
      const result = extractCreaseEdges(geo, 30);
      expect(result.length).toBe(8 * 6); // 8 edges * 2 verts * 3 coords
    });
  });

  describe("output format", () => {
    it("length is always a multiple of 6", () => {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const result = extractCreaseEdges(geo, 30);
      expect(result.length % 6).toBe(0);
    });

    it("returns Float32Array", () => {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const result = extractCreaseEdges(geo, 30);
      expect(result).toBeInstanceOf(Float32Array);
    });

    it("returns empty Float32Array for no edges", () => {
      const geo = new THREE.SphereGeometry(1, 32, 16);
      const result = extractCreaseEdges(geo, 30);
      expect(result).toBeInstanceOf(Float32Array);
      expect(result.length).toBe(0);
    });
  });
});
