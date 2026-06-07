import React from "react";

// Azalan dairesel ilerleme halkası. progress 0 (dolu) → 1 (boş).
export const Ring: React.FC<{
  progress: number;
  color: string;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}> = ({ progress, color, size = 620, stroke = 14, children }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = c * clamped;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: "absolute",
          transform: "rotate(-90deg)",
          filter: `drop-shadow(0 0 18px ${color}66)`,
        }}
      >
        {/* Arka iz */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
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
        />
      </svg>
      <div style={{ position: "relative", textAlign: "center" }}>{children}</div>
    </div>
  );
};
