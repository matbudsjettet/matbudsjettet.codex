import { ArrowLeft, Check, ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buttonTap, onboardingStepVariants, pageTransition } from "@/lib/design/animations";
import { cn } from "@/lib/utils/cn";
import { formatCompactNok } from "@/lib/utils/format";
import type { HouseholdSize, PlanMode, StoreId } from "@/types/domain";

export type OnboardingState = {
  budgetNok: number;
  householdSize: HouseholdSize;
  pantryIngredientIds: string[];
  planMode: PlanMode;
  preferredStore: StoreId;
  shoppingStyle: "one-store" | "best-solution";
};

type OnboardingFlowProps = {
  initialState: OnboardingState;
  onComplete: (state: OnboardingState) => void;
};

const totalSteps = 5;

const planModes: Array<{ description: string; label: string; value: PlanMode }> = [
  { label: "Spare mest", value: "save-most", description: "Flere enkle og rimelige middager." },
  { label: "Balansert", value: "balanced", description: "Litt av alt, uten å presse budsjettet." },
  { label: "Proteinrikt", value: "protein", description: "Mer fisk, kylling, egg og mettende retter." },
  { label: "Familievennlig", value: "family", description: "Trygge middager som passer flere." },
  { label: "Raskt og enkelt", value: "quick", description: "Kortere tid på kjøkkenet." },
  { label: "Litt ekstra", value: "extra", description: "Rom for en hyggeligere middag." }
];

const pantryOptions = [
  { id: "rice", label: "Ris" },
  { id: "pasta", label: "Pasta" },
  { id: "oil", label: "Olje" },
  { id: "salt-pepper", label: "Salt og pepper" },
  { id: "spices", label: "Krydder" },
  { id: "tomatoes-canned", label: "Hermetiske tomater" },
  { id: "flour", label: "Mel" }
];

