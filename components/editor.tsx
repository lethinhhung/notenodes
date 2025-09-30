"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/lib/hooks";

// Our <Editor> component we can reuse later
export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();
  const { theme, systemTheme } = useTheme();
  const isMuted = useAppSelector((state) => state.editor.isMuted);

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Renders the editor instance using a React component.
  return (
    <div
      className={`max-w-5xl mx-auto p-4 [&_.bn-editor]:!pt-16 [&_.bn-editor]:!pb-100 ${
        isMuted
          ? "[&_.bn-editor]:!bg-secondary [&_.bn-block-content]:!bg-secondary [&_[data-node-type='codeBlock']]:!bg-background [&_pre]:!bg-background"
          : "[&_.bn-editor]:!bg-background [&_.bn-block-content]:!bg-background [&_[data-node-type='codeBlock']]:!bg-secondary [&_pre]:!bg-secondary"
      }`}
    >
      <BlockNoteView
        editor={editor}
        theme={currentTheme === "light" ? "light" : "dark"}
      />
    </div>
  );
}
