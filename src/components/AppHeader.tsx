import { motion } from "framer-motion";
import { PhoneOff, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCase } from "../context/CaseContext";
import { CASE_NUMBER } from "../data/constants";
import { ActiveCallTimer } from "./ActiveCallTimer";

function CrisisPointMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
      <div className="flex items-end gap-0.5">
        <span className="h-2.5 w-1 rounded-sm bg-brand" />
        <span className="h-4 w-1 rounded-sm bg-brand" />
        <span className="h-3 w-1 rounded-sm bg-brand" />
      </div>
    </div>
  );
}

function OperatorAvatar({ name }: { name: string }) {
  const initials = name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-purple-400 text-xs font-bold text-brand"
      aria-label={`${name} profile`}
      role="img"
    >
      {initials || "OP"}
    </div>
  );
}

export function AppHeader() {
  const { addActivityEvent, callActive, callDurationSeconds, endCall } = useCase();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!callActive) return null;

  const handleSaveCase = () => {
    addActivityEvent({
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "case_saved",
      title: "Case saved",
      description: `Case #${CASE_NUMBER} intake saved to operator workspace.`,
      actor: "Operator",
    });
  };

  const handleEndCall = () => {
    endCall();
    navigate("/dashboard");
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex h-16 shrink-0 items-center gap-5 bg-brand px-6 text-white"
      >
        <div className="flex items-center gap-3">
          <CrisisPointMark />
          <span className="text-xl font-semibold">CrisisPoint</span>
        </div>

        <div className="h-8 w-px bg-white/40" />

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Case #{CASE_NUMBER}</span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-600">
            Active Session
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <ActiveCallTimer seconds={callDurationSeconds} />
          <button
            type="button"
            onClick={handleSaveCase}
            className="flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:bg-white"
          >
            <Save className="h-4 w-4" />
            Save Case
          </button>
          <button
            type="button"
            onClick={handleEndCall}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <PhoneOff className="h-4 w-4" />
            End Call
          </button>

          <div className="h-8 w-px bg-white/40" />

          <OperatorAvatar name={user?.name ?? "Operator"} />
        </div>
      </motion.header>
    </>
  );
}
