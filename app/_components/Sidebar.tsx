"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSceneStore } from "@/app/_store/scene-store";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useSceneStore();

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarOpen ? (
          <PanelLeftClose size={18} />
        ) : (
          <PanelLeftOpen size={18} />
        )}
      </button>

      {sidebarOpen && (
        <aside className="fixed top-0 left-0 z-40 h-full w-[360px] bg-neutral-900 border-r border-neutral-800 pt-16 px-4 pb-4 overflow-y-auto">
          <p className="text-sm text-neutral-500">Controls will appear here</p>
        </aside>
      )}
    </>
  );
}
