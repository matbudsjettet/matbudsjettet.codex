import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function Section({ eyebrow, title, action, children }: SectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-text-tertiary">{eyebrow}</p> : null}
          <h2 className="text-[1.28rem] font-black tracking-tight text-text-primary">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
