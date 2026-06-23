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

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-3 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Case notes
        </h2>
      </div>

      <label htmlFor="case-notes-editor" className="sr-only">
        Case notes
      </label>
      <textarea
        id="case-notes-editor"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Add a note…"
        className="h-[100px] w-full resize-none border-0 bg-transparent px-3 py-3 text-sm leading-relaxed text-slate-800 placeholder:italic placeholder:text-slate-400 focus:outline-none focus:ring-0"
      />
    </div>
  );
}
