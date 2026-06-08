import { z } from "zod";

export const pomodoro25Schema = z.object({
  introSeconds: z.number().min(0),
  focusMinutes: z.number().min(0),
  breakMinutes: z.number().min(0),
  outroSeconds: z.number().min(0),

  focusLabel: z.string(),
  breakLabel: z.string(),
  introKicker: z.string(),
  outroText: z.string(),

  accentFocus: z.string(),
  accentBreak: z.string(),

  sessionTotal: z.number().min(1),
  sessionCurrent: z.number().min(0),

  hasLofi: z.boolean(),
  hasRain: z.boolean(),
  hasChime: z.boolean(),
});

export type Pomodoro25Props = z.infer<typeof pomodoro25Schema>;

export type Phase25 = "intro" | "focus" | "break" | "outro";

export interface Span25 {
  phase: Phase25;
  from: number;
  durationInFrames: number;
}

export const timeline25 = (p: Pomodoro25Props, fps: number) => {
  const introDur = Math.round(p.introSeconds * fps);
  const focusDur = Math.round(p.focusMinutes * 60 * fps);
  const breakDur = Math.round(p.breakMinutes * 60 * fps);
  const outroDur = Math.round(p.outroSeconds * fps);

  const spans: Span25[] = [];
  let cursor = 0;
  const push = (phase: Phase25, d: number) => {
    if (d > 0) {
      spans.push({ phase, from: cursor, durationInFrames: d });
      cursor += d;
    }
  };
  push("intro", introDur);
  push("focus", focusDur);
  push("break", breakDur);
  push("outro", outroDur);

  return { spans, total: cursor, introDur, focusDur, breakDur, outroDur };
};
