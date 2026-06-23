import { MapPin } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  fetchPlaceSuggestions,
  getPlacesApiKey,
  type PlaceSuggestion,
} from "../lib/placesAutocomplete";

interface LocationAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

type MenuRect = {
  top: number;
  left: number;
  width: number;
};

export function LocationAutocomplete({
  id = "location-input",
  value,
  onChange,
  placeholder = "Address, neighbourhood or city",
  className = "",
}: LocationAutocompleteProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placesError, setPlacesError] = useState(false);
  const [menuRect, setMenuRect] = useState<MenuRect | null>(null);
  const hasApiKey = Boolean(getPlacesApiKey());

  const updateMenuRect = useCallback(() => {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();
    setMenuRect({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!hasApiKey || value.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setPlacesError(false);

      try {
        const results = await fetchPlaceSuggestions(value, controller.signal);
        if (controller.signal.aborted) return;
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSuggestions([]);
        setOpen(false);
        setPlacesError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [hasApiKey, value]);

  useEffect(() => {
    if (!open) {
      setMenuRect(null);
      return;
    }

    updateMenuRect();

    const scrollRoot = document.getElementById("workspace-scroll");
    scrollRoot?.addEventListener("scroll", updateMenuRect, { passive: true });
    window.addEventListener("resize", updateMenuRect);

    return () => {
      scrollRoot?.removeEventListener("scroll", updateMenuRect);
      window.removeEventListener("resize", updateMenuRect);
    };
  }, [open, updateMenuRect, suggestions]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSelect = (suggestion: PlaceSuggestion) => {
    const formatted = suggestion.secondary
      ? `${suggestion.label}, ${suggestion.secondary}`
      : suggestion.label;
    onChange(formatted);
    setOpen(false);
    setSuggestions([]);
  };

  const suggestionList =
    open && menuRect && suggestions.length > 0 ? (
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        className="fixed z-[10000] max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        style={{
          top: menuRect.top,
          left: menuRect.left,
          width: menuRect.width,
        }}
      >
        {suggestions.map((suggestion) => (
          <li key={suggestion.placeId} role="option">
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(suggestion)}
              className="block w-full px-3 py-2 text-left hover:bg-purple-50"
            >
              <span className="block text-sm font-medium text-slate-900">
                {suggestion.label}
              </span>
              {suggestion.secondary ? (
                <span className="block text-xs text-slate-500">
                  {suggestion.secondary}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div ref={containerRef}>
      <div className="relative">
        <span
          className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center"
          aria-hidden
        >
          <MapPin
            className={`h-4 w-4 ${
              hasApiKey && !placesError ? "text-brand-accent" : "text-slate-400"
            }`}
          />
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setOpen(true);
              updateMenuRect();
            }
          }}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          className={`w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent ${className}`}
        />
      </div>

      {suggestionList ? createPortal(suggestionList, document.body) : null}

      {hasApiKey && !placesError ? (
        <p className="mt-1 text-xs text-slate-500">
          {loading
            ? "Looking up addresses…"
            : "Start typing for Ontario address suggestions"}
        </p>
      ) : null}
      {!hasApiKey ? (
        <p className="mt-1 text-xs text-slate-400">
          Add VITE_GOOGLE_MAPS_API_KEY to enable address autofill
        </p>
      ) : null}
      {placesError ? (
        <p className="mt-1 text-xs text-amber-700">
          Address suggestions unavailable — enter location manually
        </p>
      ) : null}
    </div>
  );
}
