import React from "react";
import { useCurrentFrame } from "remotion";
import { fraunces, jost } from "../fonts";

const two = (n: number) => String(n).padStart(2, "0");
const fmt = (s: number) => `${two(Math.floor(s / 60))}:${two(s % 60)}`;

export type TimerPos = "tr" | "tl" | "br" | "bl";
export type TimerVariant = "digital" | "minimal" | "ring";

interface Props {
  seconds: number;
  label: string;
  accent: string;
  sessionTotal: number;
  sessionCurrent: number;
  progress?: number; // 0→1 (geçen süre) — ring için
  pulseLow?: boolean;
  position?: TimerPos;
  variant?: TimerVariant;
}

const POS: Record<TimerPos, React.CSSProperties> = {
  tr: { top: 54, right: 64, alignItems: "flex-end" },
  tl: { top: 54, left: 64, alignItems: "flex-start" },
  br: { bottom: 54, right: 64, alignItems: "flex-end" },
  bl: { bottom: 54, left: 64, alignItems: "flex-start" },
};

// Köşe sayaç: konum (4 köşe) + stil (digital/minimal/ring) seçilebilir.
export const CornerTimer: React.FC<Props> = ({
  seconds,
  label,
  accent,
  sessionTotal,
  sessionCurrent,
  progress = 0,
  pulseLow = true,
  position = "tr",
  variant = "digital",
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(frame * 0.12));
  const low = pulseLow && seconds <= 10 && seconds > 0;
  const beat = low ? 1 + 0.05 * Math.max(0, Math.cos((frame % 30) * (Math.PI / 15))) : 1;
  const right = position === "tr" || position === "br";
  const origin = right ? "right center" : "left center";

  const dots = [];
  for (let i = 0; i < sessionTotal; i++) {
    const done = i < sessionCurrent;
    const active = i === sessionCurrent;
    dots.push(
      <div
        key={i}
        style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: done || active ? accent : "transparent",
          border: `1.5px solid ${done || active ? accent : "rgba(240,243,250,0.55)"}`,
          opacity: active ? pulse : done ? 1 : 0.7,
          boxShadow: done || active ? `0 0 8px ${accent}aa` : "none",
        }}
      />,
    );
  }

  const labelEl = (
    <div
      style={{
        fontFamily: jost,
        fontWeight: 400,
        fontSize: 19,
        letterSpacing: 9,
        textTransform: "uppercase",
        color: accent,
        textShadow: `0 0 18px ${accent}55`,
        paddingLeft: 9,
        lineHeight: 1,
      }}
    >
      {label}
    </div>
  );

  const timeEl = (size: number) => (
    <div
      style={{
        fontFamily: fraunces,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 0.95,
        color: low ? accent : "#f6f0e4",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: 1,
        textShadow: low
          ? `0 2px 24px rgba(0,0,0,0.6), 0 0 26px ${accent}88`
          : "0 2px 24px rgba(0,0,0,0.6)",
        transform: `scale(${beat})`,
        transformOrigin: origin,
      }}
    >
      {fmt(Math.max(0, seconds))}
    </div>
  );

  // RING: dairesel progress + ortada saat
  if (variant === "ring") {
    const R = 78;
    const C = 2 * Math.PI * R;
    const off = C * Math.min(1, Math.max(0, progress));
    return (
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", gap: 8, ...POS[position] }}>
        <div style={{ position: "relative", width: 180, height: 180 }}>
          <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(240,243,250,0.14)" strokeWidth="7" />
            <circle
              cx="90" cy="90" r={R} fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={off}
              style={{ filter: `drop-shadow(0 0 8px ${accent}88)` }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <div style={{ fontFamily: jost, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: accent, paddingLeft: 6 }}>{label}</div>
            {timeEl(52)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 9, justifyContent: "center", width: 180 }}>{dots}</div>
      </div>
    );
  }

  // MINIMAL: zeminsiz; DIGITAL: hap zemin
  const minimal = variant === "minimal";
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: minimal ? 0 : "20px 28px 18px",
        borderRadius: 22,
        background: minimal ? "transparent" : "rgba(8,11,17,0.40)",
        backdropFilter: minimal ? undefined : "blur(8px)",
        WebkitBackdropFilter: minimal ? undefined : "blur(8px)",
        border: minimal ? "none" : "1px solid rgba(255,255,255,0.10)",
        boxShadow: minimal ? "none" : "0 10px 40px rgba(0,0,0,0.35)",
        ...POS[position],
      }}
    >
      {labelEl}
      {timeEl(minimal ? 76 : 86)}
      <div style={{ display: "flex", gap: 9, marginTop: 2 }}>{dots}</div>
    </div>
  );
};