export function OnboardingFlow({ initialState, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState(initialState);
  const canGoBack = step > 0;

  const updateState = (partial: Partial<OnboardingState>) => {
    setState((current) => ({ ...current, ...partial }));
  };

  const goNext = () => {
    if (step === totalSteps - 1) {
      onComplete(state);
      return;
    }

    setStep((current) => current + 1);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-app-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
        <header className="flex items-center justify-between py-app-3">
          <button
            aria-label="Tilbake"
            className={cn(
              "grid h-10 w-10 place-items-center rounded-lg border border-border-subtle bg-surface text-text-secondary transition",
              canGoBack ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            type="button"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-body-sm font-black">Matbudsjettet</p>
            <p className="text-caption text-text-tertiary">Steg {step + 1}/{totalSteps}</p>
          </div>
          <div className="h-10 w-10" />
        </header>

        <ProgressDots currentStep={step} />

        <main className="flex flex-1 flex-col justify-center py-app-5">
          <AnimatePresence mode="wait">
            <motion.div
              animate="animate"
              exit="exit"
              initial="initial"
              key={step}
              transition={pageTransition}
              variants={onboardingStepVariants}
            >
              {step === 0 ? <HouseholdStep state={state} updateState={updateState} /> : null}
              {step === 1 ? <BudgetStep state={state} updateState={updateState} /> : null}
              {step === 2 ? <ModeStep state={state} updateState={updateState} /> : null}
              {step === 3 ? <ShoppingStep state={state} updateState={updateState} /> : null}
              {step === 4 ? <PantryStep state={state} updateState={updateState} /> : null}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="space-y-app-3 pb-app-2">
          <Button className="w-full justify-between" onClick={goNext} type="button">
            {step === totalSteps - 1 ? "Generer ukeplan" : "Neste"}
            <ChevronRight size={18} />
          </Button>
          <p className="text-center text-caption text-text-tertiary">
            Du kan endre alt senere når ukeplanen er klar.
          </p>
        </footer>
      </div>
    </div>
  );
}

function ProgressDots({ currentStep }: { currentStep: number }) {
  return (
    <div className="grid grid-cols-5 gap-app-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          animate={{ opacity: 1, scaleX: 1 }}
          className={cn(
            "h-1.5 rounded-lg transition",
            index <= currentStep ? "bg-saving" : "bg-neutral-200"
          )}
          initial={{ opacity: 0.55, scaleX: 0.9 }}
          key={index}
          transition={{ duration: 0.22, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function StepIntro({ children, title }: { children: string; title: string }) {
  return (
    <div className="mb-app-5 space-y-app-2">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-saving-bg text-saving">
        <Sparkles size={20} />
      </div>
      <h1 className="text-title text-text-primary">{title}</h1>
      <p className="text-body-sm text-text-secondary">{children}</p>
    </div>
  );
}

function ChoiceCard({
  description,
  label,
  onClick,
  selected
}: {
  description?: string;
  label: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <motion.button className="w-full text-left" onClick={onClick} type="button" {...buttonTap}>
      <Card
        className={cn(
          "flex min-h-16 items-center justify-between gap-app-3 p-app-4 transition active:scale-[0.99]",
          selected ? "border-saving-border bg-saving-bg" : ""
        )}
        variant="surface"
      >
        <span>
          <span className="block font-black text-text-primary">{label}</span>
          {description ? <span className="mt-1 block text-body-sm text-text-secondary">{description}</span> : null}
        </span>
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-md border",
            selected ? "border-saving bg-saving text-white" : "border-border bg-surface text-transparent"
          )}
        >
          <Check size={15} strokeWidth={3} />
        </span>
      </Card>
    </motion.button>
  );
}

function HouseholdStep({
  state,
  updateState
}: {
  state: OnboardingState;
  updateState: (partial: Partial<OnboardingState>) => void;
}) {
  const options: HouseholdSize[] = [1, 2, 3, 4, 5, 6];

  return (
    <section>
      <StepIntro title="Hvor mange spiser du for?">Vi bruker dette til å beregne riktige porsjoner og handleliste.</StepIntro>
      <div className="space-y-app-3">
        {options.map((size) => (
          <ChoiceCard
            key={size}
            label={size === 1 ? "1 person" : `${size} personer`}
            onClick={() => updateState({ householdSize: size })}
            selected={state.householdSize === size}
          />
        ))}
      </div>
    </section>
  );
}

function BudgetStep({
  state,
  updateState
}: {
  state: OnboardingState;
  updateState: (partial: Partial<OnboardingState>) => void;
}) {
  const presets = [700, 1000, 1400, 2000];

  return (
    <section>
      <StepIntro title="Hva er vanlig middagsbudsjett per uke?">Velg et nivå som føles realistisk, ikke perfekt.</StepIntro>
      <Card className="p-app-4" variant="surface">
        <p className="text-center text-display text-text-primary">{formatCompactNok(state.budgetNok)}</p>
        <input
          className="mt-app-5 w-full accent-brand"
          max={2500}
          min={500}
          onChange={(event) => updateState({ budgetNok: Number(event.target.value) })}
          step={50}
          style={{ accentColor: "var(--color-saving)" }}
          type="range"
          value={state.budgetNok}
        />
        <div className="mt-app-4 grid grid-cols-4 gap-app-2">
          {presets.map((preset) => (
            <motion.button
              className={cn(
                "min-h-10 rounded-lg border px-2 text-caption font-black",
                state.budgetNok === preset
                  ? "border-saving-border bg-saving-bg text-saving"
                  : "border-border-subtle bg-surface text-text-secondary"
              )}
              key={preset}
              onClick={() => updateState({ budgetNok: preset })}
              type="button"
              {...buttonTap}
            >
              {preset} kr
            </motion.button>
          ))}
        </div>
      </Card>
    </section>
  );
}

function ModeStep({
  state,
  updateState
}: {
  state: OnboardingState;
  updateState: (partial: Partial<OnboardingState>) => void;
}) {
  return (
    <section>
      <StepIntro title="Hva er viktigst for deg denne uken?">Dette styrer hvilke middager Matbudsjettet prioriterer.</StepIntro>
      <div className="space-y-app-3">
        {planModes.map((mode) => (
          <ChoiceCard
            description={mode.description}
            key={mode.value}
            label={mode.label}
            onClick={() => updateState({ planMode: mode.value })}
            selected={state.planMode === mode.value}
          />
        ))}
      </div>
    </section>
  );
}

function ShoppingStep({
  state,
  updateState
}: {
  state: OnboardingState;
  updateState: (partial: Partial<OnboardingState>) => void;
}) {
  return (
    <section>
      <StepIntro title="Hvordan handler du vanligvis?">Vi tilpasser plan og prislogikk etter handlemåten din.</StepIntro>
      <div className="space-y-app-3">
        <ChoiceCard
          description="Planen holder seg praktisk og samlet."
          label="Jeg handler mest i én butikk"
          onClick={() => updateState({ shoppingStyle: "one-store" })}
          selected={state.shoppingStyle === "one-store"}
        />
        <ChoiceCard
          description="Du får flere forslag til optimalisering."
          label="Vis meg beste løsning"
          onClick={() => updateState({ shoppingStyle: "best-solution" })}
          selected={state.shoppingStyle === "best-solution"}
        />
      </div>

      <div className="mt-app-5">
        <p className="mb-app-2 text-caption text-text-tertiary">Foretrukket butikk</p>
        <div className="grid grid-cols-3 gap-app-2">
          {[
            { label: "KIWI", value: "KIWI" },
            { label: "REMA 1000", value: "REMA_1000" },
            { label: "MENY", value: "MENY" }
          ].map((store) => (
            <motion.button
              className={cn(
                "min-h-12 rounded-lg border px-app-2 text-caption font-black",
                state.preferredStore === store.value
                  ? "border-saving-border bg-saving-bg text-saving"
                  : "border-border-subtle bg-surface text-text-secondary"
              )}
              key={store.value}
              onClick={() => updateState({ preferredStore: store.value as StoreId })}
              type="button"
              {...buttonTap}
            >
              {store.label}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function PantryStep({
  state,
  updateState
}: {
  state: OnboardingState;
  updateState: (partial: Partial<OnboardingState>) => void;
}) {
  const togglePantryItem = (id: string) => {
    const next = state.pantryIngredientIds.includes(id)
      ? state.pantryIngredientIds.filter((item) => item !== id)
      : [...state.pantryIngredientIds, id];

    updateState({ pantryIngredientIds: next });
  };

  return (
    <section>
      <StepIntro title="Har du ofte disse basisvarene hjemme?">Da trekker vi dem ut av handlelisten når det passer.</StepIntro>
      <div className="grid grid-cols-2 gap-app-3">
        {pantryOptions.map((item) => {
          const selected = state.pantryIngredientIds.includes(item.id);

          return (
            <motion.button
              className={cn(
                "flex min-h-14 items-center justify-between rounded-lg border p-app-3 text-left text-body-sm font-black transition",
                selected
                  ? "border-saving-border bg-saving-bg text-saving"
                  : "border-border-subtle bg-surface text-text-primary"
              )}
              key={item.id}
              onClick={() => togglePantryItem(item.id)}
              type="button"
              {...buttonTap}
            >
              {item.label}
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-md border",
                  selected ? "border-saving bg-saving text-white" : "border-border text-transparent"
                )}
              >
                <Check size={14} strokeWidth={3} />
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
