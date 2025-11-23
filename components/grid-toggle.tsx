"use client";

import { Grid2X2, Grid2x2X, Grid2x2Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cycleGridMode, setGridMode, GridMode } from "@/lib/features/editor/editorSlice";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";
import { toast } from "sonner";

export function GridToggle() {
  const dispatch = useAppDispatch();
  const gridMode = useAppSelector((state) => state.editor.gridMode);

  useEffect(() => {
    const stored = localStorage.getItem("grid-mode");
    if (stored !== null && ["off", "normal", "loose"].includes(stored)) {
      if (stored !== gridMode) {
        dispatch(setGridMode(stored as GridMode));
      }
    }
  }, [dispatch, gridMode]);

  useEffect(() => {
    document.body.classList.remove("grid-off", "grid-normal", "grid-loose");
    document.body.classList.add(`grid-${gridMode}`);
  }, [gridMode]);

  const handleToggle = () => {
    const modes: GridMode[] = ["off", "normal", "loose"];
    const currentIndex = modes.indexOf(gridMode);
    const newMode = modes[(currentIndex + 1) % modes.length];

    dispatch(cycleGridMode());
    localStorage.setItem("grid-mode", newMode);

    const messages = {
      off: "Grid disabled",
      normal: "Normal grid",
      loose: "Loose grid",
    };
    toast.success(messages[newMode]);
  };

  const getTooltipText = () => {
    if (gridMode === "off") return "Grid: Off";
    if (gridMode === "normal") return "Grid: Normal";
    return "Grid: Loose";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggle}
          className="rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-black/5 dark:border-white/5 shadow-lg hover:bg-black/20 dark:hover:bg-white/20 hover:shadow-xl hover:border-transparent active:scale-95 transition-all duration-300 ease-out h-12 w-12 [&_svg]:!size-5"
        >
          <Grid2x2X
            className="absolute transition-all duration-300"
            style={{
              transform: gridMode === "off" ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)",
              opacity: gridMode === "off" ? 1 : 0,
            }}
          />
          <Grid2X2
            className="absolute transition-all duration-300"
            style={{
              transform: gridMode === "normal" ? "scale(1) rotate(0deg)" : "scale(0) rotate(90deg)",
              opacity: gridMode === "normal" ? 1 : 0,
            }}
          />
          <Grid2x2Plus
            className="absolute transition-all duration-300"
            style={{
              transform: gridMode === "loose" ? "scale(1) rotate(0deg)" : "scale(0) rotate(90deg)",
              opacity: gridMode === "loose" ? 1 : 0,
            }}
          />
          <span className="sr-only">Toggle grid background</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{getTooltipText()}</TooltipContent>
    </Tooltip>
  );
}
