import { Check, Home, ShoppingBasket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ingredients } from "@/lib/data/ingredients";
import { cn } from "@/lib/utils/cn";
import { formatCompactNok } from "@/lib/utils/format";
import { sectionVariants, pageTransition } from "@/lib/design/animations";
import type { ShoppingList as ShoppingListModel, ShoppingListItem, StoreId } from "@/types/domain";

const pantryOptions = [
  { id: "rice", label: "Ris" },
  { id: "pasta", label: "Pasta" },
  { id: "tomatoes-canned", label: "Hermetiske tomater" },
  { id: "lentils", label: "Røde linser" },
  { id: "bread", label: "Brød" },
  { id: "tortilla", label: "Tortilla" },
  { id: "oats", label: "Havregryn" },
];

const storeFlowOrders: Record<StoreId, string[]> = {
  KIWI: ["Frukt og grønt", "Kjøtt og fisk", "Meieri og egg", "Tørrvarer", "Diverse"],
  REMA_1000: ["Frukt og grønt", "Kjøtt og fisk", "Meieri og egg", "Tørrvarer", "Diverse"],
  MENY: ["Frukt og grønt", "Kjøtt og fisk", "Meieri og egg", "Tørrvarer", "Diverse"],
};

type DisplayGroup = { group: string; items: ShoppingListItem[] };

type Props = {
  onPantryItemsChange: (ids: string[]) => void;
  pantryIngredientIds: string[];
  planWeeklyTotalNok: number;
  selectedStore: StoreId;
  shoppingList: ShoppingListModel;
};

