import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let initPromise: Promise<void> | null = null;

export function getGoogleMapsApiKey(): string | undefined {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key || key === "your_google_maps_api_key_here") return undefined;
  return key;
}

export function loadGoogleMaps(): Promise<void> | null {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) return null;

  if (!initPromise) {
    setOptions({ key: apiKey, v: "weekly" });
    initPromise = importLibrary("places").then(() => undefined);
  }

  return initPromise;
}

export function formatPlaceForIntake(
  place: google.maps.places.PlaceResult,
): string {
  if (place.formatted_address) return place.formatted_address;

  const components = place.address_components ?? [];
  const locality = components.find((c) => c.types.includes("locality"));
  const neighborhood = components.find((c) =>
    c.types.includes("neighborhood"),
  );
  const admin = components.find((c) =>
    c.types.includes("administrative_area_level_1"),
  );

  const parts = [
    neighborhood?.long_name,
    locality?.long_name,
    admin?.short_name,
  ].filter(Boolean);

  if (parts.length > 0) return parts.join(", ");
  return place.name ?? "";
}
