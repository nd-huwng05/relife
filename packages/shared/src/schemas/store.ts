import { z } from "zod";

/** Bank account for payouts (B19). */
export const payoutAccountSchema = z
  .object({
    bankName: z.string().min(2, "Chọn ngân hàng"),
    accountNumber: z.string().regex(/^\d{6,20}$/, "Số tài khoản gồm 6 đến 20 chữ số"),
    confirmAccountNumber: z.string(),
    holderName: z.string().trim().min(2),
  })
  .refine((v) => v.accountNumber === v.confirmAccountNumber, {
    message: "Hai số tài khoản chưa khớp",
    path: ["confirmAccountNumber"],
  });
export type PayoutAccountInput = z.infer<typeof payoutAccountSchema>;

/** Step "Vị trí tiệm" of the store registration (B01). */
export const storeLocationSchema = z.object({
  address: z.string().trim().min(8, "Nhập địa chỉ đầy đủ"),
  lat: z.number(),
  lng: z.number(),
});
export type StoreLocationInput = z.infer<typeof storeLocationSchema>;

/** Invite a staff member (B23). */
export const inviteStaffSchema = z.object({
  phone: z.string().regex(/^[35789]\d{8}$/, "Số điện thoại chưa đúng"),
  role: z.enum(["manager", "counter"]),
});
export type InviteStaffInput = z.infer<typeof inviteStaffSchema>;
