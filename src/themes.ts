import { FontKey } from "./fonts";
import { RingMode } from "./components/DigitalClock";
import { GradientSceneProps } from "./scene/GradientScene";

export type SceneSpec =
  | { kind: "cozy"; tint?: string }
  | { kind: "forest" }
  | { kind: "gradient"; props: GradientSceneProps };

export interface Theme {
  id: number;
  name: string;
  scene: SceneSpec;
  accentFocus: string;
  accentBreak: string;
  font: FontKey;
  ring: RingMode;
  showDots: boolean;
  textColor: string;
  timeSize?: number;
  timeWeight?: number;
  letterSpacing?: number;
}

export const THEMES: Theme[] = [
  {
    id: 0,
    name: "Cozy Cool — buz mavisi gece odası",
    scene: { kind: "cozy", tint: "#2f5d86" },
    accentFocus: "#84c5ec",
    accentBreak: "#b69ae6",
    font: "serif",
    ring: "around",
    showDots: true,
    textColor: "#f4f7fb",
  },
  {
    id: 1,
    name: "Cozy Amber — sıcak mum ışığı odası",
    scene: { kind: "cozy" },
    accentFocus: "#eaa75e",
    accentBreak: "#e88c4a",
    font: "serif",
    ring: "around",
    showDots: true,
    textColor: "#f7efe2",
  },
  {
    id: 2,
    name: "Cozy Lavender — lavanta gece odası",
    scene: { kind: "cozy", tint: "#6b4d8f" },
    accentFocus: "#e6a3d4",
    accentBreak: "#b69ae6",
    font: "serif",
    ring: "around",
    showDots: true,
    textColor: "#f8eef7",
  },
  {
    id: 3,
    name: "Rainy Forest — yağmurlu orman",
    scene: { kind: "forest" },
    accentFocus: "#9fe0c0",
    accentBreak: "#cfeede",
    font: "serif",
    ring: "around",
    showDots: true,
    textColor: "#eef6f0",
  },
  {
    id: 4,
    name: "Minimal Mono — sade brutalist",
    scene: {
      kind: "gradient",
      props: {
        background: "linear-gradient(180deg,#0c0d10 0%,#15171c 100%)",
        bokeh: true,
        bokehTint: "#aab4c4",
        vignette: 0.55,
      },
    },
    accentFocus: "#cfd6e0",
    accentBreak: "#9aa6b5",
    font: "mono",
    ring: "thin",
    showDots: false,
    textColor: "#f1f3f7",
    timeWeight: 300,
  },
  {
    id: 5,
    name: "Midnight Starfield — yıldızlı gece",
    scene: {
      kind: "gradient",
      props: {
        background: "linear-gradient(180deg,#070a1a 0%,#0e1430 55%,#161d3f 100%)",
        stars: true,
        moon: true,
        vignette: 0.6,
      },
    },
    accentFocus: "#8fb4ff",
    accentBreak: "#b9a3ff",
    font: "geo",
    ring: "around",
    showDots: true,
    textColor: "#eef1ff",
  },
  {
    id: 6,
    name: "Sunset Dusk — gün batımı silüeti",
    scene: {
      kind: "gradient",
      props: {
        background:
          "linear-gradient(180deg,#2a1a3e 0%,#5a2d4d 42%,#b85c4a 76%,#e8915a 100%)",
        skyline: true,
        bokeh: true,
        bokehTint: "#ffcaa0",
        vignette: 0.5,
      },
    },
    accentFocus: "#ffd9a0",
    accentBreak: "#ffb38a",
    font: "display",
    ring: "around",
    showDots: true,
    textColor: "#fff3e6",
  },
  {
    id: 7,
    name: "Aurora — kuzey ışıkları",
    scene: {
      kind: "gradient",
      props: {
        background: "linear-gradient(180deg,#05121a 0%,#0a2230 100%)",
        aurora: ["#3ef0b0", "#5ad2ff", "#a06bff"],
        stars: true,
        vignette: 0.6,
      },
    },
    accentFocus: "#6ef0c0",
    accentBreak: "#9ab8ff",
    font: "geo",
    ring: "around",
    showDots: true,
    textColor: "#eafff6",
  },
  {
    id: 8,
    name: "Lofi Pastel — aesthetic mor/pembe",
    scene: {
      kind: "gradient",
      props: {
        background:
          "linear-gradient(160deg,#3a2a5e 0%,#6b4a8f 45%,#b56a9a 80%,#e0a3b8 100%)",
        aurora: ["#caa0ff", "#ff9ecb"],
        bokeh: true,
        bokehTint: "#ffd0e8",
        vignette: 0.45,
      },
    },
    accentFocus: "#ffc8e6",
    accentBreak: "#c8b0ff",
    font: "display",
    ring: "around",
    showDots: true,
    textColor: "#fff0f6",
  },
  {
    id: 9,
    name: "Poster Bold — iri poster saat",
    scene: {
      kind: "gradient",
      props: {
        background:
          "radial-gradient(120% 100% at 50% 30%, #14161c 0%, #07080b 100%)",
        bokeh: true,
        bokehTint: "#ff7a4d",
        vignette: 0.7,
      },
    },
    accentFocus: "#ff5a3c",
    accentBreak: "#ffd23c",
    font: "poster",
    ring: "none",
    showDots: false,
    textColor: "#f5f5f0",
    timeSize: 460,
    letterSpacing: 8,
  },
];
