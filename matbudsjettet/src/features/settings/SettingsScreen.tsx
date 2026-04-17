import { Bell, ChevronRight, Globe, HelpCircle, Info, LogOut, Palette, RotateCcw, Settings2, Shield, User2 } from "lucide-react";
import { motion } from "framer-motion";
import { pageTransition, sectionVariants } from "@/lib/design/animations";
import { formatCompactNok } from "@/lib/utils/format";
import { getPlanModeLabel } from "@/features/share/shareCardData";
import type { BudgetPreference, WeeklyRoutineState } from "@/types/domain";

type Props = {
  onRestartOnboarding: () => void;
  preference: BudgetPreference;
  routine: WeeklyRoutineState;
};

export function SettingsScreen({ onRestartOnboarding, preference, routine }: Props) {

  const profileRows = [
    { icon: User2, label: "Familie", value: `${preference.householdSize} medlemmer` },
    { icon: Settings2, label: "Budsjett", value: `${formatCompactNok(preference.weeklyBudgetNok)} per uke` },
    { icon: Settings2, label: "Preferanser", value: getPlanModeLabel(preference.planMode) },
    { icon: Settings2, label: "Abonnement", value: "Gratis" },
  ];

  const settingsRows = [
    { icon: Bell, label: "Varsler", value: "På" },
    { icon: Globe, label: "Språk", value: "Norsk" },
    { icon: Palette, label: "Tema", value: "Lyst" },
    { icon: Shield, label: "Personvern", value: "" },
    { icon: HelpCircle, label: "Hjelp & support", value: "" },
    { icon: Info, label: "Om Matbudsjett", value: "Versjon 1.0.0" },
  ];

  return (
    <motion.div animate="animate" className="space-y-6" initial="initial" transition={pageTransition} variants={sectionVariants}>

      {/* Profile card */}
      <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
        <div className="px-5 pt-6 pb-5 flex items-center gap-4">
          <div className="h-[64px] w-[64px] shrink-0 rounded-full bg-gradient-to-br from-brand to-[#4CAF76] flex items-center justify-center text-white text-[1.5rem] font-black">
            🧑
          </div>
          <div>
            <p className="text-[1.1rem] font-black text-text-primary">Din familie</p>
            <p className="text-[0.82rem] text-text-tertiary mt-0.5">
              Familie på {preference.householdSize} person{preference.householdSize > 1 ? "er" : ""}
            </p>
          </div>
        </div>

        <div className="border-t border-border-subtle">
          {profileRows.map((row, i) => (
            <button
              key={row.label}
              className={`flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-bg-elevated active:bg-bg-elevated ${i > 0 ? "border-t border-border-subtle" : ""}`}
              onClick={row.label === "Familie" || row.label === "Budsjett" || row.label === "Preferanser" ? onRestartOnboarding : undefined}
              type="button"
            >
              <row.icon size={17} className="text-text-tertiary shrink-0" strokeWidth={1.8} />
              <span className="flex-1 text-[0.875rem] font-semibold text-text-primary">{row.label}</span>
              <span className="text-[0.82rem] text-text-tertiary">{row.value}</span>
              <ChevronRight size={15} className="text-text-tertiary shrink-0" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Favoritter", value: routine.mealPreferences.favoriteMealIds.length, emoji: "❤️" },
          { label: "Uker planlagt", value: routine.weeklyHistory.length, emoji: "📅" },
          { label: "Ikke ofte", value: routine.mealPreferences.dislikedMealIds.length, emoji: "👎" },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl bg-surface border border-border shadow-card p-4 text-center">
            <p className="text-xl">{stat.emoji}</p>
            <p className="mt-2 text-[1.25rem] font-black text-text-primary">{stat.value}</p>
            <p className="mt-0.5 text-[0.68rem] font-semibold text-text-tertiary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Settings list */}
      <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
        {settingsRows.map((row, i) => (
          <button
            key={row.label}
            className={`flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-bg-elevated active:bg-bg-elevated ${i > 0 ? "border-t border-border-subtle" : ""}`}
            type="button"
          >
            <row.icon size={17} className="text-text-tertiary shrink-0" strokeWidth={1.8} />
            <span className="flex-1 text-[0.875rem] font-semibold text-text-primary">{row.label}</span>
            {row.value && <span className="text-[0.82rem] text-text-tertiary">{row.value}</span>}
            <ChevronRight size={15} className="text-text-tertiary shrink-0" strokeWidth={2} />
          </button>
        ))}
      </div>

      {/* Reset */}
      <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
        <button
          className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-bg-elevated active:bg-bg-elevated"
          onClick={onRestartOnboarding}
          type="button"
        >
          <RotateCcw size={17} className="text-brand shrink-0" strokeWidth={2} />
          <div className="flex-1">
            <p className="text-[0.875rem] font-bold text-text-primary">Start oppsett på nytt</p>
            <p className="text-[0.75rem] text-text-tertiary mt-0.5">Endre budsjett, husholdning eller preferanser</p>
          </div>
          <ChevronRight size={15} className="text-text-tertiary" strokeWidth={2} />
        </button>
      </div>

      {/* Logout */}
      <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
        <button
          className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-bg-elevated"
          type="button"
        >
          <LogOut size={17} className="text-danger shrink-0" strokeWidth={1.8} />
          <span className="text-[0.875rem] font-bold text-danger">Logg ut</span>
        </button>
      </div>

      <p className="text-center text-[0.72rem] text-text-tertiary pb-2">Matbudsjett · Versjon 1.0.0</p>
    </motion.div>
  );
}
