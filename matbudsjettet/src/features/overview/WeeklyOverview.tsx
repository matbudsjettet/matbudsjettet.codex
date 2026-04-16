import { Bell, ChevronRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";
import mealImage1 from "../../../assets/meals/meal-1.png";


interface WeeklyOverviewProps {
  plan: WeeklyPlan;
  preference: BudgetPreference;
  onAction: (action: "meals" | "shopping" | "tips" | "swap") => void;
  mealImageSrc?: string;
}

const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({ mealImageSrc, plan, preference, onAction }) => {
  const spent = plan.summary.weeklyTotalNok;
  const budget = preference.weeklyBudgetNok;
  const remaining = Math.max(0, budget - spent);
  const percent = budget > 0 ? Math.max(0, Math.min(100, Math.round((remaining / budget) * 100))) : 0;
  const featuredMeal = plan.meals[0];

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-md mx-auto flex flex-col gap-4 pb-28">

        {/* Top bar */}
        <div className="flex items-center justify-between pt-4 px-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-green-700">
            Oversikt
          </span>
          <div className="flex items-center gap-3">
            <button
              aria-label="Varsler"
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
            >
              <Bell size={20} strokeWidth={1.8} />
            </button>
            <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold select-none">
              A
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="px-4 pt-1">
          <h1 className="text-2xl font-bold text-stone-900 mt-0.5 leading-tight">
            God kveld, André! 👋
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Her er planen for uken din
          </p>
        </div>

        {/* Budget card */}
        <div className="px-4">
          <Card className="rounded-[1.35rem] border-0 bg-white p-4.5 shadow-[0_10px_24px_rgba(28,25,23,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
              Ditt budsjett
            </p>
            <div className="mb-3.5 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-stone-900 leading-none">
                {remaining.toLocaleString("nb-NO")} kr
              </span>
              <span className="text-sm text-stone-400 mb-0.5">
                igjen av {budget.toLocaleString("nb-NO")} kr
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-stone-100/95">
              <div
                className="h-3 rounded-full bg-green-700"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-stone-400">{percent} %</p>
          </Card>
        </div>

        {/* Week summary card */}
        <div className="px-4">
          <Card className="rounded-[1.35rem] border-0 bg-white p-4.5 shadow-[0_10px_24px_rgba(28,25,23,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                  Uken din
                </p>
                <p className="text-base font-semibold text-stone-900">
                  {plan.meals.length} av 7 middager planlagt
                </p>
              </div>
              <Button
                onClick={() => onAction("meals")}
                variant="secondary"
                className="rounded-xl bg-green-50 px-3 py-2 text-green-700 hover:bg-green-100 font-semibold text-sm whitespace-nowrap border-0 shadow-none"
              >
                Se ukeplan
              </Button>
            </div>
          </Card>
        </div>

        {/* Featured meal card */}
        <div className="px-4">
          <div
            className="relative min-h-[208px] w-full overflow-hidden rounded-[1.35rem] bg-stone-600 text-left shadow-[0_12px_28px_rgba(28,25,23,0.1)]"
            onClick={() => onAction("meals")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onAction("meals");
              }
            }}
          >
            <img
              src={mealImageSrc ?? mealImage1}
              alt={featuredMeal?.name ?? "Dagens middag"}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top label */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-sm">
                Dagens middag
              </span>
            </div>

            {/* Arrow CTA */}
            <button
              aria-label="Se oppskrift"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              onClick={() => onAction("meals")}
              type="button"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>

            {/* Bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/75 to-black/10 px-4 pb-4.5 pt-16">
              <h2 className="text-[1.35rem] font-bold leading-tight text-white">
                {featuredMeal?.name ?? "Dagens middag"}
              </h2>
              <p className="mt-0.5 text-sm text-white/82">
                {featuredMeal?.savingsNote ?? "Ukens anbefalte middag"}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white bg-white/20 backdrop-blur-sm">
                  <Clock size={11} />
                  {featuredMeal?.prepTimeMinutes ?? 25} min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings card */}
        <div className="px-4">
          <Card className="rounded-[1.35rem] border-0 bg-[#edf7ef] p-4.5 shadow-[0_10px_24px_rgba(81,120,89,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-stone-900">
                  Du sparer godt!
                </p>
                <p className="text-sm text-green-800/80 mt-0.5">
                  Du har spart{" "}
                  <span className="font-bold text-green-700">{remaining.toLocaleString("nb-NO")} kr</span>{" "}
                  så langt denne uken
                </p>
              </div>
              <span className="text-4xl select-none ml-3 leading-none">🌱</span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default WeeklyOverview;
