import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function Section({ eyebrow, title, action, children }: SectionProps) {
  return (
    <section className="space-y-app-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-caption uppercase text-text-tertiary">{eyebrow}</p> : null}
          <h2 className="text-title text-text-primary">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
