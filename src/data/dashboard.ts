import { CASE_NUMBER } from "./constants";

export const dashboardStats = [
  { label: "Active Cases", value: 3, detail: "currently open" },
  { label: "Pending Referrals", value: 5, detail: "waiting for agency response" },
  { label: "Needs Follow-Up", value: 2, detail: "require operator review" },
  { label: "Draft Intakes", value: 1, detail: "incomplete intake" },
];

export const dashboardCases = [
  {
    id: CASE_NUMBER,
    label: `Case #${CASE_NUMBER}`,
    survivor: "Jessica",
    status: "Active Session",
    updated: "2 min ago",
    highlight: true,
  },
  {
    id: "CP-2024-802",
    label: "Case #CP-2024-802",
    survivor: "Preferred name withheld",
    status: "Pending referral",
    updated: "18 min ago",
    highlight: false,
  },
  {
    id: "CP-2024-791",
    label: "Case #CP-2024-791",
    survivor: "Alex",
    status: "Needs follow-up",
    updated: "1 hr ago",
    highlight: false,
  },
];
