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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TechStackInfo() {
  return (
    <Tooltip>
      <Dialog>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-black/5 dark:border-white/5 shadow-lg hover:bg-black/20 dark:hover:bg-white/20 hover:shadow-xl hover:border-transparent active:scale-95 transition-all duration-300 ease-out h-12 w-12 [&_svg]:!size-5"
            >
              <Info />
              <span className="sr-only">Tech stack information</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white/80 dark:bg-black/80 backdrop-blur-xl border-black/10 dark:border-white/10 shadow-lg rounded-3xl">
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
      <TooltipContent>About this project</TooltipContent>
    </Tooltip>
  );
}
