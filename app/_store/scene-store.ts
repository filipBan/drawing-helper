import { create } from "zustand";

export type FormType =
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "triangular-pyramid"
  | "square-pyramid"
  | "pentagonal-pyramid";

export type DisplayMode = "solid" | "wireframe" | "solid-edges";

export type LightPreset =
  | "top-front"
  | "side"
  | "top-down"
  | "back-rim"
  | "low-angle";

export const LIGHT_PRESETS: Record<LightPreset, [number, number, number]> = {
  "top-front": [3, 5, 3],
  side: [6, 2, 0],
  "top-down": [0, 7, 0],
  "back-rim": [-3, 4, -3],
  "low-angle": [3, 1, 3],
};

export type CameraCommand = {
  target: [number, number, number];
  animate: boolean;
  id: number;
};

export type RotationCommand = {
  target: [number, number, number];
  animate: boolean;
  id: number;
};

interface SceneState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedForm: FormType;
  setSelectedForm: (form: FormType) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  fov: number;
  setFov: (fov: number) => void;
  animationEnabled: boolean;
  toggleAnimation: () => void;
  cameraCommand: CameraCommand | null;
  sendCameraCommand: (target: [number, number, number], animate: boolean) => void;
  clearCameraCommand: () => void;
  objectRotation: [number, number, number];
  rotationCommand: RotationCommand | null;
  sendRotationCommand: (target: [number, number, number], animate: boolean) => void;
  clearRotationCommand: () => void;
  lightPreset: LightPreset;
  setLightPreset: (preset: LightPreset) => void;
  ambientIntensity: number;
  setAmbientIntensity: (intensity: number) => void;
  gridVisible: boolean;
  toggleGrid: () => void;
  shadowSoftness: number;
  setShadowSoftness: (softness: number) => void;
}

export const DEFAULT_CAMERA_POSITION: [number, number, number] = [3, 2, 3];
export const DEFAULT_FOV = 50;

let commandId = 0;
let rotationCommandId = 0;

export const useSceneStore = create<SceneState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  selectedForm: "box",
  setSelectedForm: (form) =>
    set({ selectedForm: form, objectRotation: [0, 0, 0], rotationCommand: null }),
  displayMode: "solid",
  setDisplayMode: (mode) => set({ displayMode: mode }),
  fov: DEFAULT_FOV,
  setFov: (fov) => set({ fov }),
  animationEnabled: true,
  toggleAnimation: () => set((s) => ({ animationEnabled: !s.animationEnabled })),
  cameraCommand: null,
  sendCameraCommand: (target, animate) =>
    set({ cameraCommand: { target, animate, id: ++commandId } }),
  clearCameraCommand: () => set({ cameraCommand: null }),
  objectRotation: [0, 0, 0],
  rotationCommand: null,
  sendRotationCommand: (target, animate) =>
    set({ rotationCommand: { target, animate, id: ++rotationCommandId } }),
  clearRotationCommand: () => set({ rotationCommand: null }),
  lightPreset: "top-front",
  setLightPreset: (preset) => set({ lightPreset: preset }),
  ambientIntensity: 0.4,
  setAmbientIntensity: (intensity) => set({ ambientIntensity: intensity }),
  gridVisible: true,
  toggleGrid: () => set((s) => ({ gridVisible: !s.gridVisible })),
  shadowSoftness: 0.5,
  setShadowSoftness: (softness) => set({ shadowSoftness: softness }),
}));
