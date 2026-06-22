import { motion } from "framer-motion";
import { LogOut, PhoneOff, Save } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCase } from "../context/CaseContext";
import { EndCallModal } from "./EndCallModal";
import { SaveCloseCaseModal } from "./SaveCloseCaseModal";

function OperatorAvatar({ name }: { name: string }) {
  return (
    <img
      src="/operator-avatar.png"
      alt={`${name} profile`}
      className="h-9 w-9 rounded-full object-cover ring-2 ring-white/30"
    />
  );
}

export function AppHeader() {
  const {
    caseId,
    callLinkedToCase,
    endCallModalOpen,
    endedCallDurationSeconds,
    openEndCallModal,
    continueAfterEndCall,
    saveAndEndSession,
    saveAndCloseCase,
    addActivityEvent,
  } = useCase();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onCaseRoute = pathname.includes("/case/");
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const handleSaveClose = () => {
    saveAndCloseCase();
    addActivityEvent({
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "case_saved",
      title: "Case saved and closed",
      description: `Case #${caseId} intake saved to operator workspace.`,
      actor: "Operator",
    });
  };

  const handleSaveAndEndSession = () => {
    saveAndEndSession();
    navigate("/dashboard");
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex h-16 shrink-0 items-center gap-6 bg-brand px-6 text-white"
      >
        <div className="flex items-center rounded-md bg-white px-2 py-1">
          <img
            src="/awhl-logo.jpeg"
            alt="Assaulted Women's Helpline"
            className="h-9 w-auto object-contain"
          />
        </div>

        <div className="h-8 w-px bg-white/40" />

        {onCaseRoute ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Case #{caseId}</span>
            <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
              ACTIVE SESSION
            </span>
          </div>
        ) : (
          <span className="text-sm text-white/80">Operator workspace</span>
        )}

        <div className="ml-auto flex items-center gap-5">
          {onCaseRoute && callLinkedToCase && (
            <button
              type="button"
              onClick={openEndCallModal}
              className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <PhoneOff className="h-4 w-4" />
              End Call
            </button>
          )}
          {onCaseRoute && (
            <button
              type="button"
              onClick={() => setSaveModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-light shadow-sm transition hover:bg-slate-50"
            >
              <Save className="h-4 w-4" />
              Save and Close Case
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
          <OperatorAvatar name={user?.name ?? "Operator"} />
        </div>
      </motion.header>

      <SaveCloseCaseModal
        open={saveModalOpen}
        caseId={caseId}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleSaveClose}
      />

      <EndCallModal
        open={endCallModalOpen}
        callDurationSeconds={endedCallDurationSeconds}
        onContinue={continueAfterEndCall}
        onSaveAndEnd={handleSaveAndEndSession}
      />
    </>
  );
}
