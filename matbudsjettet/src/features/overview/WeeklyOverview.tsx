import type { ReactNode } from "react";
import { Bell, ChevronRight, Clock, Flame, Receipt, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";
import mealImage1 from "../../../assets/meals/meal-1.png";
import mealImage2 from "../../../assets/meals/meal-2.png";
import mealImage3 from "../../../assets/meals/meal-3.png";
import mealImage4 from "../../../assets/meals/meal-4.png";
import mealImage5 from "../../../assets/meals/meal-5.png";
import mealImage6 from "../../../assets/meals/meal-6.png";
import mealImage7 from "../../../assets/meals/meal-7.png";

interface WeeklyOverviewProps {
  plan: WeeklyPlan;
  preference: BudgetPreference;
  onAction: (action: "meals" | "shopping" | "tips" | "swap") => void;
  mealImageSrc?: string;
}

const mealImages = [mealImage1, mealImage2, mealImage3, mealImage4, mealImage5, mealImage6, mealImage7];
const weekdayLabels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const formatNok = (value: number) => `${value.toLocaleString("nb-NO")} kr`;

const WeeklyOverview = ({ mealImageSrc, plan, preference, onAction }: WeeklyOverviewProps) => {
  const spent = plan.summary.weeklyTotalNok;
  const budget = preference.weeklyBudgetNok;
  const remaining = Math.max(0, budget - spent);
  const percent = budget > 0 ? Math.max(0, Math.min(100, Math.round((remaining / budget) * 100))) : 0;
  const featuredMeal = plan.meals[0];
  const weekdayName = new Intl.DateTimeFormat("nb-NO", { weekday: "long" }).format(new Date());

  return (
    <div className="min-h-screen w-full bg-[#f5f0e8]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5 pb-28">
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.76rem] font-semibold capitalize tracking-[0.08em] text-[#8e8375]">{weekdayName}</p>
              <h1 className="mt-1 text-[2rem] font-black leading-none tracking-tight text-[#1d1a16]">Hei, André</h1>
              <p className="mt-1.5 text-[0.95rem] text-[#7c7468]">Planen din er satt opp for lav friksjon og gode handler.</p>
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
          <Card className="overflow-hidden rounded-[1.7rem] border-0 bg-white p-5 shadow-[0_18px_36px_rgba(33,25,16,0.08)]">
            <div className="grid grid-cols-[minmax(0,1fr)_124px] items-start gap-4">
              <div>
                <p className="text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-[#8c8172]">Ukens budsjett</p>
                <p className="mt-3 text-[2.4rem] font-black leading-none tracking-tight text-[#1c8f55]">{formatNok(remaining)}</p>
                <p className="mt-2 text-[0.95rem] text-[#7b7367]">igjen etter planlagte middager denne uken</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ecf8ef] px-3 py-1.5 text-[0.78rem] font-semibold text-[#1f9758]">
                  <Sparkles size={13} strokeWidth={2} />
                  Du ligger godt an
                </div>
              </div>
              <div className="relative h-[124px]">
                <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(129,201,149,0.24),rgba(129,201,149,0.02)_68%)]" />
                <img
                  alt={featuredMeal?.name ?? "Middag"}
                  className="absolute inset-0 h-full w-full object-contain"
                  src={mealImageSrc ?? mealImage1}
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[0.76rem] font-semibold text-[#8a806f]">
                <span>Brukt {formatNok(spent)}</span>
                <span>{percent}% igjen</span>
              </div>
              <div className="h-3.5 w-full rounded-full bg-[#efe9df]">
                <div
                  className="h-3.5 rounded-full"
                  style={{
                    width: `${percent}%`,
                    background: "linear-gradient(90deg, #2cb768 0%, #8bcf4a 44%, #ffb347 78%, #ff8b4f 100%)"
                  }}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <StatChip icon={<Receipt size={15} strokeWidth={2.1} />} label="Budsjett" value={formatNok(budget)} />
              <StatChip icon={<TrendingUp size={15} strokeWidth={2.1} />} label="Per dag" value={formatNok(plan.summary.perDayCostNok)} />
              <StatChip icon={<ShoppingBag size={15} strokeWidth={2.1} />} label="Handleliste" value={`${plan.shoppingList.totalItemsToBuy} varer`} />
            </div>
          </Card>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#8f8475]">Neste måltid</p>
              <h2 className="mt-1 text-[1.5rem] font-black tracking-tight text-[#1d1a16]">Dagens middag</h2>
            </div>
            <Button className="min-h-[42px] px-4 py-2 text-[0.82rem]" onClick={() => onAction("meals")} variant="secondary">
              Åpne ukeplan
            </Button>
          </div>
        </div>

        <div className="px-4">
          <div
            className="relative min-h-[254px] w-full overflow-hidden rounded-[1.7rem] bg-[#5c4a39] shadow-[0_18px_36px_rgba(33,25,16,0.14)]"
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
            <img
              alt={featuredMeal?.name ?? "Dagens middag"}
              className="absolute inset-0 h-full w-full object-cover"
              src={mealImageSrc ?? mealImage1}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
            <div className="absolute left-4 top-4 z-10">
              <Badge tone="warm">Anbefalt i dag</Badge>
            </div>
            <button
              aria-label="Se ukeplan"
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
            <button className="text-[0.82rem] font-semibold text-[#6d665d]" onClick={() => onAction("meals")} type="button">
              Se alle
            </button>
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
                  <img alt={meal.name} className="h-full w-full object-cover" src={mealImages[index % mealImages.length]} />
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
                    {meal.categorySignals.family ? <Badge tone="warm">Familie</Badge> : null}
                    {meal.prepTimeMinutes <= 25 ? <Badge tone="premium">Rask</Badge> : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4">
          <Card className="rounded-[1.5rem] border-0 bg-[#edf7ef] p-4.5 shadow-[0_12px_28px_rgba(81,120,89,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[1.02rem] font-black text-[#1d1a16]">Du sparer godt denne uka</p>
                <p className="mt-1 text-[0.92rem] leading-relaxed text-[#5f7a66]">
                  Planen holder deg pa {formatNok(remaining)} igjen av budsjettet og gir et jevnt prisniva gjennom uka.
                </p>
              </div>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/80 text-[#2aa95f] shadow-[0_8px_18px_rgba(81,120,89,0.08)]">
                <Sparkles size={20} strokeWidth={2.1} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="min-h-[44px] flex-1 text-[0.84rem]" onClick={() => onAction("shopping")}>
                Åpne handleliste
              </Button>
              <Button className="min-h-[44px] px-4 text-[0.84rem]" onClick={() => onAction("tips")} variant="secondary">
                Spartips
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

function StatChip({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] bg-[#faf7f1] px-3 py-3">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#238f56] shadow-[0_6px_14px_rgba(33,25,16,0.05)]">
        {icon}
      </div>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#8a8173]">{label}</p>
      <p className="mt-1 text-[0.92rem] font-bold text-[#1d1a16]">{value}</p>
    </div>
  );
}

export default WeeklyOverview;
