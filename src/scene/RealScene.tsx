import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, staticFile } from "remotion";

// Gerçek video arka plan (Loop ile tekrar) + saat okunabilirliği için koyu örtü.
export const RealScene: React.FC<{
  src: string;
  scrim?: number;
  loopFrames?: number;
}> = ({ src, scrim = 0.42, loopFrames = 339 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Loop durationInFrames={loopFrames}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Loop>
      {/* Hafif genel karartma (sıcak tonu korur) */}
      <AbsoluteFill
        style={{ background: `rgba(8,6,4,${scrim})`, pointerEvents: "none" }}
      />
      {/* Saat arkası yumuşak karartma */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(40% 45% at 50% 48%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0) 75%)",
          pointerEvents: "none",
        }}
      />
      {/* Sinematik vinyet */}
      <AbsoluteFill
        style={{ boxShadow: "inset 0 0 300px rgba(0,0,0,0.7)", pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
