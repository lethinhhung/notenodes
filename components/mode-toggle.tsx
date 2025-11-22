"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      toast.success("Switched to dark mode");
    } else if (theme === "dark") {
      setTheme("system");
      toast.success("Switched to system theme");
    } else {
      setTheme("light");
      toast.success("Switched to light mode");
    }
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full bg-white/5 dark:bg-black/5 backdrop-blur-xl border-white/10 dark:border-white/5 shadow-lg hover:bg-white/30 dark:hover:bg-white/20 hover:shadow-xl hover:border-transparent active:scale-95 transition-all duration-300 ease-out h-12 w-12 [&_svg]:size-5">
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
      className="rounded-full bg-white/5 dark:bg-black/5 backdrop-blur-xl border-white/10 dark:border-white/5 shadow-lg hover:bg-white/30 dark:hover:bg-white/20 hover:shadow-xl hover:border-transparent active:scale-95 transition-all duration-300 ease-out h-12 w-12 [&_svg]:size-5"
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
