"use client";

import dynamic from "next/dynamic";
import type { EditorTranslations } from "@/lib/editor-translations";

const Editor = dynamic(() => import("./editor").then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="max-w-5xl mx-auto px-4 py-16 min-h-screen">Loading editor...</div>
});

export function EditorWrapper({ translations }: { translations: EditorTranslations }) {
  return <Editor translations={translations} />;
}