import type { ReactNode } from "react";

interface IntakeShellProps {
  contextPanel: ReactNode;
  mainContent: ReactNode;
  rightPanel: ReactNode;
}

export function IntakeShell({
  contextPanel,
  mainContent,
  rightPanel,
}: IntakeShellProps) {
  return (
    <div
      id="workspace-scroll"
      className="h-full scroll-pt-40 overflow-y-auto overflow-x-hidden bg-white"
    >
      <div className="grid grid-cols-[280px_minmax(680px,1fr)_360px] items-start">
        <aside className="sticky top-0 self-start border-r border-slate-200 bg-page p-4">
          <div className="space-y-4">{contextPanel}</div>
        </aside>
        <main className="bg-page pb-12">{mainContent}</main>
        <aside className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col self-start border-l border-slate-200 bg-white">
          {rightPanel}
        </aside>
      </div>
    </div>
  );
}
