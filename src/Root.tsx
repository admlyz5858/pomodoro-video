import "./index.css";
import { CalculateMetadataFunction, Composition } from "remotion";
import { Pomodoro } from "./Pomodoro";
import { PomodoroProps, pomodoroSchema, timeline } from "./schema";
import { Pomodoro25 } from "./Pomodoro25";
import {
  Pomodoro25Props,
  pomodoro25Schema,
  timeline25,
} from "./pomodoro25Schema";
import { Showcase, showcaseSchema } from "./Showcase";
import { PomodoroSequence } from "./PomodoroSequence";
import {
  planSequence,
  sequenceSchema,
  SequenceProps,
} from "./sequenceSchema";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

/* ---------- Eski: 50/10 yağmurlu orman ---------- */

const FOCUS_COLOR = "#e0863a";
const BREAK_COLOR = "#7fb08a";

const baseProps: Omit<
  PomodoroProps,
  "countdownSeconds" | "focusMinutes" | "breakMinutes"
> = {
  introLabel: "STAY FOCUSED",
  focusLabel: "FOCUS",
  breakLabel: "BREAK",
  focusColor: FOCUS_COLOR,
  breakColor: BREAK_COLOR,
  hasBgImage: true,
  hasMusic: true,
  hasSfx: true,
};

const fullProps: PomodoroProps = {
  ...baseProps,
  countdownSeconds: 10,
  focusMinutes: 50,
  breakMinutes: 10,
};

const demoProps: PomodoroProps = {
  ...baseProps,
  countdownSeconds: 10,
  focusMinutes: 40 / 60,
  breakMinutes: 10 / 60,
};

const calcMeta: CalculateMetadataFunction<PomodoroProps> = ({ props }) => ({
  durationInFrames: Math.max(1, timeline(props, FPS).total),
});

/* ---------- Yeni: 25/5 cozy lofi gece odası ---------- */

const ACCENT_FOCUS = "#84c5ec"; // buz mavisi
const ACCENT_BREAK = "#b69ae6"; // lavanta / mor

const base25: Omit<
  Pomodoro25Props,
  "focusMinutes" | "breakMinutes" | "introSeconds" | "outroSeconds"
> = {
  focusLabel: "FOCUS",
  breakLabel: "BREAK",
  introKicker: "FOCUS SESSION",
  outroText: "WELL DONE",
  accentFocus: ACCENT_FOCUS,
  accentBreak: ACCENT_BREAK,
  sessionTotal: 4,
  sessionCurrent: 0,
  hasLofi: true,
  hasRain: true,
  hasChime: true,
};

const full25: Pomodoro25Props = {
  ...base25,
  introSeconds: 5,
  focusMinutes: 25,
  breakMinutes: 5,
  outroSeconds: 5,
};

const demo25: Pomodoro25Props = {
  ...base25,
  introSeconds: 5,
  focusMinutes: 35 / 60, // 35 sn
  breakMinutes: 12 / 60, // 12 sn
  outroSeconds: 5,
};

const calcMeta25: CalculateMetadataFunction<Pomodoro25Props> = ({ props }) => ({
  durationInFrames: Math.max(1, timeline25(props, FPS).total),
});

/* ---------- Çok-stilli dizilim (25/5 × 3, her blok farklı stil) ---------- */

const seqBase = {
  introText: "DEEP FOCUS",
  outroText: "WELL DONE",
  focusLabel: "FOCUS",
  breakLabel: "BREAK",
  hasLofi: true,
  hasRain: true,
  hasChime: false, // geçiş çını yok (kullanıcı isteği)
};

const fullSeq: SequenceProps = {
  ...seqBase,
  introSeconds: 5,
  outroSeconds: 6,
  segments: [
    { kind: "focus", minutes: 25, styleId: 0 },
    { kind: "break", minutes: 5, styleId: 1 },
    { kind: "focus", minutes: 25, styleId: 2 },
    { kind: "break", minutes: 5, styleId: 3 },
    { kind: "focus", minutes: 25, styleId: 5 },
    { kind: "break", minutes: 10, styleId: 7 },
  ],
};

const demoSeq: SequenceProps = {
  ...seqBase,
  introSeconds: 3,
  outroSeconds: 4,
  segments: [
    { kind: "focus", minutes: 12 / 60, styleId: 0 },
    { kind: "break", minutes: 4 / 60, styleId: 1 },
    { kind: "focus", minutes: 12 / 60, styleId: 2 },
    { kind: "break", minutes: 4 / 60, styleId: 3 },
    { kind: "focus", minutes: 12 / 60, styleId: 5 },
    { kind: "break", minutes: 6 / 60, styleId: 7 },
  ],
};

const calcMetaSeq: CalculateMetadataFunction<SequenceProps> = ({ props }) => ({
  durationInFrames: Math.max(1, planSequence(props, FPS).total),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        schema={showcaseSchema}
        defaultProps={{ styleId: 0 }}
        durationInFrames={150}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      <Composition
        id="PomodoroSeq"
        component={PomodoroSequence}
        schema={sequenceSchema}
        defaultProps={fullSeq}
        calculateMetadata={calcMetaSeq}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PomodoroSeqDemo"
        component={PomodoroSequence}
        schema={sequenceSchema}
        defaultProps={demoSeq}
        calculateMetadata={calcMetaSeq}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      <Composition
        id="Pomodoro25"
        component={Pomodoro25}
        schema={pomodoro25Schema}
        defaultProps={full25}
        calculateMetadata={calcMeta25}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Pomodoro25Demo"
        component={Pomodoro25}
        schema={pomodoro25Schema}
        defaultProps={demo25}
        calculateMetadata={calcMeta25}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      <Composition
        id="Pomodoro"
        component={Pomodoro}
        schema={pomodoroSchema}
        defaultProps={fullProps}
        calculateMetadata={calcMeta}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PomodoroDemo"
        component={Pomodoro}
        schema={pomodoroSchema}
        defaultProps={demoProps}
        calculateMetadata={calcMeta}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
