import type { IntakeState } from "../types/intake";
import type { ConsentStatus } from "../types/intake";

export const CASE_NUMBER = "CP-2024-817";

export const INTAKE_SECTION_IDS = {
  safety: "intake-section-safety",
  survivorDetails: "intake-section-survivor-details",
  serviceNeeds: "intake-section-service-needs",
  incidentDetails: "intake-section-incident-details",
  broaderContext: "intake-section-broader-context",
} as const;

export const transitions = {
  fast: { duration: 0.12, ease: "easeOut" as const },
  standard: { duration: 0.22, ease: "easeOut" as const },
  slow: { duration: 0.35, ease: "easeInOut" as const },
};

export function createEmptyIntakeState(): IntakeState {
  return {
    emergencyMode: false,
    consentStatus: "unknown",
    safety: {
      safeToTalk: null,
      safeToCallBack: null,
      callbackNumber: "",
      callbackTime: "",
      dependentsPresent: null,
      medicalAttentionRequired: null,
    },
    survivorNeeds: {
      preferredName: "",
      location: "",
      estimatedAge: "",
      genderIdentity: "",
      serviceTypes: [],
      servicePreference: null,
      needs: [],
    },
    incidentDetails: {
      incidentTypes: [],
      incidentDate: "",
      recency: "",
      relationship: null,
      accessToLocationOrDevices: null,
      weaponsInvolvedOrThreatened: null,
      protectionOrder: null,
    },
    broaderContext: {
      childrenAccompanying: "",
      supportNetwork: "",
      contactedBefore: null,
    },
  };
}

/** Populated demo data for Case #CP-2024-817 presenter path */
export const initialState: IntakeState = {
  emergencyMode: false,
  consentStatus: "unknown",

  safety: {
    safeToTalk: "yes",
    safeToCallBack: "yes",
    callbackNumber: "(555) 012-3456",
    callbackTime: "",
    dependentsPresent: "yes",
    medicalAttentionRequired: "yes",
  },

  survivorNeeds: {
    preferredName: "Jessica",
    location: "",
    estimatedAge: "",
    genderIdentity: "",
    serviceTypes: ["Counselling", "Emergency Housing"],
    servicePreference: "women_only",
    needs: [],
  },

  incidentDetails: {
    incidentTypes: ["Domestic Violence"],
    incidentDate: "",
    recency: "Ongoing / Current",
    relationship: "Spouse",
    accessToLocationOrDevices: "yes",
    weaponsInvolvedOrThreatened: "yes",
    protectionOrder: "yes",
  },

  broaderContext: {
    childrenAccompanying: "",
    supportNetwork: "",
    contactedBefore: "yes",
  },
};

export const SERVICE_TYPE_OPTIONS = ["Counselling", "Emergency Housing"];

export const NEED_OPTIONS = [
  { id: "pets", label: "Pets" },
  { id: "mobility", label: "Mobility / accessibility needs" },
  { id: "interpreter", label: "Interpreter / specific language" },
];

export const INCIDENT_TYPES = [
  "Domestic Violence",
  "Bullying",
  "Housing Connection",
  "Child Abuse",
  "Elder Abuse",
  "Sexual Assault",
  "Human Trafficking",
  "Self Harm",
  "Substance Misuse",
];

export const RELATIONSHIP_OPTIONS = [
  "Spouse",
  "Partner",
  "Family Member",
  "Caregiver",
  "Stranger",
];

export type JumpTargetGroup =
  | "SAFETY"
  | "SURVIVOR DETAILS"
  | "BROADER CONTEXT"
  | "CONSENT";

export interface JumpTarget {
  id: string;
  label: string;
  group: JumpTargetGroup;
}

export const JUMP_TARGET_GROUP_ORDER: JumpTargetGroup[] = [
  "SAFETY",
  "SURVIVOR DETAILS",
  "BROADER CONTEXT",
  "CONSENT",
];

export const jumpTargets: JumpTarget[] = [
  { id: "safeToTalk", label: "Is it safe right now?", group: "SAFETY" },
  { id: "safeToCallBack", label: "Safe to disclose?", group: "SAFETY" },
  { id: "callbackNumber", label: "Callback Number", group: "SAFETY" },
  { id: "callbackTime", label: "Callback Time", group: "SAFETY" },
  { id: "preferredName", label: "First Name", group: "SURVIVOR DETAILS" },
  { id: "location", label: "General location / area", group: "SURVIVOR DETAILS" },
  { id: "serviceTypes", label: "Service Type", group: "SURVIVOR DETAILS" },
  {
    id: "contactedBefore",
    label: "Has Hotline Been Called?",
    group: "BROADER CONTEXT",
  },
  {
    id: "consent",
    label: "Consent to share information",
    group: "CONSENT",
  },
];

export function getReferralCta(
  consentStatus: ConsentStatus,
  queueLength: number,
): string {
  if (queueLength === 0) return "Add a service to continue";
  if (consentStatus === "unknown") return "Review Consent Before Sending";
  if (consentStatus === "declined") return "Send Anonymized Referral";
  return "Complete Intake & Send Referrals";
}
