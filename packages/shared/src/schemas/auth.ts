import { z } from "zod";

import { USER_ROLE } from "../constants";

/** Vietnamese mobile number without the +84 prefix, e.g. "912345678". */
export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, "").replace(/^0/, ""))
  .pipe(z.string().regex(/^[35789]\d{8}$/, "Số điện thoại chưa đúng"));

export const otpSchema = z.string().regex(/^\d{6}$/, "Mã gồm 6 chữ số");

export const profileSetupSchema = z.object({
  name: z.string().trim().min(2, "Tên cần ít nhất 2 ký tự").max(40),
  role: z.enum([USER_ROLE.CUSTOMER, USER_ROLE.STORE, USER_ROLE.CHARITY]),
});
export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Tên cần ít nhất 2 ký tự").max(40),
  email: z.email("Email chưa đúng").nullable(),
});
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
