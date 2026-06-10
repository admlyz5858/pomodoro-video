import React from "react";
import { AbsoluteFill } from "remotion";
import { CozyScene } from "./CozyScene";
import { GradientScene } from "./GradientScene";
import { WinterCabin } from "./WinterCabin";
import { RealScene } from "./RealScene";
import { Background } from "../components/Background";
import { THEMES } from "../themes";

// styleId'ye göre ilgili arka plan sahnesini render eder.
export const SceneFor: React.FC<{ styleId: number }> = ({ styleId }) => {
  const theme = THEMES[styleId] ?? THEMES[0];
  const s = theme.scene;
  if (s.kind === "cozy") return <CozyScene tint={s.tint} />;
  if (s.kind === "cabin") return <WinterCabin glow={s.glow} sky={s.sky} />;
  if (s.kind === "video") return <RealScene src={s.src} scrim={s.scrim} />;
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
