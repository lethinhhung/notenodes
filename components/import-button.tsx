"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setContent } from "@/lib/features/editor/editorSlice";
import {
  parseJSONContent,
  parseMarkdownContent,
  parsePlainTextContent,
} from "@/lib/utils/import";
import { toast } from "sonner";
import { useRef } from "react";

export function ImportButton() {
  const dispatch = useAppDispatch();
  const editorContent = useAppSelector((state) => state.editor.content);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formatRef = useRef<"json" | "markdown" | "text">("json");

  const handleFileSelect = (format: "json" | "markdown" | "text") => {
    formatRef.current = format;

    // Trigger file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset to allow selecting the same file again
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const format = formatRef.current;

    try {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file extension
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (format === "json" && fileExtension !== "json") {
        toast.error("Please select a JSON file (.json)");
        return;
      } else if (format === "markdown" && !["md", "markdown"].includes(fileExtension || "")) {
        toast.error("Please select a Markdown file (.md)");
        return;
      } else if (format === "text" && fileExtension !== "txt") {
        toast.error("Please select a text file (.txt)");
        return;
      }

      // Read file content
      const content = await file.text();

      // Parse content based on format
      let blocks;
      let formatLabel: string;

      if (format === "json") {
        blocks = parseJSONContent(content);
        formatLabel = "JSON";
      } else if (format === "markdown") {
        blocks = parseMarkdownContent(content);
        formatLabel = "Markdown";
      } else {
        blocks = parsePlainTextContent(content);
        formatLabel = "Text";
      }

      // Confirm if there's existing content
      if (Array.isArray(editorContent) && editorContent.length > 0) {
        const hasContent = editorContent.some(
          (block: unknown) =>
            typeof block === "object" &&
            block !== null &&
            "content" in block &&
            Array.isArray(block.content) &&
            block.content.some(
              (c: unknown) =>
                typeof c === "object" &&
                c !== null &&
                "text" in c &&
                typeof c.text === "string" &&
                c.text.trim() !== ""
            )
        );

        if (hasContent) {
          const confirmed = window.confirm(
            "This will replace your current content. Continue?"
          );
          if (!confirmed) {
            return;
          }
        }
      }

      // Update editor content
      dispatch(setContent(blocks));

      // Update localStorage to sync with editor
      localStorage.setItem("editor-content", JSON.stringify(blocks));

      toast.success(`Imported from ${formatLabel}`);
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to import file"
      );
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".json,.md,.markdown,.txt"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="!bg-background shadow-md"
          >
            <Upload />
            <span className="sr-only">Import content</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleFileSelect("json")}>
            Import JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect("markdown")}>
            Import Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect("text")}>
            Import Text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
