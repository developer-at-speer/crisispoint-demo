import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { trackingIds } from "../data/agencies";
import {
  initialPhoneCalls,
  waitingCallTemplate,
} from "../data/callQueue";
import { CASE_NUMBER, initialState } from "../data/constants";
import type { ActivityEvent } from "../types/activity";
import type { Attachment } from "../types/attachments";
import type { PhoneCall } from "../types/call";
import type { IntakeState, SendState } from "../types/intake";
import type { CaseMessage } from "../types/messages";

const initialActivity: ActivityEvent[] = [
  {
    id: "evt-1",
    timestamp: "10:28 AM",
    type: "case_created",
    title: "Case created",
    description: `Case #${CASE_NUMBER} opened from hotline intake.`,
    actor: "Operator",
  },
  {
    id: "evt-2",
    timestamp: "10:31 AM",
    type: "note_added",
    title: "Case note added",
    description: "Client seems hesitant — possible third party present.",
    actor: "Operator",
  },
];

const initialMessages: CaseMessage[] = [
  {
    id: "msg-1",
    channel: "internal",
    senderName: "Operator",
    senderType: "awhl_staff",
    body: "Caller prefers text follow-up only if safe.",
    timestamp: "10:33 AM",
    visibility: "internal_only",
  },
];

let eventCounter = 10;
let msgCounter = 10;
let attachCounter = 1;
let caseCounter = 817;
let callCounter = 2;

function nextCaseId() {
  caseCounter += 1;
  return `CP-2024-${caseCounter}`;
}

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface CaseContextValue {
  caseId: string;
  intake: IntakeState;
  setIntake: React.Dispatch<React.SetStateAction<IntakeState>>;
  referralQueue: string[];
  addToQueue: (agencyId: string) => void;
  removeFromQueue: (agencyId: string) => void;
  sendState: SendState;
  setSendState: React.Dispatch<React.SetStateAction<SendState>>;
  highlightedField: string | null;
  setHighlightedField: React.Dispatch<React.SetStateAction<string | null>>;
  consentPulse: boolean;
  setConsentPulse: React.Dispatch<React.SetStateAction<boolean>>;
  consentWarning: boolean;
  setConsentWarning: React.Dispatch<React.SetStateAction<boolean>>;
  consentHighlight: boolean;
  setConsentHighlight: React.Dispatch<React.SetStateAction<boolean>>;
  phoneCalls: PhoneCall[];
  createIntakeFromCall: (callId: string) => string;
  loadCase: (targetCaseId: string) => void;
  ringWaitingCall: () => void;
  markCallResolved: (callId: string) => void;
  createFollowUpFromCall: (callId: string) => string;
  activityEvents: ActivityEvent[];
  addActivityEvent: (event: Omit<ActivityEvent, "id">) => void;
  messages: CaseMessage[];
  addMessage: (body: string, channel?: "internal" | "agency") => void;
  attachments: Attachment[];
  generateReferralSummary: () => void;
}

