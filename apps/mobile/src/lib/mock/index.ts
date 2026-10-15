// Mock backend used until Firebase is wired up. Only feature `api.ts` files import this.
// To switch a feature to Firebase, rewrite its api.ts functions; screens and hooks stay the same.
export { MOCK_OTP } from "./config";
export * as data from "./data";
export { db, resetMockDb } from "./db";
export * as fn from "./functions";
export { photoSource } from "./images";
export { ApiError, mockRequest } from "./request";
