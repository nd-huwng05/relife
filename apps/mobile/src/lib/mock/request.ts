import { devStates } from "../devStates";

import { MOCK_LATENCY_MS } from "./config";

/** Same shape as the HttpsError a Cloud Function throws, so screens handle both alike. */
export class ApiError extends Error {
  constructor(
    public readonly code:
      | "invalid-argument"
      | "not-found"
      | "failed-precondition"
      | "resource-exhausted"
      | "permission-denied"
      | "deadline-exceeded"
      | "unauthenticated"
      | "unavailable"
      | "internal",
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs a mock handler after a short delay and returns a deep copy, like data coming over
 * the network. Callers can then never mutate the mock database by accident.
 */
export async function mockRequest<T>(handler: () => T, latencyMs = MOCK_LATENCY_MS): Promise<T> {
  await sleep(latencyMs);
  // Dev switch for E03: behave like a dropped connection.
  if (devStates.get().offline) throw new ApiError("unavailable", "Không kết nối được tới Relife. Kiểm tra mạng rồi thử lại.");
  const result = handler();
  return result === undefined ? result : (JSON.parse(JSON.stringify(result)) as T);
}

export function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function randomCode(length = 6): string {
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return out;
}
