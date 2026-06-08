import React from "react";
import { useCurrentFrame } from "remotion";
import { rand } from "../lib/rand";

// Gooseneck masa lambası + sıcak ışık halesi (hafif titreşimli).
export const DeskLamp: React.FC<{ glow: string }> = ({ glow }) => {
  const frame = useCurrentFrame();
  // İnce titreşim: birkaç sinüsün toplamı
  const flicker =
    0.86 +
    0.08 * Math.sin(frame * 0.5) +
    0.06 * Math.sin(frame * 1.3 + 1) +
    0.04 * (rand(Math.floor(frame / 3)) - 0.5);

  return (
    <div style={{ position: "relative", width: 260, height: 320 }}>
      {/* Geniş ışık halesi */}
      <div
        style={{
          position: "absolute",
          left: -40,
          top: 30,
          width: 340,
          height: 340,
          background: `radial-gradient(circle, ${glow}55 0%, ${glow}22 30%, ${glow}00 62%)`,
          opacity: flicker,
          filter: "blur(4px)",
        }}
      />
      {/* Lamba taban */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 150,
          width: 110,
          height: 16,
          background: "linear-gradient(180deg,#241b16,#0e0a08)",
          borderRadius: 8,
        }}
      />
      {/* Direk */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 198,
          width: 10,
          height: 180,
          background: "#1a1410",
          borderRadius: 5,
        }}
      />
      {/* Kol */}
      <div
        style={{
          position: "absolute",
          bottom: 184,
          left: 70,
          width: 140,
          height: 10,
          background: "#1a1410",
          borderRadius: 5,
          transform: "rotate(-12deg)",
          transformOrigin: "right center",
        }}
      />
      {/* Başlık (abajur) */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 40,
          width: 70,
          height: 50,
          background: "linear-gradient(180deg,#2a201a,#140e0b)",
          borderRadius: "50% 50% 12px 12px",
          transform: "rotate(18deg)",
        }}
      />
      {/* Ampul parıltısı */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 56,
          width: 40,
          height: 26,
          background: `radial-gradient(circle, ${glow} 0%, ${glow}88 40%, transparent 72%)`,
          opacity: flicker,
          filter: "blur(2px)",
        }}
      />
      {/* Işık konisi (aşağı) */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: 6,
          width: 150,
          height: 200,
          background: `linear-gradient(180deg, ${glow}33 0%, ${glow}00 80%)`,
          clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0% 100%)",
          opacity: flicker * 0.8,
          filter: "blur(3px)",
        }}
      />
    </div>
  );
};
