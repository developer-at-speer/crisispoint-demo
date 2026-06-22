import type { ReactNode } from "react";
import { PageTransition } from "../components/PageTransition";

interface StandardPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function StandardPageLayout({
  title,
  subtitle,
  children,
}: StandardPageLayoutProps) {
  return (
    <div
      id="workspace-scroll"
      className="h-full overflow-y-auto overflow-x-hidden bg-page"
    >
      <PageTransition>
        <div className="mx-auto max-w-5xl p-8">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            )}
          </header>
          {children}
        </div>
      </PageTransition>
    </div>
  );
}