export function ShoppingList({ onPantryItemsChange, pantryIngredientIds, planWeeklyTotalNok, selectedStore, shoppingList }: Props) {
  const [sortMode, setSortMode] = useState<"category" | "flow">("category");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const visibleGroups = useMemo<DisplayGroup[]>(() =>
    shoppingList.groups
      .map(g => ({ ...g, items: g.items.filter(i => !i.alreadyHave) }))
      .filter(g => g.items.length > 0),
    [shoppingList]
  );

  const groupedForDisplay = useMemo<DisplayGroup[]>(() => {
    if (sortMode === "category") return visibleGroups;
    const flowOrder = storeFlowOrders[selectedStore];
    const grouped = new Map<string, ShoppingListItem[]>();
    visibleGroups.flatMap(g => g.items).forEach(item => {
      const grp = getFlowGroup(item);
      grouped.set(grp, [...(grouped.get(grp) ?? []), item]);
    });
    return flowOrder
      .map(g => ({ group: g, items: (grouped.get(g) ?? []).sort((a, b) => a.name.localeCompare(b.name, "nb-NO")) }))
      .filter(g => g.items.length > 0);
  }, [selectedStore, sortMode, visibleGroups]);

  const allItemIds = useMemo(() => groupedForDisplay.flatMap(g => g.items.map(i => i.ingredientId)), [groupedForDisplay]);
  const itemSignature = allItemIds.join("|");
  useEffect(() => { setCheckedItems(new Set()); }, [itemSignature]);

  const checkedCount = allItemIds.filter(id => checkedItems.has(id)).length;
  const totalCount = shoppingList.totalItemsToBuy;
  const allChecked = totalCount > 0 && checkedCount === totalCount;

  const toggleItem = (id: string) => {
    setCheckedItems(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const togglePantry = (id: string) => {
    onPantryItemsChange(pantryIngredientIds.includes(id)
      ? pantryIngredientIds.filter(i => i !== id)
      : [...pantryIngredientIds, id]);
  };


  return (
    <motion.div animate="animate" className="space-y-5" initial="initial" transition={pageTransition} variants={sectionVariants}>

      {/* Summary hero */}
      <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <p className="text-[0.75rem] font-semibold text-text-tertiary">Handleliste</p>
          <p className="mt-1 text-[2rem] font-black tracking-tight text-text-primary">{formatCompactNok(shoppingList.basketTotalNok)}</p>
          <p className="mt-0.5 text-[0.82rem] text-text-secondary">
            {totalCount} varer · Middagskostnad: {formatCompactNok(planWeeklyTotalNok)}
          </p>
          {shoppingList.pantrySavingsNok > 0 && (
            <div className="mt-2 inline-flex items-center rounded-xl bg-saving-bg px-3 py-1.5 text-[0.78rem] font-bold text-saving">
              Du sparer {formatCompactNok(shoppingList.pantrySavingsNok)} fra pantry
            </div>
          )}
        </div>

        {/* Progress */}
        {totalCount > 0 && (
          <div className="border-t border-border-subtle px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[0.78rem] font-semibold text-text-secondary">
                {checkedCount} av {totalCount} handlet
              </p>
              {allChecked && (
                <span className="flex items-center gap-1 text-[0.75rem] font-bold text-brand">
                  <Check size={13} strokeWidth={3} />Alt handlet
                </span>
              )}
            </div>
            <div className="h-1.5 rounded-full bg-surface-soft overflow-hidden">
              <motion.div
                animate={{ width: totalCount > 0 ? `${(checkedCount / totalCount) * 100}%` : "0%" }}
                className="h-full rounded-full bg-brand"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sort toggle */}
      <SegmentedControl
        items={[
          { label: `Etter kategori`, value: "category" },
          { label: "Butikkflyt", value: "flow" },
        ]}
        onChange={v => setSortMode(v as "category" | "flow")}
        value={sortMode}
      />

      {/* Pantry */}
      <div className="rounded-2xl bg-surface border border-border shadow-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface-soft">
            <Home size={16} className="text-text-secondary" />
          </div>
          <div>
            <p className="text-[0.875rem] font-bold text-text-primary">Har du hjemme?</p>
            <p className="text-[0.75rem] text-text-tertiary">Trykk på det du allerede har</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {pantryOptions.map(item => (
            <button
              key={item.id}
              className={cn(
                "rounded-xl px-3 py-1.5 text-[0.78rem] font-semibold transition-all",
                pantryIngredientIds.includes(item.id)
                  ? "bg-saving-bg text-saving border border-saving-border"
                  : "bg-surface-soft text-text-secondary border border-border-subtle"
              )}
              onClick={() => togglePantry(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="rounded-2xl bg-surface border border-border shadow-card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-saving-bg text-2xl">🛒</div>
          <p className="mt-4 text-[0.95rem] font-bold text-text-primary">Alt er hjemme!</p>
          <p className="mt-1 text-[0.82rem] text-text-secondary">Du har allerede alt du trenger.</p>
        </div>
      )}

      {/* Items grouped */}
      {groupedForDisplay.map(group => (
        <div key={group.group} className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <p className="text-[0.82rem] font-black text-text-primary">{group.group}</p>
            <span className="text-[0.72rem] font-semibold text-text-tertiary">{group.items.length} varer</span>
          </div>
          {group.items.map((item, i) => {
            const checked = checkedItems.has(item.ingredientId);
            return (
              <button
                key={item.ingredientId}
                className={cn(
                  "flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors active:bg-bg-elevated",
                  i > 0 ? "border-t border-border-subtle" : "",
                  checked ? "opacity-60" : ""
                )}
                onClick={() => toggleItem(item.ingredientId)}
                type="button"
              >
                <span className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all",
                  checked ? "border-brand bg-brand" : "border-border"
                )}>
                  {checked && <Check size={12} strokeWidth={3} className="text-white" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-[0.875rem] font-semibold text-text-primary", checked ? "line-through" : "")}>
                    {item.name}
                  </span>
                  <span className="block text-[0.75rem] text-text-tertiary mt-0.5">{item.displayQuantity}</span>
                </span>
                <span className="shrink-0 text-[0.82rem] font-bold text-text-primary">
                  {formatCompactNok(item.estimatedPriceNok)}
                </span>
              </button>
            );
          })}
        </div>
      ))}

      {/* Total */}
      {totalCount > 0 && (
        <div className="rounded-2xl bg-brand text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[0.78rem] font-semibold text-white/70">Totalt estimert</p>
            <p className="text-[1.5rem] font-black">{formatCompactNok(shoppingList.basketTotalNok)}</p>
          </div>
          <ShoppingBasket size={28} className="text-white/40" />
        </div>
      )}
    </motion.div>
  );
}

function getFlowGroup(item: ShoppingListItem) {
  const ing = ingredients.find(i => i.id === item.ingredientId);
  if (!ing) return "Diverse";
  if (ing.category === "produce") return "Frukt og grønt";
  if (ing.category === "protein") return "Kjøtt og fisk";
  if (ing.category === "dairy") return "Meieri og egg";
  if (ing.category === "pantry") return "Tørrvarer";
  return "Diverse";
}
