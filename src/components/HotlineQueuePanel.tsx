import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, FileText, Phone } from "lucide-react";
import { formatCallDuration } from "../lib/callTimer";
import type { PhoneCall } from "../types/call";
import type { ActivityEvent } from "../types/activity";

interface HotlineQueuePanelProps {
  calls: PhoneCall[];
  recentActivity: ActivityEvent[];
  onCreateIntake: (callId: string) => void;
  onOpenCase: (caseId: string) => void;
  onCreateFollowUp: (callId: string) => void;
  onMarkResolved: (callId: string) => void;
}

function QueueSection({
  title,
  children,
  empty,
}: {
  title: string;
  children: React.ReactNode;
  empty?: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {children}
      {!children && empty && (
        <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-500">
          {empty}
        </p>
      )}
    </div>
  );
}

function CallCard({
  call,
  onCreateIntake,
  onOpenCase,
  onCreateFollowUp,
  onMarkResolved,
}: {
  call: PhoneCall;
  onCreateIntake: (callId: string) => void;
  onOpenCase: (caseId: string) => void;
  onCreateFollowUp: (callId: string) => void;
  onMarkResolved: (callId: string) => void;
}) {
  const isWaiting = call.status === "waiting";
  const isLive =
    call.status === "active" || call.status === "linked_to_intake";
  const isMissed =
    call.status === "missed" || call.status === "follow_up_required";
  const isCompleted = call.status === "completed";

  const subtitle = (() => {
    if (isWaiting) {
      return (
        <>
          <span>Waiting {formatCallDuration(call.durationSeconds)}</span>
          <span className="text-slate-400">·</span>
          <span>No case linked</span>
        </>
      );
    }
    if (isLive) {
      return (
        <>
          <span>{formatCallDuration(call.durationSeconds)} elapsed</span>
          {call.operatorName && (
            <>
              <span className="text-slate-400">·</span>
              <span>Operator: {call.operatorName}</span>
            </>
          )}
          {call.linkedCaseId && (
            <>
              <span className="text-slate-400">·</span>
              <span>Linked Case: {call.linkedCaseId}</span>
            </>
          )}
        </>
      );
    }
    if (isMissed) {
      return (
        <>
          <span>Missed {formatCallDuration(call.durationSeconds)} ago</span>
          <span className="text-slate-400">·</span>
          <span>No intake created</span>
        </>
      );
    }
    if (isCompleted) {
      const parts = [
        call.linkedCaseId ? `Case ${call.linkedCaseId}` : null,
        call.referralSent ? "Referral sent" : null,
        call.trackingId ? "Tracking ID received" : null,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(" · ") : "Call completed";
    }
    return null;
  })();

  const hasActions =
    isWaiting ||
    (isLive && call.linkedCaseId) ||
    isMissed;

  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-light";
  const secondaryButtonClass =
    "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`rounded-xl border px-4 py-4 ${
        isWaiting
          ? "border-amber-200 bg-amber-50/50"
          : isMissed
            ? "border-red-200/80 bg-red-50/30"
            : isCompleted
              ? "border-slate-200 bg-slate-50"
              : "border-slate-200 bg-white"
      }`}
    >
      <div className="space-y-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">{call.lineName}</p>
            {isWaiting && (
              <motion.span
                className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Waiting
              </motion.span>
            )}
            {isLive && call.status === "linked_to_intake" && (
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-brand">
                Intake in progress
              </span>
            )}
            {call.priority === "high" && !isCompleted && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700">
                High priority
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm leading-relaxed text-slate-600">
              {subtitle}
            </p>
          )}
        </div>

        {hasActions && (
          <div className="flex flex-wrap gap-2 border-t border-slate-200/80 pt-3">
            {isWaiting && (
              <button
                type="button"
                onClick={() => onCreateIntake(call.id)}
                className={`${primaryButtonClass} gap-1.5`}
              >
                <FileText className="h-4 w-4" />
                Create Intake
              </button>
            )}
            {isLive && call.linkedCaseId && (
              <button
                type="button"
                onClick={() => onOpenCase(call.linkedCaseId!)}
                className={secondaryButtonClass}
              >
                Open Case
              </button>
            )}
            {isMissed && (
              <>
                <button
                  type="button"
                  onClick={() => onCreateFollowUp(call.id)}
                  className={primaryButtonClass}
                >
                  Create Follow-Up
                </button>
                <button
                  type="button"
                  onClick={() => onMarkResolved(call.id)}
                  className={secondaryButtonClass}
                >
                  Mark Resolved
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.li>
  );
}

const CALL_ACTIVITY_TYPES = new Set([
  "call_incoming",
  "call_answered",
  "call_ended",
  "intake_started",
  "case_created",
  "referral_sent",
  "case_closed",
  "case_saved",
]);

export function HotlineQueuePanel({
  calls,
  recentActivity,
  onCreateIntake,
  onOpenCase,
  onCreateFollowUp,
  onMarkResolved,
}: HotlineQueuePanelProps) {
  const waiting = calls.filter((c) => c.status === "waiting");
  const active = calls.filter(
    (c) => c.status === "active" || c.status === "linked_to_intake",
  );
  const followUp = calls.filter(
    (c) => c.status === "missed" || c.status === "follow_up_required",
  );
  const completed = calls.filter((c) => c.status === "completed");
  const callActivity = recentActivity
    .filter((e) => CALL_ACTIVITY_TYPES.has(e.type))
    .slice(0, 6);

  return (
    <section className="mb-10 space-y-8">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Phone className="h-4 w-4 text-brand" />
          <h2 className="text-lg font-semibold text-slate-900">
            Hotline Queue
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Dashboard-level call visibility — integrates with AWHL&apos;s phone and
          Salesforce systems. Intake workflow stays unchanged.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <QueueSection
            title="Waiting"
            empty={waiting.length === 0 ? "No calls waiting" : undefined}
          >
            {waiting.length > 0 && (
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {waiting.map((call) => (
                    <CallCard
                      key={call.id}
                      call={call}
                      onCreateIntake={onCreateIntake}
                      onOpenCase={onOpenCase}
                      onCreateFollowUp={onCreateFollowUp}
                      onMarkResolved={onMarkResolved}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </QueueSection>

          <QueueSection
            title="Active"
            empty={active.length === 0 ? "No active calls" : undefined}
          >
            {active.length > 0 && (
              <ul className="space-y-3">
                {active.map((call) => (
                  <CallCard
                    key={call.id}
                    call={call}
                    onCreateIntake={onCreateIntake}
                    onOpenCase={onOpenCase}
                    onCreateFollowUp={onCreateFollowUp}
                    onMarkResolved={onMarkResolved}
                  />
                ))}
              </ul>
            )}
          </QueueSection>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <QueueSection
              title="Needs Follow-Up"
              empty={
                followUp.length === 0
                  ? "No missed or unlinked calls"
                  : undefined
              }
            >
              {followUp.length > 0 && (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {followUp.map((call) => (
                      <CallCard
                        key={call.id}
                        call={call}
                        onCreateIntake={onCreateIntake}
                        onOpenCase={onOpenCase}
                        onCreateFollowUp={onCreateFollowUp}
                        onMarkResolved={onMarkResolved}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </QueueSection>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Recent Call Activity
            </h3>
            {callActivity.length === 0 ? (
              <p className="text-sm text-slate-500">No recent call events</p>
            ) : (
              <ul className="space-y-3">
                {callActivity.map((event) => (
                  <li
                    key={event.id}
                    className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      event.highlight
                        ? "border-purple-200 bg-purple-50"
                        : "border-slate-100 bg-slate-50/50"
                    }`}
                  >
                    <p className="text-xs text-slate-500">{event.timestamp}</p>
                    <p className="font-medium text-slate-800">{event.title}</p>
                    {event.description && (
                      <p className="mt-0.5 text-xs text-slate-600">
                        {event.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {completed.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <QueueSection title="Completed">
                <ul className="space-y-3">
                  {completed.map((call) => (
                    <CallCard
                      key={call.id}
                      call={call}
                      onCreateIntake={onCreateIntake}
                      onOpenCase={onOpenCase}
                      onCreateFollowUp={onCreateFollowUp}
                      onMarkResolved={onMarkResolved}
                    />
                  ))}
                </ul>
              </QueueSection>
            </div>
          )}
        </div>
      </div>

      {calls.length === 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-sm text-slate-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          No calls in queue right now.
        </div>
      )}
    </section>
  );
}
