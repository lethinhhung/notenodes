import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Editor } from "@/components/dynamic-editor";
import { EditorBackgroundToggle } from "@/components/editor-background-toggle";
import { CopyButton } from "@/components/copy-button";
import { DownloadButton } from "@/components/download-button";

export default async function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <CopyButton />
        <DownloadButton />
        <EditorBackgroundToggle />
        <ModeToggle />
        <LanguageToggle />
      </div>
      <Editor />
    </div>
  );
}
