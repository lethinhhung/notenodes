"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector } from "@/lib/hooks";
import {
  blocksToMarkdown,
  blocksToHTML,
  blocksToPlainText,
  type Block,
} from "@/lib/utils/export";
import { toast } from "sonner";

export function DownloadButton() {
  const editorContent = useAppSelector((state) => state.editor.content);

  const handleExport = async (
    format: "markdown" | "json" | "html" | "text"
  ) => {
    try {
      let content: string;
      let filename: string;
      let mimeType: string;
      let formatLabel: string;

      // Ensure editorContent is an array
      const blocks = Array.isArray(editorContent) ? editorContent : [];

      if (format === "markdown") {
        content = blocksToMarkdown(blocks as Block[]);
        filename = `notenodes-${Date.now()}.md`;
        mimeType = "text/markdown";
        formatLabel = "Markdown";
      } else if (format === "html") {
        content = blocksToHTML(blocks as Block[]);
        filename = `notenodes-${Date.now()}.html`;
        mimeType = "text/html";
        formatLabel = "HTML";
      } else if (format === "text") {
        content = blocksToPlainText(blocks as Block[]);
        filename = `notenodes-${Date.now()}.txt`;
        mimeType = "text/plain";
        formatLabel = "Text";
      } else {
        content = JSON.stringify(blocks, null, 2);
        filename = `notenodes-${Date.now()}.json`;
        mimeType = "application/json";
        formatLabel = "JSON";
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

      toast.success(`Downloaded as ${formatLabel}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to download content");
    }
  };

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-black/5 dark:border-white/5 shadow-lg hover:bg-black/20 dark:hover:bg-white/20 hover:shadow-xl hover:border-transparent active:scale-95 transition-all duration-300 ease-out h-12 w-12 [&_svg]:!size-5"
            >
              <Upload />
              <span className="sr-only">Download content</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport("markdown")}>
            Download Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("html")}>
            Download HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("text")}>
            Download Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("json")}>
            Download JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent>Download content</TooltipContent>
    </Tooltip>
  );
}
