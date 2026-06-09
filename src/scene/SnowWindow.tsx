import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rand, rand2 } from "../lib/rand";

const woodV =
  "linear-gradient(90deg,#241712 0%,#3a261b 40%,#46301f 50%,#3a261b 60%,#1e120d 100%)";
const woodH =
  "linear-gradient(180deg,#241712 0%,#3a261b 40%,#46301f 50%,#3a261b 60%,#1e120d 100%)";

const SNOW = 60;

// Karlı gece/alacakaranlık penceresi: dış manzara + çam silueti + yağan kar.
export const SnowWindow: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  sky?: string;
}> = ({
  x = 120,
  y = 130,
  w = 470,
  h = 540,
  sky = "linear-gradient(180deg,#26334d 0%,#33405c 45%,#4a4e66 100%)",
}) => {
  const frame = useCurrentFrame();
  const T = 26;

  const flakes = [];
  for (let i = 0; i < SNOW; i++) {
    const fx = rand(i) * (w - 2 * T);
    const speed = 14 + rand(i + 3) * 22;
    const sway = Math.sin((frame + i * 12) * 0.03) * 14;
    const startY = rand2(i) * (h - 2 * T + 100);
    const travel = h - 2 * T + 60;
    const fy = (((frame * speed * 0.06 + startY) % travel));
    const sz = 2 + rand(i + 9) * 5;
    flakes.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: fx + sway,
          top: fy,
          width: sz,
          height: sz,
          borderRadius: "50%",
          background: "rgba(245,248,255,0.92)",
          opacity: 0.5 + rand(i + 1) * 0.5,
          filter: "blur(0.4px)",
        }}
      />,
    );
  }

  // Basit çam silueti dizisi (alt kısımda)
  const pines = [];
  const pineCount = 7;
  for (let i = 0; i < pineCount; i++) {
    const pw = 50 + rand(i + 30) * 40;
    const ph = 70 + rand2(i + 30) * 70;
    const px = (i / pineCount) * (w - 2 * T) + rand(i + 40) * 20;
    pines.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: px,
          bottom: 0,
          width: 0,
          height: 0,
          borderLeft: `${pw / 2}px solid transparent`,
          borderRight: `${pw / 2}px solid transparent`,
          borderBottom: `${ph}px solid #1a2230`,
          opacity: 0.85,
        }}
      />,
    );
  }

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {/* Cam (dış manzara) */}
      <div
        style={{
          position: "absolute",
          left: T,
          top: T,
          width: w - 2 * T,
          height: h - 2 * T,
          background: sky,
          overflow: "hidden",
          boxShadow: "inset 0 0 80px rgba(8,12,20,0.7)",
        }}
      >
        {/* Ay parıltısı */}
        <div
          style={{
            position: "absolute",
            right: "16%",
            top: "12%",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 40%,#f3f1e8,#cfd4dd 60%,#aab0bd)",
            boxShadow: "0 0 70px rgba(230,238,250,0.45)",
          }}
        />
        {/* Çam silueti şeridi */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150 }}>
          {/* kar zemini */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 46,
              background: "linear-gradient(180deg,#cdd6e6,#aab4c8)",
            }}
          />
          {pines}
        </div>
        {/* Yağan kar */}
        {flakes}
        {/* Camda hafif buğu/ışık */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%)",
          }}
        />
      </div>

      {/* Ahşap pencere çerçevesi */}
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: T, background: woodH }} />
      <div style={{ position: "absolute", left: 0, top: h - T, width: w, height: T + 8, background: woodH }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: T, height: h, background: woodV }} />
      <div style={{ position: "absolute", left: w - T, top: 0, width: T, height: h, background: woodV }} />
      {/* Orta bölme */}
      <div style={{ position: "absolute", left: w / 2 - 8, top: T, width: 16, height: h - 2 * T, background: woodV }} />
      <div style={{ position: "absolute", left: T, top: h / 2 - 7, width: w - 2 * T, height: 14, background: woodH }} />
      {/* Pencere önü kar birikintisi */}
      <div
        style={{
          position: "absolute",
          left: -6,
          top: h - T - 6,
          width: w + 12,
          height: 16,
          background: "linear-gradient(180deg,#eef2fa,#c8d0e0)",
          borderRadius: 8,
        }}
      />
    </div>
  );
};
