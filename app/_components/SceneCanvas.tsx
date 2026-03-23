"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Box,
  Sphere,
  Cylinder,
  Cone,
  Edges,
  Grid,
} from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore, DEFAULT_CAMERA_POSITION, LIGHT_PRESETS } from "@/app/_store/scene-store";
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
        <Box args={[1, 1, 1]} castShadow>
          <FormMaterial mode={mode} />
        </Box>
      );
    case "sphere":
      return (
        <Sphere args={[0.6, 32, 32]} castShadow>
          <FormMaterial mode={mode} />
        </Sphere>
      );
    case "cylinder":
      return (
        <Cylinder args={[0.5, 0.5, 1, 32]} castShadow>
          <FormMaterial mode={mode} />
        </Cylinder>
      );
    case "cone":
      return (
        <Cone args={[0.5, 1, 32]} castShadow>
          <FormMaterial mode={mode} />
        </Cone>
      );
    case "triangular-pyramid":
      return (
        <Cone args={[0.6, 1, 3]} castShadow>
          <FormMaterial mode={mode} />
        </Cone>
      );
    case "square-pyramid":
      return (
        <Cone args={[0.6, 1, 4]} castShadow>
          <FormMaterial mode={mode} />
        </Cone>
      );
    case "pentagonal-pyramid":
      return (
        <Cone args={[0.6, 1, 5]} castShadow>
          <FormMaterial mode={mode} />
        </Cone>
      );
  }
}

const LERP_SPEED = 0.05;
const ROTATION_LERP_SPEED = 0.08;

function RotatingGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const rotationCommand = useSceneStore((s) => s.rotationCommand);
  const clearRotationCommand = useSceneStore((s) => s.clearRotationCommand);
  const objectRotation = useSceneStore((s) => s.objectRotation);
  const lastCommandId = useRef<number | null>(null);
  const targetEuler = useRef<THREE.Euler | null>(null);
  const targetQuat = useRef<THREE.Quaternion | null>(null);
  const tweening = useRef(false);

  // Apply current rotation from store (handles form switch reset)
  const initialEuler = useMemo(
    () => new THREE.Euler(...objectRotation),
    [objectRotation],
  );

  useEffect(() => {
    if (groupRef.current && !tweening.current) {
      groupRef.current.rotation.set(...objectRotation);
    }
  }, [objectRotation]);

  useEffect(() => {
    if (!rotationCommand || rotationCommand.id === lastCommandId.current) return;
    lastCommandId.current = rotationCommand.id;

    const euler = new THREE.Euler(...rotationCommand.target);
    if (rotationCommand.animate) {
      targetEuler.current = euler;
      targetQuat.current = new THREE.Quaternion().setFromEuler(euler);
      tweening.current = true;
    } else {
      if (groupRef.current) {
        groupRef.current.rotation.copy(euler);
      }
      useSceneStore.setState({ objectRotation: rotationCommand.target });
    }
    clearRotationCommand();
  }, [rotationCommand, clearRotationCommand]);

  useFrame(() => {
    if (!tweening.current || !targetQuat.current || !groupRef.current) return;

    const currentQuat = groupRef.current.quaternion.clone();
    currentQuat.slerp(targetQuat.current, ROTATION_LERP_SPEED);
    groupRef.current.quaternion.copy(currentQuat);

    if (currentQuat.angleTo(targetQuat.current) < 0.005) {
      groupRef.current.rotation.copy(targetEuler.current!);
      useSceneStore.setState({
        objectRotation: [
          targetEuler.current!.x,
          targetEuler.current!.y,
          targetEuler.current!.z,
        ],
      });
      tweening.current = false;
      targetQuat.current = null;
      targetEuler.current = null;
    }
  });

  return (
    <group ref={groupRef} rotation={initialEuler}>
      {children}
    </group>
  );
}

