import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rand, rand2 } from "../lib/rand";

// Ufuk çizgisi (cam tabanı). Binalar buradan yukarı uzanır.
const HORIZON = 0.66; // ekran yüksekliğinin oranı

interface BuildingLayerProps {
  count: number;
  seedBase: number;
  baseColor: string;
  maxHeight: number; // px
  minHeight: number;
  widthRange: [number, number];
  windowColor: string;
  opacity: number;
  drift: number; // px (yavaş parallax)
}

const BuildingLayer: React.FC<BuildingLayerProps> = ({
  count,
  seedBase,
  baseColor,
  maxHeight,
  minHeight,
  widthRange,
  windowColor,
  opacity,
  drift,
}) => {
  const buildings = [];
  let x = -40;
  for (let i = 0; i < count; i++) {
    const s = seedBase + i;
    const w = widthRange[0] + rand(s) * (widthRange[1] - widthRange[0]);
    const h = minHeight + rand2(s) * (maxHeight - minHeight);
    const gap = 2 + rand(s + 0.5) * 10;

    // Bina pencereleri
    const wins = [];
    const cols = Math.max(2, Math.floor(w / 26));
    const rows = Math.max(2, Math.floor(h / 34));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ws = s * 13.3 + r * 7.1 + c * 3.7;
        const lit = rand(ws) > 0.52;
        if (!lit) continue;
        wins.push(
          <div
            key={`${r}-${c}`}
            style={{
              position: "absolute",
              left: 8 + c * (w - 16) / cols,
              top: 10 + r * (h - 16) / rows,
              width: Math.max(4, (w - 16) / cols - 8),
              height: 9,
              background: windowColor,
              opacity:
                0.55 +
                0.45 * (0.5 + 0.5 * Math.sin(ws * 50 + ws)) * 1,
              borderRadius: 1,
              boxShadow: `0 0 6px ${windowColor}`,
            }}
          />,
        );
      }
    }

    buildings.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          bottom: 0,
          width: w,
          height: h,
          background: baseColor,
          borderTopLeftRadius: rand(s + 9) > 0.7 ? 4 : 0,
          borderTopRightRadius: rand(s + 8) > 0.7 ? 4 : 0,
        }}
      >
        {wins}
      </div>,
    );
    x += w + gap;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${HORIZON * 100}%`,
        bottom: 0,
        transform: `translateX(${drift}px)`,
      }}
    >
      {buildings}
    </div>
  );
};

export const CitySkyline: React.FC = () => {
  const frame = useCurrentFrame();
  const driftFar = Math.sin(frame * 0.004) * 6;
  const driftNear = Math.sin(frame * 0.004 + 1) * 3;

  return (
    <AbsoluteFill>
      {/* Uzak kule sırası */}
      <BuildingLayer
        count={22}
        seedBase={100}
        baseColor="#0b1622"
        minHeight={120}
        maxHeight={300}
        widthRange={[60, 120]}
        windowColor="#ffcf87"
        opacity={0.8}
        drift={driftFar}
      />
      {/* Yakın kule sırası */}
      <BuildingLayer
        count={14}
        seedBase={500}
        baseColor="#070d15"
        minHeight={180}
        maxHeight={420}
        widthRange={[90, 170]}
        windowColor="#ffb86b"
        opacity={1}
        drift={driftNear}
      />
    </AbsoluteFill>
  );
};
