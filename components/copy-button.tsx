"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/lib/hooks";
import { blocksToMarkdown, blocksToHTML } from "@/lib/utils/export";

export function CopyButton() {
  const editorContent = useAppSelector((state) => state.editor.content);

  const handleCopy = async (format: "markdown" | "json" | "html") => {
    try {
      let content: string;

      if (format === "markdown") {
        content = blocksToMarkdown(editorContent);
      } else if (format === "html") {
        content = blocksToHTML(editorContent);
      } else {
        content = JSON.stringify(editorContent, null, 2);
      }

      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="!bg-background shadow-md"
        >
          <Copy />
          <span className="sr-only">Copy content</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleCopy("markdown")}>
          Copy as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopy("html")}>
          Copy as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopy("json")}>
          Copy as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
