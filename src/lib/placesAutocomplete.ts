export function getPlacesApiKey(): string | undefined {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key || key === "your_google_maps_api_key_here") return undefined;
  return key;
}

export type PlaceSuggestion = {
  placeId: string;
  label: string;
  secondary: string;
};

type AutocompleteResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      text?: { text?: string };
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
    };
  }>;
  error?: { message?: string };
};

export async function fetchPlaceSuggestions(
  input: string,
): Promise<PlaceSuggestion[]> {
  const apiKey = getPlacesApiKey();
  if (!apiKey || input.trim().length < 2) return [];

  const response = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input: input.trim(),
        includedRegionCodes: ["ca"],
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Places autocomplete request failed");
  }

  const data = (await response.json()) as AutocompleteResponse;

  return (data.suggestions ?? [])
    .map((suggestion) => {
      const prediction = suggestion.placePrediction;
      if (!prediction?.placeId) return null;

      const label =
        prediction.structuredFormat?.mainText?.text ??
        prediction.text?.text ??
        "";
      const secondary = prediction.structuredFormat?.secondaryText?.text ?? "";

      if (!label) return null;

      return {
        placeId: prediction.placeId,
        label,
        secondary,
      };
    })
    .filter((item): item is PlaceSuggestion => item !== null);
}
