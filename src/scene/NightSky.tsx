import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rand, rand2 } from "../lib/rand";

const STAR_COUNT = 70;

// Gece gökyüzü: derin mavi-teal degrade + ay parıltısı + parıldayan yıldızlar.
export const NightSky: React.FC = () => {
  const frame = useCurrentFrame();

  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const x = rand(i) * 100;
    const y = rand2(i) * 62; // sadece üst kısımda
    const size = 1 + rand(i + 31) * 2.2;
    const twinkle =
      0.25 + 0.55 * (0.5 + 0.5 * Math.sin(frame * 0.06 + i * 1.7));
    stars.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#eaf2ff",
          opacity: twinkle * 0.8,
          boxShadow: `0 0 ${size * 2}px rgba(220,235,255,0.8)`,
        }}
      />,
    );
  }

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #07101b 0%, #0c1a2a 34%, #14283c 60%, #1d3146 78%, #2a3142 100%)",
      }}
    >
      {/* Ay parıltısı */}
      <div
        style={{
          position: "absolute",
          left: "72%",
          top: "12%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(226,232,240,0.35) 0%, rgba(226,232,240,0.10) 30%, rgba(226,232,240,0) 60%)",
          filter: "blur(2px)",
        }}
      />
      {/* Ay diski */}
      <div
        style={{
          position: "absolute",
          left: "76%",
          top: "16%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 38%, #f4f1e8 0%, #d9dbe0 55%, #b9bfca 100%)",
          boxShadow: "0 0 80px rgba(230,238,250,0.45)",
        }}
      />
      {stars}
      {/* Ufuktaki sıcak şehir ışığı sızıntısı */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "38%",
          background:
            "linear-gradient(180deg, rgba(214,138,74,0) 0%, rgba(214,138,74,0.10) 60%, rgba(230,150,80,0.22) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
