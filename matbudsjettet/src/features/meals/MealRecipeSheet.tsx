import type { HouseholdSize, PlannedMeal } from "@/types/domain";
import { AnimatePresence, motion } from "framer-motion";
import { Clock3, X } from "lucide-react";
import { buttonTap, modalBackdropVariants, modalSheetVariants, pageTransition } from "@/lib/design/animations";
import { getRecipeDefinition } from "@/lib/data/recipes";

type MealRecipeSheetProps = {
  meal: PlannedMeal;
  householdSize: HouseholdSize;
  onClose: () => void;
};

export function MealRecipeSheet({ meal, householdSize, onClose }: MealRecipeSheetProps) {
  const recipe = getRecipeDefinition(meal, householdSize);

  return (
    <AnimatePresence>
      <motion.div
        animate="animate"
        className="fixed inset-0 z-50 flex items-end bg-text-primary/30 px-app-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        exit="exit"
        initial="initial"
        onClick={onClose}
        transition={pageTransition}
        variants={modalBackdropVariants}
      >
        <motion.div
          animate="animate"
          className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface p-app-5 shadow-app"
          exit="exit"
          initial="initial"
          onClick={(event) => event.stopPropagation()}
          transition={pageTransition}
          variants={modalSheetVariants}
        >
          <div className="flex items-start justify-between gap-app-3">
            <div>
              <p className="text-body-sm font-black text-text-secondary">Oppskrift</p>
              <h2 className="mt-1 text-title text-text-primary">{recipe.title}</h2>
            </div>
            <motion.button
              aria-label="Lukk oppskrift"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-text-secondary shadow-app"
              onClick={onClose}
              type="button"
              {...buttonTap}
            >
              <X size={18} />
            </motion.button>
          </div>

          <div className="mt-app-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-app-3 py-app-2 text-body-sm font-semibold text-text-secondary">
            <Clock3 size={16} />
            {recipe.timeMinutes} min
          </div>

          <div className="mt-app-6">
            <h3 className="text-headline text-text-primary">Du trenger</h3>
            <ul className="mt-app-3 space-y-app-2">
              {recipe.ingredients.slice(0, 7).map((ingredient) => (
                <li className="rounded-xl bg-bg-elevated px-app-4 py-app-3 text-body-sm text-text-primary" key={ingredient}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-app-6">
            <h3 className="text-headline text-text-primary">Slik gjør du</h3>
            <ol className="mt-app-3 space-y-app-2">
              {recipe.steps.slice(0, 5).map((step, index) => (
                <li className="flex items-start gap-app-3 rounded-xl bg-bg-elevated px-app-4 py-app-3" key={step}>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface text-caption font-black text-text-primary shadow-app">
                    {index + 1}
                  </span>
                  <span className="text-body-sm text-text-primary">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {recipe.notes?.length ? (
            <div className="mt-app-4">
              {recipe.notes.map((note) => (
                <p className="text-body-sm text-text-secondary" key={note}>
                  {note}
                </p>
              ))}
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
