import { useCallback, useRef, useState, type ReactNode } from "react";

interface HoverScrollAreaProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
  label?: string;
}

export function HoverScrollArea({
  children,
  className = "",
  maxHeight = "calc((100vh - 5rem) / 3 - 0.75rem)",
  label,
}: HoverScrollAreaProps) {
  const [hovered, setHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !hovered) return;

    const canScrollUp = el.scrollTop > 0;
    const canScrollDown =
      el.scrollTop + el.clientHeight < el.scrollHeight - 1;

    if (
      (e.deltaY < 0 && canScrollUp) ||
      (e.deltaY > 0 && canScrollDown)
    ) {
      e.stopPropagation();
    }
  }, [hovered]);

  return (
    <div
      className={`hover-scroll-area group/scroll rounded-xl transition-shadow duration-150 ${
        hovered ? "shadow-md ring-1 ring-purple-100" : ""
      } ${className}`}
      style={{ maxHeight }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
    >
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className={`hover-scroll-inner max-h-[inherit] overflow-x-hidden overscroll-contain transition-[overflow] duration-150 ${
          hovered ? "overflow-y-auto" : "overflow-y-hidden"
        }`}
        style={{ maxHeight }}
      >
        {children}
      </div>
    </div>
  );
}
