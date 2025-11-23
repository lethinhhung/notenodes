"use client";

import { Grid2X2, Grid2x2X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function GridToggle() {
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("show-grid");
    if (stored !== null) {
      setShowGrid(stored === "true");
    }
  }, []);

  useEffect(() => {
    if (showGrid) {
      document.body.classList.add("show-grid");
      document.body.classList.remove("hide-grid");
    } else {
      document.body.classList.add("hide-grid");
      document.body.classList.remove("show-grid");
    }
  }, [showGrid]);

  const handleToggle = () => {
    const newState = !showGrid;
    setShowGrid(newState);
    localStorage.setItem("show-grid", String(newState));
    toast.success(newState ? "Grid enabled" : "Grid disabled");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-black/5 dark:border-white/5 shadow-lg hover:bg-black/20 dark:hover:bg-white/20 hover:shadow-xl hover:border-transparent active:scale-95 transition-all duration-300 ease-out h-12 w-12 [&_svg]:!size-5"
    >
      <Grid2X2
        className="scale-100 rotate-0 transition-all data-[hidden=true]:scale-0 data-[hidden=true]:-rotate-90"
        data-hidden={!showGrid}
      />
      <Grid2x2X
        className="absolute scale-0 rotate-90 transition-all data-[hidden=true]:scale-100 data-[hidden=true]:rotate-0"
        data-hidden={!showGrid}
      />
      <span className="sr-only">Toggle grid background</span>
    </Button>
  );
}
