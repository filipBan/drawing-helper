import { create } from "zustand";

interface SceneState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
