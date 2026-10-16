import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { connectivity, isNetworkError } from "./connectivity";
import { ApiError } from "./mock";

/**
 * App-wide TanStack Query client: caching, retries only for unexpected errors, and the
 * online/offline signal for E03 taken from every request's outcome.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onSuccess: () => connectivity.reportSuccess(), onError: (e) => connectivity.reportFailure(e) }),
  mutationCache: new MutationCache({ onSuccess: () => connectivity.reportSuccess(), onError: (e) => connectivity.reportFailure(e) }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => !(error instanceof ApiError) && failureCount < 2,
    },
    mutations: { retry: false },
  },
});

/** Human message for any error thrown by an api.ts function. */
export function errorMessage(error: unknown): string {
  if (isNetworkError(error)) return "Không kết nối được. Kiểm tra mạng rồi thử lại.";
  if (error instanceof Error && error.message) return error.message;
  return "Có lỗi xảy ra, thử lại giúp mình nhé.";
}
