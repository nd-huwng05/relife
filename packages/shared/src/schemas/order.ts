import { z } from "zod";

/** Input of the `createOrder` Function (A14). */
export const createOrderSchema = z.object({
  bagId: z.string(),
  qty: z.number().int().min(1).max(5),
  acceptedSelfPickup: z.literal(true, { error: "Hãy xác nhận bạn sẽ tự đến lấy" }),
  idempotencyKey: z.string().min(8),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const CANCEL_REASONS = [
  { key: "changed_plans", label: "Thay đổi kế hoạch" },
  { key: "wrong_item", label: "Đặt nhầm túi hoặc số lượng" },
  { key: "cannot_make_it", label: "Không kịp đến trong khung giờ" },
  { key: "other", label: "Lý do khác" },
] as const;

/** Input of the `cancelOrder` Function (A23). */
export const cancelOrderSchema = z.object({
  orderId: z.string(),
  reason: z.enum(["changed_plans", "wrong_item", "cannot_make_it", "other"]),
});
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;

/** Review written once per collected order (A24). */
export const reviewSchema = z.object({
  orderId: z.string(),
  rating: z.number().int().min(1).max(5),
  tags: z.array(z.string()).max(6),
  text: z.string().trim().max(500),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

/** Pickup code typed by store staff (B15): six letters or digits, any case. */
export const pickupCodeSchema = z
  .string()
  .transform((v) => v.replace(/\s/g, "").toUpperCase())
  .pipe(z.string().regex(/^[A-Z0-9]{6}$/, "Mã gồm 6 ký tự"));
