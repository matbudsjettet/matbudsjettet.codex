import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, CalendarDays, Home, Lightbulb, ShoppingBasket, User } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs } from "@/components/ui/Tabs";
import { buttonTap } from "@/lib/design/animations";
import type { AppView } from "@/types/navigation";
import { cn } from "@/lib/utils/cn";

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
        <header className={cn("safe-top pb-2", isOverview ? "px-0" : "px-5")}>
          {isOverview ? <div className="h-2" /> : (
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
        <main className={cn("flex-1 pb-32", isOverview ? "" : "space-y-6 px-5")} ref={mainRef}>
          {children}
        </main>

        {/* Tab bar */}
        <nav className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2">
          <div className="mx-auto max-w-md overflow-hidden rounded-[24px] border border-[#ece3d8] bg-[rgba(255,255,255,0.92)] shadow-[0_18px_42px_rgba(33,25,16,0.12)] backdrop-blur-xl">
            <Tabs items={tabs} />
          </div>
        </nav>
      </div>
    </div>
  );
}
