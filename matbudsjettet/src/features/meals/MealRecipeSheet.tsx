import { X, Clock3, ChefHat } from "lucide-react";
import { getRecipeDefinition } from "@/lib/data/recipes";
import type { HouseholdSize, PlannedMeal } from "@/types/domain";

type Props = { householdSize: HouseholdSize; meal: PlannedMeal; onClose: () => void; };

export function MealRecipeSheet({ householdSize, meal, onClose }: Props) {
  const recipe = getRecipeDefinition(meal, householdSize);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black/40" onClick={onClose}>
      <div
        className="mt-auto max-h-[88vh] overflow-y-auto rounded-t-3xl bg-background"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-2">
          <div>
            <p className="text-[0.72rem] font-semibold text-text-tertiary">Oppskrift</p>
            <h2 className="text-[1.25rem] font-black tracking-tight text-text-primary">{meal.name}</h2>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface"
            onClick={onClose}
            type="button"
          >
            <X size={17} strokeWidth={2} className="text-text-secondary" />
          </button>
        </div>

        {/* Info pills */}
        <div className="flex gap-2 px-5 pb-4">
          <div className="flex items-center gap-1.5 rounded-xl bg-surface-soft px-3 py-1.5 text-[0.78rem] font-semibold text-text-secondary">
            <Clock3 size={13} />{recipe.timeMinutes} min
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-surface-soft px-3 py-1.5 text-[0.78rem] font-semibold text-text-secondary">
            <ChefHat size={13} />{meal.difficulty === "easy" ? "Enkel" : "Middels"}
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-surface-soft px-3 py-1.5 text-[0.78rem] font-semibold text-text-secondary">
            👥 {householdSize} pers.
          </div>
        </div>

        <div className="px-5 pb-8 space-y-6">
          {/* Ingredients */}
          <section>
            <h3 className="text-[0.875rem] font-black text-text-primary mb-3">Ingredienser</h3>
            <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
              {recipe.ingredients.map((ing: string, i: number) => (
                <div
                  key={i}
                  className={`flex items-center px-4 py-3 ${i > 0 ? "border-t border-border-subtle" : ""}`}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-brand mr-3 shrink-0" />
                  <p className="text-[0.875rem] text-text-primary">{ing}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Steps */}
          <section>
            <h3 className="text-[0.875rem] font-black text-text-primary mb-3">Fremgangsmåte</h3>
            <div className="space-y-3">
              {recipe.steps.map((step: string, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-white text-[0.72rem] font-black">
                    {i + 1}
                  </div>
                  <p className="flex-1 text-[0.875rem] text-text-secondary leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          {recipe.notes && recipe.notes.length > 0 && (
            <section>
              <h3 className="text-[0.875rem] font-black text-text-primary mb-2">Tips</h3>
              <div className="rounded-2xl bg-[#EBF5EF] border border-saving-border p-4 space-y-2">
                {recipe.notes.map((note: string, i: number) => (
                  <p key={i} className="text-[0.82rem] text-brand">💡 {note}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
