"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

interface EdgeRendererProps {
  edges: Float32Array;
  color: string;
  thickness: number;
  showHidden?: boolean;
}

export function EdgeRenderer({
  edges,
  color,
  thickness,
  showHidden: _showHidden = false,
}: EdgeRendererProps) {
  const geomRef = useRef<THREE.BufferGeometry>(null);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        linewidth: thickness,
        depthFunc: THREE.LessEqualDepth,
      }),
    [color, thickness],
  );

  useEffect(() => {
    const geom = geomRef.current;
    if (!geom) return;

    const attr = new THREE.BufferAttribute(edges, 3);
    geom.setAttribute("position", attr);
    geom.computeBoundingSphere();
  }, [edges]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <lineSegments material={material}>
      <bufferGeometry ref={geomRef} />
    </lineSegments>
  );
}
