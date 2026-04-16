import { Check, Crown, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createPremiumOptimizationPreview } from "@/lib/engines/premiumOptimizationEngine";
import { formatCompactNok } from "@/lib/utils/format";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";

type PaywallScreenProps = {
  onClose: () => void;
  plan?: WeeklyPlan;
  preference?: BudgetPreference;
};

type PaywallValue = {
  comparisonLabel: string;
  differenceNok?: number;
  differenceLabel: string;
  hasDynamicData: boolean;
  monthlyLabel: string;
  optimizedTotalNok?: number;
  optimizedTotalLabel: string;
  originalTotalNok?: number;
  originalTotalLabel: string;
  weeklySavingsNok?: number;
  weeklySavingsLabel: string;
};

const monthlyPriceNok = 49;

export function PaywallScreen({ onClose, plan, preference }: PaywallScreenProps) {
  const [ctaPressed, setCtaPressed] = useState(false);
  const value = useMemo(() => getPaywallValue(plan, preference), [plan, preference]);

  const handleStartTrial = () => {
    setCtaPressed(true);
    window.setTimeout(() => setCtaPressed(false), 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-app-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
        <header className="sticky top-0 z-10 -mx-app-5 flex items-center justify-between border-b border-border-subtle bg-background px-app-5 py-app-3">
          <button
            aria-label="Lukk"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border-subtle bg-surface text-text-secondary"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
          <p className="text-body-sm font-black text-text-primary">Matbudsjettet Pro</p>
          <div className="h-10 w-10" />
        </header>

        <main className="flex-1 space-y-app-4 py-app-5">
          <PaywallHero value={value} />
          <PaywallComparison value={value} />
          <PaywallValueBullets value={value} />
          <PaywallPricing />

          <div className="rounded-lg border border-premium-border bg-premium-bg px-app-3 py-app-2 text-center text-body-sm font-black text-premium">
            7 dager gratis • Ingen binding
          </div>

          <Button className="mt-app-6 w-full" onClick={handleStartTrial} type="button" variant="premium">
            {ctaPressed ? "Klar for prøveperiode" : "Start gratis prøveperiode"}
          </Button>

          <div className="space-y-1 text-center text-caption text-text-tertiary">
            <p>Avslutt når som helst i App Store</p>
            <p>Ingen skjulte kostnader</p>
          </div>
        </main>
      </div>
    </div>
  );
}

function PaywallHero({ value }: { value: PaywallValue }) {
  return (
    <section className="rounded-lg border border-premium-border bg-premium-bg p-app-5 text-center shadow-app">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-surface text-premium">
        <Crown size={22} />
      </div>
      <h1 className="mt-app-4 text-title text-text-primary">
        Du kan spare{" "}
        {value.weeklySavingsNok ? (
          <AnimatedNumber className="text-saving" value={value.weeklySavingsNok} />
        ) : (
          value.weeklySavingsLabel
        )}{" "}
        denne uken
      </h1>
      <p className="mt-app-2 text-body font-bold text-saving">{value.monthlyLabel}</p>
      <p className="mt-app-2 text-caption text-text-tertiary">
        {value.hasDynamicData ? "Basert på ukeplanen din" : "Realistisk estimat før ukeplanen er klar"}
      </p>
    </section>
  );
}

function PaywallComparison({ value }: { value: PaywallValue }) {
  return (
    <Card className="p-app-4" variant="default">
      <div className="grid grid-cols-2 gap-app-3">
        <ComparisonColumn label="Uten Pro" value={value.originalTotalLabel} valueNok={value.originalTotalNok} />
        <ComparisonColumn label="Med Pro" tone="saving" value={value.optimizedTotalLabel} valueNok={value.optimizedTotalNok} />
      </div>
      <div className="mt-app-4 rounded-lg bg-saving-bg p-app-3 text-center">
        <p className="text-caption text-saving">{value.comparisonLabel}</p>
        <p className="mt-1 text-headline text-saving">
          Spar{" "}
          {value.differenceNok ? (
            <AnimatedNumber value={value.differenceNok} />
          ) : (
            value.differenceLabel
          )}
        </p>
      </div>
    </Card>
  );
}

function ComparisonColumn({
  label,
  tone = "neutral",
  value,
  valueNok
}: {
  label: string;
  tone?: "neutral" | "saving";
  value: string;
  valueNok?: number;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-app-3">
      <p className="text-caption text-text-tertiary">{label}</p>
      <p className={tone === "saving" ? "mt-app-2 text-headline text-saving" : "mt-app-2 text-headline text-text-primary"}>
        {valueNok ? <AnimatedNumber pulse={tone === "saving"} value={valueNok} /> : value}
      </p>
    </div>
  );
}

function PaywallValueBullets({ value }: { value: PaywallValue }) {
  const valueBullets = [
    "Finn billigste butikk for hver vare",
    value.hasDynamicData
      ? `Estimert sparepotensial på ${value.weeklySavingsLabel} denne uken`
      : "Realistisk spareområde før live priser er klare",
    "Automatisk optimalisert handleliste",
    "Smarte bytteforslag som kutter kostnader"
  ];

  return (
    <Card className="p-app-4" variant="surface">
      <div className="space-y-app-3">
        {valueBullets.map((bullet) => (
          <div className="flex items-center gap-app-3 text-body-sm font-bold text-text-secondary" key={bullet}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-saving-bg text-saving">
              <Check size={15} strokeWidth={3} />
            </span>
            <span>{bullet}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PaywallPricing() {
  return (
    <Card className="p-app-4 text-center" variant="default">
      <p className="text-title text-text-primary">{monthlyPriceNok} kr / måned</p>
      <p className="mt-app-1 text-body-sm font-bold text-text-secondary">ca. 1,60 kr per dag</p>
    </Card>
  );
}

const getPaywallValue = (plan?: WeeklyPlan, preference?: BudgetPreference): PaywallValue => {
  if (plan && preference) {
    const preview = createPremiumOptimizationPreview(plan, preference, true);
    const optimizedTotal = Math.max(0, plan.summary.weeklyTotalNok - preview.estimatedExtraSavingsNok);
    const monthlySavings = preview.estimatedExtraSavingsNok * 4;

    return {
      comparisonLabel: "Avrundet estimat fra ukeplanen din",
      differenceNok: preview.estimatedExtraSavingsNok,
      differenceLabel: formatCompactNok(preview.estimatedExtraSavingsNok),
      hasDynamicData: true,
      monthlyLabel: `Det er over ${formatCompactNok(Math.floor(monthlySavings / 10) * 10)} per måned`,
      optimizedTotalNok: optimizedTotal,
      optimizedTotalLabel: formatCompactNok(optimizedTotal),
      originalTotalNok: plan.summary.weeklyTotalNok,
      originalTotalLabel: formatCompactNok(plan.summary.weeklyTotalNok),
      weeklySavingsNok: preview.estimatedExtraSavingsNok,
      weeklySavingsLabel: formatCompactNok(preview.estimatedExtraSavingsNok)
    };
  }

  return {
    comparisonLabel: "Estimert spareområde",
    differenceLabel: "200-400 kr",
    hasDynamicData: false,
    monthlyLabel: "Det er anslagsvis 800-1600 kr per måned",
    optimizedTotalLabel: "lavere ukehandel",
    originalTotalLabel: "ordinær ukehandel",
    weeklySavingsLabel: "200-400 kr"
  };
};
