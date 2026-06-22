import { Maximize2 } from "lucide-react";
import { useState } from "react";
import { CASE_NUMBER } from "../data/constants";

interface CaseNotesCardProps {
  saveLabel: string;
  caseId: string;
}

const demoNotes = [
  "Client seems hesitant",
  "Mentioned sister as potential safe contact",
  "Prior shelter contact approximately two years ago",
];

export function CaseNotesCard({ saveLabel, caseId }: CaseNotesCardProps) {
  const [notes, setNotes] = useState(
    caseId === CASE_NUMBER ? demoNotes.join("\n\n") : "",
  );
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Case notes
        </h2>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label={expanded ? "Collapse notes" : "Expand notes"}
          title={expanded ? "Collapse notes" : "Expand notes"}
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <label htmlFor="case-notes-editor" className="sr-only">
        Case notes
      </label>
      <textarea
        id="case-notes-editor"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add a note…"
        className={`min-h-0 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent ${
          expanded ? "min-h-[70vh]" : "min-h-[calc(100vh-12rem)]"
        }`}
      />

      <p className="mt-2 text-xs text-slate-400">{saveLabel}</p>
    </div>
  );
}
