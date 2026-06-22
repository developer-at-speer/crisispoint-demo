import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { StandardPageLayout } from "../layouts/StandardPageLayout";
import { agencies } from "../data/agencies";
import { AvailabilityBadge } from "../components/ui/AvailabilityBadge";
import { Tag } from "../components/ui/Tag";

const referralMethodLabels = {
  api: "API",
  portal: "Portal",
  email: "Email",
  phone: "Phone",
  csv: "CSV",
};

const agencyMeta: Record<string, { referralMethod: keyof typeof referralMethodLabels; lastUpdated: string }> = {
  "safe-harbor": { referralMethod: "portal", lastUpdated: "12 min ago" },
  "crisis-support-network": { referralMethod: "api", lastUpdated: "8 min ago" },
  "yellow-brick-house": { referralMethod: "email", lastUpdated: "22 min ago" },
  "harbour-light": { referralMethod: "portal", lastUpdated: "5 min ago" },
  "willow-creek": { referralMethod: "phone", lastUpdated: "31 min ago" },
  "downtown-womens": { referralMethod: "api", lastUpdated: "14 min ago" },
  "lakeshore-support": { referralMethod: "csv", lastUpdated: "45 min ago" },
};

export function AgenciesPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(agencies[0]?.id ?? "");

  const filtered = useMemo(() => {
    if (!query.trim()) return agencies;
    const q = query.toLowerCase();
    return agencies.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.serviceTypes.some((s) => s.toLowerCase().includes(q)) ||
        a.serviceAreas.some((area) => area.includes(q)),
    );
  }, [query]);

  const selected = agencies.find((a) => a.id === selectedId) ?? agencies[0];
  const meta = selected ? agencyMeta[selected.id] : null;

  return (
    <StandardPageLayout
      title="Agencies & Contacts"
      subtitle="Federated agency directory for referral coordination"
    >
      <div className="flex gap-6">
        <div className="w-96 shrink-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search agencies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm"
            />
          </div>
          <ul className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((agency) => (
                <motion.li
                  key={agency.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(agency.id)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                      selectedId === agency.id
                        ? "border-purple-200 bg-purple-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <p className="font-medium text-slate-900">{agency.name}</p>
                    <p className="text-sm text-slate-500">{agency.primaryService}</p>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.22 }}
              className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {selected.name}
                  </h2>
                  <p className="text-slate-600">{selected.primaryService}</p>
                </div>
                <AvailabilityBadge status={selected.availability} size="md" />
              </div>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-500">Availability</dt>
                  <dd className="font-medium capitalize text-slate-900">
                    {selected.availability}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Languages</dt>
                  <dd className="mt-1 flex gap-1">
                    {selected.languages.map((l) => (
                      <Tag key={l}>{l}</Tag>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Eligibility</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {selected.eligibility.map((e) => (
                      <Tag key={e}>{e}</Tag>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Accessibility</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {selected.accessibility.length > 0 ? (
                      selected.accessibility.map((a) => <Tag key={a}>{a}</Tag>)
                    ) : (
                      <span className="text-slate-600">None listed</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Region served</dt>
                  <dd className="text-slate-900">
                    {selected.serviceAreas.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Referral method</dt>
                  <dd className="font-medium text-slate-900">
                    {meta
                      ? referralMethodLabels[meta.referralMethod]
                      : "Portal"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Contact</dt>
                  <dd className="text-slate-900">
                    {selected.phone} · {selected.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Address</dt>
                  <dd className="text-slate-900">{selected.address}</dd>
                </div>
                {meta && (
                  <div>
                    <dt className="text-slate-500">Last updated</dt>
                    <dd className="text-slate-900">{meta.lastUpdated}</dd>
                  </div>
                )}
              </dl>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StandardPageLayout>
  );
}
