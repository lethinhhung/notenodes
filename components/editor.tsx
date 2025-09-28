"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { CodeNode, CodeHighlightNode, $createCodeNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_MODIFIER_COMMAND,
  $getSelection,
  $isRangeSelection,
  TextNode,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  COMMAND_PRIORITY_HIGH,
  LexicalEditor,
  $isTextNode,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import type { EditorTranslations } from "@/lib/editor-translations";

const theme = {
  paragraph: "mb-1 text-[15px] leading-relaxed",
  heading: {
    h1: "text-4xl font-bold mb-2 mt-8",
    h2: "text-3xl font-bold mb-2 mt-6",
    h3: "text-2xl font-bold mb-2 mt-4",
  },
  list: {
    ul: "list-disc ml-5 mb-2",
    ol: "list-decimal ml-5 mb-2",
    listitem: "mb-1",
  },
  quote: "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300",
  code: "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm",
  codeHighlight: {
    atrule: "text-blue-600",
    attr: "text-blue-600",
    boolean: "text-red-600",
    builtin: "text-purple-600",
    cdata: "text-gray-600",
    char: "text-green-600",
    class: "text-purple-600",
    "class-name": "text-purple-600",
    comment: "text-gray-500 italic",
    constant: "text-red-600",
    deleted: "text-red-600",
    doctype: "text-gray-600",
    entity: "text-orange-600",
    function: "text-blue-600",
    important: "text-red-600",
    inserted: "text-green-600",
    keyword: "text-purple-600",
    namespace: "text-purple-600",
    number: "text-red-600",
    operator: "text-gray-700",
    prolog: "text-gray-600",
    property: "text-blue-600",
    punctuation: "text-gray-700",
    regex: "text-orange-600",
    selector: "text-green-600",
    string: "text-green-600",
    symbol: "text-red-600",
    tag: "text-blue-600",
    url: "text-orange-600",
    variable: "text-orange-600",
  },
  link: "text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-300",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm",
  },
};

interface SlashMenuItem {
  title: string;
  description: string;
  keywords: string[];
  onSelect: (editor: LexicalEditor) => void;
  icon: string;
}

function createSlashMenuItems(translations: EditorTranslations): SlashMenuItem[] {
  return [
    {
      title: translations.slashMenu.heading1.title,
      description: translations.slashMenu.heading1.description,
      keywords: ["h1", "heading", "title", "large"],
      icon: "H1",
      onSelect: (editor) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h1"));
          }
        });
      },
    },
    {
      title: translations.slashMenu.heading2.title,
      description: translations.slashMenu.heading2.description,
      keywords: ["h2", "heading", "subtitle", "medium"],
      icon: "H2",
      onSelect: (editor) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h2"));
          }
        });
      },
    },
    {
      title: translations.slashMenu.heading3.title,
      description: translations.slashMenu.heading3.description,
      keywords: ["h3", "heading", "small"],
      icon: "H3",
      onSelect: (editor) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h3"));
          }
        });
      },
    },
    {
      title: translations.slashMenu.bulletedList.title,
      description: translations.slashMenu.bulletedList.description,
      keywords: ["ul", "list", "bullet", "unordered"],
      icon: "•",
      onSelect: (editor) => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      },
    },
    {
      title: translations.slashMenu.numberedList.title,
      description: translations.slashMenu.numberedList.description,
      keywords: ["ol", "list", "number", "ordered"],
      icon: "1.",
      onSelect: (editor) => {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      },
    },
    {
      title: translations.slashMenu.quote.title,
      description: translations.slashMenu.quote.description,
      keywords: ["quote", "blockquote", "citation"],
      icon: "❝",
      onSelect: (editor) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        });
      },
    },
    {
      title: translations.slashMenu.codeBlock.title,
      description: translations.slashMenu.codeBlock.description,
      keywords: ["code", "codeblock", "snippet", "programming"],
      icon: "</>",
      onSelect: (editor) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createCodeNode());
          }
        });
      },
    },
  ];
}

