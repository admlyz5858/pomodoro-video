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
import { SceneFor } from "./scene/SceneFor";
import { DigitalClock } from "./components/DigitalClock";
import { TitleCard } from "./components/TitleCard";
import { fontByKey } from "./fonts";
import { THEMES } from "./themes";
import { planSequence, PlannedSegment, SequenceProps } from "./sequenceSchema";

// Tek bir blok: kendi stilinin sahnesi + geri sayan saat + siyaha açılış/kapanış.
const SegmentView: React.FC<{
  seg: PlannedSegment;
  focusLabel: string;
  breakLabel: string;
}> = ({ seg, focusLabel, breakLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES[seg.styleId] ?? THEMES[0];

  const totalSeconds = Math.round(seg.minutes * 60);
  const seconds = Math.max(0, totalSeconds - Math.floor(frame / fps));
  const progress =
    seg.durationInFrames > 0 ? Math.min(1, frame / seg.durationInFrames) : 0;

  const isFocus = seg.kind === "focus";
  const accent = isFocus ? theme.accentFocus : theme.accentBreak;
  const label = isFocus ? focusLabel : breakLabel;

  // Siyaha açılış/kapanış (stil geçişi)
  const fadeIn = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [seg.durationInFrames - 0.6 * fps, seg.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      <SceneFor styleId={seg.styleId} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <DigitalClock
          seconds={seconds}
          progress={progress}
          label={label}
          accent={accent}
          sessionTotal={seg.sessionTotal}
          sessionCurrent={seg.sessionCurrent}
          timeFont={fontByKey[theme.font]}
          ringMode={theme.ring}
          showDots={theme.showDots}
          textColor={theme.textColor}
          timeSize={theme.timeSize}
          timeWeight={theme.timeWeight}
          letterSpacing={theme.letterSpacing}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PomodoroSequence: React.FC<SequenceProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { introDur, planned, outroFrom, outroDur } = planSequence(props, fps);

  const lastTheme =
    THEMES[props.segments[props.segments.length - 1]?.styleId ?? 0] ?? THEMES[0];
  const firstTheme = THEMES[props.segments[0]?.styleId ?? 0] ?? THEMES[0];

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080d" }}>
      {/* Sesler */}
      {props.hasLofi ? (
        <Audio
          src={staticFile("lofi.mp3")}
          loop
          volume={(f) =>
            interpolate(
              f,
              [0, 3 * fps, durationInFrames - 4 * fps, durationInFrames],
              [0, 0.7, 0.7, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
      {props.hasRain ? (
        <Audio
          src={staticFile("music.mp3")}
          loop
          volume={(f) =>
            interpolate(
              f,
              [0, 3 * fps, durationInFrames - 4 * fps, durationInFrames],
              [0, 0.2, 0.2, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}

      {/* Her blok başında geçiş çını */}
      {props.hasChime
        ? [...planned.map((p) => p.from), outroFrom].map((f, i) => (
            <Sequence
              key={`chime-${i}`}
              from={f}
              durationInFrames={Math.ceil(1.4 * fps)}
              layout="none"
            >
              <Audio src={staticFile("chime.mp3")} volume={0.85} />
            </Sequence>
          ))
        : null}

      {/* Intro */}
      {introDur > 0 ? (
        <Sequence from={0} durationInFrames={introDur}>
          <TitleCard
            main={props.introText}
            sub="POMODORO"
            accent={firstTheme.accentFocus}
            durationInFrames={introDur}
          />
        </Sequence>
      ) : null}

      {/* Bloklar */}
      {planned.map((seg, i) => (
        <Sequence key={`seg-${i}`} from={seg.from} durationInFrames={seg.durationInFrames}>
          <SegmentView
            seg={seg}
            focusLabel={props.focusLabel}
            breakLabel={props.breakLabel}
          />
        </Sequence>
      ))}

      {/* Outro */}
      {outroDur > 0 ? (
        <Sequence from={outroFrom} durationInFrames={outroDur}>
          <TitleCard
            main={props.outroText}
            sub="SESSION COMPLETE"
            accent={lastTheme.accentBreak}
            durationInFrames={outroDur}
          />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
