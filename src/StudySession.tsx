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
import { ThemedCountdown } from "./components/ThemedCountdown";
import { TitleCard } from "./components/TitleCard";
import { Ambient } from "./components/Ambient";
import { Lightning } from "./components/Lightning";
import { fontByKey } from "./fonts";
import { THEMES } from "./themes";

export const studySchema = z.object({
  cycles: z.array(z.object({ focusStyle: z.number(), breakStyle: z.number() })),
  countdownSeconds: z.number().min(0),
  focusMinutes: z.number().min(0),
  breakMinutes: z.number().min(0),
  introSeconds: z.number().min(0),
  outroSeconds: z.number().min(0),
  introMain: z.string(),
  introSub: z.string(),
  outroMain: z.string(),
  outroSub: z.string(),
  countdownLabel: z.string(),
  focusLabel: z.string(),
  breakLabel: z.string(),
  musicFocus: z.string(),
  musicBreak: z.string(),
  musicVolume: z.number(),
  keepAmbient: z.boolean(),
});
export type StudyProps = z.infer<typeof studySchema>;

export const planStudy = (p: StudyProps, fps: number) => {
  const introDur = Math.round(p.introSeconds * fps);
  const outroDur = Math.round(p.outroSeconds * fps);
  const cd = Math.round(p.countdownSeconds * fps);
  const focus = Math.round(p.focusMinutes * 60 * fps);
  const brk = Math.round(p.breakMinutes * 60 * fps);

  type Ph = {
    type: "intro" | "countdown" | "focus" | "break" | "outro";
    from: number;
    dur: number;
    style: number;
    session: number;
  };
  const phases: Ph[] = [];
  let cursor = 0;
  const first = p.cycles[0]?.focusStyle ?? 0;
  if (introDur > 0)
    phases.push({ type: "intro", from: 0, dur: introDur, style: first, session: 0 });
  cursor = introDur;
  if (cd > 0) {
    phases.push({ type: "countdown", from: cursor, dur: cd, style: first, session: 0 });
    cursor += cd;
  }
  p.cycles.forEach((cy, i) => {
    phases.push({ type: "focus", from: cursor, dur: focus, style: cy.focusStyle, session: i });
    cursor += focus;
    phases.push({ type: "break", from: cursor, dur: brk, style: cy.breakStyle, session: i + 1 });
    cursor += brk;
  });
  const outroFrom = cursor;
  if (outroDur > 0) {
    const last = p.cycles[p.cycles.length - 1]?.breakStyle ?? 0;
    phases.push({ type: "outro", from: cursor, dur: outroDur, style: last, session: p.cycles.length });
    cursor += outroDur;
  }
  return { introDur, outroDur, cd, focus, brk, phases, outroFrom, total: cursor };
};

