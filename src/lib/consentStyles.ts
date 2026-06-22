import type { ConsentStatus } from "../types/intake";

export const consentCardConfig = {
  unknown: {
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
    boxShadow: "0 1px 2px rgba(249, 115, 22, 0.08)",
  },
  granted: {
    borderColor: "#16a34a",
    backgroundColor: "#f0fdf4",
    boxShadow: "0 1px 2px rgba(22, 163, 74, 0.08)",
  },
  declined: {
    borderColor: "#dc2626",
    backgroundColor: "#fef2f2",
    boxShadow: "0 1px 2px rgba(220, 38, 38, 0.08)",
  },
} as const;

export function getConsentStatusLine(status: ConsentStatus) {
  switch (status) {
    case "granted":
      return {
        message: "Consent provided — info will be shared with referred services",
        className: "text-green-700",
        iconClass: "bg-green-600 text-white",
      };
    case "declined":
      return {
        message: "Consent not given — info will not be shared",
        className: "text-red-700 italic",
        iconClass: "bg-red-600 text-white",
      };
    default:
      return null;
  }
}

export function getSurvivorDetailsBorderClass(status: ConsentStatus) {
  switch (status) {
    case "granted":
      return "border-green-600";
    case "declined":
      return "border-red-700";
    default:
      return "border-slate-200";
  }
}
