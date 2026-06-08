import React from "react";
import { Audio, interpolate, staticFile, useVideoConfig } from "remotion";
import { AmbientKey } from "../themes";

// Sahneye uygun ortam sesi parçaları (loop + segment başı/sonu fade).
const TRACKS: Record<AmbientKey, { src: string; vol: number }[]> = {
  rain: [{ src: "music.mp3", vol: 0.5 }],
  forest: [
    { src: "birds.ogg", vol: 0.5 },
    { src: "water.ogg", vol: 0.32 },
  ],
  night: [{ src: "crickets.ogg", vol: 0.42 }],
  storm: [{ src: "music.mp3", vol: 0.62 }],
};

export const Ambient: React.FC<{
  ambient: AmbientKey;
  phaseFrames: number;
}> = ({ ambient, phaseFrames }) => {
  const { fps } = useVideoConfig();
  const fade = (f: number, base: number) =>
    interpolate(
      f,
      [0, 0.8 * fps, Math.max(0.8 * fps, phaseFrames - 0.8 * fps), phaseFrames],
      [0, base, base, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  return (
    <>
      {TRACKS[ambient].map((t, i) => (
        <Audio
          key={i}
          src={staticFile(t.src)}
          loop
          volume={(f) => fade(f, t.vol)}
        />
      ))}
    </>
  );
};
