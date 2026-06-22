import { MapPin } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
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

export function LocationAutocomplete({
  id = "location-input",
  value,
  onChange,
  placeholder = "Address, neighbourhood or city",
  className = "",
}: LocationAutocompleteProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placesError, setPlacesError] = useState(false);
  const hasApiKey = Boolean(getPlacesApiKey());

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
        const results = await fetchPlaceSuggestions(value);
        if (controller.signal.aborted) return;
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setOpen(false);
          setPlacesError(true);
        }
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
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
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
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          className={`w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent ${className}`}
        />
        {open && suggestions.length > 0 ? (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
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
        ) : null}
      </div>
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
