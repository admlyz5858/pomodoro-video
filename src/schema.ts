import { z } from "zod";

// Pomodoro videosunun tüm parametreleri.
export const pomodoroSchema = z.object({
  // Faz süreleri
  countdownSeconds: z.number().min(0), // başlangıçtaki geri sayım (10 sn)
  focusMinutes: z.number().min(0),
  breakMinutes: z.number().min(0),

  // Metinler / etiketler
  introLabel: z.string(), // geri sayım sırasında üstte (örn. STAY FOCUSED)
  focusLabel: z.string(),
  breakLabel: z.string(),

  // Renkler (sonbahar / lofi paleti)
  focusColor: z.string(),
  breakColor: z.string(),

  // Varlık bayrakları (public/ içinde dosya var mı?)
  hasBgImage: z.boolean(),
  hasMusic: z.boolean(),
  hasSfx: z.boolean(), // tick + chime ses efektleri
});

export type PomodoroProps = z.infer<typeof pomodoroSchema>;

export type Phase = "introCountdown" | "focus" | "break";

export interface PhaseSpan {
  phase: Phase;
  from: number; // başlangıç karesi (global)
  durationInFrames: number;
}

// Proplardan ve fps'ten tüm fazların kare aralıklarını ve toplam süreyi hesaplar.
export const timeline = (props: PomodoroProps, fps: number) => {
  const countdownDur = Math.round(props.countdownSeconds * fps);
  const focusDur = Math.round(props.focusMinutes * 60 * fps);
  const breakDur = Math.round(props.breakMinutes * 60 * fps);

  const spans: PhaseSpan[] = [];
  let cursor = 0;
  const push = (phase: Phase, durationInFrames: number) => {
    if (durationInFrames > 0) {
      spans.push({ phase, from: cursor, durationInFrames });
      cursor += durationInFrames;
    }
  };

  push("introCountdown", countdownDur);
  push("focus", focusDur);
  push("break", breakDur);

  return {
    spans,
    total: cursor,
    countdownDur,
    focusDur,
    breakDur,
  };
};