function SlashCommandPlugin({ slashMenuItems }: { slashMenuItems: SlashMenuItem[] }) {
  const [editor] = useLexicalComposerContext();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = slashMenuItems.filter((item) => {
    const searchStr = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchStr) ||
      item.description.toLowerCase().includes(searchStr) ||
      item.keywords.some((keyword) => keyword.includes(searchStr))
    );
  });

  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems.length, selectedIndex]);

  const scrollToItem = useCallback((node: HTMLButtonElement | null) => {
    if (node) {
      node.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const selectItem = useCallback(
    (index: number) => {
      const item = filteredItems[index];
      if (item) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchor = selection.anchor;
            const node = anchor.getNode();
            const text = node.getTextContent();
            const offset = anchor.offset;

            const textUpToCursor = text.substring(0, offset);
            const slashIndex = textUpToCursor.lastIndexOf("/");

            if (slashIndex !== -1 && $isTextNode(node)) {
              const textNode = node as TextNode;
              textNode.select(slashIndex, offset);
              const newSelection = $getSelection();
              if ($isRangeSelection(newSelection)) {
                newSelection.removeText();
              }
            }
          }
        });

        item.onSelect(editor);
        closeMenu();
      }
    },
    [editor, filteredItems, closeMenu]
  );

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          if (showMenu) closeMenu();
          return;
        }

        const node = selection.anchor.getNode();
        const text = node.getTextContent();
        const offset = selection.anchor.offset;

        const textUpToCursor = text.substring(0, offset);
        const lastSlashIndex = textUpToCursor.lastIndexOf("/");

        if (lastSlashIndex === -1) {
          if (showMenu) closeMenu();
          return;
        }

        const textBeforeSlash = textUpToCursor.substring(0, lastSlashIndex);
        const isAtStart = lastSlashIndex === 0 || textBeforeSlash.match(/^\s*$/);

        if (!isAtStart) {
          if (showMenu) closeMenu();
          return;
        }

        const queryAfterSlash = textUpToCursor.substring(lastSlashIndex + 1);

        setQuery(queryAfterSlash);

        if (!showMenu) {
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const range = domSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setMenuPosition({
              top: rect.bottom + window.scrollY + 5,
              left: rect.left + window.scrollX,
            });
          }
          setShowMenu(true);
        }
      });
    });
  }, [editor, showMenu, closeMenu]);

  useEffect(() => {
    if (!showMenu) return;

    const removeArrowDown = editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      (event) => {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    const removeArrowUp = editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      (event) => {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    const removeEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        event?.preventDefault();
        selectItem(selectedIndex);
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    const removeEscape = editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        closeMenu();
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      removeArrowDown();
      removeArrowUp();
      removeEnter();
      removeEscape();
    };
  }, [showMenu, selectedIndex, filteredItems.length, editor, selectItem, closeMenu]);

  if (!showMenu || filteredItems.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[300px] max-h-[400px] overflow-y-auto"
      style={{ top: menuPosition.top, left: menuPosition.left }}
    >
      {filteredItems.map((item, index) => (
        <button
          key={item.title}
          ref={index === selectedIndex ? scrollToItem : null}
          className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            index === selectedIndex ? "bg-gray-100 dark:bg-gray-700" : ""
          }`}
          onClick={() => selectItem(index)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 dark:text-gray-100">{item.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function KeyboardShortcutsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event = payload as KeyboardEvent;
        const { code, ctrlKey, metaKey } = event;

        if (ctrlKey || metaKey) {
          switch (code) {
            case "KeyB":
              event.preventDefault();
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
              return true;
            case "KeyI":
              event.preventDefault();
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
              return true;
            case "KeyU":
              event.preventDefault();
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
              return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}

function AutoSavePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const savedState = localStorage.getItem("editorState");
    if (savedState) {
      try {
        const state = editor.parseEditorState(savedState);
        editor.setEditorState(state);
      } catch (error) {
        console.error("Failed to load saved state:", error);
      }
    }

    return editor.registerUpdateListener(({ editorState }) => {
      const json = editorState.toJSON();
      localStorage.setItem("editorState", JSON.stringify(json));
    });
  }, [editor]);

  return null;
}

function onError(error: Error) {
  console.error(error);
}

export function Editor({ translations }: { translations: EditorTranslations }) {
  const [title, setTitle] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTitle = localStorage.getItem("editorTitle");
    if (savedTitle) {
      setTitle(savedTitle);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("editorTitle", title);
    }
  }, [title, isLoaded]);

  const slashMenuItems = useMemo(() => createSlashMenuItems(translations), [translations]);

  const initialConfig = {
    namespace: "NoteNodesEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
    ],
  };

  return (
    <div className="max-w-[900px] mx-auto px-24 py-12">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={translations.titlePlaceholder}
        className="w-full text-5xl font-bold mb-4 outline-none bg-transparent border-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
      />

      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[500px] outline-none text-gray-900 dark:text-gray-100" />
            }
            placeholder={
              <div className="absolute top-0 left-0 text-gray-400 pointer-events-none text-[15px]">
                {translations.contentPlaceholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <KeyboardShortcutsPlugin />
          <AutoSavePlugin />
          <SlashCommandPlugin slashMenuItems={slashMenuItems} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </LexicalComposer>
    </div>
  );
}