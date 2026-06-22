import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SaveCloseCaseModalProps {
  open: boolean;
  caseId: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function SaveCloseCaseModal({
  open,
  caseId,
  onClose,
  onConfirm,
}: SaveCloseCaseModalProps) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onConfirm();
    onClose();
    navigate("/dashboard");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-close-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>

            <h2
              id="save-close-title"
              className="text-center text-xl font-semibold text-slate-900"
            >
              Save and close case?
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Intake data for Case #{caseId} will be saved. You can return
              to this case from the dashboard at any time.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep working
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-light"
              >
                Save and close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
