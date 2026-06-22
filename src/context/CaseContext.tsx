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
import { CASE_NUMBER, initialState } from "../data/constants";
import { formatCallDuration } from "../lib/callTimer";
import type { ActivityEvent } from "../types/activity";
import type { Attachment } from "../types/attachments";
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
  incomingCallVisible: boolean;
  setIncomingCallVisible: React.Dispatch<React.SetStateAction<boolean>>;
  callActive: boolean;
  callDurationSeconds: number;
  acceptCall: () => void;
  endCall: () => void;
  activityEvents: ActivityEvent[];
  addActivityEvent: (event: Omit<ActivityEvent, "id">) => void;
  messages: CaseMessage[];
  addMessage: (body: string, channel?: "internal" | "agency") => void;
  attachments: Attachment[];
  generateReferralSummary: () => void;
}

const CaseContext = createContext<CaseContextValue | null>(null);

let eventCounter = 10;
let msgCounter = 10;
let attachCounter = 1;

export function CaseProvider({ children }: { children: ReactNode }) {
  const [intake, setIntake] = useState<IntakeState>(initialState);
  const [referralQueue, setReferralQueue] = useState<string[]>([]);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [consentPulse, setConsentPulse] = useState(false);
  const [consentWarning, setConsentWarning] = useState(false);
  const [consentHighlight, setConsentHighlight] = useState(false);
  const [incomingCallVisible, setIncomingCallVisible] = useState(true);
  const [callActive, setCallActive] = useState(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
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
          timestamp: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
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
    if (!callActive) {
      setCallDurationSeconds(0);
      return;
    }

    const interval = window.setInterval(() => {
      setCallDurationSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [callActive]);

  const acceptCall = useCallback(() => {
    setIncomingCallVisible(false);
    setCallActive(true);
    setCallDurationSeconds(0);
    addActivityEvent({
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "case_created",
      title: "Call answered",
      description: `Active session started for Case #${CASE_NUMBER}.`,
      actor: "Operator",
    });
  }, [addActivityEvent]);

  const endCall = useCallback(() => {
    const duration = formatCallDuration(callDurationSeconds);
    setCallActive(false);
    setCallDurationSeconds(0);
    addActivityEvent({
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "note_added",
      title: "Call ended",
      description: `Active session closed for Case #${CASE_NUMBER} after ${duration}.`,
      actor: "Operator",
    });
  }, [addActivityEvent, callDurationSeconds]);

  const addMessage = useCallback(
    (body: string, channel: "internal" | "agency" = "internal") => {
      msgCounter += 1;
      const msg: CaseMessage = {
        id: `msg-${msgCounter}`,
        channel,
        senderName: "Operator",
        senderType: "awhl_staff",
        body,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
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
      createdAt: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      createdBy: "Operator",
      sharingMode: anonymized ? "anonymized" : "identifiable",
      status: "ready",
    };
    setAttachments((prev) => [attachment, ...prev]);
  }, [intake.consentStatus]);

  const value = useMemo(
    () => ({
      caseId: CASE_NUMBER,
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
      incomingCallVisible,
      setIncomingCallVisible,
      callActive,
      callDurationSeconds,
      acceptCall,
      endCall,
      activityEvents,
      addActivityEvent,
      messages,
      addMessage,
      attachments,
      generateReferralSummary,
    }),
    [
      intake,
      referralQueue,
      sendState,
      highlightedField,
      consentPulse,
      consentWarning,
      consentHighlight,
      incomingCallVisible,
      callActive,
      callDurationSeconds,
      acceptCall,
      endCall,
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
