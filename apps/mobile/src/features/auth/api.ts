import { otpSchema, phoneSchema, profileSetupSchema, type ProfileSetupInput, type UserRole } from "@relife/shared";

import { data, fn, mockRequest } from "@/lib/mock";

/** Onboarding copy (A02). Static for now; may move to remote config. */
export const onboardingSlides = data.ONBOARDING_SLIDES;

// All sign-in calls for FC1. Currently backed by the mock API.
// TODO(S1): replace with Firebase Auth (signInWithPhoneNumber, Google) and the `users` doc.

export async function sendOtp(rawPhone: string) {
  const phone = phoneSchema.parse(rawPhone);
  return mockRequest(() => fn.auth.sendOtp(phone), 700);
}

export async function verifyOtp({ phone, code }: { phone: string | null; code: string }) {
  const otp = otpSchema.parse(code);
  return mockRequest(() => fn.auth.verifyOtp(phone, otp), 600);
}

export async function signInWithGoogle() {
  // TODO(S1): Google sign-in needs a development build (not available in Expo Go).
  return mockRequest(() => fn.auth.signInWithGoogle(), 600);
}

export async function completeProfile(input: ProfileSetupInput): Promise<{ role: UserRole }> {
  const data = profileSetupSchema.parse(input);
  return mockRequest(() => fn.auth.completeProfile(data));
}
