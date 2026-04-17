import { Check, Crown, X } from "lucide-react";
import { useState, useMemo } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { createPremiumOptimizationPreview } from "@/lib/engines/premiumOptimizationEngine";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";

type Props = { onClose: () => void; plan?: WeeklyPlan; preference?: BudgetPreference; };

const monthlyPriceNok = 49;

const features = [
  "Ubegrenset antall planer",
  "Flere smarte spartips",
  "Eksklusive oppskrifter",
  "Prioritert support",
];

export function PaywallScreen({ onClose, plan, preference }: Props) {
  const [pressed, setPressed] = useState(false);
  const savings = useMemo(() => {
    if (!plan || !preference) return null;
    const preview = createPremiumOptimizationPreview(plan, preference, true);
    return preview.estimatedExtraSavingsNok;
  }, [plan, preference]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">

        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <button
            aria-label="Lukk"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface"
            onClick={onClose}
            type="button"
          >
            <X size={17} strokeWidth={2} className="text-text-secondary" />
          </button>
          <p className="text-[0.875rem] font-bold text-text-primary">Matbudsjett+</p>
          <div className="h-10 w-10" />
        </header>

        {/* Hero */}
        <div className="rounded-2xl bg-[#1A3225] text-white p-6 text-center mb-5">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#D4A017]/20 mb-4">
            <Crown size={28} className="text-[#D4A017]" strokeWidth={2} />
          </div>
          <h1 className="text-[1.65rem] font-black tracking-tight leading-snug">Matbudsjett+</h1>
          <p className="mt-2 text-[0.875rem] text-white/70">Få enda mer ut av appen</p>

          {savings && savings > 0 && (
            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <p className="text-[0.78rem] text-white/60">Du kan spare ytterligere</p>
              <p className="text-[2rem] font-black mt-1">
                <AnimatedNumber value={savings} /> kr
              </p>
              <p className="text-[0.78rem] text-white/60 mt-0.5">denne uken med Pro</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden mb-4">
          {features.map((f, i) => (
            <div key={f} className={`flex items-center gap-3.5 px-5 py-4 ${i > 0 ? "border-t border-border-subtle" : ""}`}>
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-saving-bg">
                <Check size={15} strokeWidth={3} className="text-saving" />
              </div>
              <p className="text-[0.875rem] font-semibold text-text-primary">{f}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="rounded-2xl bg-surface border border-border shadow-card p-5 text-center mb-4">
          <p className="text-[2rem] font-black text-text-primary">{monthlyPriceNok} kr</p>
          <p className="text-[0.875rem] text-text-secondary">per måned · ca. 1,60 kr per dag</p>
        </div>

        {/* Trial note */}
        <div className="rounded-2xl bg-[#EBF5EF] border border-saving-border px-4 py-3 text-center text-[0.82rem] font-bold text-brand mb-4">
          7 dager gratis · Ingen bindingstid
        </div>

        {/* CTA */}
        <Button
          className="w-full bg-[#D4A017] text-white border-[#D4A017] hover:bg-[#C08F10]"
          onClick={() => setPressed(true)}
          size="lg"
          type="button"
        >
          {pressed ? "Klar! ✓" : "Prøv gratis i 7 dager"}
        </Button>

        <div className="mt-3 space-y-1 text-center text-[0.75rem] text-text-tertiary">
          <p>Avslutt når som helst i App Store</p>
          <p>Ingen skjulte kostnader</p>
        </div>
      </div>
    </div>
  );
}
