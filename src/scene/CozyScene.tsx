import React from "react";
import { AbsoluteFill } from "remotion";
import { NightSky } from "./NightSky";
import { CitySkyline } from "./CitySkyline";
import { OutsideRain } from "./OutsideRain";
import { GlassDrops } from "./GlassDrops";
import { WindowFrame } from "./WindowFrame";
import { RoomForeground } from "./RoomForeground";
import { Bokeh } from "./Bokeh";

// Cozy lofi gece sahnesi — tüm katmanlar (tam süre boyunca, global frame).
// tint: opsiyonel renk overlay'i (cool / lavanta varyantları için).
export const CozyScene: React.FC<{ tint?: string }> = ({ tint }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#05080d" }}>
      <NightSky />
      <CitySkyline />
      <OutsideRain />
      <GlassDrops />
      <WindowFrame />
      <RoomForeground />
      <Bokeh />

      {/* Sıcak renk derecelendirme katmanı */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,30,45,0.10) 0%, rgba(30,20,12,0.06) 60%, rgba(10,6,4,0.18) 100%)",
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />
      {/* Opsiyonel renk tonu (mood kaydırma) */}
      {tint ? (
        <AbsoluteFill
          style={{
            background: tint,
            mixBlendMode: "color",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
      ) : null}

      {/* Sinematik vinyet */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 320px rgba(0,0,0,0.7)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
