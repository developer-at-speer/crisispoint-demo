import { motion } from "framer-motion";
import { Info, MapPin, Phone } from "lucide-react";
import type { ScoredAgency } from "../types/agency";
import { AvailabilityBadge } from "./ui/AvailabilityBadge";
import { Tag } from "./ui/Tag";

interface ReferralCardProps {
  agency: ScoredAgency;
  isAdded: boolean;
  isTopMatch: boolean;
  onAdd: (agencyId: string) => void;
  onInfo: (agencyId: string) => void;
  highlightWomenOnly?: boolean;
}

export function ReferralCard({
  agency,
  isAdded,
  isTopMatch,
  onAdd,
  onInfo,
  highlightWomenOnly,
}: ReferralCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className={`rounded-lg border bg-white p-4 shadow-sm transition-shadow ${
        isTopMatch ? "ring-2 ring-purple-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{agency.name}</h3>
          <p className="text-sm text-slate-500">{agency.primaryService}</p>
        </div>
        <AvailabilityBadge status={agency.availability} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {agency.languages.map((lang) => (
          <Tag key={lang}>{lang}</Tag>
        ))}
        {agency.eligibility.map((item) => (
          <Tag
            key={item}
            highlight={highlightWomenOnly && item === "Women only"}
          >
            {item}
          </Tag>
        ))}
        {agency.accessibility.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>

      {(agency.waitlistNote || agency.limitedNote) && (
        <p className="mt-2 text-xs font-medium text-red-600">
          {agency.waitlistNote || agency.limitedNote}
        </p>
      )}

      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
        <p className="flex items-start gap-1.5">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {agency.address}
            {agency.distanceKm > 0 && ` · ${agency.distanceKm} km away`}
          </span>
        </p>
        <p className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          {agency.phone}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onAdd(agency.id)}
          disabled={isAdded}
          className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
            isAdded
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-brand-accent text-brand-accent hover:bg-purple-50"
          }`}
        >
          {isAdded ? "Added" : "Add to referral queue"}
        </button>
        <button
          type="button"
          onClick={() => onInfo(agency.id)}
          aria-label={`More info about ${agency.name}`}
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-500 hover:bg-slate-50"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}
