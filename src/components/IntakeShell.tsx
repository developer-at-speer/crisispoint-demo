import type { ReactNode } from "react";

interface IntakeShellProps {
  contextPanel: ReactNode;
  notesPanel?: ReactNode;
  mainContent: ReactNode;
  rightPanel: ReactNode;
}

export function IntakeShell({
  contextPanel,
  notesPanel,
  mainContent,
  rightPanel,
}: IntakeShellProps) {
  const notesExpanded = notesPanel != null;

  return (
    <div
      id="workspace-scroll"
      className="h-full scroll-pt-40 overflow-y-auto overflow-x-hidden bg-white"
    >
      <div
        className={`grid items-start ${
          notesExpanded
            ? "grid-cols-[280px_300px_minmax(560px,1fr)_360px]"
            : "grid-cols-[280px_minmax(680px,1fr)_360px]"
        }`}
      >
        <aside className="sticky top-0 self-start border-r border-slate-200 bg-page p-4">
          {contextPanel}
        </aside>

        {notesExpanded ? (
          <aside className="sticky top-0 border-r border-slate-200 bg-page p-4">
            {notesPanel}
          </aside>
        ) : null}

        <main className="bg-page pb-12">{mainContent}</main>

        <aside className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col self-start border-l border-slate-200 bg-white">
          {rightPanel}
        </aside>
      </div>
    </div>
  );
}
