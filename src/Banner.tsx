import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fraunces, jost } from "./fonts";

const AMBER = "#f0b15a";
const CREAM = "#f7efe0";

// YouTube kanal banner'ı (2560x1440). Güvenli alan ortada ~1546x423.
export const Banner: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a1020" }}>
      {/* Arka plan görseli */}
      <Img
        src={staticFile("banner-src.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Kenarları hafif karart (merkeze odak) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(8,12,24,0.55) 0%, rgba(8,12,24,0) 22%, rgba(8,12,24,0) 78%, rgba(8,12,24,0.55) 100%)",
        }}
      />
      {/* Başlık arkası yumuşak ışık/scrim */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(38% 46% at 50% 47%, rgba(6,10,20,0.6) 0%, rgba(6,10,20,0.25) 55%, rgba(6,10,20,0) 78%)",
        }}
      />

      {/* Merkez içerik (güvenli alan) */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", transform: "translateY(-12px)" }}>
          {/* Amber hilal (avatarla uyum) */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <svg width="74" height="74" viewBox="0 0 74 74">
              <defs>
                <filter id="mg" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <mask id="cr">
                  <rect width="74" height="74" fill="black" />
                  <circle cx="34" cy="37" r="24" fill="white" />
                  <circle cx="46" cy="31" r="22" fill="black" />
                </mask>
              </defs>
              <circle cx="34" cy="37" r="24" fill={AMBER} mask="url(#cr)" filter="url(#mg)" />
            </svg>
          </div>

          {/* Başlık */}
          <div
            style={{
              fontFamily: fraunces,
              fontWeight: 600,
              fontSize: 200,
              lineHeight: 1,
              color: CREAM,
              letterSpacing: 2,
              textShadow:
                "0 6px 50px rgba(0,0,0,0.55), 0 0 60px rgba(240,177,90,0.20)",
            }}
          >
            Deep Focus
          </div>

          {/* İnce ayraç: çizgi · nokta · çizgi */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              marginTop: 26,
              marginBottom: 22,
            }}
          >
            <div style={{ width: 120, height: 2, background: `linear-gradient(90deg, transparent, ${AMBER})`, opacity: 0.8 }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: AMBER, boxShadow: `0 0 12px ${AMBER}` }} />
            <div style={{ width: 120, height: 2, background: `linear-gradient(90deg, ${AMBER}, transparent)`, opacity: 0.8 }} />
          </div>

          {/* Slogan */}
          <div
            style={{
              fontFamily: jost,
              fontWeight: 400,
              fontSize: 40,
              letterSpacing: 16,
              textTransform: "uppercase",
              color: "#d8e4f2",
              paddingLeft: 16,
              textShadow: "0 2px 16px rgba(0,0,0,0.6)",
            }}
          >
            Study With Me · Lofi · Pomodoro
          </div>
        </div>
      </AbsoluteFill>

      {/* Sinematik vinyet */}
      <AbsoluteFill
        style={{ boxShadow: "inset 0 0 420px rgba(0,0,0,0.6)", pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
