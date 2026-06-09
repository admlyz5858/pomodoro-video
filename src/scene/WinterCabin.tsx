import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rand } from "../lib/rand";
import { SnowWindow } from "./SnowWindow";
import { Fireplace } from "./Fireplace";
import { CoffeeMug } from "./CoffeeSteam";

const Firewood: React.FC = () => (
  <div style={{ position: "absolute", left: 1230, top: 880, width: 240, height: 120 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: (i % 3) * 70 + (i >= 3 ? 35 : 0),
          top: i >= 3 ? 0 : 40,
          width: 64,
          height: 40,
          borderRadius: 20,
          background: "linear-gradient(180deg,#5a3d28,#2e1d12)",
          boxShadow: "inset 6px 0 0 rgba(255,180,110,0.12)",
        }}
      >
        <div style={{ position: "absolute", left: 4, top: 8, width: 22, height: 22, borderRadius: "50%", background: "#7a5436" }} />
      </div>
    ))}
  </div>
);

const FairyLights: React.FC<{ glow: string }> = ({ glow }) => {
  const frame = useCurrentFrame();
  const bulbs = [];
  for (let i = 0; i < 16; i++) {
    const x = 60 + i * 118;
    const dip = Math.sin(i * 0.9) * 18;
    const tw = 0.5 + 0.5 * Math.sin(frame * 0.08 + i * 1.4);
    bulbs.push(
      <div key={i} style={{ position: "absolute", left: x, top: 30 + dip }}>
        <div style={{ position: "absolute", left: 5, top: -14, width: 2, height: 16, background: "#2a2018" }} />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: glow,
            opacity: 0.55 + tw * 0.45,
            boxShadow: `0 0 14px ${glow}, 0 0 28px ${glow}88`,
          }}
        />
      </div>,
    );
  }
  return <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 80 }}>{bulbs}</div>;
};

// Kış kulübesi sahnesi — ahşap oda + karlı pencere + şömine + sıcak ışık.
export const WinterCabin: React.FC<{ glow?: string; sky?: string }> = ({
  glow = "#ff9a3c",
  sky = "linear-gradient(180deg,#26334d 0%,#33405c 45%,#4a4e66 100%)",
}) => {
  const frame = useCurrentFrame();
  const flicker = 0.86 + 0.08 * Math.sin(frame * 0.5) + 0.05 * (rand(Math.floor(frame / 3)) - 0.5);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1c130c" }}>
      {/* Ahşap duvar (dikey tahtalar) */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(90deg,#3a2618 0px,#3a2618 118px,#2c1c11 120px,#3a2618 122px), linear-gradient(180deg,#3f2a1a 0%,#2a1b10 100%)",
        }}
      />
      {/* Zemin */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 300,
          background:
            "repeating-linear-gradient(90deg,#241710 0px,#241710 140px,#1b110a 143px,#241710 146px), linear-gradient(180deg,#2c1c11,#160d07)",
        }}
      />
      {/* Zemin halısı */}
      <div
        style={{
          position: "absolute",
          left: "28%",
          bottom: 40,
          width: "44%",
          height: 120,
          background: "radial-gradient(ellipse at center, #6a3b34 0%, #43221f 70%, transparent 80%)",
          borderRadius: "50%",
          opacity: 0.7,
        }}
      />

      <FairyLights glow={glow} />
      <SnowWindow sky={sky} />
      <Fireplace glow={glow} />
      <Firewood />

      {/* Sıcak içecek (orta-alt) */}
      <div style={{ position: "absolute", left: 880, top: 760, transform: "scale(1.1)" }}>
        <CoffeeMug accent={glow} />
      </div>

      {/* Şömineden yayılan sıcak ortam ışığı (sağdan) */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(60% 70% at 78% 70%, rgba(255,150,70,0.22) 0%, rgba(255,150,70,0.06) 45%, rgba(255,150,70,0) 70%)",
          opacity: flicker,
          pointerEvents: "none",
        }}
      />
      {/* Genel sıcak ton + vinyet */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(40,22,10,0.18) 0%, rgba(20,10,4,0.30) 100%)",
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 320px rgba(0,0,0,0.72)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
