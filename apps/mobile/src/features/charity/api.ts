import type { CharityApplication, CharityProfile, Claim, IntakeReport, Surplus } from "@relife/shared";

import { data, db, fn, mockRequest } from "@/lib/mock";

// FH1 (charity onboarding) and FH2 (claiming surplus). Phase 2, sprint S9. Mock API for now.
// TODO(S9): `charityApplications`, `charities`, `surplus` queries and the `claimSurplus`
// and `exportIntakeReport` Functions.

export function getCharity(): Promise<CharityProfile> {
  return mockRequest(() => db.charity, 200);
}

export function getCharityApplication(): Promise<CharityApplication> {
  return mockRequest(() => db.charityApplication, 200);
}

export function getSurplusList(): Promise<Surplus[]> {
  return mockRequest(() => db.surplus);
}

export function getSurplus(id: string): Promise<Surplus> {
  return mockRequest(() => {
    const s = db.surplus.find((x) => x.id === id);
    if (!s) throw new Error("Nguồn này không còn");
    return s;
  }, 200);
}

export function claimSurplus(input: { surplusId: string; units: number }): Promise<Claim> {
  return mockRequest(() => fn.claimSurplus(input.surplusId, input.units), 600);
}

export function getClaims(): Promise<Claim[]> {
  return mockRequest(() => db.claims);
}

export function getClaim(id: string): Promise<Claim> {
  return mockRequest(() => {
    const c = db.claims.find((x) => x.id === id);
    if (!c) throw new Error("Không tìm thấy phiếu");
    return c;
  }, 200);
}

export function getIntakeReport(): Promise<IntakeReport> {
  return mockRequest(() => data.intakeReport);
}

export function updateCharitySettings(patch: Partial<Pick<CharityProfile, "radiusKm" | "onlyMatchingStorage">>): Promise<CharityProfile> {
  return mockRequest(() => {
    db.charity = { ...db.charity, ...patch };
    return db.charity;
  }, 400);
}
