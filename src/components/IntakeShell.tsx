import type { ReactNode } from "react";

interface IntakeShellProps {
  navigatePanel: ReactNode;
  notesPanel: ReactNode;
  mainContent: ReactNode;
  rightPanel: ReactNode;
}

export function IntakeShell({
  navigatePanel,
  notesPanel,
  mainContent,
  rightPanel,
}: IntakeShellProps) {
  return (
    <div
      id="workspace-scroll"
      className="h-full scroll-pt-40 overflow-y-auto overflow-x-hidden bg-white"
    >
      <div className="grid min-h-full grid-cols-[260px_300px_minmax(560px,1fr)_360px] items-stretch">
        <aside className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col border-r border-slate-200 bg-page p-4">
          {navigatePanel}
        </aside>

        <aside className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col border-r border-slate-200 bg-page p-4">
          {notesPanel}
        </aside>

        <main className="bg-page pb-12">{mainContent}</main>

        <aside className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col self-start border-l border-slate-200 bg-white">
          {rightPanel}
        </aside>
      </div>
    </div>
  );
}
