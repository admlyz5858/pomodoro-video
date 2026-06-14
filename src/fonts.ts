import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";

// Fraunces: karakterli editöryel serif (cozy/şık saat)
export const fraunces = loadFraunces("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
}).fontFamily;

// Cormorant Garamond: ince/klasik serif (zarif çember saati)
export const cormorant = loadCormorant("normal", {
  weights: ["300", "400", "500"],
  subsets: ["latin"],
}).fontFamily;

// Jost: geometrik zarif sans (etiketler)
export const jost = loadJost("normal", {
  weights: ["300", "400", "500"],
  subsets: ["latin"],
}).fontFamily;

// JetBrains Mono: teknik/minimal saat
export const mono = loadMono("normal", {
  weights: ["300", "500", "700"],
  subsets: ["latin"],
}).fontFamily;

// Outfit: temiz geometrik
export const outfit = loadOutfit("normal", {
  weights: ["300", "500", "700"],
  subsets: ["latin"],
}).fontFamily;

// Unbounded: yuvarlak modern display
export const unbounded = loadUnbounded("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
}).fontFamily;

// Bebas Neue: ince-uzun poster
export const bebas = loadBebas("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

export type FontKey = "serif" | "mono" | "geo" | "display" | "poster";

export const fontByKey: Record<FontKey, string> = {
  serif: fraunces,
  mono,
  geo: outfit,
  display: unbounded,
  poster: bebas,
};
