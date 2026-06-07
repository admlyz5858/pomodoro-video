import { z } from "zod";

// Pomodoro videosunun tüm parametreleri. Süreler dakika/saniye cinsindendir;
// kareye çevirme işini timeline() yapar.
export const pomodoroSchema = z.object({
  // Faz süreleri
  focusMinutes: z.number().min(0),
  breakMinutes: z.number().min(0),
  introSeconds: z.number().min(0),
  breakIntroSeconds: z.number().min(0),
  outroSeconds: z.number().min(0),

  // Metinler
  introText: z.string(),
  breakText: z.string(),
  outroText: z.string(),
  focusLabel: z.string(),
  breakLabel: z.string(),

  // Renkler (sonbahar / lofi paleti)
  focusColor: z.string(),
  breakColor: z.string(),

  // Arka plan fotoğrafı public/ içinde var mı? Yoksa degrade fallback kullanılır.
  hasBgImage: z.boolean(),
  // Arka plan müziği public/ içinde var mı?
  hasMusic: z.boolean(),
});

export type PomodoroProps = z.infer<typeof pomodoroSchema>;

export type Phase = "intro" | "focus" | "breakIntro" | "break" | "outro";

export interface PhaseSpan {
  phase: Phase;
  from: number; // başlangıç karesi (global)
  durationInFrames: number;
}

// Proplardan ve fps'ten tüm fazların kare aralıklarını ve toplam süreyi hesaplar.
export const timeline = (props: PomodoroProps, fps: number) => {
  const introDur = Math.round(props.introSeconds * fps);
  const focusDur = Math.round(props.focusMinutes * 60 * fps);
  const breakIntroDur = Math.round(props.breakIntroSeconds * fps);
  const breakDur = Math.round(props.breakMinutes * 60 * fps);
  const outroDur = Math.round(props.outroSeconds * fps);

  const spans: PhaseSpan[] = [];
  let cursor = 0;
  const push = (phase: Phase, durationInFrames: number) => {
    if (durationInFrames > 0) {
      spans.push({ phase, from: cursor, durationInFrames });
      cursor += durationInFrames;
    }
  };

  push("intro", introDur);
  push("focus", focusDur);
  push("breakIntro", breakIntroDur);
  push("break", breakDur);
  push("outro", outroDur);

  return { spans, total: cursor };
};
