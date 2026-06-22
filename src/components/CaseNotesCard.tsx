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
  const notes = caseId === CASE_NUMBER ? demoNotes : [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Case Notes</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        {notes.length === 0 ? (
          <li className="text-slate-400">No notes yet</li>
        ) : (
          notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="text-slate-400">•</span>
              <span>{note}</span>
            </li>
          ))
        )}
      </ul>
      <p className="mt-3 text-xs text-slate-400 transition-opacity">{saveLabel}</p>
    </div>
  );
}
