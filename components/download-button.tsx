"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/lib/hooks";
import { blocksToMarkdown, blocksToHTML, type Block } from "@/lib/utils/export";

export function DownloadButton() {
  const editorContent = useAppSelector((state) => state.editor.content);

  const handleExport = async (format: "markdown" | "json" | "html") => {
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === "markdown") {
        content = blocksToMarkdown(editorContent as Block[]);
        filename = `note-${Date.now()}.md`;
        mimeType = "text/markdown";
      } else if (format === "html") {
        content = blocksToHTML(editorContent as Block[]);
        filename = `note-${Date.now()}.html`;
        mimeType = "text/html";
      } else {
        content = JSON.stringify(editorContent, null, 2);
        filename = `note-${Date.now()}.json`;
        mimeType = "application/json";
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
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
          <Download />
          <span className="sr-only">Download content</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("markdown")}>
          Download Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("html")}>
          Download HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          Download JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
