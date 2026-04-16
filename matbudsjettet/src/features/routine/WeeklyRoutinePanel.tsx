import { CalendarDays, Heart, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import type { WeeklyRoutineState } from "@/types/domain";

type WeeklyRoutinePanelProps = {
  onRefreshWeek: () => void;
  routine: WeeklyRoutineState;
};

export function WeeklyRoutinePanel({ onRefreshWeek, routine }: WeeklyRoutinePanelProps) {
  const favoriteCount = routine.mealPreferences.favoriteMealIds.length;
  const dislikedCount = routine.mealPreferences.dislikedMealIds.length;
  const repeatCheapCount = routine.mealPreferences.repeatCheapMealIds.length;

  return (
    <Section eyebrow="Ukentlig rytme" title="Neste uke blir smartere">
      <Card className="p-app-4" variant="surface">
        <div className="flex items-start gap-app-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-surface text-saving">
            <CalendarDays size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-text-primary">Vanene dine er lagret lokalt</p>
            <p className="mt-1 text-body-sm text-text-secondary">
              Favoritter, retter du vil se sjeldnere og billige gjengangere brukes når ukeplanen friskes opp.
            </p>
          </div>
        </div>

        <div className="mt-app-4 grid grid-cols-3 gap-app-2 text-center">
          <RoutineMetric icon={<Heart size={16} />} label="Favoritter" value={favoriteCount} />
          <RoutineMetric icon={<RotateCcw size={16} />} label="Billig igjen" value={repeatCheapCount} />
          <RoutineMetric icon={<CalendarDays size={16} />} label="Ikke ofte" value={dislikedCount} />
        </div>

        <Button className="mt-app-4 w-full" onClick={onRefreshWeek} type="button" variant="secondary">
          Frisk opp ukeplanen
        </Button>
      </Card>
    </Section>
  );
}

function RoutineMetric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-app-3">
      <div className="mx-auto grid h-8 w-8 place-items-center rounded-md bg-saving-bg text-saving">{icon}</div>
      <p className="mt-app-2 text-headline text-text-primary">{value}</p>
      <p className="text-caption text-text-tertiary">{label}</p>
    </div>
  );
}
