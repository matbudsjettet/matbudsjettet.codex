import { Bell, ChevronRight, Clock, Flame } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";
import { getMealImage } from "@/lib/design/mealImages";

interface WeeklyOverviewProps {
  plan: WeeklyPlan;
  preference: BudgetPreference;
  onAction: (action: "meals" | "shopping" | "tips" | "swap") => void;
  mealImageSrc?: string;
}

const weekdayLabels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const formatNok = (value: number) => `${value.toLocaleString("nb-NO")} kr`;

const WeeklyOverview = ({ mealImageSrc, plan, preference, onAction }: WeeklyOverviewProps) => {
  const spent = plan.summary.weeklyTotalNok;
  const budget = preference.weeklyBudgetNok;
  const remaining = Math.max(0, budget - spent);
  const percent = budget > 0 ? Math.max(0, Math.min(100, Math.round((remaining / budget) * 100))) : 0;
  const featuredMeal = plan.meals[0];
  const featuredMealImage = featuredMeal ? getMealImage(featuredMeal.id, 0) : getMealImage("fallback", 0);
  const weekdayName = new Intl.DateTimeFormat("nb-NO", { weekday: "long" }).format(new Date());

  return (
    <div className="min-h-screen w-full bg-[#f5f0e8]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 pb-28">
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.76rem] font-semibold capitalize tracking-[0.08em] text-[#8e8375]">{weekdayName}</p>
              <h1 className="mt-1 text-[1.8rem] font-black leading-none tracking-tight text-[#1d1a16]">Hei, André</h1>
              <p className="mt-1 text-[0.92rem] text-[#7c7468]">Rolig uke, god mat og færre småturer.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                aria-label="Varsler"
                className="relative grid h-11 w-11 place-items-center rounded-full bg-white shadow-[0_10px_24px_rgba(33,25,16,0.08)]"
                type="button"
              >
                <Bell size={19} strokeWidth={1.9} className="text-[#5c554b]" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ff8f4d]" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4">
          <Card className="overflow-hidden rounded-[1.45rem] border-0 bg-white p-4 shadow-[0_12px_24px_rgba(33,25,16,0.06)]">
            <div className="grid grid-cols-[minmax(0,1fr)_98px] items-start gap-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8c8172]">Budsjett igjen</p>
                <p className="mt-2 text-[1.8rem] font-black leading-none tracking-tight text-[#1c7c4d]">{formatNok(remaining)}</p>
                <p className="mt-1 text-[0.86rem] text-[#7b7367]">etter ukens plan</p>
              </div>
              <div className="relative h-[98px]">
                <div className="absolute inset-3 rounded-full bg-[radial-gradient(circle,rgba(129,201,149,0.16),rgba(129,201,149,0.02)_70%)]" />
                <img alt={featuredMeal?.name ?? "Middag"} className="absolute inset-0 h-full w-full object-contain" src={mealImageSrc ?? featuredMealImage} />
              </div>
            </div>

            <div className="mt-3.5">
              <div className="mb-2 flex items-center justify-between text-[0.72rem] font-semibold text-[#8a806f]">
                <span>Brukt {formatNok(spent)}</span>
                <span>{percent}% igjen</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#eee6dc]">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${percent}%`,
                    background: "linear-gradient(90deg, #2b8a58 0%, #5fa06d 100%)"
                  }}
                />
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-3 gap-3 border-t border-[#f0ebe4] pt-3">
              <StatChip label="Budsjett" value={formatNok(budget)} />
              <StatChip label="Per dag" value={formatNok(plan.summary.perDayCostNok)} />
              <StatChip label="Varer" value={`${plan.shoppingList.totalItemsToBuy}`} />
            </div>
          </Card>
        </div>

        <div className="px-4">
          <div
            className="relative min-h-[248px] w-full overflow-hidden rounded-[1.6rem] bg-[#5c4a39] shadow-[0_16px_30px_rgba(33,25,16,0.12)]"
            onClick={() => onAction("meals")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onAction("meals");
              }
            }}
            role="button"
            tabIndex={0}
          >
            <img alt={featuredMeal?.name ?? "Dagens middag"} className="absolute inset-0 h-full w-full object-cover" src={mealImageSrc ?? featuredMealImage} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
            <div className="absolute left-4 top-4 z-10">
              <Badge tone="warm">I kveld</Badge>
            </div>
            <button
              aria-label="Åpne ukeplan"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/18 text-white backdrop-blur-md"
              onClick={() => onAction("meals")}
              type="button"
            >
              <ChevronRight size={18} strokeWidth={2.3} />
            </button>
            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-5 pt-16">
              <h3 className="text-[1.55rem] font-black leading-tight text-white">{featuredMeal?.name ?? "Dagens middag"}</h3>
              <p className="mt-1 max-w-[15rem] text-[0.95rem] leading-relaxed text-white/84">
                {featuredMeal?.savingsNote ?? "Ukens anbefalte middag"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/16 px-2.5 py-1 text-[0.76rem] font-medium text-white backdrop-blur-sm">
                  <Clock size={11} />
                  {featuredMeal?.prepTimeMinutes ?? 25} min
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/16 px-2.5 py-1 text-[0.76rem] font-medium text-white backdrop-blur-sm">
                  <Flame size={11} />
                  {formatNok(featuredMeal?.totalPriceNok ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[1.45rem] font-black tracking-tight text-[#1d1a16]">Denne uka</h2>
            <Button className="min-h-[38px] px-3.5 py-2 text-[0.78rem]" onClick={() => onAction("meals")} variant="secondary">Åpne ukeplan</Button>
          </div>
        </div>

        <div className="overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-3 pr-4">
            {plan.meals.slice(0, 5).map((meal, index) => (
              <button
                className="w-[11rem] shrink-0 overflow-hidden rounded-[1.35rem] bg-white text-left shadow-[0_12px_28px_rgba(33,25,16,0.08)]"
                key={meal.id}
                onClick={() => onAction("meals")}
                type="button"
              >
                <div className="relative h-[7.75rem] overflow-hidden">
                  <img alt={meal.name} className="h-full w-full object-cover" src={getMealImage(meal.id, index)} />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[0.68rem] font-semibold text-[#514a42]">
                    {weekdayLabels[index] ?? meal.weekday ?? `Dag ${index + 1}`}
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <div>
                    <p className="line-clamp-1 text-[0.95rem] font-bold text-[#1d1a16]">{meal.name}</p>
                    <p className="mt-1 text-[0.78rem] text-[#7a7369]">{meal.prepTimeMinutes} min • {formatNok(meal.totalPriceNok)}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {meal.categorySignals.budget ? <Badge tone="saving">Billig</Badge> : null}
                    {!meal.categorySignals.budget && meal.prepTimeMinutes <= 25 ? <Badge tone="premium">Rask</Badge> : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between gap-4 rounded-[1.35rem] bg-[#edf3ed] px-4 py-3.5">
            <div>
              <p className="text-[0.98rem] font-black text-[#1d1a16]">Du ligger godt an</p>
              <p className="mt-1 text-[0.88rem] leading-relaxed text-[#5f7a66]">
                {formatNok(remaining)} igjen og {plan.shoppingList.totalItemsToBuy} varer å handle.
              </p>
            </div>
            <Button className="min-h-[40px] shrink-0 px-4 py-2 text-[0.8rem]" onClick={() => onAction("shopping")}>
              Handleliste
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#8a8173]">{label}</p>
      <p className="mt-1 text-[0.95rem] font-bold text-[#1d1a16]">{value}</p>
    </div>
  );
}

export default WeeklyOverview;
