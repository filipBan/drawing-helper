"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Box,
  Sphere,
  Cylinder,
  Cone,
  Edges,
} from "@react-three/drei";
import { useSceneStore } from "@/app/_store/scene-store";
import type { FormType, DisplayMode } from "@/app/_store/scene-store";
import { Sidebar } from "./Sidebar";

const materialProps = { color: "#b0b0b0" } as const;
const edgeColor = "#222222";

function FormMaterial({ mode }: { mode: DisplayMode }) {
  switch (mode) {
    case "solid":
      return <meshStandardMaterial {...materialProps} />;
    case "wireframe":
      return <meshStandardMaterial {...materialProps} wireframe />;
    case "solid-edges":
      return (
        <>
          <meshStandardMaterial {...materialProps} />
          <Edges color={edgeColor} />
        </>
      );
  }
}

function SceneGeometry({
  form,
  mode,
}: {
  form: FormType;
  mode: DisplayMode;
}) {
  switch (form) {
    case "box":
      return (
        <Box args={[1, 1, 1]}>
          <FormMaterial mode={mode} />
        </Box>
      );
    case "sphere":
      return (
        <Sphere args={[0.6, 32, 32]}>
          <FormMaterial mode={mode} />
        </Sphere>
      );
    case "cylinder":
      return (
        <Cylinder args={[0.5, 0.5, 1, 32]}>
          <FormMaterial mode={mode} />
        </Cylinder>
      );
    case "cone":
      return (
        <Cone args={[0.5, 1, 32]}>
          <FormMaterial mode={mode} />
        </Cone>
      );
    case "triangular-pyramid":
      return (
        <Cone args={[0.6, 1, 3]}>
          <FormMaterial mode={mode} />
        </Cone>
      );
    case "square-pyramid":
      return (
        <Cone args={[0.6, 1, 4]}>
          <FormMaterial mode={mode} />
        </Cone>
      );
    case "pentagonal-pyramid":
      return (
        <Cone args={[0.6, 1, 5]}>
          <FormMaterial mode={mode} />
        </Cone>
      );
  }
}

export function SceneCanvas() {
  const sidebarOpen = useSceneStore((s) => s.sidebarOpen);
  const selectedForm = useSceneStore((s) => s.selectedForm);
  const displayMode = useSceneStore((s) => s.displayMode);

  return (
    <div className="h-screen w-screen">
      <Sidebar />
      <div
        className="h-full transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? 360 : 0 }}
      >
        <Canvas
          camera={{ position: [3, 2, 3], fov: 50 }}
          style={{ background: "#3a3a3a" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <SceneGeometry form={selectedForm} mode={displayMode} />
          <OrbitControls
            maxPolarAngle={Math.PI / 2}
            makeDefault
          />
        </Canvas>
      </div>
    </div>
  );
}
