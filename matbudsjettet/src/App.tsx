import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/app/AppShell";
import { BudgetSummary } from "@/features/budget/BudgetSummary";
import { MealDetailScreen } from "@/features/meals/MealDetailScreen";
import { MealPlan } from "@/features/meals/MealPlan";
import { MealRecipeSheet } from "@/features/meals/MealRecipeSheet";
import { OnboardingFlow } from "@/features/onboarding/OnboardingFlow";
import type { OnboardingState } from "@/features/onboarding/OnboardingFlow";
import WeeklyOverview from "@/features/overview/WeeklyOverview";
import { PaywallScreen } from "@/features/premium/PaywallScreen";
import { PremiumOptimization } from "@/features/premium/PremiumOptimization";
import { ResultScreen } from "@/features/result/ResultScreen";
import { WeeklyRoutinePanel } from "@/features/routine/WeeklyRoutinePanel";
import { ShareSummarySheet } from "@/features/share/ShareSummaryCard";
import { ShoppingList } from "@/features/shopping/ShoppingList";
import { SavingsTips } from "@/features/tips/SavingsTips";
import { SettingsScreen } from "@/features/settings/SettingsScreen";
import { ingredients } from "@/lib/data/ingredients";
import { meals } from "@/lib/data/meals";
import { defaultPreference } from "@/lib/data/preferences";
import { pageTransition, pageVariants } from "@/lib/design/animations";
import { createWeeklyPlan, refreshWeeklyPlan } from "@/lib/engines/mealGenerationEngine";
import { getMealSwapAlternatives, replaceMealInPlan } from "@/lib/engines/mealSwapEngine";
import { createSavingsTipsPlanHash, generateSavingsTips } from "@/lib/engines/savingsTipEngine";
import { buildShoppingList } from "@/lib/engines/shoppingListEngine";
import { usePersistentState } from "@/lib/hooks/usePersistentState";
import {
  createWeeklyHistoryEntry,
  loadWeeklyRoutineState,
  saveWeeklyRoutineState
} from "@/lib/storage/weeklyRoutineStorage";
import { formatCompactNok } from "@/lib/utils/format";
import type { BudgetPreference, HouseholdSize, MealSwapAlternative, PlanMode, PlannedMeal, StoreId, WeeklyPlan } from "@/types/domain";
import type { AppView } from "@/types/navigation";

const viewTitles: Record<AppView, string> = {
  overview: "Uken din",
  meals: "Ukeplan",
  "meal-detail": "Bytt rett",
  shopping: "Handleliste",
  tips: "Spartips",
  premium: "Pro",
  settings: "Innstillinger"
};

