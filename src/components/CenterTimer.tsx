import React from "react";
import { AbsoluteFill } from "remotion";
import { cormorant, outfit } from "../fonts";

const two = (n: number) => String(n).padStart(2, "0");
const fmt = (s: number) => `${two(Math.floor(s / 60))}:${two(s % 60)}`;

export type CenterVariant = "ringserif" | "bar";

interface Props {
  variant: CenterVariant;
  seconds: number;       // kalan saniye
  progress: number;      // 0→1 geçen
  label: string;
  accent: string;
  subscribeText?: string; // bar stilinde sol-üst not
}

// Ekran görüntülerindeki iki zarif stil.
export const CenterTimer: React.FC<Props> = ({ variant, seconds, progress, label, accent, subscribeText }) => {
  if (variant === "ringserif") {
    const size = 620, sw = 2.5, R = (size - sw) / 2 - 4;
    const C = 2 * Math.PI * R;
    const remain = Math.min(1, Math.max(0, 1 - progress));
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={size} height={size} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={sw} />
            <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="#ffffff" strokeWidth={sw} strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - remain)}
              style={{ filter: `drop-shadow(0 0 10px ${accent}66)` }} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: "translateY(-6px)" }}>
            <div style={{ fontFamily: cormorant, fontWeight: 300, fontSize: 150, lineHeight: 1, color: "#fff",
              letterSpacing: 4, fontVariantNumeric: "tabular-nums", textShadow: "0 2px 30px rgba(0,0,0,0.45)" }}>
              {fmt(Math.max(0, seconds))}
            </div>
            <div style={{ fontFamily: cormorant, fontWeight: 400, fontSize: 46, letterSpacing: 14, textTransform: "uppercase",
              color: "rgba(255,255,255,0.92)", marginTop: 30, paddingLeft: 14, textShadow: "0 2px 18px rgba(0,0,0,0.5)" }}>
              {label}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // bar
  return (
    <AbsoluteFill>
      {subscribeText ? (
        <div style={{ position: "absolute", top: 64, left: 92, display: "flex", gap: 16 }}>
          <div style={{ width: 2, background: "rgba(255,255,255,0.85)" }} />
          <div style={{ fontFamily: cormorant, fontStyle: "italic", fontWeight: 500, fontSize: 34, lineHeight: 1.3,
            color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,0.6)", whiteSpace: "pre-line" }}>
            {subscribeText}
          </div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 92, right: 92, bottom: 70 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontFamily: outfit, fontWeight: 700, fontSize: 52, letterSpacing: 6, textTransform: "uppercase",
            color: "#fff", textShadow: "0 2px 18px rgba(0,0,0,0.6)" }}>{label}</div>
          <div style={{ fontFamily: outfit, fontWeight: 600, fontSize: 52, color: "#fff", fontVariantNumeric: "tabular-nums",
            textShadow: "0 2px 18px rgba(0,0,0,0.6)" }}>{fmt(Math.max(0, seconds))}</div>
        </div>
        <div style={{ height: 7, borderRadius: 4, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            background: "#fff", borderRadius: 4, boxShadow: `0 0 12px ${accent}aa` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Stil B girişi: ortada dev kalın sayı (10sn geri sayım)
export const BigCountNumber: React.FC<{ n: number; accent: string }> = ({ n, accent }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: outfit, fontWeight: 800, fontSize: 300, lineHeight: 1, color: "#fff",
      textShadow: `0 6px 50px rgba(0,0,0,0.5), 0 0 60px ${accent}55` }}>{two(Math.max(0, n))}</div>
  </AbsoluteFill>
);
