export interface Attachment {
  id: string;
  name: string;
  type:
    | "referral_summary"
    | "consent_record"
    | "agency_response"
    | "uploaded_file";
  createdAt: string;
  createdBy: string;
  sharingMode: "identifiable" | "anonymized" | "internal_only";
  status: "ready" | "processing" | "uploaded";
}
