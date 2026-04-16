import type { Store } from "@/types/domain";
import { storeMultipliers } from "@/lib/engines/pricingEngine";

export const stores: Store[] = [
  {
    id: "REMA_1000",
    name: "REMA 1000",
    note: "God for hverdagsvarer og enkle middager",
    multiplier: storeMultipliers.REMA_1000
  },
  {
    id: "KIWI",
    name: "KIWI",
    note: "Sterk på pris og basisvarer",
    multiplier: storeMultipliers.KIWI
  },
  {
    id: "MENY",
    name: "MENY",
    note: "Best utvalg når planen trenger noe spesielt",
    multiplier: storeMultipliers.MENY
  }
];
