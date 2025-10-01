import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { languages } from "@/lib/i18n/settings";
import StoreProvider from "@/app/StoreProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Note Nodes",
  description: "A note-taking app",
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
            <Analytics />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
