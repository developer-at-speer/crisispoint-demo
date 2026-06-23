import type { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";

interface IntakeSectionProps {
  id: string;
  title: string;
  tier: string;
  tierVariant?: "urgent" | "fastPath" | "normal" | "muted";
  sectionClassName?: string;
  beforeContent?: ReactNode;
  children: ReactNode;
}

export function IntakeSection({
  id,
  title,
  tier,
  tierVariant = "normal",
  sectionClassName = "",
  beforeContent,
  children,
}: IntakeSectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-40 overflow-visible rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${sectionClassName}`}
    >
      <SectionHeader title={title} tier={tier} tierVariant={tierVariant} />
      {beforeContent}
      <div className="space-y-6">{children}</div>
    </section>
  );
}
