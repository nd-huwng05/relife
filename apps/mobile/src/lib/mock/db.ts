import type {
  AppNotification,
  Bag,
  BagTemplate,
  CharityApplication,
  CharityProfile,
  Claim,
  Order,
  Payout,
  PayoutAccount,
  PayoutLine,
  Review,
  StaffMember,
  Store,
  StoreApplication,
  StoreNotificationPrefs,
  Surplus,
  UserProfile,
} from "@relife/shared";

import { MOCK_CLOCK } from "./config";
import { bagTemplates, seedBags } from "./data/bags";
import { charityProfile, seedCharityApplication, seedClaims, seedSurplus } from "./data/charity";
import { seedOrders } from "./data/orders";
import { payoutAccount, seedApplication, seedPayouts, seedReviews, staff, storeNotificationPrefs } from "./data/storeAdmin";
import { stores } from "./data/stores";
import { customerProfile, seedCustomerNotifications } from "./data/users";

/** In-memory copy of the Firestore collections the app reads. Reset on every app reload. */
export interface MockDb {
  stores: Store[];
  bags: Bag[];
  templates: BagTemplate[];
  orders: Order[];
  customer: UserProfile;
  notifications: AppNotification[];
  application: StoreApplication;
  reviews: Review[];
  payouts: { holding: number; nextPayoutAt: string; history: Payout[]; lines: PayoutLine[] };
  payoutAccount: PayoutAccount;
  staff: StaffMember[];
  storePrefs: StoreNotificationPrefs;
  charity: CharityProfile;
  charityApplication: CharityApplication;
  surplus: Surplus[];
  claims: Claim[];
  /** Results of create calls by idempotencyKey, so retries return the first result. */
  idempotency: Map<string, unknown>;
  /** Failed manual pickup code attempts for anti-guessing (B15). */
  codeAttempts: number[];
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function createDb(): MockDb {
  const base = MOCK_CLOCK.startAt;
  return {
    stores: clone(stores),
    bags: seedBags(base),
    templates: clone(bagTemplates),
    orders: seedOrders(base),
    customer: clone(customerProfile),
    notifications: seedCustomerNotifications(base),
    application: seedApplication(base),
    reviews: seedReviews(base),
    payouts: seedPayouts(base),
    payoutAccount: clone(payoutAccount),
    staff: clone(staff),
    storePrefs: clone(storeNotificationPrefs),
    charity: clone(charityProfile),
    charityApplication: seedCharityApplication(base),
    surplus: seedSurplus(base),
    claims: seedClaims(base),
    idempotency: new Map(),
    codeAttempts: [],
  };
}

export const db: MockDb = createDb();

export function resetMockDb() {
  Object.assign(db, createDb());
}
