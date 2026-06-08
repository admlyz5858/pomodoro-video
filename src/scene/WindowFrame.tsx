import React from "react";
import { AbsoluteFill } from "remotion";

const woodV =
  "linear-gradient(90deg, #25160f 0%, #3c2619 35%, #4a3020 50%, #3c2619 65%, #21130c 100%)";
const woodH =
  "linear-gradient(180deg, #25160f 0%, #3c2619 35%, #4a3020 50%, #3c2619 65%, #21130c 100%)";

// Cam alanı dikdörtgeni (px, 1920x1080)
const GX = 34;
const GY = 24;
const GR = 1886; // sağ kenar
const GB = 720; // alt kenar (denizlik üstü)
const T = 32; // çerçeve kalınlığı

export const WindowFrame: React.FC = () => {
  const paneW = GR - GX;

  return (
    <AbsoluteFill>
      {/* Camın iç gölgesi (kenarlara doğru kararma) + soğuk yansıma */}
      <div
        style={{
          position: "absolute",
          left: GX + T,
          top: GY + T,
          width: GR - GX - 2 * T,
          height: GB - GY - 2 * T,
          boxShadow: "inset 0 0 120px rgba(4,10,18,0.75)",
          background:
            "linear-gradient(125deg, rgba(180,205,235,0.06) 0%, rgba(180,205,235,0) 28%, rgba(180,205,235,0) 70%, rgba(120,140,170,0.05) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Üst kiriş */}
      <div style={{ position: "absolute", left: GX, top: GY, width: paneW, height: T, background: woodH }} />
      {/* Alt kiriş (denizlik üstü rayı) */}
      <div style={{ position: "absolute", left: GX, top: GB - T, width: paneW, height: T + 6, background: woodH }} />
      {/* Sol direk */}
      <div style={{ position: "absolute", left: GX, top: GY, width: T, height: GB - GY, background: woodV }} />
      {/* Sağ direk */}
      <div style={{ position: "absolute", left: GR - T, top: GY, width: T, height: GB - GY, background: woodV }} />

      {/* Dikey orta bölme */}
      <div
        style={{
          position: "absolute",
          left: (GX + GR) / 2 - 11,
          top: GY + T,
          width: 22,
          height: GB - GY - 2 * T,
          background: woodV,
        }}
      />
      {/* Yatay orta bölme */}
      <div
        style={{
          position: "absolute",
          left: GX + T,
          top: (GY + GB) / 2 - 9,
          width: GR - GX - 2 * T,
          height: 18,
          background: woodH,
        }}
      />

      {/* Çerçeve iç kenar vurgusu */}
      <div
        style={{
          position: "absolute",
          left: GX + T - 2,
          top: GY + T - 2,
          width: GR - GX - 2 * T + 4,
          height: GB - GY - 2 * T + 4,
          border: "1px solid rgba(0,0,0,0.5)",
          boxShadow: "inset 0 1px 0 rgba(120,90,60,0.35)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
