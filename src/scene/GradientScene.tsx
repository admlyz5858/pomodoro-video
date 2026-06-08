import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rand, rand2 } from "../lib/rand";
import { Bokeh } from "./Bokeh";
import { CitySkyline } from "./CitySkyline";

const Stars: React.FC<{ count?: number }> = ({ count = 90 }) => {
  const frame = useCurrentFrame();
  const els = [];
  for (let i = 0; i < count; i++) {
    const x = rand(i) * 100;
    const y = rand2(i) * 78;
    const size = 1 + rand(i + 13) * 2.4;
    const tw = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(frame * 0.06 + i * 1.7));
    els.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#eef4ff",
          opacity: tw * 0.85,
          boxShadow: `0 0 ${size * 2}px rgba(220,235,255,0.8)`,
        }}
      />,
    );
  }
  return <AbsoluteFill>{els}</AbsoluteFill>;
};

const Aurora: React.FC<{ colors: string[] }> = ({ colors }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ filter: "blur(60px)", opacity: 0.55 }}>
      {colors.map((c, i) => {
        const x = 20 + i * 22 + Math.sin(frame * 0.01 + i) * 8;
        const y = 18 + (i % 2) * 22 + Math.cos(frame * 0.012 + i) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 620,
              height: 360,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${c} 0%, ${c}00 70%)`,
              transform: "translate(-50%,-50%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export interface GradientSceneProps {
  background: string;
  stars?: boolean;
  moon?: boolean;
  bokeh?: boolean;
  bokehTint?: string;
  skyline?: boolean;
  aurora?: string[];
  vignette?: number;
}

export const GradientScene: React.FC<GradientSceneProps> = ({
  background,
  stars,
  moon,
  bokeh,
  bokehTint = "#ffce8a",
  skyline,
  aurora,
  vignette = 0.6,
}) => {
  return (
    <AbsoluteFill style={{ background }}>
      {aurora ? <Aurora colors={aurora} /> : null}
      {stars ? <Stars /> : null}
      {moon ? (
        <div
          style={{
            position: "absolute",
            left: "75%",
            top: "16%",
            width: 130,
            height: 130,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 38%, #f6f3ea 0%, #dadce1 55%, #b7bdc8 100%)",
            boxShadow: "0 0 90px rgba(235,240,250,0.5)",
          }}
        />
      ) : null}
      {skyline ? <CitySkyline /> : null}
      {bokeh ? <Bokeh tint={bokehTint} /> : null}

      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 340px rgba(0,0,0,${vignette})`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
