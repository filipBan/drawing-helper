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
  showHidden = false,
}: EdgeRendererProps) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const hiddenGeomRef = useRef<THREE.BufferGeometry>(null);
  const hiddenLineRef = useRef<THREE.LineSegments>(null);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        linewidth: thickness,
        depthFunc: THREE.LessEqualDepth,
      }),
    [color, thickness],
  );

  const hiddenMaterial = useMemo(
    () =>
      new THREE.LineDashedMaterial({
        color,
        linewidth: thickness * 0.5,
        depthFunc: THREE.GreaterDepth,
        dashSize: 0.05,
        gapSize: 0.05,
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
    if (!showHidden) return;
    const geom = hiddenGeomRef.current;
    if (!geom) return;

    const attr = new THREE.BufferAttribute(edges, 3);
    geom.setAttribute("position", attr);
    geom.computeBoundingSphere();
    hiddenLineRef.current?.computeLineDistances();
  }, [edges, showHidden]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useEffect(() => {
    return () => {
      hiddenMaterial.dispose();
    };
  }, [hiddenMaterial]);

  return (
    <>
      <lineSegments material={material}>
        <bufferGeometry ref={geomRef} />
      </lineSegments>
      {showHidden && (
        <lineSegments ref={hiddenLineRef} material={hiddenMaterial}>
          <bufferGeometry ref={hiddenGeomRef} />
        </lineSegments>
      )}
    </>
  );
}
