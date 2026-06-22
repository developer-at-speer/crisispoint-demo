export type Availability = "available" | "waitlist" | "limited";

export interface Agency {
  id: string;
  name: string;
  primaryService: string;
  serviceTypes: string[];
  availability: Availability;
  distanceKm: number;
  languages: string[];
  eligibility: string[];
  accessibility: string[];
  phone: string;
  email: string;
  address: string;
  serviceAreas: string[];
  referralMethod?: "api" | "portal" | "email" | "phone" | "csv";
  lastUpdated?: string;
  waitlistNote?: string;
  limitedNote?: string;
  hours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
}

export interface ScoredAgency extends Agency {
  score: number;
}
