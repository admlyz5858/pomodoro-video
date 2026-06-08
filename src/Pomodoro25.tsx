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
import { CozyScene } from "./scene/CozyScene";
import { DigitalClock } from "./components/DigitalClock";
import { TitleCard } from "./components/TitleCard";
import { Pomodoro25Props, timeline25 } from "./pomodoro25Schema";

// Bir faz için saat: opsiyonel geri sayım + giriş fade'i.
const ClockPhase: React.FC<{
  totalSeconds: number;
  countdown: boolean;
  fadeIn: boolean;
  label: string;
  accent: string;
  sessionTotal: number;
  sessionCurrent: number;
}> = ({ totalSeconds, countdown, fadeIn, label, accent, sessionTotal, sessionCurrent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.floor(frame / fps);
  const seconds = countdown ? Math.max(0, totalSeconds - elapsed) : totalSeconds;

  const enter = fadeIn
    ? interpolate(frame, [0, 1 * fps], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const rise = fadeIn ? interpolate(enter, [0, 1], [16, 0]) : 0;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        transform: `translateY(${rise}px)`,
      }}
    >
      <DigitalClock
        seconds={seconds}
        label={label}
        accent={accent}
        sessionTotal={sessionTotal}
        sessionCurrent={sessionCurrent}
      />
    </AbsoluteFill>
  );
};

export const Pomodoro25: React.FC<Pomodoro25Props> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { spans, introDur, focusDur } = timeline25(props, fps);

  const breakStart = introDur + focusDur;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080d" }}>
      <CozyScene />

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
              [0, 0.22, 0.22, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}

      {/* Geçiş çınları */}
      {props.hasChime ? (
        <>
          <Sequence from={breakStart} durationInFrames={Math.ceil(1.4 * fps)} layout="none">
            <Audio src={staticFile("chime.mp3")} volume={0.9} />
          </Sequence>
          <Sequence from={breakStart + focusDur} durationInFrames={Math.ceil(1.4 * fps)} layout="none">
            <Audio src={staticFile("chime.mp3")} volume={0.9} />
          </Sequence>
        </>
      ) : null}

      {/* UI fazları */}
      {spans.map((span) => {
        if (span.phase === "intro") {
          return (
            <Sequence key="intro" from={span.from} durationInFrames={span.durationInFrames}>
              <ClockPhase
                totalSeconds={Math.round(props.focusMinutes * 60)}
                countdown={false}
                fadeIn
                label={props.introKicker}
                accent={props.accentFocus}
                sessionTotal={props.sessionTotal}
                sessionCurrent={props.sessionCurrent}
              />
            </Sequence>
          );
        }
        if (span.phase === "focus") {
          return (
            <Sequence key="focus" from={span.from} durationInFrames={span.durationInFrames}>
              <ClockPhase
                totalSeconds={Math.round(props.focusMinutes * 60)}
                countdown
                fadeIn={false}
                label={props.focusLabel}
                accent={props.accentFocus}
                sessionTotal={props.sessionTotal}
                sessionCurrent={props.sessionCurrent}
              />
            </Sequence>
          );
        }
        if (span.phase === "break") {
          return (
            <Sequence key="break" from={span.from} durationInFrames={span.durationInFrames}>
              <ClockPhase
                totalSeconds={Math.round(props.breakMinutes * 60)}
                countdown
                fadeIn={false}
                label={props.breakLabel}
                accent={props.accentBreak}
                sessionTotal={props.sessionTotal}
                sessionCurrent={props.sessionCurrent}
              />
            </Sequence>
          );
        }
        return (
          <Sequence key="outro" from={span.from} durationInFrames={span.durationInFrames}>
            <TitleCard
              main={props.outroText}
              sub="SESSION COMPLETE"
              accent={props.accentBreak}
              durationInFrames={span.durationInFrames}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
