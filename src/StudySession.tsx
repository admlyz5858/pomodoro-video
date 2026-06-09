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
  cycles: z.array(
    z.object({ focusStyle: z.number(), breakStyle: z.number() }),
  ),
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

  const phases: {
    type: "intro" | "focus" | "break" | "outro";
    from: number;
    dur: number;
    style?: number;
    session?: number;
  }[] = [];
  let cursor = 0;
  if (introDur > 0) phases.push({ type: "intro", from: 0, dur: introDur });
  cursor = introDur;
  p.cycles.forEach((cy, i) => {
    const fb = cd + focus;
    phases.push({ type: "focus", from: cursor, dur: fb, style: cy.focusStyle, session: i });
    cursor += fb;
    phases.push({ type: "break", from: cursor, dur: brk, style: cy.breakStyle, session: i + 1 });
    cursor += brk;
  });
  const outroFrom = cursor;
  const total = cursor + outroDur;
  return { introDur, outroDur, cd, focus, brk, phases, outroFrom, total };
};

const musicFade = (f: number, total: number, fps: number, vol: number) =>
  interpolate(f, [0, 1 * fps, total - 1 * fps, total], [0, vol, vol, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const blockFade = (f: number, total: number, fps: number) =>
  Math.min(
    interpolate(f, [0, 0.6 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 0.6 * fps, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

const FocusTimer: React.FC<{
  style: number;
  focusSeconds: number;
  focusFrames: number;
  label: string;
  session: number;
  sessionTotal: number;
}> = ({ style, focusSeconds, focusFrames, label, session, sessionTotal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES[style] ?? THEMES[0];
  const seconds = Math.max(0, focusSeconds - Math.floor(frame / fps));
  const progress = Math.min(1, frame / focusFrames);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <DigitalClock
        seconds={seconds}
        progress={progress}
        label={label}
        accent={theme.accentFocus}
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
  );
};

const FocusBlock: React.FC<{
  style: number;
  cd: number;
  focus: number;
  p: StudyProps;
  session: number;
  sessionTotal: number;
}> = ({ style, cd, focus, p, session, sessionTotal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES[style] ?? THEMES[0];
  const total = cd + focus;

  return (
    <AbsoluteFill style={{ opacity: blockFade(frame, total, fps) }}>
      <SceneFor styleId={style} />
      {theme.ambient === "storm" ? <Lightning phaseFrames={total} /> : null}
      {p.keepAmbient ? (
        <Ambient ambient={theme.ambient} phaseFrames={total} gain={p.musicFocus ? 0.6 : 1} />
      ) : null}
      {p.musicFocus ? (
        <Audio src={staticFile(p.musicFocus)} loop volume={(f) => musicFade(f, total, fps, p.musicVolume)} />
      ) : null}

      <Sequence from={0} durationInFrames={cd}>
        <ThemedCountdown
          durationInFrames={cd}
          label={p.countdownLabel}
          accent={theme.accentFocus}
          font={fontByKey[theme.font]}
          textColor={theme.textColor}
          ringMode={theme.ring}
        />
      </Sequence>
      <Sequence from={cd} durationInFrames={focus}>
        <FocusTimer
          style={style}
          focusSeconds={Math.round(focus / fps)}
          focusFrames={focus}
          label={p.focusLabel}
          session={session}
          sessionTotal={sessionTotal}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const BreakBlock: React.FC<{
  style: number;
  brk: number;
  p: StudyProps;
  session: number;
  sessionTotal: number;
}> = ({ style, brk, p, session, sessionTotal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES[style] ?? THEMES[0];
  const seconds = Math.max(0, Math.round(brk / fps) - Math.floor(frame / fps));
  const progress = Math.min(1, frame / brk);

  return (
    <AbsoluteFill style={{ opacity: blockFade(frame, brk, fps) }}>
      <SceneFor styleId={style} />
      {theme.ambient === "storm" ? <Lightning phaseFrames={brk} /> : null}
      {p.keepAmbient ? (
        <Ambient ambient={theme.ambient} phaseFrames={brk} gain={p.musicBreak ? 0.6 : 1} />
      ) : null}
      {p.musicBreak ? (
        <Audio src={staticFile(p.musicBreak)} loop volume={(f) => musicFade(f, brk, fps, p.musicVolume)} />
      ) : null}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <DigitalClock
          seconds={seconds}
          progress={progress}
          label={p.breakLabel}
          accent={theme.accentBreak}
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

export const StudySession: React.FC<StudyProps> = (p) => {
  const { fps } = useVideoConfig();
  const plan = planStudy(p, fps);
  const sessionTotal = p.cycles.length;
  const firstStyle = p.cycles[0]?.focusStyle ?? 0;
  const lastStyle = p.cycles[p.cycles.length - 1]?.breakStyle ?? 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080d" }}>
      {plan.phases.map((ph, i) => {
        if (ph.type === "intro") {
          return (
            <Sequence key={i} from={ph.from} durationInFrames={ph.dur}>
              <Ambient ambient={THEMES[firstStyle].ambient} phaseFrames={ph.dur} gain={0.5} />
              <TitleCard main={p.introMain} sub={p.introSub} accent={THEMES[firstStyle].accentFocus} durationInFrames={ph.dur} />
            </Sequence>
          );
        }
        if (ph.type === "focus") {
          return (
            <Sequence key={i} from={ph.from} durationInFrames={ph.dur}>
              <FocusBlock style={ph.style!} cd={plan.cd} focus={plan.focus} p={p} session={ph.session!} sessionTotal={sessionTotal} />
            </Sequence>
          );
        }
        if (ph.type === "break") {
          return (
            <Sequence key={i} from={ph.from} durationInFrames={ph.dur}>
              <BreakBlock style={ph.style!} brk={plan.brk} p={p} session={ph.session!} sessionTotal={sessionTotal} />
            </Sequence>
          );
        }
        return (
          <Sequence key={i} from={ph.from} durationInFrames={ph.dur}>
            <Ambient ambient={THEMES[lastStyle].ambient} phaseFrames={ph.dur} gain={0.5} />
            <TitleCard main={p.outroMain} sub={p.outroSub} accent={THEMES[lastStyle].accentBreak} durationInFrames={ph.dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
