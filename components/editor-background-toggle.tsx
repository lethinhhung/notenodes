"use client";

import * as React from "react";
import { Square, SquareDashed } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleMuted } from "@/lib/features/editor/editorSlice";

import { Button } from "@/components/ui/button";

export function EditorBackgroundToggle() {
  const dispatch = useAppDispatch();
  const isMuted = useAppSelector((state) => state.editor.isMuted);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => dispatch(toggleMuted())}
    >
      <Square
        className="scale-100 rotate-0 transition-all data-[muted=true]:scale-0 data-[muted=true]:-rotate-90"
        data-muted={isMuted}
      />
      <SquareDashed
        className="absolute scale-0 rotate-90 transition-all data-[muted=true]:scale-100 data-[muted=true]:rotate-0"
        data-muted={isMuted}
      />
      <span className="sr-only">Toggle editor background</span>
    </Button>
  );
}
