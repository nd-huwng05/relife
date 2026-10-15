import type { PayoutStatus } from "../constants";
import type { Vnd } from "../money";
import type { IsoDateTime } from "./common";

/** `payouts/{id}`: one transfer to a store for a period. */
export interface Payout {
  id: string;
  periodStart: IsoDateTime;
  periodEnd: IsoDateTime;
  paidAt: IsoDateTime | null;
  orderCount: number;
  amount: Vnd;
  status: PayoutStatus;
}

export interface PayoutLine {
  orderCode: string;
  date: IsoDateTime;
  description: string;
  /** Net amount for the store after commission. Negative or zero for refunds. */
  amount: Vnd;
}

export interface PayoutBalance {
  holding: Vnd;
  nextPayoutAt: IsoDateTime;
  bankLabel: string;
}

/** `stores/{id}/private/payout` */
export interface PayoutAccount {
  bankName: string;
  accountNumber: string;
  holderName: string;
}

export interface RevenueReport {
  period: "week" | "month" | "year";
  label: string;
  total: Vnd;
  changePercent: number;
  /** Daily totals in thousand đồng, oldest first. */
  bars: { label: string; value: number }[];
  insight: string;
}
