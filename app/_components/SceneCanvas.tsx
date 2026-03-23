"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Sphere, Cylinder, Cone } from "@react-three/drei";
import { useSceneStore } from "@/app/_store/scene-store";
import type { FormType } from "@/app/_store/scene-store";
import { Sidebar } from "./Sidebar";

const materialProps = { color: "#b0b0b0" } as const;

function SceneGeometry({ form }: { form: FormType }) {
  switch (form) {
    case "box":
      return (
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial {...materialProps} />
        </Box>
      );
    case "sphere":
      return (
        <Sphere args={[0.6, 32, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Sphere>
      );
    case "cylinder":
      return (
        <Cylinder args={[0.5, 0.5, 1, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Cylinder>
      );
    case "cone":
      return (
        <Cone args={[0.5, 1, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Cone>
      );
    case "triangular-pyramid":
      return (
        <Cone args={[0.6, 1, 3]}>
          <meshStandardMaterial {...materialProps} />
        </Cone>
      );
    case "square-pyramid":
      return (
        <Cone args={[0.6, 1, 4]}>
          <meshStandardMaterial {...materialProps} />
        </Cone>
      );
    case "pentagonal-pyramid":
      return (
        <Cone args={[0.6, 1, 5]}>
          <meshStandardMaterial {...materialProps} />
        </Cone>
      );
  }
}

export function SceneCanvas() {
  const sidebarOpen = useSceneStore((s) => s.sidebarOpen);
  const selectedForm = useSceneStore((s) => s.selectedForm);

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
          <SceneGeometry form={selectedForm} />
          <OrbitControls
            maxPolarAngle={Math.PI / 2}
            makeDefault
          />
        </Canvas>
      </div>
    </div>
  );
}
