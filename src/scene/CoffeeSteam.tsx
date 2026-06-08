import React from "react";
import { useCurrentFrame } from "remotion";

// Sıcak kupa + yükselen dalgalı buhar.
export const CoffeeMug: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();

  // Üç buhar şeridi — her biri farklı fazda dalgalanır, yukarı süzülür, solar.
  const streams = [0, 1, 2].map((i) => {
    const phase = i * 2.1;
    const wob = (t: number) => Math.sin(frame * 0.07 + phase + t) * (6 + i * 2);
    const x0 = 14 + i * 14;
    const d = `M ${x0} 70
       C ${x0 + wob(0)} 52, ${x0 - wob(1)} 38, ${x0 + wob(1.5)} 22
       S ${x0 - wob(2)} -4, ${x0 + wob(2.5)} -26`;
    const op = 0.10 + 0.10 * (0.5 + 0.5 * Math.sin(frame * 0.05 + phase));
    return (
      <path
        key={i}
        d={d}
        fill="none"
        stroke="rgba(230,225,215,1)"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={op}
        style={{ filter: "blur(3px)" }}
      />
    );
  });

  return (
    <div style={{ position: "relative", width: 120, height: 170 }}>
      {/* Buhar */}
      <svg
        width={90}
        height={120}
        viewBox="-20 -40 90 120"
        style={{ position: "absolute", left: 24, top: -36 }}
      >
        {streams}
      </svg>
      {/* Kupa gövdesi */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 18,
          width: 84,
          height: 78,
          background: "linear-gradient(180deg, #2a2320 0%, #15110e 100%)",
          borderRadius: "10px 10px 16px 16px",
          boxShadow: `inset 6px 0 10px rgba(255,255,255,0.04), 0 0 26px ${accent}33`,
        }}
      />
      {/* Kupa içi sıcak parıltı (üst elips) */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 22,
          width: 76,
          height: 16,
          background: `radial-gradient(ellipse at center, ${accent}cc 0%, ${accent}55 50%, transparent 75%)`,
          borderRadius: "50%",
        }}
      />
      {/* Kulp */}
      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: 96,
          width: 26,
          height: 34,
          border: "7px solid #1d1714",
          borderLeft: "none",
          borderRadius: "0 16px 16px 0",
        }}
      />
    </div>
  );
};
