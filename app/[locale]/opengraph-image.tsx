import { ImageResponse } from "next/og";
import { languages } from "@/lib/i18n/settings";
import { SITE_NAME, SITE_TAGLINE, SITE_TITLE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE_TITLE;

// The layout's generateStaticParams does not reach sibling metadata routes, so
// without this the card is re-rendered on every crawl instead of at build time.
export function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

/*
 * The card sits on the app's own palette — same two-tone elevation, same
 * neutral shadcn ramp, no hue the editor itself never shows. Every element that
 * has children needs an explicit display value: satori has no block default.
 *
 * The copy is English in both locales, so one image serves /en and /vi alike.
 */
const PAGE = "#0A0A0A"; // --background, dark
const CARD = "#171717"; // --card, dark
const INK = "#FAFAFA"; // --foreground, dark
const MUTED = "#A1A1A1"; // --muted-foreground, dark
const RAISED = "#262626"; // --accent, dark

// Three blocks, each with its drag handle: the shape of the editor itself.
const BLOCKS = [
  { width: "360px", color: "#8A8A8A" },
  { width: "268px", color: "#5C5C5C" },
  { width: "196px", color: "#3D3D3D" },
];

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: PAGE,
          fontFamily: "sans-serif",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "72px",
            borderRadius: "40px",
            background: CARD,
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "84px",
                height: "84px",
                borderRadius: "21px",
                background: INK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* The tile is foreground and the glyph is card-coloured, so the
                  mark reads as a cut-out rather than a drawn icon. */}
              <svg width="48" height="48" viewBox="0 0 16 16" fill="none">
                <rect
                  x="2.2"
                  y="3"
                  width="11.6"
                  height="2.4"
                  rx="1.2"
                  fill={CARD}
                />
                <rect
                  x="2.2"
                  y="6.8"
                  width="8.4"
                  height="2.4"
                  rx="1.2"
                  fill={CARD}
                />
                <rect
                  x="2.2"
                  y="10.6"
                  width="5.6"
                  height="2.4"
                  rx="1.2"
                  fill={CARD}
                />
              </svg>
            </div>
            <div
              style={{
                fontSize: "72px",
                fontWeight: 700,
                color: INK,
                letterSpacing: "-2.5px",
              }}
            >
              {SITE_NAME}
            </div>
          </div>
          <div
            style={{
              fontSize: "34px",
              color: MUTED,
              maxWidth: "840px",
              lineHeight: 1.35,
              letterSpacing: "-0.5px",
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginTop: "auto",
            }}
          >
            {BLOCKS.map((block) => (
              <div
                key={block.width}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "3px",
                    background: RAISED,
                  }}
                />
                <div
                  style={{
                    width: block.width,
                    height: "8px",
                    borderRadius: "4px",
                    background: block.color,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
