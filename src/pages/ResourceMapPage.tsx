import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StandardPageLayout } from "../layouts/StandardPageLayout";
import { agencies } from "../data/agencies";
import { useCase } from "../context/CaseContext";
import { AvailabilityBadge } from "../components/ui/AvailabilityBadge";

interface ResourcePin {
  agencyId: string;
  x: number;
  y: number;
}

const pins: ResourcePin[] = [
  { agencyId: "safe-harbor", x: 58, y: 42 },
  { agencyId: "crisis-support-network", x: 48, y: 55 },
  { agencyId: "yellow-brick-house", x: 72, y: 28 },
  { agencyId: "harbour-light", x: 62, y: 68 },
  { agencyId: "willow-creek", x: 38, y: 22 },
  { agencyId: "downtown-womens", x: 52, y: 48 },
  { agencyId: "lakeshore-support", x: 22, y: 62 },
];

const pinColors = {
  available: "bg-green-500",
  waitlist: "bg-purple-500",
  limited: "bg-orange-500",
};

export function ResourceMapPage() {
  const { intake, addToQueue, referralQueue } = useCase();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const visiblePins = useMemo(() => {
    return pins.filter((pin) => {
      const agency = agencies.find((a) => a.id === pin.agencyId);
      if (!agency) return false;
      if (filter === "all") return true;
      return agency.availability === filter;
    });
  }, [filter]);

  const selectedAgency = agencies.find((a) => a.id === selectedPin);

  return (
    <StandardPageLayout
      title="Resource Map"
      subtitle="Geographic view of available services"
    >
      <p className="mb-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        Using approximate area only. Exact location is not displayed unless
        appropriate and consent allows.
        {intake.survivorNeeds.location && (
          <span className="mt-1 block font-medium text-slate-800">
            Approximate area: {intake.survivorNeeds.location}
          </span>
        )}
      </p>

      <div className="mb-4 flex gap-2">
        {(["all", "available", "limited", "waitlist"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? "bg-brand text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="relative h-[420px] flex-1 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="absolute inset-0 opacity-30">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 32 0 L 0 0 0 32"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <p className="absolute left-4 top-4 text-xs font-medium text-slate-500">
            Toronto area · stylized map
          </p>

          <AnimatePresence>
            {visiblePins.map((pin, index) => {
              const agency = agencies.find((a) => a.id === pin.agencyId)!;
              const selected = selectedPin === pin.agencyId;
              return (
                <motion.button
                  key={pin.agencyId}
                  type="button"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => setSelectedPin(pin.agencyId)}
                  className={`absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${pinColors[agency.availability]} ${
                    selected ? "ring-4 ring-purple-200 ring-offset-2" : ""
                  }`}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  aria-label={agency.name}
                />
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {selectedAgency ? (
            <motion.div
              key={selectedAgency.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="w-72 shrink-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <AvailabilityBadge status={selectedAgency.availability} />
              <h3 className="mt-3 font-semibold text-slate-900">
                {selectedAgency.name}
              </h3>
              <p className="text-sm text-slate-500">
                {selectedAgency.primaryService}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {selectedAgency.address}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {selectedAgency.distanceKm} km away
              </p>
              <button
                type="button"
                onClick={() => addToQueue(selectedAgency.id)}
                disabled={referralQueue.includes(selectedAgency.id)}
                className="mt-4 w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-light disabled:bg-slate-300"
              >
                {referralQueue.includes(selectedAgency.id)
                  ? "Added"
                  : "Add to referral queue"}
              </button>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-72 text-sm text-slate-500"
            >
              Select a pin to preview the agency.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </StandardPageLayout>
  );
}
