"use client";

import { Square, SquareDashed, Blend } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  cycleBackgroundMode,
  setBackgroundMode,
  EditorBackgroundMode,
} from "@/lib/features/editor/editorSlice";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";

export function EditorBackgroundToggle() {
  const dispatch = useAppDispatch();
  const backgroundMode = useAppSelector((state) => state.editor.backgroundMode);

  useEffect(() => {
    const stored = localStorage.getItem("editor-background");
    if (stored !== null && ["default", "muted", "glass"].includes(stored)) {
      if (stored !== backgroundMode) {
        dispatch(setBackgroundMode(stored as EditorBackgroundMode));
      }
    }
  }, [dispatch, backgroundMode]);

  const handleToggle = () => {
    const modes: EditorBackgroundMode[] = ["default", "muted", "glass"];
    const currentIndex = modes.indexOf(backgroundMode);
    const newMode = modes[(currentIndex + 1) % modes.length];

    dispatch(cycleBackgroundMode());
    localStorage.setItem("editor-background", newMode);

    const messages = {
      default: "Default background",
      muted: "Muted background",
      glass: "Liquid glass background",
    };
    toast.success(messages[newMode]);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-black/5 dark:border-white/5 shadow-lg hover:bg-black/20 dark:hover:bg-white/20 hover:shadow-xl hover:border-transparent active:scale-95 transition-all duration-300 ease-out h-12 w-12 [&_svg]:!size-5"
    >
      <Square
        className="absolute transition-all duration-300"
        style={{
          transform: backgroundMode === "default" ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)",
          opacity: backgroundMode === "default" ? 1 : 0,
        }}
      />
      <SquareDashed
        className="absolute transition-all duration-300"
        style={{
          transform: backgroundMode === "muted" ? "scale(1) rotate(0deg)" : "scale(0) rotate(90deg)",
          opacity: backgroundMode === "muted" ? 1 : 0,
        }}
      />
      <Blend
        className="absolute transition-all duration-300"
        style={{
          transform: backgroundMode === "glass" ? "scale(1) rotate(0deg)" : "scale(0) rotate(90deg)",
          opacity: backgroundMode === "glass" ? 1 : 0,
        }}
      />
      <span className="sr-only">Toggle editor background</span>
    </Button>
  );
}
