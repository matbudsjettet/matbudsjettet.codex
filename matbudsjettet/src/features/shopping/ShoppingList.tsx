import { Check, ChevronRight, Crown, Home, LockKeyhole, ShoppingBasket, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ingredients } from "@/lib/data/ingredients";
import { stores } from "@/lib/data/stores";
import { cn } from "@/lib/utils/cn";
import { formatCompactNok } from "@/lib/utils/format";
import type { ShoppingList as ShoppingListModel, ShoppingListItem, StoreId } from "@/types/domain";

type ShoppingListProps = {
  onPantryItemsChange: (pantryIngredientIds: string[]) => void;
  pantryIngredientIds: string[];
  planWeeklyTotalNok: number;
  selectedStore: StoreId;
  shoppingList: ShoppingListModel;
};

type ShoppingSortMode = "category" | "flow";
type DisplayGroup = {
  group: string;
  items: ShoppingListItem[];
};

const pantryOptions = [
  { id: "rice", label: "Ris" },
  { id: "pasta", label: "Pasta" },
  { id: "tomatoes-canned", label: "Hermetiske tomater" },
  { id: "lentils", label: "Røde linser" },
  { id: "bread", label: "Brød" },
  { id: "tortilla", label: "Tortilla" },
  { id: "oats", label: "Havregryn" }
];

const storeFlowOrders: Record<StoreId, string[]> = {
  KIWI: ["Frukt og grønt", "Bakeri", "Kjøtt og fisk", "Meieri og egg", "Tørrvarer", "Frys", "Drikke", "Diverse"],
  REMA_1000: ["Frukt og grønt", "Bakeri", "Kjøtt og fisk", "Meieri og egg", "Tørrvarer", "Frys", "Drikke", "Diverse"],
  MENY: ["Frukt og grønt", "Bakeri", "Kjøtt og fisk", "Meieri og egg", "Tørrvarer", "Frys", "Drikke", "Diverse"]
};

