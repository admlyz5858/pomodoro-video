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
export const CozyScene: React.FC = () => {
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
