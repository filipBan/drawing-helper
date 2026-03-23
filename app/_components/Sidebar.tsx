"use client";

import {
  PanelLeftClose,
  PanelLeftOpen,
  Box,
  Circle,
  Cylinder,
  Cone,
  Triangle,
  Pyramid,
  Pentagon,
  Square,
  Grid3x3,
  Cuboid,
} from "lucide-react";
import { useSceneStore } from "@/app/_store/scene-store";
import type { FormType, DisplayMode } from "@/app/_store/scene-store";
import type { LucideIcon } from "lucide-react";

const displayModes: { mode: DisplayMode; label: string; icon: LucideIcon }[] =
  [
    { mode: "solid", label: "Solid", icon: Square },
    { mode: "wireframe", label: "Wire", icon: Grid3x3 },
    { mode: "solid-edges", label: "Edges", icon: Cuboid },
  ];

const forms: { type: FormType; label: string; icon: LucideIcon }[] = [
  { type: "box", label: "Box", icon: Box },
  { type: "sphere", label: "Sphere", icon: Circle },
  { type: "cylinder", label: "Cylinder", icon: Cylinder },
  { type: "cone", label: "Cone", icon: Cone },
  { type: "triangular-pyramid", label: "Tri Pyramid", icon: Triangle },
  { type: "square-pyramid", label: "Sq Pyramid", icon: Pyramid },
  { type: "pentagonal-pyramid", label: "Pent Pyramid", icon: Pentagon },
];

export function Sidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    selectedForm,
    setSelectedForm,
    displayMode,
    setDisplayMode,
  } = useSceneStore();

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
          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-3">
            Form
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {forms.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setSelectedForm(type)}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-2.5 text-xs transition-colors ${
                  selectedForm === type
                    ? "bg-neutral-700 text-white ring-1 ring-neutral-500"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
                aria-label={label}
              >
                <Icon size={20} />
                <span className="truncate w-full text-center">{label}</span>
              </button>
            ))}
          </div>

          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-3 mt-6">
            Display
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {displayModes.map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setDisplayMode(mode)}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-2.5 text-xs transition-colors ${
                  displayMode === mode
                    ? "bg-neutral-700 text-white ring-1 ring-neutral-500"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
                aria-label={label}
              >
                <Icon size={20} />
                <span className="truncate w-full text-center">{label}</span>
              </button>
            ))}
          </div>
        </aside>
      )}
    </>
  );
}
