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
      className={
        isMuted
          ? "[&_.bn-editor]:!bg-secondary [&_.bn-block-content]:!bg-secondary"
          : "[&_.bn-editor]:!bg-background [&_.bn-block-content]:!bg-background"
      }
    >
      <BlockNoteView
        editor={editor}
        theme={currentTheme === "light" ? "light" : "dark"}
      />
    </div>
  );
}
