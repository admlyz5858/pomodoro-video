import React from "react";
import { useCurrentFrame } from "remotion";
import { fraunces, jost } from "../fonts";

const two = (n: number) => String(n).padStart(2, "0");
const fmt = (s: number) => `${two(Math.floor(s / 60))}:${two(s % 60)}`;

interface Props {
  seconds: number;
  label: string;
  accent: string;
  sessionTotal: number;
  sessionCurrent: number;
  pulseLow?: boolean; // son 10 sn vurgusu
}

// Köşe (sağ üst) zarif sayaç: küçük hap zemin + MM:SS + etiket + seans noktaları.
export const CornerTimer: React.FC<Props> = ({
  seconds,
  label,
  accent,
  sessionTotal,
  sessionCurrent,
  pulseLow = true,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(frame * 0.12));
  const low = pulseLow && seconds <= 10 && seconds > 0;
  const beat = low ? 1 + 0.05 * Math.max(0, Math.cos((frame % 30) * (Math.PI / 15))) : 1;

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

  return (
    <div
      style={{
        position: "absolute",
        top: 54,
        right: 64,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
        padding: "20px 28px 18px",
        borderRadius: 22,
        background: "rgba(8,11,17,0.40)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
      }}
    >
      {/* Etiket */}
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

      {/* Saat */}
      <div
        style={{
          fontFamily: fraunces,
          fontWeight: 500,
          fontSize: 86,
          lineHeight: 0.95,
          color: low ? accent : "#f6f0e4",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: 1,
          textShadow: low
            ? `0 2px 24px rgba(0,0,0,0.6), 0 0 26px ${accent}88`
            : "0 2px 24px rgba(0,0,0,0.6)",
          transform: `scale(${beat})`,
          transformOrigin: "right center",
        }}
      >
        {fmt(Math.max(0, seconds))}
      </div>

      {/* Seans noktaları */}
      <div style={{ display: "flex", gap: 9, marginTop: 2 }}>{dots}</div>
    </div>
  );
};
