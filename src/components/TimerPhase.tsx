import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Ring } from "./Ring";

const two = (n: number) => String(n).padStart(2, "0");

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${two(m)}:${two(s)}`;
};

// Bir geri sayım fazı: azalan halka + büyük MM:SS sayaç + üstte etiket.
// Bir <Sequence> içinde render edildiği için frame 0'dan başlar.
export const TimerPhase: React.FC<{
  durationInFrames: number;
  label: string;
  color: string;
}> = ({ durationInFrames, label, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalSeconds = Math.round(durationInFrames / fps);
  const elapsed = Math.floor(frame / fps);
  const remaining = Math.max(0, totalSeconds - elapsed);

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // Faz girişinde yumuşak belirme
  const enter = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
      }}
    >
      <Ring progress={progress} color={color}>
        <div
          style={{
            textTransform: "uppercase",
            letterSpacing: 10,
            fontSize: 34,
            fontWeight: 600,
            color: color,
            marginBottom: 10,
            opacity: 0.92,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 200,
            fontWeight: 700,
            lineHeight: 1,
            color: "#f4efe6",
            fontVariantNumeric: "tabular-nums",
            fontFamily:
              "'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadow: "0 6px 40px rgba(0,0,0,0.55)",
          }}
        >
          {formatTime(remaining)}
        </div>
      </Ring>
    </AbsoluteFill>
  );
};
