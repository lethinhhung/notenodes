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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setContent } from "@/lib/features/editor/editorSlice";
import {
  parseJSONContent,
  parseMarkdownContent,
  parsePlainTextContent,
  parseHTMLContent,
} from "@/lib/utils/import";
import { toast } from "sonner";
import { useRef, useState } from "react";

type ImportFormat = "json" | "markdown" | "text" | "html";

export function ImportButton() {
  const dispatch = useAppDispatch();
  const editorContent = useAppSelector((state) => state.editor.content);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formatRef = useRef<ImportFormat>("json");
  const pendingContentRef = useRef<{
    blocks: unknown[];
    formatLabel: string;
  } | null>(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleFileSelect = (format: ImportFormat) => {
    formatRef.current = format;

    // Trigger file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset to allow selecting the same file again
      fileInputRef.current.click();
    }
  };

  const applyImport = () => {
    if (!pendingContentRef.current) return;

    const { blocks, formatLabel } = pendingContentRef.current;

    // Update editor content
    dispatch(setContent(blocks));

    // Update localStorage to sync with editor
    localStorage.setItem("editor-content", JSON.stringify(blocks));

    toast.success(`Imported from ${formatLabel}`);

    // Reset
    pendingContentRef.current = null;
    setShowConfirmDialog(false);
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
      } else if (
        format === "markdown" &&
        !["md", "markdown"].includes(fileExtension || "")
      ) {
        toast.error("Please select a Markdown file (.md)");
        return;
      } else if (
        format === "html" &&
        !["html", "htm"].includes(fileExtension || "")
      ) {
        toast.error("Please select an HTML file (.html)");
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
      } else if (format === "html") {
        blocks = parseHTMLContent(content);
        formatLabel = "HTML";
      } else {
        blocks = parsePlainTextContent(content);
        formatLabel = "Text";
      }

      // Check if there's existing content
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
          // Store pending content and show dialog
          pendingContentRef.current = { blocks, formatLabel };
          setShowConfirmDialog(true);
          return;
        }
      }

      // No existing content, apply directly
      dispatch(setContent(blocks));
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
        accept=".json,.md,.markdown,.html,.htm,.txt"
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
          <DropdownMenuItem onClick={() => handleFileSelect("markdown")}>
            Import Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect("html")}>
            Import HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect("text")}>
            Import Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect("json")}>
            Import JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace existing content?</DialogTitle>
            <DialogDescription>
              This will replace your current note content with the imported
              file. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={applyImport}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
