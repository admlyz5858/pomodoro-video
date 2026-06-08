import React from "react";
import { useCurrentFrame } from "remotion";
import { fraunces, jost } from "../fonts";
import { ProgressRing } from "./ProgressRing";

const two = (n: number) => String(n).padStart(2, "0");
const fmt = (s: number) => `${two(Math.floor(s / 60))}:${two(s % 60)}`;

interface Props {
  seconds: number;
  progress: number; // 0 (dolu halka) → 1 (boş)
  label: string;
  accent: string;
  sessionTotal: number;
  sessionCurrent: number; // 0 tabanlı; aktif odak indeksi
}

export const DigitalClock: React.FC<Props> = ({
  seconds,
  progress,
  label,
  accent,
  sessionTotal,
  sessionCurrent,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(frame * 0.12));

  const dots = [];
  for (let i = 0; i < sessionTotal; i++) {
    const done = i < sessionCurrent;
    const active = i === sessionCurrent;
    dots.push(
      <div
        key={i}
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: done || active ? accent : "transparent",
          border: `2px solid ${done || active ? accent : "rgba(240,243,250,0.7)"}`,
          opacity: active ? pulse : done ? 1 : 0.8,
          boxShadow: done || active ? `0 0 12px ${accent}aa` : "none",
        }}
      />,
    );
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Okunabilirlik için yumuşak karartma halesi */}
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 520,
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(ellipse at center, rgba(6,9,14,0.55) 0%, rgba(6,9,14,0.25) 45%, rgba(6,9,14,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Saati çevreleyen ilerleme halkası */}
      <ProgressRing progress={progress} color={accent} />

      {/* Etiket */}
      <div
        style={{
          fontFamily: jost,
          fontWeight: 400,
          fontSize: 38,
          letterSpacing: 18,
          textTransform: "uppercase",
          color: accent,
          textShadow: `0 0 24px ${accent}66`,
          marginBottom: 6,
          paddingLeft: 18,
          position: "relative",
        }}
      >
        {label}
      </div>

      {/* Saat */}
      <div
        style={{
          fontFamily: fraunces,
          fontWeight: 500,
          fontSize: 270,
          lineHeight: 1,
          color: "#f6f0e4",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: 2,
          textShadow:
            "0 4px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,210,150,0.12)",
          position: "relative",
        }}
      >
        {fmt(Math.max(0, seconds))}
      </div>

      {/* Session noktaları */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 18,
          position: "relative",
        }}
      >
        {dots}
      </div>
    </div>
  );
};
