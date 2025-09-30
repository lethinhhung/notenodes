"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useTheme } from "next-themes";

// Our <Editor> component we can reuse later
export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();
  const { theme, systemTheme } = useTheme();

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      theme={
        theme === "system" ? systemTheme : theme === "light" ? "light" : "dark"
      }
    />
  );
}
