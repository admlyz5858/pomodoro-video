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
import { fraunces } from "../fonts";

interface ItemProps {
  text: string;
  accent: string;
  holdFrames: number;
  fps: number;
}

// Tek mesaj: aşağıdan hafifçe kayarak yumuşakça belirir, durur, yukarı kayarak kaybolur.
const QuoteItem: React.FC<ItemProps> = ({ text, accent, holdFrames, fps }) => {
  const frame = useCurrentFrame();
  const inDur = Math.round(1.2 * fps);
  const outDur = Math.round(1.5 * fps);
  const outStart = inDur + holdFrames;
  const total = outStart + outDur;

  const opacity = interpolate(
    frame,
    [0, inDur, outStart, total],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // belirme: +26 -> 0 ; kaybolma: 0 -> -16
  const slideIn = interpolate(frame, [0, inDur], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideOut = interpolate(frame, [outStart, total], [0, -16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = slideIn + slideOut;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          position: "absolute",
          top: "64%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${y}px)`,
          width: 1180,
          textAlign: "center",
        }}
      >
        {/* okunabilirlik için lokal yumuşak karartı */}
        <div
          style={{
            position: "absolute",
            inset: "-70px -120px",
            background:
              "radial-gradient(ellipse at center, rgba(6,9,14,0.50) 0%, rgba(6,9,14,0.26) 48%, rgba(6,9,14,0) 75%)",
            pointerEvents: "none",
          }}
        />
        {/* ince üst aksan çizgisi */}
        <div
          style={{
            position: "relative",
            width: 64,
            height: 2,
            margin: "0 auto 26px",
            background: accent,
            opacity: 0.85,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: fraunces,
            fontWeight: 500,
            fontSize: 58,
            lineHeight: 1.34,
            color: "#f6f0e4",
            letterSpacing: 0.5,
            textShadow: `0 3px 30px rgba(0,0,0,0.65), 0 0 40px ${accent}33`,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

interface Props {
  quotes: string[]; // havuz; offset ile döner
  times: number[]; // her mesajın faz içindeki başlangıç frame'i
  accent: string;
  holdSeconds: number;
  offset?: number; // havuzda başlangıç indeksi (bloklar arası tekrar olmasın)
  chimeVolume?: number;
}

export const QuoteOverlay: React.FC<Props> = ({
  quotes,
  times,
  accent,
  holdSeconds,
  offset = 0,
  chimeVolume = 0.3,
}) => {
  const { fps } = useVideoConfig();
  const holdFrames = Math.round(holdSeconds * fps);
  const inDur = Math.round(1.2 * fps);
  const outDur = Math.round(1.5 * fps);
  const itemFrames = inDur + holdFrames + outDur;

  return (
    <>
      {times.map((t, i) => {
        const text = quotes.length ? quotes[(offset + i) % quotes.length] : "";
        if (!text) return null;
        return (
          <Sequence key={i} from={t} durationInFrames={itemFrames} layout="none">
            <Audio
              src={staticFile("chime.mp3")}
              volume={chimeVolume}
              startFrom={0}
            />
            <QuoteItem text={text} accent={accent} holdFrames={holdFrames} fps={fps} />
          </Sequence>
        );
      })}
    </>
  );
};
