import type { LucideIcon } from "lucide-react";
import {
  Clock,
  FileText,
  Home,
  Map,
  MessageSquare,
  Paperclip,
  Shield,
  Users,
} from "lucide-react";
import { CASE_NUMBER } from "./constants";

export type NavId =
  | "dashboard"
  | "intake"
  | "agencies"
  | "privacy"
  | "history"
  | "map"
  | "messages"
  | "attachments";

export interface NavItem {
  id: NavId;
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: Home },
  {
    id: "intake",
    label: "Current Intake",
    path: `/case/${CASE_NUMBER}/intake`,
    icon: FileText,
  },
  { id: "agencies", label: "Agencies & Contacts", path: "/agencies", icon: Users },
  {
    id: "privacy",
    label: "Privacy & Consent",
    path: `/case/${CASE_NUMBER}/privacy`,
    icon: Shield,
  },
  {
    id: "history",
    label: "Activity History",
    path: `/case/${CASE_NUMBER}/history`,
    icon: Clock,
  },
  { id: "map", label: "Resource Map", path: "/resources/map", icon: Map },
  {
    id: "messages",
    label: "Notes & Messages",
    path: `/case/${CASE_NUMBER}/messages`,
    icon: MessageSquare,
  },
  {
    id: "attachments",
    label: "Attachments",
    path: `/case/${CASE_NUMBER}/attachments`,
    icon: Paperclip,
  },
];

export function getActiveNavId(pathname: string): NavId {
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.includes("/intake")) return "intake";
  if (pathname.startsWith("/agencies")) return "agencies";
  if (pathname.includes("/privacy")) return "privacy";
  if (pathname.includes("/history")) return "history";
  if (pathname.startsWith("/resources/map")) return "map";
  if (pathname.includes("/messages")) return "messages";
  if (pathname.includes("/attachments")) return "attachments";
  return "intake";
}
