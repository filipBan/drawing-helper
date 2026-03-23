"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSceneStore } from "@/app/_store/scene-store";
import { Sidebar } from "./Sidebar";

function DefaultBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#b0b0b0" />
    </mesh>
  );
}

export function SceneCanvas() {
  const sidebarOpen = useSceneStore((s) => s.sidebarOpen);

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
          <DefaultBox />
          <OrbitControls
            maxPolarAngle={Math.PI / 2}
            makeDefault
          />
        </Canvas>
      </div>
    </div>
  );
}
