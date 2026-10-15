import { ORDER_STATUS, type Order } from "@relife/shared";
import type { StatusTone } from "@relife/ui";

/** Customer-facing label and badge tone for an order. Never shows "paid" unless the server says so. */
export function orderStatusView(order: Pick<Order, "status" | "transferReportedAt">): { label: string; tone: StatusTone } {
  switch (order.status) {
    case ORDER_STATUS.PAID:
      return { label: "Sẵn sàng nhận", tone: "success" };
    case ORDER_STATUS.HELD:
      return order.transferReportedAt
        ? { label: "Chờ xác nhận thanh toán", tone: "warning" }
        : { label: "Chờ thanh toán", tone: "warning" };
    case ORDER_STATUS.COLLECTED:
      return { label: "Đã nhận", tone: "success" };
    case ORDER_STATUS.NO_SHOW:
      return { label: "Không đến", tone: "danger" };
    case ORDER_STATUS.REFUNDING:
      return { label: "Đang hoàn tiền", tone: "warning" };
    case ORDER_STATUS.REFUNDED:
      return { label: "Đã hoàn tiền", tone: "neutral" };
    case ORDER_STATUS.EXPIRED:
      return { label: "Hết giờ giữ túi", tone: "neutral" };
    case ORDER_STATUS.CANCELLED:
    default:
      return { label: "Đã huỷ", tone: "danger" };
  }
}

export const isUpcoming = (o: Order) => o.status === ORDER_STATUS.PAID || o.status === ORDER_STATUS.HELD;
export const isCompleted = (o: Order) => o.status === ORDER_STATUS.COLLECTED || o.status === ORDER_STATUS.NO_SHOW;

/** "K7QM4P" → "K7Q  M4P" for reading aloud. */
export const splitCode = (code: string) => `${code.slice(0, 3)}  ${code.slice(3)}`;

/** Store staff only see the last two characters: "••4P". */
export const maskCode = (code: string) => `••${code.slice(-2)}`;
