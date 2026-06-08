import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { rand, rand2 } from "../lib/rand";

// Camın ARDINDA düşen yağmur — hafif bulanık, mavimsi, derinlik hissi.
// Sadece cam alanında (üst ~%70) görünür.
const COUNT = 130;
const GLASS_BOTTOM = 0.7; // cam alanının alt sınırı (oran)

export const OutsideRain: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const glassH = height * GLASS_BOTTOM;

  const drops = [];
  for (let i = 0; i < COUNT; i++) {
    const x = rand(i) * (width + 120) - 60;
    const len = 40 + rand2(i) * 70;
    const speed = 14 + rand(i + 5) * 16;
    const offset = rand2(i + 3) * (glassH + 200);
    const travel = glassH + 200;
    const y = ((frame * speed + offset) % travel) - 120;
    const opacity = 0.05 + rand(i + 9) * 0.12;
    drops.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 1.5,
          height: len,
          background:
            "linear-gradient(to bottom, rgba(190,210,235,0), rgba(190,210,235,0.8))",
          opacity,
          transform: "rotate(13deg)",
          borderRadius: 2,
        }}
      />,
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: `${GLASS_BOTTOM * 100}%`,
        overflow: "hidden",
        filter: "blur(1.2px)",
      }}
    >
      {drops}
    </div>
  );
};
