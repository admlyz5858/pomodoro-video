import React from "react";
import { useCurrentFrame } from "remotion";

// Saksıda yapraklar — yumuşakça sallanır (rim ışık vurgusu ile siluet).
export const Plant: React.FC<{ rim: string }> = ({ rim }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.04) * 2.5;

  const leaves = [
    { rot: -42, len: 130, w: 34, x: 24, delay: 0 },
    { rot: -20, len: 158, w: 36, x: 30, delay: 0.6 },
    { rot: 0, len: 172, w: 38, x: 36, delay: 1.2 },
    { rot: 22, len: 156, w: 36, x: 42, delay: 1.8 },
    { rot: 44, len: 128, w: 34, x: 48, delay: 2.4 },
  ];

  return (
    <div style={{ position: "relative", width: 150, height: 250 }}>
      {/* Yapraklar */}
      <div style={{ position: "absolute", bottom: 70, left: 30 }}>
        {leaves.map((l, i) => {
          const s = sway + Math.sin(frame * 0.05 + l.delay) * 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 0,
                left: l.x,
                width: l.w,
                height: l.len,
                background: "linear-gradient(180deg,#1c2a1d 0%,#0e1710 100%)",
                borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%",
                transform: `rotate(${l.rot + s}deg)`,
                transformOrigin: "bottom center",
                boxShadow: `inset 2px 0 0 ${rim}22`,
              }}
            />
          );
        })}
      </div>
      {/* Saksı */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 34,
          width: 84,
          height: 78,
          background: "linear-gradient(180deg,#3a2519 0%,#1c120c 100%)",
          borderRadius: "6px 6px 14px 14px",
          clipPath: "polygon(8% 0, 92% 0, 82% 100%, 18% 100%)",
          boxShadow: `0 0 20px ${rim}18`,
        }}
      />
    </div>
  );
};
