/**
 * Site identity, in one place. `metadataBase`, robots.ts, sitemap.ts and the OG
 * image all read from here so the production URL is a single-line change.
 */

import { fallbackLng } from "@/lib/i18n/settings";

export const BASE_URL = "https://notenodes.vercel.app";

export const SITE_NAME = "NoteNodes";

export const SITE_TITLE = "NoteNodes — Quick Markdown Editor";

export const SITE_DESCRIPTION =
  "A fast, lightweight markdown editor with block-based architecture, instant auto-save, and one-click export to Markdown, HTML, and JSON.";

/** Short form, for the social card. */
export const SITE_TAGLINE =
  "Block-based markdown, saved as you type, exported in one click.";

/** Every route is locale-prefixed, so no page lives at the bare origin. */
export function localeUrl(locale: string) {
  return `${BASE_URL}/${locale}`;
}

/** Open Graph wants a full territory tag; the routes only carry the prefix. */
const OG_LOCALES: Record<string, string> = { en: "en_US", vi: "vi_VN" };

export function ogLocale(locale: string) {
  return OG_LOCALES[locale] ?? OG_LOCALES[fallbackLng];
}
