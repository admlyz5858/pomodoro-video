import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Intro / mola geçişi / kapanış için ortalanmış büyük metin ekranı.
// Belirir (pop) → bekler → kaybolur.
export const TextScreen: React.FC<{
  text: string;
  color: string;
  durationInFrames: number;
}> = ({ text, color, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 110 },
  });
  const scale = interpolate(pop, [0, 1], [0.8, 1]);

  const fadeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 0.6 * fps, durationInFrames],
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
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#f4efe6",
            fontFamily: "Georgia, 'Times New Roman', serif",
            textShadow: "0 8px 50px rgba(0,0,0,0.6)",
          }}
        >
          {text}
        </div>
        <div
          style={{
            marginTop: 28,
            height: 4,
            width: 120,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 2,
            background: color,
            boxShadow: `0 0 18px ${color}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
