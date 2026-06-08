import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

// Belirtilen mutlak karelerde tick ("dit") ve chime (geçiş çını) sesleri çalar.
export const Sfx: React.FC<{
  tickFrames: number[];
  chimeFrames: number[];
}> = ({ tickFrames, chimeFrames }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const tickDur = Math.ceil(0.3 * fps);
  const chimeDur = Math.ceil(1.4 * fps);

  return (
    <>
      {tickFrames
        .filter((f) => f >= 0 && f < durationInFrames)
        .map((f, i) => (
          <Sequence
            key={`tick-${i}`}
            from={f}
            durationInFrames={tickDur}
            layout="none"
          >
            <Audio src={staticFile("tick.mp3")} volume={0.85} />
          </Sequence>
        ))}
      {chimeFrames
        .filter((f) => f >= 0 && f < durationInFrames)
        .map((f, i) => (
          <Sequence
            key={`chime-${i}`}
            from={f}
            durationInFrames={chimeDur}
            layout="none"
          >
            <Audio src={staticFile("chime.mp3")} volume={0.95} />
          </Sequence>
        ))}
    </>
  );
};
