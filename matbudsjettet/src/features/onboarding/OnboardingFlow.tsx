import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { buttonTap } from "@/lib/design/animations";
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

type Props = { initialState: OnboardingState; onComplete: (state: OnboardingState) => void; };

const totalSteps = 5;

const planModes: Array<{ description: string; label: string; value: PlanMode }> = [
  { label: "Spare mest", value: "save-most", description: "Rimelige og mettende middager." },
  { label: "Balansert", value: "balanced", description: "Litt av alt, uten å presse budsjettet." },
  { label: "Proteinrikt", value: "protein", description: "Mer fisk, kylling og egg." },
  { label: "Familievennlig", value: "family", description: "Trygge middager alle liker." },
  { label: "Raskt og enkelt", value: "quick", description: "Under 30 min på kjøkkenet." },
  { label: "Litt ekstra", value: "extra", description: "Rom for en hyggeligere middag." },
];

const pantryOptions = [
  { id: "rice", label: "Ris" }, { id: "pasta", label: "Pasta" }, { id: "oil", label: "Olje" },
  { id: "salt-pepper", label: "Salt & pepper" }, { id: "spices", label: "Krydder" },
  { id: "tomatoes-canned", label: "Hermetiske tomater" }, { id: "flour", label: "Mel" },
];

const stepTitles = [
  "Hvordan mange er dere?",
  "Hva er ukesbudsjettet?",
  "Hva er viktigst for dere?",
  "Hvor handler du?",
  "Hva har du allerede hjemme?",
];

const stepSubtitles = [
  "Vi beregner riktige porsjoner og handleliste.",
  "Vi lager en plan som passer akkurat for deg.",
  "Vi tilpasser ukeplanen etter dine preferanser.",
  "Vi finner de beste prisene i din butikk.",
  "Disse ingrediensene holdes utenfor handlelisten.",
];

const stepEmojis = ["👨‍👩‍👧‍👦", "💰", "🎯", "🛒", "🏠"];

export function OnboardingFlow({ initialState, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState(initialState);
  const canGoBack = step > 0;

  const updateState = (partial: Partial<OnboardingState>) => setState(c => ({ ...c, ...partial }));

  const goNext = () => {
    if (step === totalSteps - 1) { onComplete(state); return; }
    setStep(c => c + 1);
  };

  // Step 0 = welcome slide
  if (step === -1) {
    return <WelcomeSlide onStart={() => setStep(0)} />;
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">

        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <motion.button
            aria-label="Tilbake"
            className={cn("grid h-10 w-10 place-items-center rounded-full border border-border bg-surface", !canGoBack && "opacity-0 pointer-events-none")}
            onClick={() => setStep(c => Math.max(0, c - 1))}
            type="button"
            {...buttonTap}
          >
            <ArrowLeft size={17} strokeWidth={2} className="text-text-secondary" />
          </motion.button>
          <p className="text-[0.82rem] font-bold text-text-tertiary">Steg {step + 1} av {totalSteps}</p>
          <div className="h-10 w-10" />
        </header>

        {/* Progress */}
        <div className="flex gap-1.5 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn("h-1.5 flex-1 rounded-full transition-all duration-300", i <= step ? "bg-brand" : "bg-surface-soft")}
            />
          ))}
        </div>

        {/* Step content */}
        <main className="flex flex-1 flex-col justify-center py-8">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              key={step}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {/* Step header */}
              <div>
                <div className="mb-4 text-4xl">{stepEmojis[step]}</div>
                <h1 className="text-[1.65rem] font-black tracking-tight text-text-primary leading-snug">
                  {stepTitles[step]}
                </h1>
                <p className="mt-2 text-[0.875rem] text-text-secondary">{stepSubtitles[step]}</p>
              </div>

              {step === 0 && <HouseholdStep state={state} updateState={updateState} />}
              {step === 1 && <BudgetStep state={state} updateState={updateState} />}
              {step === 2 && <ModeStep state={state} updateState={updateState} />}
              {step === 3 && <ShoppingStep state={state} updateState={updateState} />}
              {step === 4 && <PantryStep state={state} updateState={updateState} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="space-y-3">
          <Button className="w-full justify-between" onClick={goNext} size="lg" type="button">
            {step === totalSteps - 1 ? "Generer ukeplan" : "Neste"}
            <ChevronRight size={18} strokeWidth={2.5} />
          </Button>
          <p className="text-center text-[0.75rem] text-text-tertiary">Du kan endre alt dette senere</p>
        </footer>
      </div>
    </div>
  );
}

