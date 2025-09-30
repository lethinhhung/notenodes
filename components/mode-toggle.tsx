"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <Sun className="scale-100 rotate-0 transition-all" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="!bg-background shadow-md"
    >
      <Sun
        className="scale-100 rotate-0 transition-all data-[theme=dark]:scale-0 data-[theme=dark]:-rotate-90 data-[theme=system]:scale-0 data-[theme=system]:-rotate-90"
        data-theme={theme}
      />
      <Moon
        className="absolute scale-0 rotate-90 transition-all data-[theme=dark]:scale-100 data-[theme=dark]:rotate-0 data-[theme=light]:scale-0 data-[theme=light]:rotate-90 data-[theme=system]:scale-0 data-[theme=system]:rotate-90"
        data-theme={theme}
      />
      <SunMoon
        className="absolute scale-0 rotate-90 transition-all data-[theme=system]:scale-100 data-[theme=system]:rotate-0 data-[theme=light]:scale-0 data-[theme=light]:rotate-90 data-[theme=dark]:scale-0 data-[theme=dark]:rotate-90"
        data-theme={theme}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
