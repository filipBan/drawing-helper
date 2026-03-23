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

interface SceneState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedForm: FormType;
  setSelectedForm: (form: FormType) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  selectedForm: "box",
  setSelectedForm: (form) => set({ selectedForm: form }),
  displayMode: "solid",
  setDisplayMode: (mode) => set({ displayMode: mode }),
}));
