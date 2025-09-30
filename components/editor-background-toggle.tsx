"use client";

import { Square, SquareDashed } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleMuted } from "@/lib/features/editor/editorSlice";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function EditorBackgroundToggle() {
  const dispatch = useAppDispatch();
  const isMuted = useAppSelector((state) => state.editor.isMuted);

  useEffect(() => {
    const stored = localStorage.getItem("editor-background");
    if (stored !== null) {
      const isStoredMuted = stored === "muted";
      if (isStoredMuted !== isMuted) {
        dispatch(toggleMuted());
      }
    }
  }, []);

  const handleToggle = () => {
    dispatch(toggleMuted());
    localStorage.setItem("editor-background", isMuted ? "default" : "muted");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="!bg-background shadow-md"
    >
      <SquareDashed
        className="scale-100 rotate-0 transition-all data-[muted=true]:scale-0 data-[muted=true]:-rotate-90"
        data-muted={isMuted}
      />
      <Square
        className="absolute scale-0 rotate-90 transition-all data-[muted=true]:scale-100 data-[muted=true]:rotate-0"
        data-muted={isMuted}
      />
      <span className="sr-only">Toggle editor background</span>
    </Button>
  );
}
