import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";

// Fraunces: karakterli, editöryel serif — büyük saat rakamları için.
export const fraunces = loadFraunces("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
}).fontFamily;

// Jost: geometrik, zarif sans — etiketler ve küçük metinler için.
export const jost = loadJost("normal", {
  weights: ["300", "400", "500"],
  subsets: ["latin"],
}).fontFamily;
