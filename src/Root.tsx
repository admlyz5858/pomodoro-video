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

// Tam video: 10 sn geri sayım + 50 dk odak + 10 dk mola
const fullProps: PomodoroProps = {
  ...baseProps,
  countdownSeconds: 10,
  focusMinutes: 50,
  breakMinutes: 10,
};

// Demo (1 dk): 10 sn geri sayım + 40 sn odak + 10 sn mola
const demoProps: PomodoroProps = {
  ...baseProps,
  countdownSeconds: 10,
  focusMinutes: 40 / 60, // 40 sn
  breakMinutes: 10 / 60, // 10 sn
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
