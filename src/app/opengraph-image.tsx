import { ImageResponse } from "next/og";

import { siteName } from "@/lib/site";

export const alt =
  "AKD Hospitality Limited — incorporated 1936, quoted on the Pakistan Stock Exchange as AKDHL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social sharing card, generated at build time rather than shipped as a static
 * asset, so it stays in step with the brand palette.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0c2340 0%, #14375c 60%, #1f6fb2 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#7fb2e0",
            }}
          />
          <div
            style={{
              color: "#ffffff",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Pakistan Stock Exchange &nbsp;·&nbsp; AKDHL
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: 82,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              marginTop: 26,
              width: 132,
              height: 7,
              borderRadius: 999,
              background: "#7fb2e0",
            }}
          />
          <div
            style={{
              marginTop: 30,
              color: "rgba(255,255,255,0.82)",
              fontSize: 33,
              lineHeight: 1.35,
              maxWidth: 880,
            }}
          >
            Incorporated in 1936. Hospitality, motels, destination management
            and tourism attractions.
          </div>
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 25,
          }}
        >
          akdhospitality.com
        </div>
      </div>
    ),
    size,
  );
}
