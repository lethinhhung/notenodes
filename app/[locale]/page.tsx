import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Editor } from "@/components/dynamic-editor";
import { EditorBackgroundToggle } from "@/components/editor-background-toggle";

export default async function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <EditorBackgroundToggle />
        <ModeToggle />
        <LanguageToggle />
      </div>
      <Editor />
    </div>
  );
}
