import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, CalendarDays, Home, Lightbulb, ShoppingBasket, User } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs } from "@/components/ui/Tabs";
import { buttonTap } from "@/lib/design/animations";
import type { AppView } from "@/types/navigation";

const NON_BACK_VIEWS: AppView[] = ["overview", "meals", "shopping", "tips", "premium"];

const NOW = new Date();
const DATE_LABEL = NOW.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" });

type AppShellProps = {
  activeView: AppView;
  canGoBack?: boolean;
  children: ReactNode;
  onBack?: () => void;
  onNavigate: (view: AppView) => void;
  title: string;
};

export function AppShell({ activeView, canGoBack = false, children, onBack, onNavigate, title }: AppShellProps) {
  const mainRef = useRef<HTMLElement>(null);
  const isOverview = activeView === "overview";

  const tabs = [
    { label: "Oversikt", icon: Home, active: activeView === "overview", onClick: () => onNavigate("overview") },
    { label: "Måltider", icon: CalendarDays, active: activeView === "meals" || activeView === "meal-detail", onClick: () => onNavigate("meals") },
    { label: "Handleliste", icon: ShoppingBasket, active: activeView === "shopping", onClick: () => onNavigate("shopping") },
    { label: "Tips", icon: Lightbulb, active: activeView === "tips", onClick: () => onNavigate("tips") },
    { label: "Profil", icon: User, active: activeView === "premium" || activeView === "settings", onClick: () => onNavigate("premium") },
  ];

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeView]);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">

        {/* Header */}
        <header className="safe-top px-5 pb-2">
          {isOverview ? (
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-[0.72rem] font-semibold capitalize tracking-wide text-text-tertiary">{DATE_LABEL}</p>
                <h1 className="mt-0.5 text-[1.65rem] font-black leading-tight tracking-tight text-text-primary">Oversikt</h1>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  aria-label="Innstillinger"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface shadow-card"
                  onClick={() => onNavigate("settings")}
                  type="button"
                  {...buttonTap}
                >
                  <User size={17} strokeWidth={1.8} className="text-text-secondary" />
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                {canGoBack ? (
                  <motion.button
                    aria-label="Tilbake"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface shadow-card"
                    onClick={onBack}
                    type="button"
                    {...buttonTap}
                  >
                    <ArrowLeft size={17} strokeWidth={2} className="text-text-secondary" />
                  </motion.button>
                ) : null}
                <h1 className="text-[1.65rem] font-black tracking-tight text-text-primary">{title}</h1>
              </div>
              {!canGoBack && (
                <motion.button
                  aria-label="Innstillinger"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface shadow-card"
                  onClick={() => onNavigate("settings")}
                  type="button"
                  {...buttonTap}
                >
                  <User size={17} strokeWidth={1.8} className="text-text-secondary" />
                </motion.button>
              )}
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 space-y-6 px-5 pb-32" ref={mainRef}>
          {children}
        </main>

        {/* Tab bar */}
        <nav className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          <div className="mx-auto max-w-md overflow-hidden rounded-[22px] border border-border bg-surface shadow-elevated">
            <Tabs items={tabs} />
          </div>
        </nav>
      </div>
    </div>
  );
}
