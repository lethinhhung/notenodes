import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { fallbackLng, languages } from "@/lib/i18n/settings";
import {
  BASE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  localeUrl,
  ogLocale,
} from "@/lib/site";
import StoreProvider from "@/app/StoreProvider";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Every route is locale-prefixed, so the canonical and og:url have to name the
// locale being served — a static metadata object would point /vi at /en's URL.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(BASE_URL),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    keywords: [
      "markdown editor",
      "note-taking",
      "block editor",
      "auto-save",
      "lightweight editor",
      "markdown export",
    ],
    // Inline SVG so there is no icon request at all. opengraph-image.tsx
    // supplies the social card, and Next wires it into both openGraph and
    // twitter for us.
    icons: {
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📝</text></svg>",
    },
    alternates: {
      canonical: localeUrl(locale),
      // /en and /vi are one page under two prefixes. hreflang is what stops a
      // crawler reading the second as a duplicate of the first.
      languages: {
        ...Object.fromEntries(languages.map((l) => [l, localeUrl(l)])),
        "x-default": localeUrl(fallbackLng),
      },
    },
    openGraph: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: localeUrl(locale),
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const fontClasses =
    locale === "vi" ? "" : `${geistSans.variable} ${geistMono.variable}`;
  return (
    <html lang={locale} suppressHydrationWarning spellCheck={false}>
      <body className={`${fontClasses} antialiased`} spellCheck={false}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            {children}
            <Toaster />
            <Analytics />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
