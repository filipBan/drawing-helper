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

export type CameraCommand = {
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
}

export const DEFAULT_CAMERA_POSITION: [number, number, number] = [3, 2, 3];
export const DEFAULT_FOV = 50;

let commandId = 0;

export const useSceneStore = create<SceneState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  selectedForm: "box",
  setSelectedForm: (form) => set({ selectedForm: form }),
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
}));
