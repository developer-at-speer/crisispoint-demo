import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, Clock } from "lucide-react";

interface IncomingCallModalProps {
  visible: boolean;
  onAnswer: () => void;
  onDismiss: () => void;
}

function PulsingCallIcon() {
  return (
    <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-green-400"
        animate={{ scale: [1, 1.45, 1.45], opacity: [0.6, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-green-400"
        animate={{ scale: [1, 1.3, 1.3], opacity: [0.5, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      />
      <motion.div
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <AudioLines className="h-7 w-7 text-white" strokeWidth={2.5} />
      </motion.div>
    </div>
  );
}

export function IncomingCallModal({
  visible,
  onAnswer,
  onDismiss,
}: IncomingCallModalProps) {
  const [ringSeconds, setRingSeconds] = useState(0);

  useEffect(() => {
    if (!visible) {
      setRingSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setRingSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  const formatRingTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}s`;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="incoming-call-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-2xl"
          >
            <PulsingCallIcon />

            <h2
              id="incoming-call-title"
              className="text-2xl font-bold text-slate-900"
            >
              Incoming Call
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Hotline Line 3 · Regional Support
            </p>

            <motion.span
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              High Priority
            </motion.span>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              Ringing for {formatRingTime(ringSeconds)}
            </p>

            <button
              type="button"
              onClick={onAnswer}
              className="mt-8 w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-light"
            >
              Answer &amp; Start New Intake
            </button>

            <button
              type="button"
              onClick={onDismiss}
              className="mt-4 text-sm font-medium text-red-500 transition hover:text-red-600"
            >
              Dismiss Call
            </button>

            <p className="mt-6 text-xs leading-relaxed text-slate-400">
              Ensuring rapid response and comprehensive documentation is our
              standard of care.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
