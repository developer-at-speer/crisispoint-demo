import { motion } from "framer-motion";

interface EmergencyModeBannerProps {
  emergencyMode: boolean;
  onToggle: () => void;
}

export function EmergencyModeBanner({
  emergencyMode,
  onToggle,
}: EmergencyModeBannerProps) {
  return (
    <motion.div
      layout
      animate={{
        backgroundColor: emergencyMode ? "#fff1f2" : "#ffffff",
        borderColor: emergencyMode ? "#ef4444" : "#d1d5db",
      }}
      transition={{ duration: 0.2 }}
      className="form-question sticky top-0 z-10 mb-6 flex items-center justify-between rounded-xl border p-5 shadow-sm"
    >
      <div>
        <h2
          className={`font-semibold ${emergencyMode ? "text-red-700" : "text-slate-900"}`}
        >
          Emergency mode {emergencyMode ? "on" : "off"}
        </h2>
        <p className="text-sm text-slate-600">
          Show only urgent fields needed to act fast
        </p>
      </div>

      <button
        type="button"
        aria-pressed={emergencyMode}
        onClick={onToggle}
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        {emergencyMode ? "Turn off" : "Turn on"}
      </button>
    </motion.div>
  );
}
