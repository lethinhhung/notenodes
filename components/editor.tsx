"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useTheme } from "next-themes";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setContent } from "@/lib/features/editor/editorSlice";
import { useEffect, useMemo, useRef, useCallback } from "react";

// Our <Editor> component we can reuse later
export default function Editor() {
  const { theme, systemTheme } = useTheme();
  const dispatch = useAppDispatch();
  const backgroundMode = useAppSelector((state) => state.editor.backgroundMode);
  const reduxContent = useAppSelector((state) => state.editor.content);

  // Ref to track if we're updating from external source (import)
  const isExternalUpdate = useRef(false);

  // Load initial content from localStorage
  const initialContent = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const stored = localStorage.getItem("editor-content");
    return stored ? JSON.parse(stored) : undefined;
  }, []);

  // Creates a new editor instance with initial content
  const editor = useCreateBlockNote({ initialContent });

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Initialize Redux state with localStorage content on mount
  useEffect(() => {
    if (!editor) return;

    // Set initial content to Redux
    if (initialContent) {
      dispatch(setContent(initialContent));
    }

    const handleChange = () => {
      // Skip if this change came from external update
      if (isExternalUpdate.current) {
        isExternalUpdate.current = false;
        return;
      }

      const content = editor.document;
      localStorage.setItem("editor-content", JSON.stringify(content));
      dispatch(setContent(content));
    };

    // Listen to editor changes
    return editor.onChange(handleChange);
  }, [editor, dispatch, initialContent]);

  // Update editor when Redux content changes externally (e.g., from import)
  useEffect(() => {
    if (!editor) return;

    // Check if this is an external update (from import, not from editor onChange)
    const currentEditorContent = JSON.stringify(editor.document);
    const newReduxContent = JSON.stringify(reduxContent);

    // Only update if content actually changed and it's different from current editor content
    if (
      newReduxContent !== currentEditorContent &&
      Array.isArray(reduxContent) &&
      reduxContent.length > 0
    ) {
      isExternalUpdate.current = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editor.replaceBlocks(editor.document, reduxContent as any);
    }
  }, [editor, reduxContent]);

  // Prevent page scroll when navigating slash menu with arrow keys
  useEffect(() => {
    let isMenuOpen = false;
    let scrollLocked = false;
    let lastScrollTop = 0;

    const getScrollContainer = () =>
      document.querySelector('.h-screen.overflow-auto') as HTMLElement | null;

    const checkMenuOpen = () => {
      const menu = document.querySelector('.bn-suggestion-menu, .bn-grid-suggestion-menu');
      return !!menu;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      isMenuOpen = checkMenuOpen();

      if (isMenuOpen && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        const container = getScrollContainer();
        if (container) {
          lastScrollTop = container.scrollTop;
          scrollLocked = true;
        }
      }
    };

    const handleScroll = (e: Event) => {
      if (scrollLocked) {
        const container = e.target as HTMLElement;
        container.scrollTop = lastScrollTop;
        scrollLocked = false;
      }
    };

    // Observe DOM changes to detect when suggestion menu opens/closes
    const observer = new MutationObserver(() => {
      isMenuOpen = checkMenuOpen();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("keydown", handleKeyDown, { capture: true });

    const container = getScrollContainer();
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: false });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      observer.disconnect();
    };
  }, []);

  const getBackgroundClasses = useCallback(() => {
    switch (backgroundMode) {
      case "muted":
        return "[&_.bn-editor]:!bg-secondary [&_.bn-block-content]:!bg-secondary [&_[data-node-type='codeBlock']]:!bg-background [&_pre]:!bg-background";
      case "glass":
        return "[&_.bn-editor]:!bg-white/5 dark:[&_.bn-editor]:!bg-black/5 [&_.bn-editor]:!backdrop-blur-xs [&_.bn-editor]:!border-black/10 dark:[&_.bn-editor]:!border-white/10 [&_.bn-editor]:!shadow-lg [&_.bn-editor]:!rounded-2xl [&_.bn-block-content]:!bg-transparent [&_[data-node-type='codeBlock']]:!bg-black/5 dark:[&_[data-node-type='codeBlock']]:!bg-white/5 [&_pre]:!bg-black/5 dark:[&_pre]:!bg-white/5";
      default:
        return "[&_.bn-editor]:!bg-background [&_.bn-block-content]:!bg-background [&_[data-node-type='codeBlock']]:!bg-secondary [&_pre]:!bg-secondary";
    }
  }, [backgroundMode]);

  // Renders the editor instance using a React component.
  return (
    <div
      className={`max-w-5xl mx-auto p-2 md:p-4 [&_.bn-editor]:!pt-16 [&_.bn-editor]:!pb-100
        [&_[data-node-type='codeBlock']]:!text-foreground [&_pre]:!text-foreground [&_[data-node-type='codeBlock']]:!rounded-md [&_pre]:!rounded-md
        ${backgroundMode === "glass"
          ? "[&_.bn-editor]:!border [&_.bn-editor]:!border-solid"
          : "[&_.bn-editor]:!border [&_.bn-editor]:!border-transparent [&_.bn-editor]:hover:!border-dashed [&_.bn-editor]:hover:!border-border"}
        ${getBackgroundClasses()}`}
    >
      <BlockNoteView
        editor={editor}
        theme={currentTheme === "light" ? "light" : "dark"}
      />
    </div>
  );
}
