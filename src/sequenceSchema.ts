import { z } from "zod";

export const segmentSchema = z.object({
  kind: z.enum(["focus", "break"]),
  minutes: z.number().min(0),
  styleId: z.number().min(0),
});

export const sequenceSchema = z.object({
  introSeconds: z.number().min(0),
  outroSeconds: z.number().min(0),
  introText: z.string(),
  outroText: z.string(),
  focusLabel: z.string(),
  breakLabel: z.string(),
  segments: z.array(segmentSchema),
  hasLofi: z.boolean(),
  hasRain: z.boolean(),
  hasChime: z.boolean(),
});

export type SegmentDef = z.infer<typeof segmentSchema>;
export type SequenceProps = z.infer<typeof sequenceSchema>;

export interface PlannedSegment extends SegmentDef {
  from: number;
  durationInFrames: number;
  sessionTotal: number;
  sessionCurrent: number; // bu blok sırasında dolu/aktif odak indeksi
}

// Segmentleri kare aralıklarına ve session sayaçlarına dönüştürür.
export const planSequence = (props: SequenceProps, fps: number) => {
  const introDur = Math.round(props.introSeconds * fps);
  const outroDur = Math.round(props.outroSeconds * fps);
  const sessionTotal = props.segments.filter((s) => s.kind === "focus").length;

  let cursor = introDur;
  let focusDone = 0;
  const planned: PlannedSegment[] = props.segments.map((s) => {
    const durationInFrames = Math.round(s.minutes * 60 * fps);
    const sessionCurrent = s.kind === "focus" ? focusDone : focusDone;
    const seg: PlannedSegment = {
      ...s,
      from: cursor,
      durationInFrames,
      sessionTotal,
      sessionCurrent,
    };
    cursor += durationInFrames;
    if (s.kind === "focus") focusDone += 1;
    return seg;
  });

  const outroFrom = cursor;
  const total = cursor + outroDur;

  return { introDur, outroDur, planned, outroFrom, total, sessionTotal };
};
