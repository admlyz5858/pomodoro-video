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
import { z } from "zod";
import { SceneFor } from "./scene/SceneFor";
import { DigitalClock } from "./components/DigitalClock";
import { TitleCard } from "./components/TitleCard";
import { Ambient } from "./components/Ambient";
import { Lightning } from "./components/Lightning";
import { fontByKey } from "./fonts";
import { THEMES } from "./themes";

export const singleSchema = z.object({
  styleId: z.number(),
  focusMinutes: z.number().min(0),
  breakMinutes: z.number().min(0),
  introSeconds: z.number().min(0),
  outroSeconds: z.number().min(0),
  introText: z.string(),
  focusLabel: z.string(),
  breakLabel: z.string(),
  outroText: z.string(),
  musicFile: z.string(), // "" ise müzik yok
  musicVolume: z.number(),
  keepAmbient: z.boolean(),
});
export type SingleProps = z.infer<typeof singleSchema>;

export const singleTimeline = (p: SingleProps, fps: number) => {
  const intro = Math.round(p.introSeconds * fps);
  const focus = Math.round(p.focusMinutes * 60 * fps);
  const brk = Math.round(p.breakMinutes * 60 * fps);
  const outro = Math.round(p.outroSeconds * fps);
  return {
    intro,
    focus,
    brk,
    outro,
    total: intro + focus + brk + outro,
    focusFrom: intro,
    breakFrom: intro + focus,
    outroFrom: intro + focus + brk,
  };
};

const ClockPhase: React.FC<{
  styleId: number;
  totalSeconds: number;
  phaseFrames: number;
  countdown: boolean;
  fadeIn: boolean;
  label: string;
  accent: string;
  sessionCurrent: number;
}> = ({
  styleId,
  totalSeconds,
  phaseFrames,
  countdown,
  fadeIn,
  label,
  accent,
  sessionCurrent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES[styleId] ?? THEMES[0];
  const seconds = countdown
    ? Math.max(0, totalSeconds - Math.floor(frame / fps))
    : totalSeconds;
  const progress =
    countdown && phaseFrames > 0 ? Math.min(1, frame / phaseFrames) : 0;
  const enter = fadeIn
    ? interpolate(frame, [0, 1 * fps], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
      }}
    >
      <DigitalClock
        seconds={seconds}
        progress={progress}
        label={label}
        accent={accent}
        sessionTotal={4}
        sessionCurrent={sessionCurrent}
        timeFont={fontByKey[theme.font]}
        ringMode={theme.ring}
        showDots={theme.showDots}
        textColor={theme.textColor}
        timeSize={theme.timeSize}
        timeWeight={theme.timeWeight}
        letterSpacing={theme.letterSpacing}
      />
    </AbsoluteFill>
  );
};

export const PomodoroSingle: React.FC<SingleProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const theme = THEMES[props.styleId] ?? THEMES[0];
  const t = singleTimeline(props, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080d" }}>
      {/* Sahne (tek stil, tüm video boyunca) */}
      <SceneFor styleId={props.styleId} />
      {theme.ambient === "storm" ? (
        <Lightning phaseFrames={durationInFrames} />
      ) : null}

      {/* Sahne ortam sesi (müziğin altında) */}
      {props.keepAmbient ? (
        <Ambient
          ambient={theme.ambient}
          phaseFrames={durationInFrames}
          gain={props.musicFile ? 0.6 : 1}
        />
      ) : null}

      {/* Kullanıcının arka plan müziği */}
      {props.musicFile ? (
        <Audio
          src={staticFile(props.musicFile)}
          loop
          volume={(f) =>
            interpolate(
              f,
              [0, 3 * fps, durationInFrames - 4 * fps, durationInFrames],
              [0, props.musicVolume, props.musicVolume, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}

      {/* Intro */}
      {t.intro > 0 ? (
        <Sequence from={0} durationInFrames={t.intro}>
          <ClockPhase
            styleId={props.styleId}
            totalSeconds={Math.round(props.focusMinutes * 60)}
            phaseFrames={t.intro}
            countdown={false}
            fadeIn
            label={props.introText}
            accent={theme.accentFocus}
            sessionCurrent={0}
          />
        </Sequence>
      ) : null}

      {/* Odak */}
      <Sequence from={t.focusFrom} durationInFrames={t.focus}>
        <ClockPhase
          styleId={props.styleId}
          totalSeconds={Math.round(props.focusMinutes * 60)}
          phaseFrames={t.focus}
          countdown
          fadeIn={false}
          label={props.focusLabel}
          accent={theme.accentFocus}
          sessionCurrent={0}
        />
      </Sequence>

      {/* Mola */}
      <Sequence from={t.breakFrom} durationInFrames={t.brk}>
        <ClockPhase
          styleId={props.styleId}
          totalSeconds={Math.round(props.breakMinutes * 60)}
          phaseFrames={t.brk}
          countdown
          fadeIn={false}
          label={props.breakLabel}
          accent={theme.accentBreak}
          sessionCurrent={1}
        />
      </Sequence>

      {/* Outro */}
      {t.outro > 0 ? (
        <Sequence from={t.outroFrom} durationInFrames={t.outro}>
          <TitleCard
            main={props.outroText}
            sub="SESSION COMPLETE"
            accent={theme.accentBreak}
            durationInFrames={t.outro}
          />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
