import { useEffect } from "react";

export function useIntakeStickyOffset() {
  useEffect(() => {
    const header = document.getElementById("intake-sticky-header");
    const scroll = document.getElementById("workspace-scroll");
    if (!header || !scroll) return;

    const sync = () => {
      scroll.style.setProperty(
        "--intake-sticky-offset",
        `${header.offsetHeight}px`,
      );
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    window.addEventListener("resize", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);
}
