import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  formatPlaceForIntake,
  getGoogleMapsApiKey,
  loadGoogleMaps,
} from "../lib/googleMaps";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [placesReady, setPlacesReady] = useState(false);
  const [placesError, setPlacesError] = useState(false);
  const hasApiKey = Boolean(getGoogleMapsApiKey());

  useEffect(() => {
    if (!hasApiKey) return;

    let cancelled = false;

    loadGoogleMaps()
      ?.then(() => {
        if (cancelled || !inputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: "ca" },
            fields: ["formatted_address", "address_components", "name", "geometry"],
            types: ["geocode", "establishment"],
          },
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const formatted = formatPlaceForIntake(place);
          if (formatted) onChange(formatted);
        });

        autocompleteRef.current = autocomplete;
        setPlacesReady(true);
      })
      .catch(() => {
        if (!cancelled) setPlacesError(true);
      });

    return () => {
      cancelled = true;
      const ac = autocompleteRef.current;
      if (ac && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(ac);
      }
      autocompleteRef.current = null;
    };
  }, [hasApiKey, onChange]);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <div>
      <div className="relative">
        <span
          className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center"
          aria-hidden
        >
          <MapPin
            className={`h-4 w-4 ${
              placesReady ? "text-brand-accent" : "text-slate-400"
            }`}
          />
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          defaultValue={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          className={`w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent ${className}`}
        />
      </div>
      {hasApiKey && placesReady && (
        <p className="mt-1 text-xs text-slate-500">
          Start typing for Ontario address suggestions
        </p>
      )}
      {!hasApiKey && (
        <p className="mt-1 text-xs text-slate-400">
          Add VITE_GOOGLE_MAPS_API_KEY to enable address autofill
        </p>
      )}
      {placesError && (
        <p className="mt-1 text-xs text-amber-700">
          Address suggestions unavailable — enter location manually
        </p>
      )}
    </div>
  );
}
