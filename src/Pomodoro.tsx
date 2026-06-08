import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Background } from "./components/Background";
import { CountdownIntro } from "./components/CountdownIntro";
import { TimerPhase } from "./components/TimerPhase";
import { Sfx } from "./components/Sfx";
import { PomodoroProps, timeline } from "./schema";

export const Pomodoro: React.FC<PomodoroProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { spans, countdownDur, focusDur } = timeline(props, fps);

  // Faz başlangıçları (mutlak kare)
  const focusStart = countdownDur;
  const breakStart = countdownDur + focusDur;

  // --- Ses zamanlamaları (mutlak kare) ---
  // Başlangıç geri sayımı: her saniye bir tick (10, 9, ... 1)
  const introTicks: number[] = [];
  const introSecs = Math.round(props.countdownSeconds);
  for (let s = 0; s < introSecs; s++) introTicks.push(s * fps);

  // Odağın son 10 saniyesi: her saniye bir tick (00:10 ... 00:01)
  const focusTicks: number[] = [];
  if (focusDur >= 10 * fps) {
    for (let m = 10; m >= 1; m--) focusTicks.push(focusStart + focusDur - m * fps);
  }

  // Geçiş çınları: odağa girerken ve molaya girerken
  const chimeFrames = [focusStart, breakStart];

  return (
    <AbsoluteFill style={{ backgroundColor: "#060a07" }}>
      <Background hasBgImage={props.hasBgImage} />

      {props.hasMusic ? (
        <Audio
          src={staticFile("music.mp3")}
          loop
          volume={(f) =>
            interpolate(
              f,
              [0, 2 * fps, durationInFrames - 3 * fps, durationInFrames],
              [0, 0.55, 0.55, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}

      {spans.map((span) => {
        if (span.phase === "introCountdown") {
          return (
            <Sequence
              key="introCountdown"
              from={span.from}
              durationInFrames={span.durationInFrames}
            >
              <CountdownIntro
                durationInFrames={span.durationInFrames}
                label={props.introLabel}
                color={props.focusColor}
              />
            </Sequence>
          );
        }
        if (span.phase === "focus") {
          return (
            <Sequence
              key="focus"
              from={span.from}
              durationInFrames={span.durationInFrames}
            >
              <TimerPhase
                durationInFrames={span.durationInFrames}
                label={props.focusLabel}
                color={props.focusColor}
              />
            </Sequence>
          );
        }
        return (
          <Sequence
            key="break"
            from={span.from}
            durationInFrames={span.durationInFrames}
          >
            <TimerPhase
              durationInFrames={span.durationInFrames}
              label={props.breakLabel}
              color={props.breakColor}
            />
          </Sequence>
        );
      })}

      {props.hasSfx ? (
        <Sfx
          tickFrames={[...introTicks, ...focusTicks]}
          chimeFrames={chimeFrames}
        />
      ) : null}
    </AbsoluteFill>
  );
};
