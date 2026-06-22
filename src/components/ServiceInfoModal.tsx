import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Globe, Mail, MapPin, Phone, User, X } from "lucide-react";
import { agencies } from "../data/agencies";
import { AvailabilityBadge } from "./ui/AvailabilityBadge";
import { Tag } from "./ui/Tag";

interface ServiceInfoModalProps {
  agencyId: string | null;
  isInQueue: boolean;
  onClose: () => void;
  onAdd: (agencyId: string) => void;
}

export function ServiceInfoModal({
  agencyId,
  isInQueue,
  onClose,
  onAdd,
}: ServiceInfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const agency = agencies.find((a) => a.id === agencyId);

  useEffect(() => {
    if (!agency) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [agency, onClose]);

  useEffect(() => {
    if (agency && modalRef.current) {
      const focusable = modalRef.current.querySelector<HTMLElement>("button");
      focusable?.focus();
    }
  }, [agency]);

  return (
    <AnimatePresence>
      {agency && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-6 top-6 text-slate-400 transition hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
              {agency.availability === "available" ? (
                <span className="inline-flex rounded bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                  Open
                </span>
              ) : (
                <AvailabilityBadge status={agency.availability} size="md" />
              )}
              <h2
                id="service-modal-title"
                className="text-xl font-bold text-slate-900"
              >
                {agency.name}
              </h2>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>{agency.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{agency.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{agency.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p>Monday–Friday: {agency.hours.weekday}</p>
                  <p>Saturday: {agency.hours.saturday}</p>
                  <p>
                    Sunday:{" "}
                    <span
                      className={
                        agency.hours.sunday === "Closed"
                          ? "font-medium text-red-600"
                          : ""
                      }
                    >
                      {agency.hours.sunday}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 shrink-0 text-slate-400" />
                <div className="flex gap-1.5">
                  {agency.languages.map((lang) => (
                    <Tag key={lang}>{lang}</Tag>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 shrink-0 text-slate-400" />
                <div className="flex gap-1.5">
                  {agency.eligibility.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
              {agency.accessibility.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-7">
                  {agency.accessibility.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={isInQueue}
              onClick={() => {
                onAdd(agency.id);
                onClose();
              }}
              className="mt-8 w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-light disabled:bg-slate-300"
            >
              {isInQueue ? "Added" : "Add to referral queue"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
