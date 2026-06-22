import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatCallDuration } from "../lib/callTimer";

interface EndCallModalProps {
  open: boolean;
  callDurationSeconds: number;
  onContinue: () => void;
  onSaveAndEnd: () => void;
}

export function EndCallModal({
  open,
  callDurationSeconds,
  onContinue,
  onSaveAndEnd,
}: EndCallModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onContinue}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="end-call-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22 }}
            className="relative w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="end-call-title"
              className="text-2xl font-bold text-slate-900"
            >
              Call ended
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
              The call has now ended successfully without any issues, and all
              participants have disconnected properly.
            </p>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              Call length {formatCallDuration(callDurationSeconds)}s
            </p>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={onContinue}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Continue current session
              </button>
              <button
                type="button"
                onClick={onSaveAndEnd}
                className="flex-1 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 hover:bg-brand-light"
              >
                Save and end session
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
