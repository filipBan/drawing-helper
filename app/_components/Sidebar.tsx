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
  Shuffle,
  RotateCcw,
  Aperture,
  Dices,
  Sun,
  SunDim,
  SunMedium,
  Sunset,
  Sunrise,
} from "lucide-react";
import { useSceneStore, DEFAULT_FOV, DEFAULT_CAMERA_POSITION } from "@/app/_store/scene-store";
import { randomCameraPosition, randomRotation } from "./SceneCanvas";
import type { FormType, DisplayMode, LightPreset } from "@/app/_store/scene-store";
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

const lightPresets: {
  preset: LightPreset;
  label: string;
  icon: LucideIcon;
}[] = [
  { preset: "top-front", label: "Top Front", icon: Sun },
  { preset: "side", label: "Side", icon: Sunset },
  { preset: "top-down", label: "Top Down", icon: SunMedium },
  { preset: "back-rim", label: "Back/Rim", icon: Sunrise },
  { preset: "low-angle", label: "Low Angle", icon: SunDim },
];

export function Sidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    selectedForm,
    setSelectedForm,
    displayMode,
    setDisplayMode,
    fov,
    setFov,
    animationEnabled,
    toggleAnimation,
    sendCameraCommand,
    sendRotationCommand,
    lightPreset,
    setLightPreset,
    ambientIntensity,
    setAmbientIntensity,
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

          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-3 mt-6">
            Object
          </h3>
          <div className="grid grid-cols-1 gap-2 mb-3">
            <button
              onClick={() => sendRotationCommand(randomRotation(), animationEnabled)}
              className="flex items-center justify-center gap-1.5 rounded-lg p-2.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
            >
              <Dices size={16} />
              Randomize Rotation
            </button>
          </div>

          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-3 mt-6">
            Camera
          </h3>

          <div className="mb-3">
            <label className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
              <Aperture size={14} />
              FOV: {fov}°
            </label>
            <input
              type="range"
              min={15}
              max={120}
              value={fov}
              onChange={(e) => setFov(Number(e.target.value))}
              className="w-full accent-neutral-500"
            />
            <div className="flex justify-between text-[10px] text-neutral-600">
              <span>15°</span>
              <span>120°</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => sendCameraCommand(randomCameraPosition(), animationEnabled)}
              className="flex items-center justify-center gap-1.5 rounded-lg p-2.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
            >
              <Shuffle size={16} />
              Randomize
            </button>
            <button
              onClick={() => {
                sendCameraCommand(DEFAULT_CAMERA_POSITION, animationEnabled);
                setFov(DEFAULT_FOV);
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg p-2.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-3 mt-6">
            Lighting
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {lightPresets.map(({ preset, label, icon: Icon }) => (
              <button
                key={preset}
                onClick={() => setLightPreset(preset)}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-2 text-[10px] transition-colors ${
                  lightPreset === preset
                    ? "bg-neutral-700 text-white ring-1 ring-neutral-500"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
                aria-label={label}
              >
                <Icon size={18} />
                <span className="truncate w-full text-center">{label}</span>
              </button>
            ))}
          </div>

          <div className="mb-3">
            <label className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
              <SunDim size={14} />
              Ambient: {ambientIntensity.toFixed(2)}
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={ambientIntensity}
              onChange={(e) => setAmbientIntensity(Number(e.target.value))}
              className="w-full accent-neutral-500"
            />
            <div className="flex justify-between text-[10px] text-neutral-600">
              <span>0</span>
              <span>1</span>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={animationEnabled}
              onChange={toggleAnimation}
              className="accent-neutral-500"
            />
            Animate transitions
          </label>
        </aside>
      )}
    </>
  );
}
