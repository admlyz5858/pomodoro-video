import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { rand } from "../lib/rand";

// Şimşek: sahneyi ani aydınlatan beyaz-mavi parlama + ~1 sn sonra gök gürültüsü.
export const Lightning: React.FC<{ phaseFrames: number }> = ({
  phaseFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flaş zamanları (kare). İlk ikisi yakın (kısa bloklarda da görünsün).
  const flashes: number[] = [Math.round(3 * fps), Math.round(8 * fps)];
  let t = Math.round(8 * fps);
  let k = 0;
  while (t < phaseFrames) {
    const gap = (52 + rand(k) * 34) * fps;
    t += Math.round(gap);
    if (t < phaseFrames) flashes.push(t);
    k++;
  }

  // Çift kırpışmalı parlama zarfı
  let op = 0;
  for (const ft of flashes) {
    const d = frame - ft;
    if (d >= 0 && d < 6) op = Math.max(op, 0.6 * (1 - d / 6));
    else if (d >= 8 && d < 18) op = Math.max(op, 0.32 * (1 - (d - 8) / 10));
  }

  return (
    <>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(216,230,255,0.95) 0%, rgba(184,208,255,0.55) 45%, rgba(150,175,220,0.16) 80%)",
          opacity: op,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      {flashes.map((ft, i) => (
        <Sequence
          key={i}
          from={ft + Math.round(1.4 * fps)}
          durationInFrames={Math.ceil(3.5 * fps)}
          layout="none"
        >
          <Audio
            src={staticFile("thunder.ogg")}
            volume={(f) =>
              interpolate(f, [0, 0.6 * fps, 2.5 * fps, 3.5 * fps], [0, 0.26, 0.26, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            }
          />
        </Sequence>
      ))}
    </>
  );
};
