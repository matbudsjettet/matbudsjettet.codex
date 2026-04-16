import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, Bell, CalendarDays, Home, Plus, Settings, ShoppingBasket, User } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs } from "@/components/ui/Tabs";
import { buttonTap } from "@/lib/design/animations";
import type { AppView } from "@/types/navigation";

type AppShellProps = {
  activeView: AppView;
  canGoBack?: boolean;
  children: ReactNode;
  onBack?: () => void;
  onNavigate: (view: AppView) => void;
  subtitle?: string;
  title: string;
};

export function AppShell({
  activeView,
  canGoBack = false,
  children,
  onBack,
  onNavigate,
  subtitle = "Matbudsjettet",
  title
}: AppShellProps) {
  const mainRef = useRef<HTMLElement>(null);
  const isOverview = activeView === "overview";
  const tabs = [
    {
      label: "Hjem",
      icon: Home,
      active: activeView === "overview",
      activeColor: "#44D07B",
      onClick: () => onNavigate("overview")
    },
    {
      label: "Ukeplan",
      icon: CalendarDays,
      active: activeView === "meals",
      activeColor: "#1E88E5",
      onClick: () => onNavigate("meals")
    },
    {
      label: "Handle",
      icon: ShoppingBasket,
      active: activeView === "shopping",
      activeColor: "#8c867d",
      onClick: () => onNavigate("shopping")
    },
    {
      label: "",
      icon: Plus,
      center: true,
      active: activeView === "tips",
      activeColor: "#34c86a",
      onClick: () => onNavigate("tips")
    },
    {
      label: "Profil",
      icon: User,
      active: activeView === "premium",
      activeColor: "#8c867d",
      onClick: () => onNavigate("premium")
    }
  ];

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeView]);

  return (
    <div className="min-h-screen text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
        <header className="safe-top px-app-5 pb-4">
          {isOverview ? (
            <div className="flex items-start justify-between gap-4 pt-1.5">
              <div className="min-w-0">
                <h1 className="text-[1.72rem] font-black leading-[1.05] tracking-tight text-text-primary">Hei, Andreas! 👋</h1>
                <p className="mt-2 text-[0.92rem] font-medium text-[#7f7a72]">Du sparer bra denne uka</p>
              </div>
              <motion.button
                aria-label="Varsler"
                className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#f1e7d9] bg-white text-text-primary shadow-[0_8px_22px_rgba(42,31,16,0.08)] transition-[transform,opacity,border-color] duration-200"
                onClick={() => onNavigate("settings")}
                type="button"
                {...buttonTap}
              >
                <Bell size={19} strokeWidth={2.2} />
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#ff7448] px-1 text-[0.56rem] font-black leading-none text-white">
                  2
                </span>
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-app-3">
                {canGoBack ? (
                  <motion.button
                    aria-label="Tilbake"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-surface text-text-secondary shadow-app transition-[transform,opacity,border-color] duration-200"
                    onClick={onBack}
                    type="button"
                    {...buttonTap}
                  >
                    <ArrowLeft size={19} />
                  </motion.button>
                ) : null}
                <div>
                  <p className="text-caption font-bold uppercase tracking-[0.08em] text-text-tertiary">{subtitle}</p>
                  <h1 className="mt-1 text-[2.35rem] font-black tracking-tight text-text-primary">{title}</h1>
                </div>
              </div>
              <motion.button
                aria-label="Innstillinger"
                className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-surface text-text-primary shadow-app transition-[transform,opacity,border-color] duration-200"
                onClick={() => onNavigate("settings")}
                type="button"
                {...buttonTap}
              >
                <Settings size={22} strokeWidth={2.4} />
              </motion.button>
            </div>
          )}
        </header>

        <main className="flex-1 space-y-8 px-app-5 pb-28" ref={mainRef}>
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-20 px-app-4 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1.5">
          <div
            className="mx-auto max-w-md rounded-[24px] border border-[#f2e9dc] bg-white px-2 py-1.5 shadow-[0_12px_28px_rgba(42,31,16,0.08)]"
            style={{
              boxShadow: "0 12px 28px rgba(42,31,16,0.08)"
            }}
          >
            <Tabs items={tabs} />
          </div>
        </nav>
      </div>
    </div>
  );
}
