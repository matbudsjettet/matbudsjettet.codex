import type { ReactNode } from "react";

export function Section({ eyebrow, title, action, children }: {
  eyebrow?: string; title?: string; action?: ReactNode; children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      {(eyebrow || title || action) && (
        <div className="flex items-end justify-between gap-3">
          <div>
            {eyebrow && <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-text-tertiary">{eyebrow}</p>}
            {title && <h2 className="mt-0.5 text-[1.05rem] font-black tracking-tight text-text-primary">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
