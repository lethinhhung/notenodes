import { ModeToggle } from "@/components/mode-toggle";
// import { LanguageToggle } from "@/components/language-toggle";
import { Editor } from "@/components/dynamic-editor";
import { EditorBackgroundToggle } from "@/components/editor-background-toggle";
import { CopyButton } from "@/components/copy-button";
import { DownloadButton } from "@/components/download-button";
import { CustomScrollbar } from "@/components/custom-scrollbar";
import { TechStackInfo } from "@/components/tech-stack-info";

export default async function Home() {
  return (
    <CustomScrollbar className="h-screen">
      <div className="min-h-screen relative">
        <div className="fixed top-8 right-8 z-50 flex gap-2">
          <TechStackInfo />
          <CopyButton />
          <DownloadButton />
          <EditorBackgroundToggle />
          <ModeToggle />
          {/* <LanguageToggle /> */}
        </div>
        <Editor />
      </div>
    </CustomScrollbar>
  );
}
