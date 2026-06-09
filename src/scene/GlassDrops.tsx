import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { rand, rand2 } from "../lib/rand";

const GLASS_BOTTOM = 0.7;
const RUNNERS = 10;
const SPECKS = 30;

// Camın YÜZEYİNDE: yavaşça aşağı süzülen, iz bırakan damlalar + duran zerreler.
export const GlassDrops: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const glassH = height * GLASS_BOTTOM;

  const runners = [];
  for (let i = 0; i < RUNNERS; i++) {
    const baseX = rand(i) * width;
    const period = 220 + rand2(i) * 300;
    const phase = rand(i + 11) * period;
    const t = (((frame + phase) % period) + period) % period / period; // 0..1
    // hafif ivmeli düşüş
    const eased = t * t * (3 - 2 * t);
    const headY = eased * glassH;
    const wobble = Math.sin((frame + phase) * 0.08 + i) * 6;
    const x = baseX + wobble;
    const headR = 5 + rand(i + 3) * 6;
    const trailLen = 30 + eased * 120;

    runners.push(
      <div key={`r-${i}`} style={{ position: "absolute", left: x, top: headY }}>
        {/* iz */}
        <div
          style={{
            position: "absolute",
            left: headR * 0.35,
            top: -trailLen,
            width: 2.5,
            height: trailLen,
            background:
              "linear-gradient(to bottom, rgba(200,220,245,0), rgba(200,220,245,0.35))",
            borderRadius: 2,
          }}
        />
        {/* damla başı */}
        <div
          style={{
            position: "absolute",
            width: headR * 1.6,
            height: headR * 2,
            background:
              "radial-gradient(circle at 35% 30%, rgba(235,244,255,0.9), rgba(150,175,205,0.5) 60%, rgba(120,145,180,0.2))",
            borderRadius: "50%",
            boxShadow: "inset 0 -2px 4px rgba(255,255,255,0.4)",
          }}
        />
      </div>,
    );
  }

  const specks = [];
  for (let i = 0; i < SPECKS; i++) {
    const x = rand(i + 200) * width;
    const y = rand2(i + 200) * glassH;
    const r = 1.5 + rand(i + 300) * 4;
    const shimmer = 0.3 + 0.3 * (0.5 + 0.5 * Math.sin(frame * 0.05 + i));
    specks.push(
      <div
        key={`s-${i}`}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: r,
          height: r * 1.3,
          background:
            "radial-gradient(circle at 35% 30%, rgba(230,242,255,0.85), rgba(150,175,205,0.3))",
          borderRadius: "50%",
          opacity: shimmer,
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
      }}
    >
      {specks}
      {runners}
    </div>
  );
};
