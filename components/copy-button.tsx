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
import {
  blocksToMarkdown,
  blocksToHTML,
  blocksToPlainText,
  type Block,
} from "@/lib/utils/export";
import { toast } from "sonner";

export function CopyButton() {
  const editorContent = useAppSelector((state) => state.editor.content);

  const handleCopy = async (format: "markdown" | "json" | "html" | "text") => {
    try {
      let content: string;
      let formatLabel: string;

      // Ensure editorContent is an array
      const blocks = Array.isArray(editorContent) ? editorContent : [];

      if (format === "markdown") {
        content = blocksToMarkdown(blocks as Block[]);
        formatLabel = "Markdown";
      } else if (format === "html") {
        content = blocksToHTML(blocks as Block[]);
        formatLabel = "HTML";
      } else if (format === "text") {
        content = blocksToPlainText(blocks as Block[]);
        formatLabel = "Text";
      } else {
        content = JSON.stringify(blocks, null, 2);
        formatLabel = "JSON";
      }

      await navigator.clipboard.writeText(content);
      toast.success(`Copied as ${formatLabel}`);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy content");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-black/5 dark:border-white/5 shadow-lg hover:bg-black/20 dark:hover:bg-white/20 hover:shadow-xl hover:border-transparent active:scale-95 transition-all duration-300 ease-out h-12 w-12 [&_svg]:!size-5"
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
        <DropdownMenuItem onClick={() => handleCopy("text")}>
          Copy as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopy("json")}>
          Copy as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
