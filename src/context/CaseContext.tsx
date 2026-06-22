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
import { CASE_NUMBER, createEmptyIntakeState, initialState } from "../data/constants";
import {
  buildDashboardCaseList,
  getCaseSnapshot,
  persistCaseSnapshot,
} from "../lib/caseCache";
import type { ActivityEvent } from "../types/activity";
import type { Attachment } from "../types/attachments";
import type { PhoneCall } from "../types/call";
import type { IntakeState, SendState } from "../types/intake";
import type { CaseMessage } from "../types/messages";
import type { DashboardCaseListItem, SavedCaseSnapshot } from "../types/savedCase";

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
  incomingCallId: string | null;
  createIntakeFromCall: (callId: string) => string;
  loadCase: (targetCaseId: string) => void;
  saveCurrentCase: () => void;
  saveAndCloseCase: () => void;
  dashboardCases: DashboardCaseListItem[];
  dashboardRingToken: number;
  ringWaitingCall: () => void;
  dismissIncomingCall: () => void;
  markCallResolved: (callId: string) => void;
  createFollowUpFromCall: (callId: string) => string;
  callLinkedToCase: PhoneCall | null;
  endCallModalOpen: boolean;
  endedCallDurationSeconds: number;
  openEndCallModal: () => void;
  continueAfterEndCall: () => void;
  saveAndEndSession: () => void;
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
  const [incomingCallId, setIncomingCallId] = useState<string | null>(null);
  const [endCallModalOpen, setEndCallModalOpen] = useState(false);
  const [endedCallDurationSeconds, setEndedCallDurationSeconds] = useState(0);
  const [activityEvents, setActivityEvents] = useState(initialActivity);
  const [messages, setMessages] = useState(initialMessages);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dashboardCases, setDashboardCases] = useState<DashboardCaseListItem[]>(
    () => buildDashboardCaseList(null),
  );
  const [dashboardRingToken, setDashboardRingToken] = useState(0);

  const persistCurrentCase = useCallback((): SavedCaseSnapshot => {
    const snapshot: SavedCaseSnapshot = {
      caseId,
      intake: JSON.parse(JSON.stringify(intake)) as IntakeState,
      referralQueue: [...referralQueue],
      sendState,
      savedAt: new Date().toISOString(),
    };
    persistCaseSnapshot(snapshot);
    setDashboardCases(buildDashboardCaseList(caseId));
    return snapshot;
  }, [caseId, intake, referralQueue, sendState]);

  const saveCurrentCase = useCallback(() => {
    persistCurrentCase();
  }, [persistCurrentCase]);

  const completeLinkedCall = useCallback(() => {
    setPhoneCalls((prev) =>
      prev.map((call) =>
        call.linkedCaseId === caseId && call.status === "linked_to_intake"
          ? { ...call, status: "completed" as const }
          : call,
      ),
    );
  }, [caseId]);

  const requestDashboardIncomingCall = useCallback(() => {
    setIncomingCallId(null);
    setDashboardRingToken((token) => token + 1);
  }, []);

  const saveAndCloseCase = useCallback(() => {
    persistCurrentCase();
    completeLinkedCall();
    requestDashboardIncomingCall();
  }, [persistCurrentCase, completeLinkedCall, requestDashboardIncomingCall]);

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
      setIncomingCallId(newCall.id);
      addActivityEvent({
        timestamp: nowTime(),
        type: "call_incoming",
        title: "Call received",
        description: `${newCall.lineName} — waiting in queue.`,
        actor: "System",
      });
    }
  }, [addActivityEvent]);

  const dismissIncomingCall = useCallback(() => {
    setIncomingCallId(null);
  }, []);

  const loadCase = useCallback((targetCaseId: string) => {
    setCaseId(targetCaseId);
    const cached = getCaseSnapshot(targetCaseId);
    if (cached) {
      setIntake(cached.intake);
      setReferralQueue(cached.referralQueue);
      setSendState(cached.sendState);
    } else if (targetCaseId === CASE_NUMBER) {
      setIntake(initialState);
      setReferralQueue([]);
      setSendState("idle");
    } else {
      setIntake(createEmptyIntakeState());
      setReferralQueue([]);
      setSendState("idle");
    }
    setConsentPulse(false);
    setConsentWarning(false);
    setConsentHighlight(false);
    setHighlightedField(null);
  }, []);

  const createIntakeFromCall = useCallback(
    (callId: string) => {
      const call = phoneCalls.find((c) => c.id === callId);
      const newCaseId = nextCaseId();

      setCaseId(newCaseId);
      setIntake(createEmptyIntakeState());
      setReferralQueue([]);
      setSendState("idle");
      setConsentPulse(false);
      setConsentWarning(false);
      setConsentHighlight(false);
      setHighlightedField(null);

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
      setIncomingCallId((current) => (current === callId ? null : current));

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
      setIntake(createEmptyIntakeState());
      setReferralQueue([]);
      setSendState("idle");
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

  const callLinkedToCase = useMemo(
    () =>
      phoneCalls.find(
        (call) =>
          call.linkedCaseId === caseId && call.status === "linked_to_intake",
      ) ?? null,
    [phoneCalls, caseId],
  );

  const resetIntakeForm = useCallback(() => {
    setIntake(createEmptyIntakeState());
    setReferralQueue([]);
    setSendState("idle");
    setConsentPulse(false);
    setConsentWarning(false);
    setConsentHighlight(false);
    setHighlightedField(null);
  }, []);

  const openEndCallModal = useCallback(() => {
    const duration = callLinkedToCase?.durationSeconds ?? 0;
    setEndedCallDurationSeconds(duration);
    setEndCallModalOpen(true);
    addActivityEvent({
      timestamp: nowTime(),
      type: "call_ended",
      title: "Call ended",
      description: `Hotline call disconnected for Case #${caseId}.`,
      actor: "Operator",
    });
  }, [callLinkedToCase, caseId, addActivityEvent]);

  const continueAfterEndCall = useCallback(() => {
    completeLinkedCall();
    setEndCallModalOpen(false);
  }, [completeLinkedCall]);

  const saveAndEndSession = useCallback(() => {
    persistCurrentCase();
    completeLinkedCall();
    resetIntakeForm();
    setEndCallModalOpen(false);
    requestDashboardIncomingCall();
    addActivityEvent({
      timestamp: nowTime(),
      type: "case_saved",
      title: "Session saved and ended",
      description: `Case #${caseId} intake saved. Form cleared for next caller.`,
      actor: "Operator",
    });
  }, [
    persistCurrentCase,
    completeLinkedCall,
    resetIntakeForm,
    requestDashboardIncomingCall,
    caseId,
    addActivityEvent,
  ]);

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
      incomingCallId,
      createIntakeFromCall,
      loadCase,
      saveCurrentCase,
      saveAndCloseCase,
      dashboardCases,
      dashboardRingToken,
      ringWaitingCall,
      dismissIncomingCall,
      markCallResolved,
      createFollowUpFromCall,
      callLinkedToCase,
      endCallModalOpen,
      endedCallDurationSeconds,
      openEndCallModal,
      continueAfterEndCall,
      saveAndEndSession,
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
      incomingCallId,
      createIntakeFromCall,
      loadCase,
      saveCurrentCase,
      saveAndCloseCase,
      dashboardCases,
      dashboardRingToken,
      ringWaitingCall,
      dismissIncomingCall,
      markCallResolved,
      createFollowUpFromCall,
      callLinkedToCase,
      endCallModalOpen,
      endedCallDurationSeconds,
      openEndCallModal,
      continueAfterEndCall,
      saveAndEndSession,
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
