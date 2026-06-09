import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ProgressRing } from "./ProgressRing";
import { RingMode } from "./DigitalClock";

// Büyük tek rakam geri sayımı (10 → 1) + azalan halka, temalı.
export const ThemedCountdown: React.FC<{
  durationInFrames: number;
  label: string;
  accent: string;
  font: string;
  textColor: string;
  ringMode: RingMode;
  scale?: number;
}> = ({ durationInFrames, label, accent, font, textColor, ringMode, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const remaining = Math.max(1, Math.ceil((durationInFrames - frame) / fps));
  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  const intoSecond = (frame % fps) / fps;
  const pulse = interpolate(intoSecond, [0, 0.18, 1], [1.16, 1, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const enter = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", opacity: enter }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
        }}
      >
      {ringMode !== "none" ? (
        <ProgressRing
          progress={progress}
          color={accent}
          stroke={ringMode === "thin" ? 5 : 14}
        />
      ) : null}
      <div style={{ textAlign: "center", position: "relative" }}>
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: 34,
            letterSpacing: 16,
            textTransform: "uppercase",
            color: accent,
            marginBottom: 4,
            textShadow: `0 0 24px ${accent}66`,
            paddingLeft: 16,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: font,
            fontWeight: 600,
            fontSize: 300,
            lineHeight: 1,
            color: textColor,
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 6px 40px rgba(0,0,0,0.55)",
            transform: `scale(${pulse})`,
          }}
        >
          {remaining}
        </div>
      </div>
      </div>
    </AbsoluteFill>
  );
};
