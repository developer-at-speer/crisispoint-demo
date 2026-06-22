import type { ConsentStatus } from "../types/intake";

/** Subtle consent card surfaces — white/neutral base, status via icon + text only */
export const consentCardConfig = {
  unknown: {
    borderColor: "#f59e0b",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.05)",
  },
  granted: {
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.05)",
  },
  declined: {
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.05)",
  },
} as const;

export function getConsentStatusLine(status: ConsentStatus) {
  switch (status) {
    case "granted":
      return {
        message: "Consent given — info will be shared",
        className: "text-green-700",
        iconClass: "bg-green-600 text-white",
      };
    case "declined":
      return {
        message: "Consent not given — info will not be shared",
        className: "text-red-700",
        iconClass: "bg-red-600 text-white",
      };
    default:
      return null;
  }
}
