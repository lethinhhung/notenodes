import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { languages } from "@/lib/i18n/settings";
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

const BASE_URL = "https://notenodes.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "NoteNodes — Quick Markdown Editor",
  description:
    "A fast, lightweight markdown editor with block-based architecture, instant auto-save, and one-click export to Markdown, HTML, and JSON.",
  keywords: [
    "markdown editor",
    "note-taking",
    "block editor",
    "auto-save",
    "lightweight editor",
    "markdown export",
  ],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📝</text></svg>",
  },
  openGraph: {
    title: "NoteNodes — Quick Markdown Editor",
    description:
      "A fast, lightweight markdown editor with block-based architecture, instant auto-save, and one-click export to Markdown, HTML, and JSON.",
    url: BASE_URL,
    siteName: "NoteNodes",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteNodes — Quick Markdown Editor",
    description:
      "A fast, lightweight markdown editor with block-based architecture, instant auto-save, and one-click export to Markdown, HTML, and JSON.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