function CameraController() {
  const fov = useSceneStore((s) => s.fov);
  const cameraCommand = useSceneStore((s) => s.cameraCommand);
  const clearCameraCommand = useSceneStore((s) => s.clearCameraCommand);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const controls = useThree((s) => s.controls) as unknown as {
    target: THREE.Vector3;
    update: () => void;
  } | null;

  const targetPos = useRef<THREE.Vector3 | null>(null);
  const tweening = useRef(false);
  const lastCommandId = useRef<number | null>(null);

  useEffect(() => {
    if (!cameraCommand || cameraCommand.id === lastCommandId.current) return;
    lastCommandId.current = cameraCommand.id;

    const pos = new THREE.Vector3(...cameraCommand.target);
    if (cameraCommand.animate) {
      targetPos.current = pos;
      tweening.current = true;
    } else {
      camera.position.copy(pos);
      camera.lookAt(0, 0, 0);
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }
    }
    clearCameraCommand();
  }, [cameraCommand, camera, controls, clearCameraCommand]);

  useFrame(() => {
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    if (tweening.current && targetPos.current) {
      camera.position.lerp(targetPos.current, LERP_SPEED);
      if (camera.position.distanceTo(targetPos.current) < 0.01) {
        camera.position.copy(targetPos.current);
        tweening.current = false;
        targetPos.current = null;
      }
      camera.lookAt(0, 0, 0);
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }
    }
  });

  return null;
}

const SPHERE_RADIUS = 4.5;

export function randomRotation(): [number, number, number] {
  return [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
  ];
}

export function randomCameraPosition(): [number, number, number] {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  // clamp to upper hemisphere to stay above ground
  const absPhi = Math.min(phi, Math.PI * 0.45);
  return [
    SPHERE_RADIUS * Math.sin(absPhi) * Math.cos(theta),
    SPHERE_RADIUS * Math.cos(absPhi),
    SPHERE_RADIUS * Math.sin(absPhi) * Math.sin(theta),
  ];
}

const GROUND_Y = -0.5;

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}

function SceneGrid() {
  const gridVisible = useSceneStore((s) => s.gridVisible);
  if (!gridVisible) return null;
  return (
    <Grid
      position={[0, GROUND_Y + 0.001, 0]}
      args={[50, 50]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#444444"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#555555"
      fadeDistance={25}
      fadeStrength={1}
      infiniteGrid={false}
      side={THREE.DoubleSide}
    />
  );
}

function ShadowLight() {
  const lightPreset = useSceneStore((s) => s.lightPreset);
  const shadowSoftness = useSceneStore((s) => s.shadowSoftness);
  const shadowRadius = 1 + shadowSoftness * 9; // map 0-1 to 1-10

  return (
    <directionalLight
      position={LIGHT_PRESETS[lightPreset]}
      intensity={1}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
      shadow-camera-near={0.1}
      shadow-camera-far={50}
      shadow-radius={shadowRadius}
    />
  );
}

export function SceneCanvas() {
  const sidebarOpen = useSceneStore((s) => s.sidebarOpen);
  const selectedForm = useSceneStore((s) => s.selectedForm);
  const displayMode = useSceneStore((s) => s.displayMode);
  const fov = useSceneStore((s) => s.fov);
  const ambientIntensity = useSceneStore((s) => s.ambientIntensity);

  return (
    <div className="h-screen w-screen">
      <Sidebar />
      <div
        className="h-full transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? 360 : 0 }}
      >
        <Canvas
          camera={{ position: DEFAULT_CAMERA_POSITION, fov }}
          style={{ background: "#3a3a3a" }}
          shadows="soft"
        >
          <ambientLight intensity={ambientIntensity} />
          <ShadowLight />
          <RotatingGroup>
            <SceneGeometry form={selectedForm} mode={displayMode} />
          </RotatingGroup>
          <GroundPlane />
          <SceneGrid />
          <CameraController />
          <OrbitControls
            maxPolarAngle={Math.PI / 2}
            makeDefault
          />
        </Canvas>
      </div>
    </div>
  );
}
