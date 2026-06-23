import { Maximize2, Minimize2 } from "lucide-react";

interface CaseNotesCardProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export function CaseNotesCard({
  notes,
  onNotesChange,
  expanded,
  onExpandedChange,
}: CaseNotesCardProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${
        expanded ? "h-[calc(100vh-5.5rem)]" : ""
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3.5">
        <h2 className="text-sm font-semibold text-slate-900">Case Notes</h2>
        <button
          type="button"
          onClick={() => onExpandedChange(!expanded)}
          className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label={expanded ? "Collapse notes" : "Expand notes"}
          title={expanded ? "Collapse notes" : "Expand notes"}
        >
          {expanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>

      <label htmlFor="case-notes-editor" className="sr-only">
        Case notes
      </label>
      <textarea
        id="case-notes-editor"
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder="Add a note..."
        className={`w-full resize-none border-0 bg-transparent px-4 py-3 text-sm leading-relaxed text-slate-800 placeholder:italic placeholder:text-slate-400 focus:outline-none focus:ring-0 ${
          expanded ? "min-h-0 flex-1" : "h-[88px]"
        }`}
      />
    </div>
  );
}
