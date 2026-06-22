import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HotlineQueuePanel } from "../components/HotlineQueuePanel";
import { IncomingCallModal } from "../components/IncomingCallModal";
import { PageTransition } from "../components/PageTransition";
import { SystemStatusWidget } from "../components/SystemStatusWidget";
import { useCase } from "../context/CaseContext";
import { dashboardStats } from "../data/dashboard";
import { CASE_NUMBER } from "../data/constants";

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    phoneCalls,
    incomingCallId,
    activityEvents,
    createIntakeFromCall,
    loadCase,
    ringWaitingCall,
    dismissIncomingCall,
    markCallResolved,
    createFollowUpFromCall,
    dashboardCases,
    dashboardRingToken,
  } = useCase();
  const ringWaitingCallRef = useRef(ringWaitingCall);
  ringWaitingCallRef.current = ringWaitingCall;

  useEffect(() => {
    if (dashboardRingToken > 0) return;
    if (phoneCalls.some((c) => c.status === "waiting")) return;

    const timeout = window.setTimeout(() => {
      ringWaitingCallRef.current();
    }, 1000);

    return () => window.clearTimeout(timeout);
    // First dashboard visit only — save-and-close uses dashboardRingToken instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dashboardRingToken === 0) return;

    const timeout = window.setTimeout(() => {
      ringWaitingCallRef.current();
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [dashboardRingToken]);

  const incomingCall = useMemo(
    () => phoneCalls.find((call) => call.id === incomingCallId) ?? null,
    [phoneCalls, incomingCallId],
  );

  const showIncomingCallModal =
    incomingCall !== null && incomingCall.status === "waiting";

  const handleAnswerIncomingCall = () => {
    if (!incomingCallId) return;
    const newCaseId = createIntakeFromCall(incomingCallId);
    navigate(`/case/${newCaseId}/intake`);
  };

  return (
    <div
      id="workspace-scroll"
      className="h-full overflow-y-auto overflow-x-hidden bg-page"
    >
      <PageTransition>
        <div className="mx-auto max-w-5xl p-8">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              What needs your attention right now
            </p>
          </header>

          <HotlineQueuePanel
            calls={phoneCalls}
            recentActivity={activityEvents}
            onCreateIntake={(callId) => {
              const newCaseId = createIntakeFromCall(callId);
              navigate(`/case/${newCaseId}/intake`);
            }}
            onOpenCase={(id) => {
              loadCase(id);
              navigate(`/case/${id}/intake`);
            }}
            onCreateFollowUp={(callId) => {
              const newCaseId = createFollowUpFromCall(callId);
              navigate(`/case/${newCaseId}/intake`);
            }}
            onMarkResolved={markCallResolved}
          />

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: index * 0.04 }}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Active work
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    loadCase(CASE_NUMBER);
                    navigate(`/case/${CASE_NUMBER}/intake`);
                  }}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Open current case
                </button>
              </div>

              <ul className="space-y-2">
                {dashboardCases.map((c, index) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        loadCase(c.id);
                        navigate(`/case/${c.id}/intake`);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition-colors hover:border-brand-accent hover:bg-purple-50/50 ${
                        c.highlight
                          ? "border-purple-200 bg-white shadow-sm"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900">{c.label}</p>
                        <p className="text-sm text-slate-600">{c.survivor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">
                          {c.status}
                        </p>
                        <p className="text-xs text-slate-500">{c.updated}</p>
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </section>

            <SystemStatusWidget />
          </div>
        </div>
      </PageTransition>

      <IncomingCallModal
        call={incomingCall}
        visible={showIncomingCallModal}
        onAnswer={handleAnswerIncomingCall}
        onDismiss={dismissIncomingCall}
      />
    </div>
  );
}
