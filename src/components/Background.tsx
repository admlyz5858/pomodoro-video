import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Deterministik sözde-rastgele [0,1) — indekse göre sabit, her render aynı sonucu verir.
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const RAIN_COUNT = 70;

const Rain: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const drops = [];
  for (let i = 0; i < RAIN_COUNT; i++) {
    const x = rand(i) * (width + 120) - 60;
    const len = 60 + rand(i + 7.3) * 90; // damla uzunluğu
    const speed = 9 + rand(i + 3.1) * 12; // kare başına düşüş (px)
    const offset = rand(i + 1.9) * (height + 200);
    const travel = height + 200;
    const y = ((frame * speed + offset) % travel) - 120;
    const opacity = 0.08 + rand(i + 5.5) * 0.18;
    drops.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 2,
          height: len,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0), rgba(214,228,224,0.9))",
          opacity,
          transform: "rotate(11deg)",
          borderRadius: 2,
        }}
      />,
    );
  }

  return <AbsoluteFill>{drops}</AbsoluteFill>;
};

export const Background: React.FC<{ hasBgImage: boolean }> = ({
  hasBgImage,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Yavaş Ken Burns yakınlaşması — fotoğrafa ve degradeye hayat katar.
  const scale = interpolate(frame, [0, durationInFrames], [1.06, 1.16], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0f0c" }}>
      {/* Sonbahar orman degrade tabanı (fotoğraf olmasa da dolu görünür) */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          background:
            "radial-gradient(120% 90% at 50% 35%, #24372a 0%, #16241b 45%, #0b130d 80%, #060a07 100%)",
        }}
      />
      {/* Sıcak sonbahar tonu sızıntısı */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgba(140,96,46,0.28) 0%, rgba(140,96,46,0) 60%)",
        }}
      />

      {/* Varsa gerçek orman fotoğrafı */}
      {hasBgImage ? (
        <AbsoluteFill style={{ transform: `scale(${scale})` }}>
          <Img
            src={staticFile("forest.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.85,
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* Yağmur */}
      <Rain />

      {/* Sis / atmosfer */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,18,13,0.15) 0%, rgba(10,18,13,0) 30%, rgba(6,10,7,0.55) 100%)",
        }}
      />

      {/* Okunabilirlik için merkez karartma vinyeti */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 75%)",
        }}
      />
    </AbsoluteFill>
  );
};
