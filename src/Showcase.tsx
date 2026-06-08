import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { CozyScene } from "./scene/CozyScene";
import { GradientScene } from "./scene/GradientScene";
import { Background } from "./components/Background";
import { DigitalClock } from "./components/DigitalClock";
import { fontByKey } from "./fonts";
import { THEMES } from "./themes";

export const showcaseSchema = z.object({
  styleId: z.number(),
});
export type ShowcaseProps = z.infer<typeof showcaseSchema>;

const SceneFor: React.FC<{ id: number }> = ({ id }) => {
  const theme = THEMES[id] ?? THEMES[0];
  const s = theme.scene;
  if (s.kind === "cozy") return <CozyScene tint={s.tint} />;
  if (s.kind === "forest")
    return (
      <AbsoluteFill>
        <Background hasBgImage />
        <AbsoluteFill
          style={{ background: "rgba(4,8,6,0.28)", pointerEvents: "none" }}
        />
      </AbsoluteFill>
    );
  return <GradientScene {...s.props} />;
};

export const Showcase: React.FC<ShowcaseProps> = ({ styleId }) => {
  const theme = THEMES[styleId] ?? THEMES[0];

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080d" }}>
      <SceneFor id={styleId} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <DigitalClock
          seconds={24 * 60 + 35}
          progress={0.32}
          label="FOCUS"
          accent={theme.accentFocus}
          sessionTotal={4}
          sessionCurrent={1}
          timeFont={fontByKey[theme.font]}
          ringMode={theme.ring}
          showDots={theme.showDots}
          textColor={theme.textColor}
          timeSize={theme.timeSize}
          timeWeight={theme.timeWeight}
          letterSpacing={theme.letterSpacing}
        />
      </AbsoluteFill>

      {/* Köşede stil adı (vitrin etiketi) */}
      <div
        style={{
          position: "absolute",
          left: 40,
          bottom: 34,
          fontFamily: "monospace",
          fontSize: 26,
          color: "rgba(255,255,255,0.82)",
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          letterSpacing: 1,
        }}
      >
        {`#${styleId} · ${theme.name}`}
      </div>
    </AbsoluteFill>
  );
};
