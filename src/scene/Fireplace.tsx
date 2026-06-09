import React from "react";
import { useCurrentFrame } from "remotion";
import { rand } from "../lib/rand";

// Animasyonlu şömine: taş ocak + dans eden alevler + ışıltı + yükselen közler.
export const Fireplace: React.FC<{
  glow?: string;
  x?: number;
  y?: number;
  scale?: number;
}> = ({ glow = "#ff9a3c", x = 1180, y = 470, scale = 1 }) => {
  const frame = useCurrentFrame();

  // Ocak ışığının titreşimi
  const flicker =
    0.82 +
    0.1 * Math.sin(frame * 0.5) +
    0.06 * Math.sin(frame * 1.7 + 1) +
    0.05 * (rand(Math.floor(frame / 2)) - 0.5);

  // Alev dilleri
  const flames = [
    { w: 150, h: 240, c1: "#7a1f08", c2: "#e8531a", ph: 0, sp: 0.22 },
    { w: 110, h: 300, c1: "#b23310", c2: "#ff7a1e", ph: 1.3, sp: 0.3 },
    { w: 74, h: 250, c1: "#e8651c", c2: "#ffb43c", ph: 2.1, sp: 0.4 },
    { w: 42, h: 180, c1: "#ffae3a", c2: "#ffe7a0", ph: 3.4, sp: 0.55 },
  ];

  // Yükselen közler
  const embers = [];
  for (let i = 0; i < 14; i++) {
    const period = 90 + rand(i) * 70;
    const t = (((frame + rand(i + 5) * period) % period) / period); // 0..1
    const ex = (rand(i + 1) - 0.5) * 160 + Math.sin((frame + i * 9) * 0.06) * 18;
    const ey = -t * 280;
    const op = (1 - t) * (0.4 + rand(i + 3) * 0.5);
    const sz = 2 + rand(i + 7) * 3;
    embers.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: ex,
          bottom: 150 + -ey,
          width: sz,
          height: sz,
          borderRadius: "50%",
          background: "#ffce7a",
          opacity: op,
          boxShadow: `0 0 ${sz * 2}px ${glow}`,
        }}
      />,
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: "center bottom",
        width: 520,
        height: 560,
      }}
    >
      {/* Geniş sıcak ışık halesi */}
      <div
        style={{
          position: "absolute",
          left: -160,
          top: -120,
          width: 840,
          height: 840,
          background: `radial-gradient(circle, ${glow}55 0%, ${glow}22 28%, ${glow}00 60%)`,
          opacity: flicker,
          filter: "blur(6px)",
        }}
      />

      {/* Taş ocak çerçevesi */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 40,
          width: 400,
          height: 470,
          background: "linear-gradient(180deg,#3a342f 0%,#241f1b 100%)",
          borderRadius: "14px 14px 6px 6px",
        }}
      />
      {/* Ocak ağzı (koyu iç) */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 150,
          width: 300,
          height: 320,
          background:
            "radial-gradient(ellipse at 50% 100%, #3a1604 0%, #160a05 70%)",
          borderRadius: "120px 120px 8px 8px",
          overflow: "hidden",
        }}
      >
        {/* Alevler */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -10, height: 320 }}>
          {flames.map((f, i) => {
            const sway = Math.sin(frame * f.sp + f.ph) * 14;
            const stretch =
              1 + 0.18 * Math.sin(frame * (f.sp + 0.3) + f.ph * 2);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 150 - f.w / 2 + sway,
                  bottom: 0,
                  width: f.w,
                  height: f.h * stretch,
                  background: `radial-gradient(ellipse at 50% 80%, ${f.c2} 0%, ${f.c1} 60%, transparent 75%)`,
                  borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%",
                  filter: "blur(2px)",
                  opacity: 0.92 * flicker,
                  mixBlendMode: "screen",
                }}
              />
            );
          })}
          {/* Kor yatağı */}
          <div
            style={{
              position: "absolute",
              left: 60,
              bottom: 0,
              width: 180,
              height: 40,
              background:
                "radial-gradient(ellipse at center, #ff7b22 0%, #8a2c08 70%, transparent 85%)",
              opacity: flicker,
              filter: "blur(4px)",
            }}
          />
        </div>
      </div>

      {/* Közler (ocak ağzı üstünde) */}
      <div style={{ position: "absolute", left: 260, top: 150 }}>{embers}</div>

      {/* Şömine rafı (mantel) */}
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 24,
          width: 460,
          height: 34,
          background: "linear-gradient(180deg,#5a4636,#33271d)",
          borderRadius: 6,
          boxShadow: `0 -6px 24px ${glow}33`,
        }}
      />
    </div>
  );
};
