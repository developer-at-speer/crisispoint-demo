import { Maximize2 } from "lucide-react";
import { useState } from "react";
import { CASE_NUMBER } from "../data/constants";

interface CaseNotesCardProps {
  caseId: string;
}

const demoNotes = [
  "Client seems hesitant",
  "Mentioned sister as potential safe contact",
  "Prior shelter contact approximately two years ago",
];

export function CaseNotesCard({ caseId }: CaseNotesCardProps) {
  const [notes, setNotes] = useState(
    caseId === CASE_NUMBER ? demoNotes.join("\n\n") : "",
  );
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${
        expanded ? "fixed inset-4 z-50" : "h-full"
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3.5">
        <h2 className="text-sm font-semibold text-slate-900">Case Notes</h2>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
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
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Add a note..."
        className="min-h-0 flex-1 resize-none border-0 bg-transparent px-4 py-4 text-sm leading-relaxed text-slate-800 placeholder:italic placeholder:text-slate-400 focus:outline-none focus:ring-0"
      />
    </div>
  );
}
