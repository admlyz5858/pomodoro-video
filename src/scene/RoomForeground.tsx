import React from "react";
import { AbsoluteFill } from "remotion";
import { CoffeeMug } from "./CoffeeSteam";
import { DeskLamp } from "./DeskLamp";
import { Plant } from "./Plant";

const LAMP_GLOW = "#ffb45e";

const Books: React.FC = () => (
  <div style={{ position: "relative", width: 200, height: 70 }}>
    {[
      { w: 190, h: 18, c: "#3a2330", b: 6 },
      { w: 168, h: 16, c: "#2a3140", b: 24 },
      { w: 182, h: 17, c: "#243528", b: 40 },
    ].map((bk, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          bottom: bk.b,
          left: (200 - bk.w) / 2 + (i % 2 ? 8 : -6),
          width: bk.w,
          height: bk.h,
          background: bk.c,
          borderRadius: 3,
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 14px ${LAMP_GLOW}14`,
        }}
      />
    ))}
  </div>
);

// Pencere denizliği + üstündeki cozy objeler + lambadan sıcak ambiyans.
export const RoomForeground: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Lambadan masaya yayılan geniş sıcak ambiyans */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "85%",
          height: 420,
          background:
            "radial-gradient(70% 100% at 78% 100%, rgba(255,170,90,0.16) 0%, rgba(255,170,90,0.05) 45%, rgba(255,170,90,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Denizlik / masa yüzeyi */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 330,
          background:
            "linear-gradient(180deg, #2a1d15 0%, #1a120d 22%, #0d0907 100%)",
        }}
      />
      {/* Denizlik ön kenar vurgusu */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 330,
          height: 6,
          background:
            "linear-gradient(180deg, rgba(255,190,120,0.18), rgba(255,190,120,0))",
        }}
      />

      {/* Objeler — denizlik üstünde bir sıra */}
      <div style={{ position: "absolute", left: 120, bottom: 285 }}>
        <Plant rim={LAMP_GLOW} />
      </div>
      <div style={{ position: "absolute", left: 720, bottom: 292 }}>
        <CoffeeMug accent={LAMP_GLOW} />
      </div>
      <div style={{ position: "absolute", left: 1170, bottom: 300 }}>
        <Books />
      </div>
      <div style={{ position: "absolute", left: 1500, bottom: 300 }}>
        <DeskLamp glow={LAMP_GLOW} />
      </div>
    </AbsoluteFill>
  );
};
