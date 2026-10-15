import {
  BAG_STATUS,
  ORDER_STATUS,
  bagSchema,
  bagUpdateSchema,
  pauseBagSchema,
  repostSchema,
  type Bag,
  type BagInput,
  type BagTemplate,
  type BagUpdateInput,
  type PauseBagInput,
  type RepostInput,
  type Store,
} from "@relife/shared";

import { data, db, fn, mockRequest } from "@/lib/mock";

// FC3 (customer) and FS2 (store) data access. Backed by the mock API for now.
// TODO(S2/S3): reads become Firestore queries on `bags` and `stores`; writes call the
// `publishBag`, `updateBag`, `pauseBag` and `repostTemplates` Cloud Functions.

export interface BagDetail {
  bag: Bag;
  store: Store;
  saved: boolean;
}

export interface StorePage {
  store: Store;
  bags: Bag[];
  following: boolean;
}

const isLiveToday = (b: Bag) => b.status === BAG_STATUS.LIVE || b.status === BAG_STATUS.SOLD_OUT;

export function getBag(bagId: string): Promise<BagDetail> {
  return mockRequest(() => {
    const bag = db.bags.find((b) => b.id === bagId);
    const store = bag && db.stores.find((s) => s.id === bag.storeId);
    if (!bag || !store) throw new Error("Không tìm thấy túi bánh");
    return { bag, store, saved: db.customer.savedBagIds.includes(bag.id) };
  });
}

export function getStorePage(storeId: string): Promise<StorePage> {
  return mockRequest(() => {
    const store = db.stores.find((s) => s.id === storeId);
    if (!store) throw new Error("Không tìm thấy tiệm");
    const bags = db.bags.filter((b) => b.storeId === storeId && isLiveToday(b));
    return { store, bags, following: db.customer.followingStoreIds.includes(storeId) };
  });
}

export function toggleSaveBag(bagId: string): Promise<boolean> {
  return mockRequest(() => {
    const list = db.customer.savedBagIds;
    const i = list.indexOf(bagId);
    if (i >= 0) list.splice(i, 1);
    else list.push(bagId);
    return i < 0;
  }, 150);
}

export function toggleFollowStore(storeId: string): Promise<boolean> {
  return mockRequest(() => {
    const list = db.customer.followingStoreIds;
    const i = list.indexOf(storeId);
    if (i >= 0) list.splice(i, 1);
    else list.push(storeId);
    return i < 0;
  }, 150);
}

// ---------- Store side (FS2) ----------

export interface MyBag extends Bag {
  /** Paid orders still waiting to be collected; shown when pausing (B09). */
  openPaidOrders: number;
}

export function getMyBags(): Promise<MyBag[]> {
  return mockRequest(() =>
    db.bags
      .filter((b) => b.storeId === data.MY_STORE_ID)
      .map((b) => ({
        ...b,
        openPaidOrders: db.orders.filter((o) => o.bagId === b.id && o.status === ORDER_STATUS.PAID).length,
      })),
  );
}

export function getTemplates(): Promise<BagTemplate[]> {
  return mockRequest(() => db.templates.filter((t) => t.storeId === data.MY_STORE_ID));
}

/** Form defaults for "Tạo túi bánh" (B06): last photo, windows from opening hours, allergens. */
export const bagFormOptions = {
  pickupWindows: data.PICKUP_WINDOWS,
  allergens: data.ALLERGENS,
  lastPhoto: "pastry-box",
  insight: data.BAG_LIST_INSIGHT,
};

export function publishBag(input: BagInput) {
  const payload = bagSchema.parse(input);
  return mockRequest(() => fn.publishBag(payload), 700);
}

export function updateBag(input: BagUpdateInput) {
  const payload = bagUpdateSchema.parse(input);
  return mockRequest(() => fn.updateBag(payload), 500);
}

export function pauseBag(input: PauseBagInput) {
  const payload = pauseBagSchema.parse(input);
  return mockRequest(() => fn.pauseBag(payload), 500);
}

export function resumeBag(bagId: string) {
  return mockRequest(() => fn.resumeBag(bagId), 300);
}

export function repostTemplates(input: RepostInput) {
  const payload = repostSchema.parse(input);
  return mockRequest(() => fn.repostTemplates(payload), 700);
}
