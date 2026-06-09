import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { rand, rand2 } from "../lib/rand";

const COUNT = 14;

// Yumuşak, sıcak ışık zerreleri — yavaşça yukarı süzülür, nefes alır.
export const Bokeh: React.FC<{ tint?: string }> = ({ tint = "#ffce8a" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const parts = [];
  for (let i = 0; i < COUNT; i++) {
    const size = 8 + rand(i) * 46;
    const x = rand2(i) * width + Math.sin(frame * 0.01 + i) * 30;
    const speed = 0.15 + rand(i + 4) * 0.5;
    const startY = rand(i + 7) * (height + 200);
    const y = height + 100 - (((frame * speed + startY) % (height + 200)));
    const breathe = 0.5 + 0.5 * Math.sin(frame * 0.03 + i * 1.3);
    const opacity = (0.04 + rand(i + 2) * 0.12) * breathe;
    parts.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tint} 0%, ${tint}55 40%, transparent 70%)`,
          opacity,
          filter: "blur(2px)",
        }}
      />,
    );
  }

  return <AbsoluteFill style={{ pointerEvents: "none" }}>{parts}</AbsoluteFill>;
};
