import { useMutation } from "@tanstack/react-query";

import { completeProfile, sendOtp, signInWithGoogle, verifyOtp } from "../api";
import { sessionStore } from "../store";

export function useSendOtp() {
  return useMutation({
    mutationFn: sendOtp,
    onSuccess: (res) => sessionStore.setPendingPhone(res.sentTo),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: verifyOtp,
    // An existing account goes straight to its role's screens; the root layout switches stacks.
    onSuccess: (res) => {
      if (!res.isNewUser) sessionStore.signIn(res.role, res.userId);
    },
  });
}

export function useGoogleSignIn() {
  return useMutation({ mutationFn: signInWithGoogle });
}

export function useCompleteProfile() {
  return useMutation({
    mutationFn: completeProfile,
    onSuccess: ({ role }) => sessionStore.signIn(role),
  });
}
