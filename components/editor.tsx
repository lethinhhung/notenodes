"use client";

import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import type { EditorTranslations } from "@/lib/editor-translations";

export function Editor({ translations }: { translations: EditorTranslations }) {
  const { resolvedTheme } = useTheme();
  const [initialContent, setInitialContent] = useState<any[] | undefined>(
    undefined
  );

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      try {
        const content = JSON.parse(savedContent);
        setInitialContent(content);
      } catch (error) {
        console.error("Failed to load saved content:", error);
      }
    }
  }, []);

  const slashMenuItems = useMemo(
    () => [
      {
        name: translations.slashMenu.heading1.title,
        hint: translations.slashMenu.heading1.description,
      },
      {
        name: translations.slashMenu.heading2.title,
        hint: translations.slashMenu.heading2.description,
      },
      {
        name: translations.slashMenu.heading3.title,
        hint: translations.slashMenu.heading3.description,
      },
      {
        name: translations.slashMenu.bulletedList.title,
        hint: translations.slashMenu.bulletedList.description,
      },
      {
        name: translations.slashMenu.numberedList.title,
        hint: translations.slashMenu.numberedList.description,
      },
      {
        name: translations.slashMenu.quote.title,
        hint: translations.slashMenu.quote.description,
      },
      {
        name: translations.slashMenu.codeBlock.title,
        hint: translations.slashMenu.codeBlock.description,
      },
    ],
    [translations]
  );

  const editor = useCreateBlockNote({
    initialContent: initialContent,
  });

  const handleEditorChange = () => {
    if (typeof window !== "undefined" && editor) {
      const content = editor.document;
      localStorage.setItem("editorContent", JSON.stringify(content));
    }
  };

  return (
    <BlockNoteView
      className="max-w-5xl mx-auto py-4"
      editor={editor}
      onChange={handleEditorChange}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      data-theming-css
      data-theming-css-variables-dark
    ></BlockNoteView>
  );
}