function WelcomeSlide({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center">
      <div className="text-5xl mb-6">🥗</div>
      <h1 className="text-[2rem] font-black tracking-tight text-text-primary leading-snug">
        Middagsplanlegging<br />
        <span className="text-brand">som sparer deg for<br />tid og penger</span>
      </h1>
      <p className="mt-4 text-[0.9rem] text-text-secondary max-w-xs">
        Få en personlig ukeplan med handleliste tilpasset ditt budsjett og din familie.
      </p>
      <div className="mt-8 space-y-2.5 w-full max-w-xs text-left">
        {["Smarte handlelister", "Tilpasset ditt budsjett", "Enkle og gode oppskrifter"].map(f => (
          <div key={f} className="flex items-center gap-3">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-saving-bg">
              <Check size={13} strokeWidth={3} className="text-saving" />
            </div>
            <p className="text-[0.875rem] font-semibold text-text-primary">{f}</p>
          </div>
        ))}
      </div>
      <Button className="mt-10 w-full max-w-xs justify-between" onClick={onStart} size="lg" type="button">
        Kom i gang <ChevronRight size={18} />
      </Button>
    </div>
  );
}

function HouseholdStep({ state, updateState }: { state: OnboardingState; updateState: (p: Partial<OnboardingState>) => void }) {
  const options: HouseholdSize[] = [1, 2, 3, 4, 5, 6];
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-5">
        <button
          className="grid h-14 w-14 place-items-center rounded-full bg-surface border border-border shadow-card text-[1.5rem] font-black text-text-primary transition-all active:scale-95"
          onClick={() => updateState({ householdSize: Math.max(1, state.householdSize - 1) as HouseholdSize })}
          type="button"
        >−</button>
        <div className="text-center">
          <span className="text-[4rem] font-black text-text-primary leading-none">{state.householdSize}</span>
          <p className="text-[0.82rem] font-medium text-text-tertiary mt-1">person{state.householdSize > 1 ? "er" : ""}</p>
        </div>
        <button
          className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-saving text-[1.5rem] font-black transition-all active:scale-95"
          onClick={() => updateState({ householdSize: Math.min(6, state.householdSize + 1) as HouseholdSize })}
          type="button"
        >+</button>
      </div>
      <div className="flex gap-2">
        {options.map(s => (
          <button
            key={s}
            className={cn("h-10 w-10 rounded-xl text-[0.875rem] font-bold transition-all", state.householdSize === s ? "bg-brand text-white" : "bg-surface-soft text-text-tertiary")}
            onClick={() => updateState({ householdSize: s })}
            type="button"
          >{s}</button>
        ))}
      </div>
    </div>
  );
}

