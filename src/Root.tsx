import "./index.css";
import { CalculateMetadataFunction, Composition } from "remotion";
import { Pomodoro } from "./Pomodoro";
import { PomodoroProps, pomodoroSchema, timeline } from "./schema";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

// Sonbahar / lofi paleti
const FOCUS_COLOR = "#e0863a"; // sıcak amber
const BREAK_COLOR = "#7fb08a"; // yumuşak orman yeşili

// Varlık dosyaları public/ içine indikçe bunları true yap.
const HAS_BG_IMAGE = true;
const HAS_MUSIC = true;

const baseProps: Omit<
  PomodoroProps,
  "focusMinutes" | "breakMinutes"
> = {
  introSeconds: 4,
  breakIntroSeconds: 3,
  outroSeconds: 4,
  introText: "STAY FOCUSED",
  breakText: "TAKE A BREAK",
  outroText: "WELL DONE",
  focusLabel: "FOCUS",
  breakLabel: "BREAK",
  focusColor: FOCUS_COLOR,
  breakColor: BREAK_COLOR,
  hasBgImage: HAS_BG_IMAGE,
  hasMusic: HAS_MUSIC,
};

const fullProps: PomodoroProps = {
  ...baseProps,
  focusMinutes: 50,
  breakMinutes: 10,
};

// Demo: tasarımı/animasyonu hızlı görmek için kısa süreler.
const demoProps: PomodoroProps = {
  ...baseProps,
  focusMinutes: 0.25, // 15 sn
  breakMinutes: 0.1333, // ~8 sn
  introSeconds: 2,
  breakIntroSeconds: 1.5,
  outroSeconds: 2,
};

const calculateMetadata: CalculateMetadataFunction<PomodoroProps> = ({
  props,
}) => {
  const { total } = timeline(props, FPS);
  return { durationInFrames: Math.max(1, total) };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Pomodoro"
        component={Pomodoro}
        schema={pomodoroSchema}
        defaultProps={fullProps}
        calculateMetadata={calculateMetadata}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PomodoroDemo"
        component={Pomodoro}
        schema={pomodoroSchema}
        defaultProps={demoProps}
        calculateMetadata={calculateMetadata}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
