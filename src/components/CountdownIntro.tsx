import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Ring } from "./Ring";

// Başlangıç geri sayımı: büyük tek rakam 10 → 1, azalan halka, her saniye nabız.
// Bir <Sequence> içinde render edilir, frame 0'dan başlar.
export const CountdownIntro: React.FC<{
  durationInFrames: number;
  label: string;
  color: string;
}> = ({ durationInFrames, label, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const remaining = Math.max(
    1,
    Math.ceil((durationInFrames - frame) / fps),
  );

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // Her saniye başında küçük bir "nabız" (büyüyüp normale döner)
  const intoSecond = (frame % fps) / fps; // 0..1
  const pulse = interpolate(intoSecond, [0, 0.18, 1], [1.18, 1, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });

  const enter = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
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
            marginBottom: 6,
            opacity: 0.92,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 300,
            fontWeight: 700,
            lineHeight: 1,
            color: "#f4efe6",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadow: "0 6px 40px rgba(0,0,0,0.55)",
            transform: `scale(${pulse})`,
          }}
        >
          {remaining}
        </div>
      </Ring>
    </AbsoluteFill>
  );
};
