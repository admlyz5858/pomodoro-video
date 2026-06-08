import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fraunces, jost } from "../fonts";

// Ortalanmış zarif başlık kartı (intro / outro). Belirir → bekler → kaybolur.
export const TitleCard: React.FC<{
  main: string;
  sub?: string;
  accent: string;
  durationInFrames: number;
}> = ({ main, sub, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({ frame, fps, config: { damping: 16, mass: 0.8, stiffness: 90 } });
  const y = interpolate(rise, [0, 1], [26, 0]);

  const fadeIn = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 0.7 * fps, durationInFrames],
    [1, 0],
    {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", opacity }}
    >
      <div style={{ textAlign: "center", transform: `translateY(${y}px)` }}>
        {sub ? (
          <div
            style={{
              fontFamily: jost,
              fontSize: 30,
              letterSpacing: 14,
              textTransform: "uppercase",
              color: accent,
              marginBottom: 18,
              textShadow: `0 0 22px ${accent}55`,
              paddingLeft: 14,
            }}
          >
            {sub}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: fraunces,
            fontWeight: 500,
            fontSize: 118,
            color: "#f6f0e4",
            letterSpacing: 1,
            textShadow: "0 8px 60px rgba(0,0,0,0.6)",
          }}
        >
          {main}
        </div>
        <div
          style={{
            width: 90,
            height: 3,
            background: accent,
            borderRadius: 2,
            margin: "26px auto 0",
            boxShadow: `0 0 16px ${accent}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
