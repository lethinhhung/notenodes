import type { MetadataRoute } from "next";
import { languages } from "@/lib/i18n/settings";
import { localeUrl } from "@/lib/site";

// One entry per locale: middleware redirects the bare origin to one of these,
// so there is no unprefixed URL worth listing.
export default function sitemap(): MetadataRoute.Sitemap {
  return languages.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  }));
}
