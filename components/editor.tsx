"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useMemo } from "react";

// Our <Editor> component we can reuse later
export default function Editor() {
  const { theme, systemTheme } = useTheme();
  const isMuted = useAppSelector((state) => state.editor.isMuted);

  // Load initial content from localStorage
  const initialContent = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const stored = localStorage.getItem("editor-content");
    return stored ? JSON.parse(stored) : undefined;
  }, []);

  // Creates a new editor instance with initial content
  const editor = useCreateBlockNote({ initialContent });

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Save content to localStorage on change
  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      localStorage.setItem("editor-content", JSON.stringify(editor.document));
    };

    // Listen to editor changes
    editor.onEditorContentChange(handleChange);
  }, [editor]);

  // Renders the editor instance using a React component.
  return (
    <div
      className={`max-w-5xl mx-auto p-4 [&_.bn-editor]:!pt-16 [&_.bn-editor]:!pb-100 
        [&_[data-node-type='codeBlock']]:!text-foreground [&_pre]:!text-foreground [&_[data-node-type='codeBlock']]:!rounded-md [&_pre]:!rounded-md 
        [&_.bn-editor]:!border [&_.bn-editor]:!border-transparent [&_.bn-editor]:hover:!border-dashed [&_.bn-editor]:hover:!border-border 
        ${
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
