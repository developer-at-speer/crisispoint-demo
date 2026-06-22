export type ConsentStatus = "unknown" | "granted" | "declined";
export type TriState = "yes" | "no" | "unsure" | null;

export interface IntakeState {
  emergencyMode: boolean;
  consentStatus: ConsentStatus;

  safety: {
    safeToTalk: TriState;
    safeToCallBack: "yes" | "no" | null;
    callbackNumber: string;
    callbackTime: string;
    dependentsPresent: TriState;
    medicalAttentionRequired: TriState;
  };

  survivorNeeds: {
    preferredName: string;
    location: string;
    estimatedAge: string;
    genderIdentity: string;
    serviceTypes: string[];
    servicePreference: "women_only" | "mixed_family" | "no_preference" | null;
    needs: string[];
  };

  incidentDetails: {
    incidentTypes: string[];
    incidentDate: string;
    recency: string;
    relationship: string | null;
    accessToLocationOrDevices: TriState;
    weaponsInvolvedOrThreatened: TriState;
    protectionOrder: TriState;
  };

  broaderContext: {
    childrenAccompanying: string;
    supportNetwork: string;
    contactedBefore: TriState;
  };
}

export type SendState = "idle" | "loading" | "success";
