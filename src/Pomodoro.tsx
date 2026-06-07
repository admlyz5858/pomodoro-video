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
import { TimerPhase } from "./components/TimerPhase";
import { TextScreen } from "./components/TextScreen";
import { PomodoroProps, timeline } from "./schema";

export const Pomodoro: React.FC<PomodoroProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { spans } = timeline(props, fps);

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
              [0, 0.7, 0.7, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}

      {spans.map((span) => {
        if (span.phase === "intro") {
          return (
            <Sequence
              key="intro"
              from={span.from}
              durationInFrames={span.durationInFrames}
            >
              <TextScreen
                text={props.introText}
                color={props.focusColor}
                durationInFrames={span.durationInFrames}
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
        if (span.phase === "breakIntro") {
          return (
            <Sequence
              key="breakIntro"
              from={span.from}
              durationInFrames={span.durationInFrames}
            >
              <TextScreen
                text={props.breakText}
                color={props.breakColor}
                durationInFrames={span.durationInFrames}
              />
            </Sequence>
          );
        }
        if (span.phase === "break") {
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
        }
        return (
          <Sequence
            key="outro"
            from={span.from}
            durationInFrames={span.durationInFrames}
          >
            <TextScreen
              text={props.outroText}
              color={props.breakColor}
              durationInFrames={span.durationInFrames}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
