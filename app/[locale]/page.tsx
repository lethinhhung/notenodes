import { ModeToggle } from "@/components/mode-toggle";
// import { LanguageToggle } from "@/components/language-toggle";
import { Editor } from "@/components/dynamic-editor";
import { EditorBackgroundToggle } from "@/components/editor-background-toggle";
import { GridToggle } from "@/components/grid-toggle";
import { CopyButton } from "@/components/copy-button";
import { DownloadButton } from "@/components/download-button";
import { ImportButton } from "@/components/import-button";
// import { CustomScrollbar } from "@/components/custom-scrollbar";
import { TechStackInfo } from "@/components/tech-stack-info";

export default async function Home() {
  return (
    <div className="h-screen overflow-auto">
      <div className="min-h-screen relative">
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
          <ImportButton />
          <CopyButton />
          <DownloadButton />
          <GridToggle />
          <EditorBackgroundToggle />
          <ModeToggle />
          {/* <LanguageToggle /> */}
          <TechStackInfo />
        </div>
        <Editor />
      </div>
    </div>
  );
}