export function ShoppingList({
  onPantryItemsChange,
  pantryIngredientIds,
  planWeeklyTotalNok,
  selectedStore,
  shoppingList
}: ShoppingListProps) {
  const [sortMode, setSortMode] = useState<ShoppingSortMode>("category");
  const visibleGroups = useMemo<DisplayGroup[]>(
    () =>
      shoppingList.groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !item.alreadyHave)
        }))
        .filter((group) => group.items.length > 0),
    [shoppingList]
  );
  const groupedForDisplay = useMemo<DisplayGroup[]>(() => {
    if (sortMode === "category") {
      return visibleGroups;
    }

    const flowOrder = storeFlowOrders[selectedStore];
    const grouped = new Map<string, ShoppingListItem[]>();

    visibleGroups
      .flatMap((group) => group.items)
      .forEach((item) => {
        const nextGroup = getFlowGroup(item);
        grouped.set(nextGroup, [...(grouped.get(nextGroup) ?? []), item]);
      });

    return flowOrder
      .map((group) => ({
        group,
        items: (grouped.get(group) ?? []).sort((a, b) => a.name.localeCompare(b.name, "nb-NO"))
      }))
      .filter((group) => group.items.length > 0);
  }, [selectedStore, sortMode, visibleGroups]);
  const activeHelperText =
    sortMode === "flow"
      ? "Sorter varene i en mer naturlig rekkefølge gjennom butikken."
      : "Sorter varene etter vanlige matgrupper.";
  const itemIds = useMemo(
    () => groupedForDisplay.flatMap((group) => group.items.map((item) => item.ingredientId)),
    [groupedForDisplay]
  );
  const itemSignature = itemIds.join("|");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setCheckedItems(new Set());
  }, [itemSignature]);

  const checkedCount = itemIds.filter((id) => checkedItems.has(id)).length;
  const totalCount = shoppingList.totalItemsToBuy;
  const allChecked = totalCount > 0 && checkedCount === totalCount;
  const displayedTotal = shoppingList.basketTotalNok;

  const togglePantryItem = (id: string) => {
    const next = pantryIngredientIds.includes(id)
      ? pantryIngredientIds.filter((item) => item !== id)
      : [...pantryIngredientIds, id];

    onPantryItemsChange(next);
  };

  const toggleItem = (id: string) => {
    setCheckedItems((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return (
    <Section title="Dette må du handle nå">
      {totalCount === 0 ? (
        <div className="space-y-4">
          <ShoppingListControls
            helperText={activeHelperText}
            displayedTotal={displayedTotal}
            onSortModeChange={setSortMode}
            pantrySavingsNok={shoppingList.pantrySavingsNok}
            planWeeklyTotalNok={planWeeklyTotalNok}
            selectedStore={selectedStore}
            shoppingList={shoppingList}
            sortMode={sortMode}
          />
          <PantryEditor pantryIngredientIds={pantryIngredientIds} togglePantryItem={togglePantryItem} />
          <EmptyShoppingList />
        </div>
      ) : (
        <div className="space-y-4">
          <ShoppingListControls
            helperText={activeHelperText}
            displayedTotal={displayedTotal}
            onSortModeChange={setSortMode}
            pantrySavingsNok={shoppingList.pantrySavingsNok}
            planWeeklyTotalNok={planWeeklyTotalNok}
            selectedStore={selectedStore}
            shoppingList={shoppingList}
            sortMode={sortMode}
          />

          <PantryEditor pantryIngredientIds={pantryIngredientIds} togglePantryItem={togglePantryItem} />

          <div className={cn("flex items-center justify-between gap-3 rounded-[1rem] px-4 py-3", allChecked ? "bg-[rgba(35,111,73,0.08)]" : "bg-[#f4f0e8]")}>
            <div>
              <p className="font-black">{allChecked ? "Alt er handlet" : "Klar for butikken"}</p>
              <p className="text-body-sm text-text-secondary">
                {allChecked ? "Handlelisten er ferdig krysset av." : `${checkedCount} av ${totalCount} varer er krysset av.`}
              </p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-saving">
              {allChecked ? <Check size={18} /> : <ShoppingBasket size={18} />}
            </div>
          </div>

          <div className="space-y-2.5">
            {groupedForDisplay.map((group) => (
              <div className="overflow-hidden rounded-[1.05rem] border border-border-subtle bg-white/78" key={group.group}>
                <div className="px-4 py-3">
                  <h3 className="text-[0.98rem] font-bold text-text-primary">{group.group}</h3>
                </div>
                {group.items.map((item, index) => {
                  const store = stores.find((entry) => entry.id === item.bestStore);
                  const checked = checkedItems.has(item.ingredientId);

                  return (
                    <button
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left transition-[background-color,opacity] duration-200 active:bg-neutral-200",
                        index === group.items.length - 1 ? "" : "border-t border-border-subtle"
                      )}
                      key={item.ingredientId}
                      onClick={() => toggleItem(item.ingredientId)}
                      type="button"
                    >
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-full border",
                          checked ? "border-saving bg-saving text-white" : "border-border bg-surface text-transparent"
                        )}
                      >
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate font-black text-text-primary",
                            checked ? "text-text-tertiary line-through" : ""
                          )}
                        >
                          {item.name}
                        </span>
                        <span className="block text-body-sm text-text-secondary">
                          {item.displayQuantity} · {store?.name}
                        </span>
                      </span>
                      <span className="shrink-0 text-body-sm font-black text-text-primary">
                        {formatCompactNok(item.estimatedPriceNok)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <ShoppingListProCard />
        </div>
      )}
    </Section>
  );
}

function ShoppingListControls({
  helperText,
  displayedTotal,
  onSortModeChange,
  pantrySavingsNok,
  planWeeklyTotalNok,
  selectedStore,
  shoppingList,
  sortMode
}: {
  helperText: string;
  displayedTotal: number;
  onSortModeChange: (mode: ShoppingSortMode) => void;
  pantrySavingsNok: number;
  planWeeklyTotalNok: number;
  selectedStore: StoreId;
  shoppingList: ShoppingListModel;
  sortMode: ShoppingSortMode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[1.4rem] font-black tracking-tight text-text-primary">{formatCompactNok(displayedTotal)}</p>
        <p className="mt-1 text-[0.84rem] text-text-secondary">
          {shoppingList.totalItemsToBuy} av {shoppingList.totalItems} varer må kjøpes
        </p>
        <p className="mt-1 text-[0.78rem] text-text-tertiary">
          Middagskostnaden er {formatCompactNok(planWeeklyTotalNok)}.
        </p>
        {pantrySavingsNok > 0 ? (
          <p className="mt-2 text-[0.82rem] font-semibold text-saving">Du sparer {formatCompactNok(pantrySavingsNok)} fra det du allerede har hjemme</p>
        ) : null}
      </div>
      <div className="space-y-2 rounded-[1rem] bg-[#f4f0e8] p-3">
        <SegmentedControl
          items={[
            { label: "Kategori", value: "category" },
            { label: "Butikkflyt", value: "flow" }
          ]}
          onChange={(value) => onSortModeChange(value as ShoppingSortMode)}
          value={sortMode}
        />
        <p className="text-[0.8rem] text-text-secondary">
          {helperText}
          {sortMode === "flow" ? ` Gjelder typisk handlemønster hos ${getStoreName(selectedStore)}.` : ""}
        </p>
      </div>
    </div>
  );
}

const getStoreName = (storeId: StoreId) => stores.find((store) => store.id === storeId)?.name ?? storeId;

const getFlowGroup = (item: ShoppingListItem) => {
  const ingredient = ingredients.find((entry) => entry.id === item.ingredientId);

  if (!ingredient) {
    return "Diverse";
  }

  if (ingredient.category === "produce") {
    return "Frukt og grønt";
  }

  if (ingredient.category === "bakery") {
    return "Bakeri";
  }

  if (ingredient.category === "protein") {
    return "Kjøtt og fisk";
  }

  if (ingredient.category === "dairy") {
    return "Meieri og egg";
  }

  if (ingredient.category === "pantry") {
    return "Tørrvarer";
  }

  if (ingredient.category === "frozen") {
    return "Frys";
  }

  return "Diverse";
};

function PantryEditor({
  pantryIngredientIds,
  togglePantryItem
}: {
  pantryIngredientIds: string[];
  togglePantryItem: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f4f0e8] text-text-secondary">
          <Home size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[1rem] font-black text-text-primary">Basisvarer hjemme</h3>
          <p className="mt-1 text-body-sm text-text-secondary">
            Påvirker handlelisten, ikke middagskostnaden.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {pantryOptions.map((item) => {
          const selected = pantryIngredientIds.includes(item.id);

          return (
            <button
              className={cn(
                "rounded-full px-3 py-2 text-[0.74rem] font-semibold transition",
                selected
                  ? "bg-saving-bg text-saving"
                  : "bg-white text-text-secondary shadow-[0_4px_12px_rgba(33,25,16,0.03)]"
              )}
              key={item.id}
              onClick={() => togglePantryItem(item.id)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyShoppingList() {
  return (
    <Card className="p-5 text-center" variant="surface">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f3eee6] text-text-secondary">
        <ShoppingBasket size={22} />
      </div>
      <h3 className="mt-app-3 text-headline text-text-primary">Handlekurven er tom</h3>
      <p className="mt-app-2 text-body-sm text-text-secondary">
        Alt du trenger til middagene er allerede hjemme.
      </p>
    </Card>
  );
}

function ShoppingListProCard() {
  const bullets = [
    "Live priser fra norske butikker",
    "Automatisk billigste handlekurv",
    "Smarte bytteforslag"
  ];

  return (
    <Card className="p-4" variant="premium">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone="premium">Pro</Badge>
          <h3 className="mt-3 text-[1.12rem] font-black text-text-primary">Prisjakt med Matbudsjettet Pro</h3>
          <p className="mt-1.5 text-body-sm text-text-secondary">Se billigste butikk per vare og spar enda mer</p>
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface text-premium">
          <Crown size={20} strokeWidth={2.3} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {bullets.map((bullet) => (
          <div className="flex items-center gap-2 text-body-sm font-semibold text-text-primary" key={bullet}>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface text-premium">
              <Sparkles size={13} />
            </span>
            <span>{bullet}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[0.95rem] bg-surface p-3">
        <LockKeyhole className="shrink-0 text-premium" size={17} />
        <p className="text-body-sm text-text-secondary">Klar for live prisdata når Pro åpner.</p>
      </div>

      <Button className="mt-5 w-full justify-between" type="button" variant="premium">
        Få tidlig tilgang
        <ChevronRight size={18} />
      </Button>
    </Card>
  );
}
