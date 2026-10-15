// Every create call carries an idempotencyKey so a retry never double books.
// TODO(S1): add the httpsCallable wrapper for Cloud Functions in asia-southeast1 here.

/** New key per user action. Keep it in state so retries of the same action reuse it. */
export function newIdempotencyKey(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
