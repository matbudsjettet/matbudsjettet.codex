import { RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getPlanModeLabel } from "@/features/share/shareCardData";
import { stores } from "@/lib/data/stores";
import { formatCompactNok } from "@/lib/utils/format";
import type { BudgetPreference, WeeklyRoutineState } from "@/types/domain";

type SettingsScreenProps = {
  onRestartOnboarding: () => void;
  preference: BudgetPreference;
  routine: WeeklyRoutineState;
};

export function SettingsScreen({ onRestartOnboarding, preference, routine }: SettingsScreenProps) {
  const store = stores.find((item) => item.id === preference.preferredStore);

  return (
    <div className="space-y-app-6">
      <Section eyebrow="Innstillinger" title="Planvaner">
        <Card className="p-app-4" variant="surface">
          <div className="flex items-start gap-app-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-surface text-text-secondary">
              <Settings size={20} />
            </div>
            <div>
              <p className="font-black text-text-primary">Lagrede valg</p>
              <p className="mt-1 text-body-sm text-text-secondary">
                {preference.householdSize} personer · {formatCompactNok(preference.weeklyBudgetNok)} ·{" "}
                {getPlanModeLabel(preference.planMode)} · {store?.name}
              </p>
            </div>
          </div>
        </Card>
      </Section>

      <Section eyebrow="Ukentlig bruk" title="Historikk">
        <Card className="p-app-4" variant="default">
          <div className="grid grid-cols-3 gap-app-2 text-center">
            <Metric label="Favoritter" value={routine.mealPreferences.favoriteMealIds.length} />
            <Metric label="Ikke ofte" value={routine.mealPreferences.dislikedMealIds.length} />
            <Metric label="Uker" value={routine.weeklyHistory.length} />
          </div>
        </Card>
      </Section>

      <Card className="p-app-4" variant="surface">
        <div className="flex items-start gap-app-3">
          <RotateCcw className="shrink-0 text-saving" size={20} />
          <div>
            <p className="font-black text-text-primary">Start oppsett på nytt</p>
            <p className="mt-1 text-body-sm text-text-secondary">
              Bruk dette hvis husholdning, budsjett eller matvaner har endret seg.
            </p>
          </div>
        </div>
        <Button className="mt-app-4 w-full" onClick={onRestartOnboarding} type="button" variant="secondary">
          Gå til onboarding
        </Button>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-app-3">
      <p className="text-headline text-text-primary">{value}</p>
      <p className="text-caption text-text-tertiary">{label}</p>
    </div>
  );
}
