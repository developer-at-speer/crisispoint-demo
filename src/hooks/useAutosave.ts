import { useEffect, useRef, useState } from "react";

type SaveStatus = "idle" | "saving" | "just-now" | "recent";

export function useAutosave(changeKey: string) {
  const [status, setStatus] = useState<SaveStatus>("recent");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setStatus("saving");
    const savingTimer = setTimeout(() => setStatus("just-now"), 700);
    const revertTimer = setTimeout(() => setStatus("recent"), 5700);

    return () => {
      clearTimeout(savingTimer);
      clearTimeout(revertTimer);
    };
  }, [changeKey]);

  const label =
    status === "saving"
      ? "Saving…"
      : status === "just-now"
        ? "Last saved just now"
        : "Last saved 2 min ago";

  return label;
}