function BudgetStep({ state, updateState }: { state: OnboardingState; updateState: (p: Partial<OnboardingState>) => void }) {
  const presets = [500, 800, 1000, 1500, 2000, 2500];
  return (
    <div className="space-y-4">
      <div className="text-center">
        <span className="text-[3rem] font-black text-brand">{formatCompactNok(state.budgetNok)}</span>
        <p className="text-[0.82rem] text-text-tertiary">per uke</p>
      </div>
      <input
        className="w-full rounded-xl border border-border bg-surface-soft h-2 accent-brand"
        max={5000} min={300} step={100}
        type="range"
        value={state.budgetNok}
        onChange={e => updateState({ budgetNok: Number(e.target.value) })}
      />
      <div className="flex flex-wrap gap-2">
        {presets.map(p => (
          <button
            key={p}
            className={cn("flex-1 rounded-xl py-2.5 text-[0.82rem] font-bold transition-all", state.budgetNok === p ? "bg-brand text-white" : "bg-surface-soft text-text-secondary")}
            onClick={() => updateState({ budgetNok: p })}
            type="button"
          >{formatCompactNok(p)}</button>
        ))}
      </div>
    </div>
  );
}

function ModeStep({ state, updateState }: { state: OnboardingState; updateState: (p: Partial<OnboardingState>) => void }) {
  return (
    <div className="space-y-2.5">
      {planModes.map(mode => (
        <button
          key={mode.value}
          className={cn("w-full flex items-center justify-between rounded-2xl border p-4 text-left transition-all", state.planMode === mode.value ? "border-saving-border bg-saving-bg" : "border-border bg-surface")}
          onClick={() => updateState({ planMode: mode.value })}
          type="button"
        >
          <div>
            <p className="text-[0.9rem] font-bold text-text-primary">{mode.label}</p>
            <p className="mt-0.5 text-[0.78rem] text-text-secondary">{mode.description}</p>
          </div>
          <div className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all", state.planMode === mode.value ? "border-brand bg-brand" : "border-border")}>
            {state.planMode === mode.value && <Check size={13} strokeWidth={3} className="text-white" />}
          </div>
        </button>
      ))}
    </div>
  );
}

function ShoppingStep({ state, updateState }: { state: OnboardingState; updateState: (p: Partial<OnboardingState>) => void }) {
  const stores: Array<{ id: StoreId; name: string; note: string }> = [
    { id: "KIWI", name: "KIWI", note: "Lavpris, bred dekning" },
    { id: "REMA_1000", name: "REMA 1000", note: "Lavpris, god kvalitet" },
    { id: "MENY", name: "MENY", note: "Større utvalg, litt høyere pris" },
  ];
  return (
    <div className="space-y-2.5">
      {stores.map(store => (
        <button
          key={store.id}
          className={cn("w-full flex items-center justify-between rounded-2xl border p-4 text-left transition-all", state.preferredStore === store.id ? "border-saving-border bg-saving-bg" : "border-border bg-surface")}
          onClick={() => updateState({ preferredStore: store.id })}
          type="button"
        >
          <div>
            <p className="text-[0.9rem] font-bold text-text-primary">{store.name}</p>
            <p className="mt-0.5 text-[0.78rem] text-text-secondary">{store.note}</p>
          </div>
          <div className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all", state.preferredStore === store.id ? "border-brand bg-brand" : "border-border")}>
            {state.preferredStore === store.id && <Check size={13} strokeWidth={3} className="text-white" />}
          </div>
        </button>
      ))}
    </div>
  );
}

function PantryStep({ state, updateState }: { state: OnboardingState; updateState: (p: Partial<OnboardingState>) => void }) {
  const toggle = (id: string) => {
    updateState({ pantryIngredientIds: state.pantryIngredientIds.includes(id)
      ? state.pantryIngredientIds.filter(i => i !== id)
      : [...state.pantryIngredientIds, id] });
  };
  return (
    <div className="flex flex-wrap gap-2.5">
      {pantryOptions.map(item => {
        const selected = state.pantryIngredientIds.includes(item.id);
        return (
          <button
            key={item.id}
            className={cn("flex items-center gap-2 rounded-2xl border px-4 py-3 text-[0.875rem] font-semibold transition-all", selected ? "border-saving-border bg-saving-bg text-saving" : "border-border bg-surface text-text-secondary")}
            onClick={() => toggle(item.id)}
            type="button"
          >
            {selected && <Check size={14} strokeWidth={3} className="text-saving" />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
