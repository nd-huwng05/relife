import type { OrderStatus, OrderType, PaymentMethod } from "../constants";
import type { Vnd } from "../money";
import type { IsoDateTime, PhotoRef } from "./common";

/** `orders/{id}`. Written only by Cloud Functions; `paid` is set only by the payment webhook. */
export interface Order {
  id: string;
  /** Human readable reference, e.g. "RLF-8K2Q7M". */
  code: string;
  type: OrderType;
  customerId: string;
  customerName: string;
  /** How many times this customer has collected at the store, including this order. */
  customerVisitCount: number;
  bagId: string;
  bagTitle: string;
  bagPhoto: PhotoRef;
  storeId: string;
  storeName: string;
  storeAddress: string;
  storeDistanceKm: number;
  qty: number;
  unitPrice: Vnd;
  amount: Vnd;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  bankName: string | null;
  holdExpiresAt: IsoDateTime;
  /** Six characters shown as "K7Q M4P". Signed server side. */
  pickupCode: string;
  pickupStart: IsoDateTime;
  pickupEnd: IsoDateTime;
  /** Time the customer said they would come, used to sort the store's list (B10). */
  plannedArrival: IsoDateTime | null;
  createdAt: IsoDateTime;
  /** Customer tapped "Tôi đã chuyển khoản"; waiting for the webhook (A17). */
  transferReportedAt: IsoDateTime | null;
  paidAt: IsoDateTime | null;
  collectedAt: IsoDateTime | null;
  cancelledAt: IsoDateTime | null;
  refundAmount: Vnd | null;
  reviewed: boolean;
  idempotencyKey: string;
}

/** Data the customer needs to make the VietQR transfer (createPayment). */
export interface PaymentInstructions {
  orderId: string;
  amount: Vnd;
  bankName: string;
  accountNumber: string;
  /** Transfer note that must match for automatic confirmation, e.g. "RLF 8K2Q7M". */
  transferNote: string;
  /** Payload encoded in the QR code. */
  qrPayload: string;
  holdExpiresAt: IsoDateTime;
}

export type PaymentFailureReason = "hold_expired" | "abandoned" | "late_payment";

export type ScanResult =
  | { ok: true; order: Order }
  | {
      ok: false;
      reason:
        | "already_used"
        | "other_store"
        | "cancelled"
        | "too_early"
        | "window_closed"
        | "not_found";
      usedAt?: IsoDateTime;
      attemptsLeft?: number;
    };
