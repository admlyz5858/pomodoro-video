import React from "react";
import { useCurrentFrame } from "remotion";
import { fraunces, jost } from "../fonts";
import { ProgressRing } from "./ProgressRing";

const two = (n: number) => String(n).padStart(2, "0");
const fmt = (s: number) => `${two(Math.floor(s / 60))}:${two(s % 60)}`;

export type RingMode = "around" | "thin" | "none";

interface Props {
  seconds: number;
  progress: number; // 0 (dolu halka) → 1 (boş)
  label: string;
  accent: string;
  sessionTotal: number;
  sessionCurrent: number;
  // Tema seçenekleri (varsayılanlar mevcut görünümü korur)
  timeFont?: string;
  labelFont?: string;
  ringMode?: RingMode;
  showDots?: boolean;
  textColor?: string;
  timeSize?: number;
  timeWeight?: number;
  letterSpacing?: number;
  pulseLow?: boolean; // son 10 sn'de rakamı vurgula
}

export const DigitalClock: React.FC<Props> = ({
  seconds,
  progress,
  label,
  accent,
  sessionTotal,
  sessionCurrent,
  timeFont = fraunces,
  labelFont = jost,
  ringMode = "around",
  showDots = true,
  textColor = "#f6f0e4",
  timeSize = 270,
  timeWeight = 500,
  letterSpacing = 2,
  pulseLow = false,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(frame * 0.12));

  // Son 10 saniye vurgusu: her saniye nabız + renk accent'e kayar
  const low = pulseLow && seconds <= 10 && seconds > 0;
  const beat = low
    ? 1 + 0.08 * Math.max(0, Math.cos((frame % 30) * (Math.PI / 15)))
    : 1;
  const timeCol = low ? accent : textColor;

  const dots = [];
  if (showDots) {
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
          width: 800,
          height: 540,
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(ellipse at center, rgba(6,9,14,0.5) 0%, rgba(6,9,14,0.22) 45%, rgba(6,9,14,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {ringMode !== "none" ? (
        <ProgressRing
          progress={progress}
          color={accent}
          stroke={ringMode === "thin" ? 5 : 14}
        />
      ) : null}

      {/* Etiket */}
      <div
        style={{
          fontFamily: labelFont,
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
          fontFamily: timeFont,
          fontWeight: timeWeight,
          fontSize: timeSize,
          lineHeight: 1,
          color: timeCol,
          fontVariantNumeric: "tabular-nums",
          letterSpacing,
          textShadow: low
            ? `0 4px 60px rgba(0,0,0,0.6), 0 0 50px ${accent}88`
            : "0 4px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,255,255,0.08)",
          position: "relative",
          transform: `scale(${beat})`,
        }}
      >
        {fmt(Math.max(0, seconds))}
      </div>

      {/* Session noktaları */}
      {showDots ? (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 22,
            position: "relative",
          }}
        >
          {dots}
        </div>
      ) : null}
    </div>
  );
};
