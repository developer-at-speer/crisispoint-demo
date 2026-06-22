import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Search, X } from "lucide-react";
import {
  JUMP_TARGET_GROUP_ORDER,
  jumpTargets,
} from "../data/constants";

function isMacPlatform() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

function isFindShortcut(e: KeyboardEvent) {
  return (
    (e.ctrlKey || e.metaKey) &&
    !e.altKey &&
    !e.shiftKey &&
    e.key.toLowerCase() === "f"
  );
}

interface FieldJumpCommandProps {
  onJump: (fieldId: string) => void;
}

export function FieldJumpCommand({ onJump }: FieldJumpCommandProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl F");
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(open);
  openRef.current = open;
  const onJumpRef = useRef(onJump);
  onJumpRef.current = onJump;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jumpTargets;
    return jumpTargets.filter((t) => t.label.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const indexed = filtered.map((target, index) => ({ target, index }));
    return JUMP_TARGET_GROUP_ORDER.map((group) => ({
      group,
      items: indexed.filter((item) => item.target.group === group),
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  const filteredRef = useRef(filtered);
  filteredRef.current = filtered;
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;

  const close = () => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  };

  const handleSelect = (fieldId: string) => {
    close();
    onJumpRef.current(fieldId);
  };

  useEffect(() => {
    setShortcutLabel(isMacPlatform() ? "⌘ F" : "Ctrl F");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFindShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (openRef.current) {
          close();
        } else {
          setQuery("");
          setSelectedIndex(0);
          setOpen(true);
        }
        return;
      }

      if (!openRef.current) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) =>
          Math.min(i + 1, filteredRef.current.length - 1),
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        return;
      }

      if (e.key === "Enter") {
        const target = filteredRef.current[selectedIndexRef.current];
        if (target) {
          e.preventDefault();
          handleSelect(target.id);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Jump to Field"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  Jump to Field
                </h2>
                <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  {shortcutLabel}
                </kbd>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a field name..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                {query.trim() && filtered.length > 0 && (
                  <span className="shrink-0 text-xs text-slate-400">
                    {filtered.length} {filtered.length === 1 ? "result" : "results"}
                  </span>
                )}
              </div>
            </div>

            <ul className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-slate-500">
                  No matching fields
                </li>
              ) : (
                grouped.map(({ group, items }) => {
                  const groupHasSelection = items.some(
                    (item) => item.index === selectedIndex,
                  );

                  return (
                    <li key={group}>
                      <div
                        className={`px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider ${
                          groupHasSelection ? "text-brand" : "text-slate-400"
                        }`}
                      >
                        {group}
                      </div>
                      <ul>
                        {items.map(({ target, index }) => {
                          const selected = index === selectedIndex;

                          return (
                            <li key={target.id}>
                              <button
                                type="button"
                                onClick={() => handleSelect(target.id)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                                  selected
                                    ? "bg-purple-50 text-brand"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <span className={selected ? "font-medium" : ""}>
                                  {target.label}
                                </span>
                                {selected && (
                                  <Check className="h-4 w-4 shrink-0 text-brand" />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="flex items-center justify-center gap-3 border-t border-slate-100 px-4 py-2.5 text-xs text-slate-400">
              <span>
                <kbd className="font-sans">↑↓</kbd> navigate
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <kbd className="font-sans">Enter</kbd> to select
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <kbd className="font-sans">Esc</kbd> to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