export function App() {
  const [routine, setRoutine] = usePersistentState(loadWeeklyRoutineState, saveWeeklyRoutineState);
  const savedPreference = routine.savedPreference;
  const [selectedStore, setSelectedStore] = useState<StoreId>(savedPreference?.preferredStore ?? defaultPreference.preferredStore);
  const [householdSize, setHouseholdSize] = useState<HouseholdSize>(savedPreference?.householdSize ?? defaultPreference.householdSize);
  const [pantryIngredientIds, setPantryIngredientIds] = useState(savedPreference?.pantryIngredientIds ?? defaultPreference.pantryIngredientIds);
  const [planMode, setPlanMode] = useState<PlanMode>(savedPreference?.planMode ?? defaultPreference.planMode);
  const [shoppingStyle, setShoppingStyle] = useState<OnboardingState["shoppingStyle"]>(savedPreference?.shoppingStyle ?? "one-store");
  const [weeklyBudgetNok, setWeeklyBudgetNok] = useState(savedPreference?.weeklyBudgetNok ?? defaultPreference.weeklyBudgetNok);
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(Boolean(savedPreference));
  const [resultScreenOpen, setResultScreenOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<PlannedMeal | null>(null);
  const [recipeMeal, setRecipeMeal] = useState<PlannedMeal | null>(null);
  const [activeView, setActiveView] = useState<AppView>("overview");
  const [savingsFeedback, setSavingsFeedback] = useState<{ amountNok: number; id: number } | null>(null);
  const pantryIngredientIdsRef = useRef(pantryIngredientIds);
  const mealPreferencesRef = useRef(routine.mealPreferences);

  const preference: BudgetPreference = useMemo(
    () => ({
      ...defaultPreference,
      preferredStore: selectedStore,
      householdSize,
      pantryIngredientIds,
      planMode,
      weeklyBudgetNok
    }),
    [householdSize, pantryIngredientIds, planMode, selectedStore, weeklyBudgetNok]
  );

  const generatedPlan = useMemo(
    () => createWeeklyPlan(meals, ingredients, preference, routine.mealPreferences),
    [preference, routine.mealPreferences]
  );
  const weeklyPlan = currentPlan ?? generatedPlan;
  const savingsPlanHash = useMemo(() => createSavingsTipsPlanHash(weeklyPlan, preference), [weeklyPlan, preference]);
  const swapAlternatives = useMemo(
    () => (selectedMeal ? getMealSwapAlternatives(selectedMeal, weeklyPlan, meals, preference) : []),
    [selectedMeal, weeklyPlan, preference]
  );
  const activeSmartCoachState =
    routine.smartCoach.lastPlanHash === savingsPlanHash
      ? routine.smartCoach
      : { completedTipIds: [], dismissedTipIds: [], lastPlanHash: savingsPlanHash };
  const savingsReport = useMemo(
    () =>
      generateSavingsTips(weeklyPlan, preference, meals, {
        completedTipIds: activeSmartCoachState.completedTipIds,
        dismissedTipIds: activeSmartCoachState.dismissedTipIds,
        planHash: savingsPlanHash
      }),
    [activeSmartCoachState.completedTipIds, activeSmartCoachState.dismissedTipIds, preference, savingsPlanHash, weeklyPlan]
  );
  const storeSavingsHintNok = useMemo(() => {
    if (selectedStore === "KIWI") {
      return 0;
    }

    const kiwiPreference = { ...preference, preferredStore: "KIWI" as const };
    const kiwiPlan = createWeeklyPlan(meals, ingredients, kiwiPreference, routine.mealPreferences);

    return Math.max(0, weeklyPlan.summary.weeklyTotalNok - kiwiPlan.summary.weeklyTotalNok);
  }, [preference, routine.mealPreferences, selectedStore, weeklyPlan.summary.weeklyTotalNok]);

  const planShapeKey = `${selectedStore}-${householdSize}-${planMode}-${weeklyBudgetNok}`;

  useEffect(() => {
    pantryIngredientIdsRef.current = pantryIngredientIds;
  }, [pantryIngredientIds]);

  useEffect(() => {
    mealPreferencesRef.current = routine.mealPreferences;
  }, [routine.mealPreferences]);

  useEffect(() => {
    if (routine.smartCoach.lastPlanHash === savingsPlanHash) {
      return;
    }

    setRoutine((current) => ({
      ...current,
      smartCoach: {
        completedTipIds: [],
        dismissedTipIds: [],
        lastPlanHash: savingsPlanHash
      }
    }));
  }, [routine.smartCoach.lastPlanHash, savingsPlanHash, setRoutine]);

  useEffect(() => {
    const nextPreference: BudgetPreference = {
      ...defaultPreference,
      householdSize,
      pantryIngredientIds: pantryIngredientIdsRef.current,
      planMode,
      preferredStore: selectedStore,
      weeklyBudgetNok
    };

    setCurrentPlan(createWeeklyPlan(meals, ingredients, nextPreference, mealPreferencesRef.current));
    setSelectedMeal(null);
    setRecipeMeal(null);
    setActiveView("overview");
  }, [householdSize, planMode, planShapeKey, selectedStore, weeklyBudgetNok]);

  const handleSelectReplacement = (alternative: MealSwapAlternative) => {
    if (!selectedMeal) {
      return;
    }

    if (alternative.priceDifferenceNok < 0) {
      showSavingsFeedback(Math.abs(alternative.priceDifferenceNok));
    }

    setCurrentPlan((plan) =>
      replaceMealInPlan(plan ?? generatedPlan, selectedMeal.id, alternative.meal, ingredients, preference)
    );
    setSelectedMeal(null);
    setRecipeMeal(null);
    setActiveView("meals");
  };

  const navigateTo = (view: AppView) => {
    setActiveView(view);
    if (view !== "meal-detail") {
      setSelectedMeal(null);
    }
    setRecipeMeal(null);
  };

  const openMealDetail = (meal: PlannedMeal) => {
    setSelectedMeal(meal);
    setActiveView("meal-detail");
  };

  const openRecipe = (meal: PlannedMeal) => {
    setRecipeMeal(meal);
  };

  const handleBack = () => {
    if (activeView === "meal-detail") {
      setSelectedMeal(null);
      setActiveView("meals");
      return;
    }

    setActiveView("overview");
  };

  const saveCurrentPreference = (nextPreference: BudgetPreference, nextShoppingStyle = shoppingStyle) => {
    setRoutine((current) => ({
      ...current,
      savedPreference: {
        ...nextPreference,
        shoppingStyle: nextShoppingStyle
      }
    }));
  };

  const handleCompleteOnboarding = (onboardingState: OnboardingState) => {
    setHouseholdSize(onboardingState.householdSize);
    setPantryIngredientIds(onboardingState.pantryIngredientIds);
    setPlanMode(onboardingState.planMode);
    setSelectedStore(onboardingState.preferredStore);
    setShoppingStyle(onboardingState.shoppingStyle);
    setWeeklyBudgetNok(onboardingState.budgetNok);
    const nextPreference: BudgetPreference = {
      ...defaultPreference,
      householdSize: onboardingState.householdSize,
      pantryIngredientIds: onboardingState.pantryIngredientIds,
      planMode: onboardingState.planMode,
      preferredStore: onboardingState.preferredStore,
      weeklyBudgetNok: onboardingState.budgetNok
    };

    saveCurrentPreference(nextPreference, onboardingState.shoppingStyle);
    setCurrentPlan(createWeeklyPlan(meals, ingredients, nextPreference, routine.mealPreferences));
    setSelectedMeal(null);
    setRecipeMeal(null);
    setActiveView("overview");
    setResultScreenOpen(true);
    setOnboardingComplete(true);
  };

  const handlePantryItemsChange = (nextPantryIngredientIds: string[]) => {
    const nextPreference = {
      ...preference,
      pantryIngredientIds: nextPantryIngredientIds
    };

    setPantryIngredientIds(nextPantryIngredientIds);
    saveCurrentPreference(nextPreference);
    setCurrentPlan((plan) =>
      plan
        ? {
            ...plan,
            shoppingList: buildShoppingList(plan.meals, ingredients, nextPreference)
          }
        : null
    );
  };

  const handleHouseholdSizeChange = (nextHouseholdSize: HouseholdSize) => {
    setHouseholdSize(nextHouseholdSize);
    saveCurrentPreference({ ...preference, householdSize: nextHouseholdSize });
  };

  const handleStoreChange = (nextStore: StoreId) => {
    const nextPreference = { ...preference, preferredStore: nextStore };
    const nextPlan = createWeeklyPlan(meals, ingredients, nextPreference, routine.mealPreferences);
    const savingsNok = weeklyPlan.summary.weeklyTotalNok - nextPlan.summary.weeklyTotalNok;

    if (savingsNok > 0) {
      showSavingsFeedback(savingsNok);
    }

    setSelectedStore(nextStore);
    saveCurrentPreference(nextPreference);
  };

  const handleWeeklyBudgetChange = (nextBudgetNok: number) => {
    setWeeklyBudgetNok(nextBudgetNok);
    saveCurrentPreference({ ...preference, weeklyBudgetNok: nextBudgetNok });
  };

  const handleRefreshWeek = () => {
    const refreshedPlan = refreshWeeklyPlan(meals, ingredients, preference, routine.mealPreferences);

    setCurrentPlan(refreshedPlan);
    setSelectedMeal(null);
    setRecipeMeal(null);
    setActiveView("overview");
    setRoutine((current) => ({
      ...current,
      lastGeneratedAt: new Date().toISOString(),
      weeklyHistory: [createWeeklyHistoryEntry(refreshedPlan), ...current.weeklyHistory].slice(0, 8)
    }));
  };

  const handleOverviewAction = (action: "meals" | "shopping" | "tips" | "swap") => {
    if (action === "meals") {
      navigateTo("meals");
      return;
    }

    if (action === "shopping") {
      navigateTo("shopping");
      return;
    }

    if (action === "tips") {
      navigateTo("tips");
      return;
    }

    const swapCandidate = [...weeklyPlan.meals].sort((a, b) => b.totalPriceNok - a.totalPriceNok)[0];
    if (swapCandidate) {
      openMealDetail(swapCandidate);
    }
  };

  const handleRestartOnboarding = () => {
    setOnboardingComplete(false);
    setResultScreenOpen(false);
    setActiveView("overview");
    setSelectedMeal(null);
    setRecipeMeal(null);
  };

  const markTipCompleted = (tipId: string) => {
    setRoutine((current) => ({
      ...current,
      smartCoach: {
        ...current.smartCoach,
        completedTipIds: current.smartCoach.completedTipIds.includes(tipId)
          ? current.smartCoach.completedTipIds
          : [...current.smartCoach.completedTipIds, tipId],
        dismissedTipIds: current.smartCoach.dismissedTipIds.filter((id) => id !== tipId),
        lastPlanHash: savingsPlanHash
      }
    }));
  };

  const dismissTip = (tipId: string) => {
    setRoutine((current) => ({
      ...current,
      smartCoach: {
        ...current.smartCoach,
        completedTipIds: current.smartCoach.completedTipIds.filter((id) => id !== tipId),
        dismissedTipIds: current.smartCoach.dismissedTipIds.includes(tipId)
          ? current.smartCoach.dismissedTipIds
          : [...current.smartCoach.dismissedTipIds, tipId],
        lastPlanHash: savingsPlanHash
      }
    }));
  };

  const resultSavingsNok = Math.max(0, weeklyPlan.summary.budgetComparison.differenceNok);

  const showSavingsFeedback = (amountNok: number) => {
    const id = Date.now();
    setSavingsFeedback({ amountNok, id });
    window.setTimeout(() => {
      setSavingsFeedback((current) => (current?.id === id ? null : current));
    }, 1100);
  };

  const renderMealPlan = () => (
    <MealPlan meals={weeklyPlan.meals} onOpenRecipe={openRecipe} />
  );

  const renderActiveView = () => {
    switch (activeView) {
      case "overview":
        return (
          <>
            <WeeklyOverview onAction={handleOverviewAction} plan={weeklyPlan} preference={preference} />
            <BudgetSummary
              householdSize={householdSize}
              onAdjustPlan={() => navigateTo("meals")}
              onHouseholdSizeChange={handleHouseholdSizeChange}
              onSharePlan={() => setShareOpen(true)}
              onStoreChange={handleStoreChange}
              onWeeklyBudgetChange={handleWeeklyBudgetChange}
              selectedStore={selectedStore}
              storeSavingsHintNok={storeSavingsHintNok}
              weeklyBudgetNok={weeklyBudgetNok}
            />
            <WeeklyRoutinePanel onRefreshWeek={handleRefreshWeek} routine={routine} />
          </>
        );

      case "meals":
        return renderMealPlan();

      case "meal-detail":
        return selectedMeal ? (
          <MealDetailScreen alternatives={swapAlternatives} meal={selectedMeal} onSelectAlternative={handleSelectReplacement} />
        ) : (
          renderMealPlan()
        );

      case "shopping":
        return (
          <ShoppingList
            onPantryItemsChange={handlePantryItemsChange}
            pantryIngredientIds={pantryIngredientIds}
            planWeeklyTotalNok={weeklyPlan.summary.weeklyTotalNok}
            selectedStore={selectedStore}
            shoppingList={weeklyPlan.shoppingList}
          />
        );

      case "tips":
        return <SavingsTips onCompleteTip={markTipCompleted} onDismissTip={dismissTip} report={savingsReport} />;

      case "premium":
        return <PremiumOptimization locked onOpenPaywall={() => setPaywallOpen(true)} plan={weeklyPlan} preference={preference} />;

      case "settings":
        return <SettingsScreen onRestartOnboarding={handleRestartOnboarding} preference={preference} routine={routine} />;
    }
  };

  if (!onboardingComplete) {
    return (
      <OnboardingFlow
        initialState={{
          budgetNok: weeklyBudgetNok,
          householdSize,
          pantryIngredientIds,
          planMode,
          preferredStore: selectedStore,
          shoppingStyle
        }}
        onComplete={handleCompleteOnboarding}
      />
    );
  }

  if (resultScreenOpen) {
    return <ResultScreen onContinue={() => setResultScreenOpen(false)} savingsNok={resultSavingsNok} />;
  }

  return (
    <AppShell
      activeView={activeView}
      canGoBack={activeView === "meal-detail" || activeView === "settings"}
      onBack={handleBack}
      onNavigate={navigateTo}
      title={viewTitles[activeView]}
    >
      <AnimatePresence mode="wait">
        <motion.div
          animate="animate"
          exit="exit"
          initial="initial"
          key={activeView}
          transition={pageTransition}
          variants={pageVariants}
        >
          {renderActiveView()}
        </motion.div>
      </AnimatePresence>
      {paywallOpen ? <PaywallScreen onClose={() => setPaywallOpen(false)} plan={weeklyPlan} preference={preference} /> : null}
      {recipeMeal ? <MealRecipeSheet householdSize={preference.householdSize} meal={recipeMeal} onClose={() => setRecipeMeal(null)} /> : null}
      {shareOpen ? <ShareSummarySheet onClose={() => setShareOpen(false)} plan={weeklyPlan} preference={preference} /> : null}
      <AnimatePresence>
        {savingsFeedback ? <FloatingSavingsFeedback key={savingsFeedback.id} amountNok={savingsFeedback.amountNok} /> : null}
      </AnimatePresence>
    </AppShell>
  );
}

function FloatingSavingsFeedback({ amountNok }: { amountNok: number }) {
  return (
    <motion.div
      animate={{ opacity: [0, 1, 1, 0], scale: [0.98, 1.04, 1, 0.98], y: [0, -8, -14, -22] }}
      className="pointer-events-none fixed left-1/2 top-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] z-50 -translate-x-1/2 rounded-full bg-saving px-app-4 py-app-2 text-body-sm font-black text-white shadow-app"
      exit={{ opacity: 0, y: -24 }}
      initial={{ opacity: 0, scale: 0.98, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      +{formatCompactNok(amountNok)} spart
    </motion.div>
  );
}