const CaseContext = createContext<CaseContextValue | null>(null);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [caseId, setCaseId] = useState(CASE_NUMBER);
  const [intake, setIntake] = useState<IntakeState>(initialState);
  const [referralQueue, setReferralQueue] = useState<string[]>([]);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [consentPulse, setConsentPulse] = useState(false);
  const [consentWarning, setConsentWarning] = useState(false);
  const [consentHighlight, setConsentHighlight] = useState(false);
  const [phoneCalls, setPhoneCalls] = useState<PhoneCall[]>(initialPhoneCalls);
  const [activityEvents, setActivityEvents] = useState(initialActivity);
  const [messages, setMessages] = useState(initialMessages);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const addActivityEvent = useCallback((event: Omit<ActivityEvent, "id">) => {
    eventCounter += 1;
    setActivityEvents((prev) => [
      { ...event, id: `evt-${eventCounter}`, highlight: true },
      ...prev.map((e) => ({ ...e, highlight: false })),
    ]);
    setTimeout(() => {
      setActivityEvents((prev) =>
        prev.map((e) => ({ ...e, highlight: false })),
      );
    }, 800);
  }, []);

  const addToQueue = useCallback(
    (agencyId: string) => {
      setReferralQueue((prev) => {
        if (prev.includes(agencyId)) return prev;
        addActivityEvent({
          timestamp: nowTime(),
          type: "referral_added",
          title: "Referral added to queue",
          actor: "Operator",
        });
        return [...prev, agencyId];
      });
    },
    [addActivityEvent],
  );

  const removeFromQueue = useCallback((agencyId: string) => {
    setReferralQueue((prev) => prev.filter((id) => id !== agencyId));
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhoneCalls((prev) =>
        prev.map((call) => {
          if (
            call.status === "waiting" ||
            call.status === "active" ||
            call.status === "linked_to_intake" ||
            call.status === "missed" ||
            call.status === "follow_up_required"
          ) {
            return { ...call, durationSeconds: call.durationSeconds + 1 };
          }
          return call;
        }),
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const ringWaitingCall = useCallback(() => {
    const pendingCall: { current: PhoneCall | null } = { current: null };

    setPhoneCalls((prev) => {
      if (prev.some((c) => c.status === "waiting")) return prev;

      callCounter += 1;
      pendingCall.current = {
        id: `call-${String(callCounter).padStart(3, "0")}`,
        ...waitingCallTemplate,
        durationSeconds: 0,
      };

      return [pendingCall.current, ...prev];
    });

    if (pendingCall.current) {
      const newCall = pendingCall.current;
      addActivityEvent({
        timestamp: nowTime(),
        type: "call_incoming",
        title: "Call received",
        description: `${newCall.lineName} — waiting in queue.`,
        actor: "System",
      });
    }
  }, [addActivityEvent]);

  const loadCase = useCallback((targetCaseId: string) => {
    setCaseId(targetCaseId);
    if (targetCaseId === CASE_NUMBER) {
      setIntake(initialState);
    }
  }, []);

  const createIntakeFromCall = useCallback(
    (callId: string) => {
      const call = phoneCalls.find((c) => c.id === callId);
      const newCaseId = nextCaseId();

      setCaseId(newCaseId);
      setIntake({ ...initialState, emergencyMode: false });
      setReferralQueue([]);
      setSendState("idle");

      setPhoneCalls((prev) =>
        prev.map((c) =>
          c.id === callId
            ? {
                ...c,
                status: "linked_to_intake" as const,
                linkedCaseId: newCaseId,
                operatorName: "Julia",
                durationSeconds: c.status === "waiting" ? 0 : c.durationSeconds,
              }
            : c,
        ),
      );

      addActivityEvent({
        timestamp: nowTime(),
        type: "intake_started",
        title: "Intake created from call queue",
        description: `Case #${newCaseId} linked to ${call?.lineName ?? "hotline call"}.`,
        actor: "Operator",
      });

      return newCaseId;
    },
    [phoneCalls, addActivityEvent],
  );

  const markCallResolved = useCallback(
    (callId: string) => {
      setPhoneCalls((prev) => prev.filter((c) => c.id !== callId));
      addActivityEvent({
        timestamp: nowTime(),
        type: "note_added",
        title: "Missed call resolved",
        description: "Follow-up marked complete from dashboard queue.",
        actor: "Operator",
      });
    },
    [addActivityEvent],
  );

  const createFollowUpFromCall = useCallback(
    (callId: string) => {
      const newCaseId = nextCaseId();
      setCaseId(newCaseId);
      setIntake({
        ...initialState,
        emergencyMode: false,
        survivorNeeds: {
          ...initialState.survivorNeeds,
          preferredName: "",
          location: "",
          serviceTypes: [],
        },
        safety: {
          ...initialState.safety,
          safeToCallBack: null,
          callbackNumber: "",
          callbackTime: "",
        },
      });
      setReferralQueue([]);
      markCallResolved(callId);
      addActivityEvent({
        timestamp: nowTime(),
        type: "case_created",
        title: "Follow-up case created",
        description: `Lightweight case #${newCaseId} opened from missed call.`,
        actor: "Operator",
      });
      return newCaseId;
    },
    [addActivityEvent, markCallResolved],
  );

  const addMessage = useCallback(
    (body: string, channel: "internal" | "agency" = "internal") => {
      msgCounter += 1;
      const msg: CaseMessage = {
        id: `msg-${msgCounter}`,
        channel,
        senderName: "Operator",
        senderType: "awhl_staff",
        body,
        timestamp: nowTime(),
        visibility: channel === "internal" ? "internal_only" : "shared_with_agency",
      };
      setMessages((prev) => [...prev, msg]);
      addActivityEvent({
        timestamp: msg.timestamp,
        type: "note_added",
        title: "Case note added",
        description: body,
        actor: "Operator",
      });
    },
    [addActivityEvent],
  );

  const generateReferralSummary = useCallback(() => {
    attachCounter += 1;
    const anonymized = intake.consentStatus === "declined";
    const attachment: Attachment = {
      id: `att-${attachCounter}`,
      name: anonymized
        ? "Anonymized Referral Summary"
        : `Referral Summary — Safe Harbor`,
      type: "referral_summary",
      createdAt: nowTime(),
      createdBy: "Operator",
      sharingMode: anonymized ? "anonymized" : "identifiable",
      status: "ready",
    };
    setAttachments((prev) => [attachment, ...prev]);
  }, [intake.consentStatus]);

  const value = useMemo(
    () => ({
      caseId,
      intake,
      setIntake,
      referralQueue,
      addToQueue,
      removeFromQueue,
      sendState,
      setSendState,
      highlightedField,
      setHighlightedField,
      consentPulse,
      setConsentPulse,
      consentWarning,
      setConsentWarning,
      consentHighlight,
      setConsentHighlight,
      phoneCalls,
      createIntakeFromCall,
      loadCase,
      ringWaitingCall,
      markCallResolved,
      createFollowUpFromCall,
      activityEvents,
      addActivityEvent,
      messages,
      addMessage,
      attachments,
      generateReferralSummary,
    }),
    [
      caseId,
      intake,
      referralQueue,
      sendState,
      highlightedField,
      consentPulse,
      consentWarning,
      consentHighlight,
      phoneCalls,
      createIntakeFromCall,
      loadCase,
      ringWaitingCall,
      markCallResolved,
      createFollowUpFromCall,
      activityEvents,
      addActivityEvent,
      messages,
      addMessage,
      attachments,
      generateReferralSummary,
    ],
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used within CaseProvider");
  return ctx;
}

export function getTrackingIdForAgency(agencyId: string): string {
  return trackingIds[agencyId] ?? "REF-00000";
}
