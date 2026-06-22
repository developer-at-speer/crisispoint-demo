export interface CaseMessage {
  id: string;
  channel: "internal" | "agency";
  senderName: string;
  senderType: "awhl_staff" | "agency";
  body: string;
  timestamp: string;
  visibility: "internal_only" | "shared_with_agency";
}
