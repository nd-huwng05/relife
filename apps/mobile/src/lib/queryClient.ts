import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "./mock";

/** App-wide TanStack Query client: caching, and retries only for network-type errors. */
export const queryClient = new QueryClient({
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
  if (error instanceof Error && error.message) return error.message;
  return "Có lỗi xảy ra, thử lại giúp mình nhé.";
}
