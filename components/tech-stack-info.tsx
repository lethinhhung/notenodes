"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TechStackInfo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="!bg-background shadow-md"
        >
          <Info />
          <span className="sr-only">Tech stack information</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>About this project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">Framework</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Next.js 15 (App Router)</li>
              <li>React 19</li>
              <li>TypeScript</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Styling</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Tailwind CSS v4</li>
              <li>shadcn/ui components (New York style)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Editor</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>BlockNote Editor</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Internationalization (react-i18next)</li>
              <li>Dark/Light theme (next-themes)</li>
              <li>State management (Redux Toolkit)</li>
              <li>Export to Markdown, HTML, JSON</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
