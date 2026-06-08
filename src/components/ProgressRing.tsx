import React from "react";

// Saati çevreleyen, süre geçtikçe boşalan ince-kalın ilerleme halkası.
// İçi tamamen şeffaf — sadece çizgi çizilir, arka plan görünür kalır.
// progress: 0 (dolu) → 1 (boş).
export const ProgressRing: React.FC<{
  progress: number;
  color: string;
  size?: number;
  stroke?: number;
}> = ({ progress, color, size = 880, stroke = 14 }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, Math.max(0, progress));
  const offset = c * p;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) rotate(-90deg)",
        filter: `drop-shadow(0 0 16px ${color}55)`,
        pointerEvents: "none",
      }}
    >
      {/* Soluk iz (tam çember) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(235,240,250,0.10)"
        strokeWidth={stroke}
      />
      {/* Kalan süre yayı */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        opacity={0.95}
      />
    </svg>
  );
};
