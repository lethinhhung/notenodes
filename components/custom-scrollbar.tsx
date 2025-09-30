"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CustomScrollbarProps {
  children: React.ReactNode;
  className?: string;
}

export function CustomScrollbar({
  children,
  className = "",
}: CustomScrollbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  const updateScrollbar = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const thumb = thumbRef.current;
    const scrollbar = scrollbarRef.current;

    if (!container || !content || !thumb || !scrollbar) return;

    const scrollHeight = content.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollTop = container.scrollTop;
    const scrollbarHeight = scrollbar.clientHeight;

    // Calculate thumb height and position based on scrollbar height
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * scrollbarHeight,
      30 // Minimum thumb height
    );
    const maxScrollTop = scrollHeight - clientHeight;
    const maxThumbTop = scrollbarHeight - thumbHeight;
    const thumbTop = (scrollTop / maxScrollTop) * maxThumbTop;

    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${thumbTop}px)`;
  }, []);

  const handleScroll = useCallback(() => {
    updateScrollbar();
  }, [updateScrollbar]);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = containerRef.current?.scrollTop || 0;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (
        !isDragging ||
        !containerRef.current ||
        !contentRef.current ||
        !scrollbarRef.current
      )
        return;

      const container = containerRef.current;
      const content = contentRef.current;
      const scrollbar = scrollbarRef.current;
      const deltaY = e.clientY - dragStartY.current;
      const scrollHeight = content.scrollHeight;
      const clientHeight = container.clientHeight;
      const scrollbarHeight = scrollbar.clientHeight;

      // Calculate scroll position based on drag
      const maxScrollTop = scrollHeight - clientHeight;
      const scrollRatio = maxScrollTop / scrollbarHeight;
      const newScrollTop = dragStartScrollTop.current + deltaY * scrollRatio;

      container.scrollTop = Math.max(
        0,
        Math.min(newScrollTop, scrollHeight - clientHeight)
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial update
    updateScrollbar();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(container);

    // Update on content changes
    const mutationObserver = new MutationObserver(updateScrollbar);
    if (contentRef.current) {
      mutationObserver.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [updateScrollbar]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll overflow-x-hidden"
      >
        <div ref={contentRef}>{children}</div>
      </div>

      {/* Custom scrollbar track - always visible for debugging */}
      <div
        ref={scrollbarRef}
        className="fixed top-4 bottom-4 right-3 w-2 transition-opacity duration-200 z-[100]"
      >
        {/* Scrollbar thumb */}
        <div
          ref={thumbRef}
          onMouseDown={handleThumbMouseDown}
          className="absolute right-0 w-full bg-primary rounded-full cursor-pointer transition-colors"
          style={{ willChange: "transform" }}
        />
      </div>
    </div>
  );
}
