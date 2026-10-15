import { z } from "zod";

const vnd = z.number().int().nonnegative();
const localTime = z.string().regex(/^\d{2}:\d{2}$/);

/** Input of the `publishBag` Function (B06). */
export const bagSchema = z
  .object({
    title: z.string().trim().min(3, "Tên túi cần ít nhất 3 ký tự").max(60),
    price: vnd.min(10_000, "Giá bán tối thiểu 10.000đ"),
    value: vnd,
    stock: z.number().int().min(1).max(50),
    maxPerCustomer: z.number().int().min(1).max(5),
    pickupStart: localTime,
    pickupEnd: localTime,
    allergens: z.array(z.string()),
    photo: z.string().min(1, "Thêm ảnh túi"),
    idempotencyKey: z.string().min(8),
  })
  .refine((b) => b.value > b.price, { message: "Giá gốc phải cao hơn giá bán", path: ["value"] });
export type BagInput = z.infer<typeof bagSchema>;

/** Input of the `updateBag` Function (B08). The price is ignored once a bag has paid orders. */
export const bagUpdateSchema = z.object({
  bagId: z.string(),
  price: vnd.optional(),
  stock: z.number().int().min(0).max(50),
  pickupStart: localTime,
  pickupEnd: localTime,
});
export type BagUpdateInput = z.infer<typeof bagUpdateSchema>;

/** Input of the `pauseBag` Function (B09). */
export const pauseBagSchema = z.object({
  bagId: z.string(),
  reason: z.enum(["sold_out_early", "closed_unexpectedly", "other"]),
  paidOrders: z.enum(["keep", "refund"]),
});
export type PauseBagInput = z.infer<typeof pauseBagSchema>;

/** Input of `repostTemplates` (B07). */
export const repostSchema = z.object({
  items: z.array(z.object({ templateId: z.string(), stock: z.number().int().min(1).max(50) })).min(1),
  idempotencyKey: z.string().min(8),
});
export type RepostInput = z.infer<typeof repostSchema>;
