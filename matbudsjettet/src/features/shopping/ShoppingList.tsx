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
      ? "Sorter varene i en mer naturlig rekkefølge gjennom butikken"
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
    <Section eyebrow="Handleliste" title="Dette må du handle nå">
      {totalCount === 0 ? (
        <div className="space-y-app-4">
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
        <div className="space-y-app-4">
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

          <Card className="p-app-5" variant={allChecked ? "saving" : "surface"}>
            <div className="flex items-center justify-between gap-app-3">
              <div>
                <p className="font-black">{allChecked ? "Alt er handlet" : "Klar for butikken"}</p>
                <p className="text-body-sm text-text-secondary">
                  {allChecked ? "Handlelisten er ferdig krysset av." : `${checkedCount} av ${totalCount} varer er krysset av.`}
                </p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-surface text-saving">
                {allChecked ? <Check size={20} /> : <ShoppingBasket size={20} />}
              </div>
            </div>
          </Card>

          <div className="space-y-app-4">
            {groupedForDisplay.map((group) => (
              <Card className="overflow-hidden p-0" key={group.group} variant="surface">
                <div className="border-b border-border-subtle px-app-4 py-app-3">
                  <h3 className="text-headline text-text-primary">{group.group}</h3>
                </div>
                {group.items.map((item, index) => {
                  const store = stores.find((entry) => entry.id === item.bestStore);
                  const checked = checkedItems.has(item.ingredientId);

                  return (
                    <button
                      className={cn(
                        "flex w-full items-center gap-app-3 p-app-4 text-left transition-[background-color,opacity] duration-200 active:bg-neutral-200",
                        index === group.items.length - 1 ? "" : "border-b border-border-subtle"
                      )}
                      key={item.ingredientId}
                      onClick={() => toggleItem(item.ingredientId)}
                      type="button"
                    >
                      <span
                        className={cn(
                          "grid h-7 w-7 shrink-0 place-items-center rounded-md border",
                          checked ? "border-saving bg-saving text-white" : "border-border bg-surface text-transparent"
                        )}
                      >
                        <Check size={16} strokeWidth={3} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-app-2">
                          <span
                            className={cn(
                              "truncate font-black text-text-primary",
                              checked ? "text-text-tertiary line-through" : ""
                            )}
                          >
                            {item.name}
                          </span>
                          {item.alreadyHave ? <Badge tone="saving">Har</Badge> : null}
                        </span>
                        <span className="block text-body-sm font-semibold text-text-secondary">
                          {item.displayQuantity} · {item.alreadyHave ? "ligger i skapet" : store?.name}
                        </span>
                      </span>
                      <span className="shrink-0 text-body-sm font-black text-text-primary">
                        {formatCompactNok(item.estimatedPriceNok)}
                      </span>
                    </button>
                  );
                })}
              </Card>
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
    <Card className="space-y-app-4 p-app-5" variant="default">
      <div>
        <p className="text-title text-text-primary">{formatCompactNok(displayedTotal)}</p>
        <p className="mt-1 text-caption text-text-tertiary">
          Inkluderer hele pakker. Middagskostnaden er {formatCompactNok(planWeeklyTotalNok)}.
        </p>
        <p className="mt-1 text-body-sm text-text-secondary">
          {shoppingList.totalItemsToBuy} av {shoppingList.totalItems} varer må kjøpes
        </p>
        {pantrySavingsNok > 0 ? (
          <p className="mt-2 text-body-sm text-saving">Du sparer {formatCompactNok(pantrySavingsNok)} fra det du allerede har hjemme</p>
        ) : null}
      </div>
      <div className="space-y-app-2">
        <SegmentedControl
          items={[
            { label: "Sorter etter kategori", value: "category" },
            { label: "Butikkflyt", value: "flow" }
          ]}
          onChange={(value) => onSortModeChange(value as ShoppingSortMode)}
          value={sortMode}
        />
        <p className="text-body-sm text-text-secondary">
          {helperText}
          {sortMode === "flow" ? ` Gjelder typisk handlemønster hos ${getStoreName(selectedStore)}.` : ""}
        </p>
      </div>
    </Card>
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
    <Card className="p-app-4" variant="surface">
      <div className="flex items-start gap-app-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface text-text-secondary">
          <Home size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-headline text-text-primary">Basisvarer hjemme</h3>
          <p className="mt-1 text-body-sm text-text-secondary">
            Trykk av og på. Dette endrer handlekurven, ikke ukens middagskostnad.
          </p>
        </div>
      </div>
      <div className="mt-app-3 flex flex-wrap gap-app-2">
        {pantryOptions.map((item) => {
          const selected = pantryIngredientIds.includes(item.id);

          return (
            <button
              className={cn(
                "rounded-md border px-app-3 py-app-2 text-caption font-black transition",
                selected
                  ? "border-saving-border bg-saving-bg text-saving"
                  : "border-border-subtle bg-surface text-text-secondary"
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
    </Card>
  );
}

function EmptyShoppingList() {
  return (
    <Card className="p-app-5 text-center" variant="surface">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-neutral-200 text-text-secondary">
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
    <Card className="p-app-5" variant="premium">
      <div className="flex items-start justify-between gap-app-4">
        <div>
          <Badge tone="premium">Pro</Badge>
          <h3 className="mt-app-3 text-title text-text-primary">Prisjakt med Matbudsjettet Pro</h3>
          <p className="mt-app-2 text-body-sm text-text-secondary">Se billigste butikk per vare og spar enda mer</p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-surface text-premium">
          <Crown size={22} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-app-4 space-y-app-2">
        {bullets.map((bullet) => (
          <div className="flex items-center gap-app-2 text-body-sm font-bold text-text-primary" key={bullet}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-surface text-premium">
              <Sparkles size={15} />
            </span>
            <span>{bullet}</span>
          </div>
        ))}
      </div>

      <div className="mt-app-4 flex items-center gap-app-3 rounded-lg border border-premium-border bg-surface p-app-3">
        <LockKeyhole className="shrink-0 text-premium" size={18} />
        <p className="text-body-sm font-semibold text-text-secondary">Klar for live prisdata når Pro åpner.</p>
      </div>

      <Button className="mt-app-6 w-full justify-between" type="button" variant="premium">
        Få tidlig tilgang
        <ChevronRight size={18} />
      </Button>
    </Card>
  );
}