const musicFade = (f: number, total: number, fps: number, vol: number) =>
  interpolate(f, [0, 1 * fps, total - 1 * fps, total], [0, vol, vol, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Kısa siyah geçiş (ölü zaman az)
const blockFade = (f: number, total: number, fps: number) =>
  Math.min(
    interpolate(f, [0, 0.3 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 0.3 * fps, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

// Son 10 saniyede her saniye hafif saat tık'ı
const LastTicks: React.FC<{ phaseFrames: number }> = ({ phaseFrames }) => {
  const { fps } = useVideoConfig();
  const frames: number[] = [];
  for (let m = 10; m >= 1; m--) {
    const fr = phaseFrames - m * fps;
    if (fr >= 0) frames.push(fr);
  }
  return (
    <>
      {frames.map((fr, i) => (
        <Sequence key={i} from={fr} durationInFrames={Math.ceil(0.3 * fps)} layout="none">
          <Audio src={staticFile("clocktick.mp3")} volume={0.4} />
        </Sequence>
      ))}
    </>
  );
};

const TimerBlock: React.FC<{
  style: number;
  totalSeconds: number;
  phaseFrames: number;
  label: string;
  accent: string;
  session: number;
  sessionTotal: number;
  music: string;
  musicVolume: number;
  keepAmbient: boolean;
}> = ({ style, totalSeconds, phaseFrames, label, accent, session, sessionTotal, music, musicVolume, keepAmbient }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES[style] ?? THEMES[0];
  const seconds = Math.max(0, totalSeconds - Math.floor(frame / fps));
  const progress = Math.min(1, frame / phaseFrames);

  return (
    <AbsoluteFill style={{ opacity: blockFade(frame, phaseFrames, fps) }}>
      <SceneFor styleId={style} />
      {theme.ambient === "storm" ? <Lightning phaseFrames={phaseFrames} /> : null}
      {keepAmbient ? (
        <Ambient ambient={theme.ambient} phaseFrames={phaseFrames} gain={music ? 0.6 : 1} />
      ) : null}
      {music ? (
        <Audio src={staticFile(music)} loop volume={(f) => musicFade(f, phaseFrames, fps, musicVolume)} />
      ) : null}
      <LastTicks phaseFrames={phaseFrames} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <DigitalClock
          seconds={seconds}
          progress={progress}
          label={label}
          accent={accent}
          sessionTotal={sessionTotal}
          sessionCurrent={session}
          timeFont={fontByKey[theme.font]}
          ringMode={theme.ring}
          showDots={theme.showDots}
          textColor={theme.textColor}
          timeSize={theme.timeSize}
          timeWeight={theme.timeWeight}
          letterSpacing={theme.letterSpacing}
          pulseLow
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CountdownBlock: React.FC<{
  style: number;
  phaseFrames: number;
  label: string;
  music: string;
  musicVolume: number;
  keepAmbient: boolean;
}> = ({ style, phaseFrames, label, music, musicVolume, keepAmbient }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES[style] ?? THEMES[0];
  return (
    <AbsoluteFill style={{ opacity: blockFade(frame, phaseFrames, fps) }}>
      <SceneFor styleId={style} />
      {theme.ambient === "storm" ? <Lightning phaseFrames={phaseFrames} /> : null}
      {keepAmbient ? (
        <Ambient ambient={theme.ambient} phaseFrames={phaseFrames} gain={music ? 0.6 : 1} />
      ) : null}
      {music ? (
        <Audio src={staticFile(music)} loop volume={(f) => musicFade(f, phaseFrames, fps, musicVolume)} />
      ) : null}
      <ThemedCountdown
        durationInFrames={phaseFrames}
        label={label}
        accent={theme.accentFocus}
        font={fontByKey[theme.font]}
        textColor={theme.textColor}
        ringMode={theme.ring}
      />
    </AbsoluteFill>
  );
};

export const StudySession: React.FC<StudyProps> = (p) => {
  const { fps } = useVideoConfig();
  const plan = planStudy(p, fps);
  const sessionTotal = p.cycles.length;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080d" }}>
      {plan.phases.map((ph, i) => {
        const theme = THEMES[ph.style] ?? THEMES[0];
        if (ph.type === "intro") {
          return (
            <Sequence key={i} from={ph.from} durationInFrames={ph.dur}>
              <Ambient ambient={theme.ambient} phaseFrames={ph.dur} gain={0.5} />
              <TitleCard main={p.introMain} sub={p.introSub} accent={theme.accentFocus} durationInFrames={ph.dur} />
            </Sequence>
          );
        }
        if (ph.type === "countdown") {
          return (
            <Sequence key={i} from={ph.from} durationInFrames={ph.dur}>
              <CountdownBlock style={ph.style} phaseFrames={ph.dur} label={p.countdownLabel} music={p.musicFocus} musicVolume={p.musicVolume} keepAmbient={p.keepAmbient} />
            </Sequence>
          );
        }
        if (ph.type === "focus" || ph.type === "break") {
          const isFocus = ph.type === "focus";
          return (
            <Sequence key={i} from={ph.from} durationInFrames={ph.dur}>
              <TimerBlock
                style={ph.style}
                totalSeconds={Math.round(ph.dur / fps)}
                phaseFrames={ph.dur}
                label={isFocus ? p.focusLabel : p.breakLabel}
                accent={isFocus ? theme.accentFocus : theme.accentBreak}
                session={ph.session}
                sessionTotal={sessionTotal}
                music={isFocus ? p.musicFocus : p.musicBreak}
                musicVolume={p.musicVolume}
                keepAmbient={p.keepAmbient}
              />
            </Sequence>
          );
        }
        return (
          <Sequence key={i} from={ph.from} durationInFrames={ph.dur}>
            <Ambient ambient={theme.ambient} phaseFrames={ph.dur} gain={0.5} />
            <TitleCard main={p.outroMain} sub={p.outroSub} accent={theme.accentBreak} durationInFrames={ph.dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
