# Relife architecture

Higher layers may import lower layers, never the reverse.

```
apps/mobile/src/app/        Screens (Expo Router). Thin: compose features, no logic.
apps/mobile/src/features/   One folder per module (FC1, FS2, ...). Most code lives here.
apps/mobile/src/lib/        App-wide setup: firebase, functions, queryClient, storage.
apps/mobile/src/components/ App-level layout pieces (Screen, PlaceholderScreen).
apps/admin/                 Next.js admin console (D01–D16) for the Relife team.
packages/ui                 Theme (colors, typography, spacing) + base components.
packages/shared             Types, Zod schemas, constants, helpers. App AND server.
functions/                  Cloud Functions. The only place that writes money, stock
                            or order status.
firebase/                   Security rules and indexes.
```

Every screen of the Figma file (A01–A32, B01–B24, C01–C08) is built on top of a
**mock API** (see [MOCK_API.md](MOCK_API.md)). Each sprint replaces the mock calls in
one feature's `api.ts` with Firebase; screens and hooks do not change.

## Routes (`apps/mobile/src/app`)

| Group | Who | Notes |
|---|---|---|
| `(auth)` | Signed out | `welcome` (A01), `onboarding` (A02), `location` (A03), `login` (A04), `phone` (A05), `otp` (A06), `profile-setup` (A07) |
| `(customer)` | Customers | `(tabs)`: index (A08), map (A11), orders (A21), saved (A26), profile (A27). Stack: `filter` (A09), `search` (A10), `bag/[id]` (A12), `store/[id]` (A13), `checkout/*` (A14–A19), `pickup/[orderId]` (A20), `order/[id]` (A22–A24), `notifications` (A25), `account/*` (A28–A32) |
| `(store)` | Store owners | `status` (B01–B03) until the application is approved, then `(tabs)`: index (B04), bags (B05), scan (opens `scanner`), revenue (B17), settings (B20). Stack: `bags/*` (B06–B09), `today-orders/*` (B10, B11, B16), `scanner/*` (B12–B15), `payouts/*` (B18, B19), `settings/notifications` (B21), `reviews` (B22), `staff` (B23), `training` (B24), `register` |
| `(charity)` | Charities | `(tabs)`: index (C03), claims (C06), report (C07), area (C08). Stack: `surplus/[id]` (C04), `claim/[id]` (C05), `org-register` (C01), `verification` (C02). Phase 2, S9 |

The root `_layout.tsx` uses `Stack.Protected` to show only the group for the
current role. The role comes from `sessionStore` in `features/auth`: it starts from
`EXPO_PUBLIC_DEV_ROLE` (`customer`, `store`, `charity` or empty for the sign-in flow)
and then follows the fake sign-in. Replace it with Firebase Auth in S1.

## Shared states (E01–E08)

| State | Where | How it is triggered |
|---|---|---|
| E01 Loading | `LoadingView` in `@relife/ui` | Skeleton after 200 ms, "Tải lâu hơn bình thường" + retry after 10 s |
| E02 Empty list | `discover/EmptyResults` | Discover has no bag for the current filters |
| E03 Offline | `status/OfflineBanner`, `OfflineState` | A request fails with a network error (`lib/connectivity.ts`, no NetInfo); the next success clears it |
| E04 System error | `status/SystemErrorScreen` | Root `ErrorBoundary` in `app/_layout.tsx`, and Discover on unexpected errors |
| E05 Outside coverage | `status/OutsideCoverageScreen` | Location is farther than `serviceArea.radiusKm` from `config/app` |
| E06 Location denied | `status/LocationDeniedScreen` | Map tab when permission is denied |
| E07 Maintenance, E08 Force update | `status/AppGate` | `config/app` (`useAppStatus`, polled every minute); `/pickup/*` stays open |

`/dev-states` (Account → "Trạng thái hệ thống (dev)", only in `__DEV__`) switches the mock
into each state through `lib/devStates.ts` and previews every screen.

## App components (`apps/mobile/src/components`)

`Screen`, `ScreenHeader`, `BottomBar`, `Sheet` (bottom sheet for transparent modal
routes), `FloatingTabBar` (the Deep Forest pill from Figma), `Photo`, `CopyRow`,
`RelifeMap` (real map with react-native-maps: Apple Maps on iOS, works in Expo Go;
`RelifeMap.web.tsx` falls back to the Figma illustration in `FakeMap`) and
`lib/location.ts` (`useUserLocation`, permission request, distance).

Route URLs must be unique across role groups (e.g. the store's order list is
`/today-orders`, the charity settings tab is `/area`), otherwise the router can resolve
a link to a protected group of another role.

## Feature folders

| Folder | Module | Sprint |
|---|---|---|
| `auth` | FC1 | S1 |
| `discover` | FC2 | S3 |
| `bags` | FC3, FS2 | S2, S3 |
| `checkout` | FC4 | S4 |
| `pickup` | FC5, FS3 | S5 |
| `profile` | FC6 | S8 |
| `store-admin` | FS1, FS4 | S2, S7 |
| `charity` | FH1, FH2 | S9 |
| `status` | Shared states E01–E08 | all |

```
features/<name>/
├── components/   PascalCase.tsx
├── hooks/        useSomething.ts
├── api.ts        every Firebase / Cloud Function call for this feature
├── store.ts      optional Zustand state shared between screens
└── index.ts      public entry; screens import only from "@/features/<name>"
```

## Admin console (`apps/admin`)

Next.js 16 App Router + Tailwind 4, port 3001 (`pnpm admin`). Same layering as mobile:

```
src/app/login/               D01 sign-in (email + 6-digit code, httpOnly cookie, 30 min)
src/app/(console)/           D02–D16; layout.tsx checks the session and draws the Sidebar
src/features/<area>/         api.ts (server-only reads + calls), actions.ts ("use server"),
                             components/, index.ts
src/components/              ui.tsx (PageHeader, Card, Badge, Table, Modal, …), forms.tsx
                             (client SubmitButton, ActionButton, FormMessage), Icon, Sidebar
src/lib/                     session.ts, actions.ts (runAction, requireCaller), mock/
```

| Folder | Screens |
|---|---|
| `overview` | D02 |
| `stores` | D03 approvals, D04 stores + suspend dialog |
| `moderation` | D05 bags |
| `orders` | D06 lookup |
| `finance` | D07 reconciliation, D08 payouts (+ `/payouts/export` CSV), D09 refunds |
| `support` | D10 complaints, D11 users |
| `charities` | D12 |
| `comms` | D13 push, D14 reports |
| `system` | D15 audit log, D16 config |

- Every write goes through `lib/mock/functions.ts`, which mirrors the future admin Cloud
  Functions: validate with the shared schema, check `idempotencyKey`, change data, append
  to `auditLog`. Only feature `api.ts` files import it.
- `lib/mock/db.ts` keeps the data in memory on `globalThis`; restart `pnpm admin` to reset.
  Mock time is pinned to Saturday 27/09/2026 19:42 (`lib/mock/clock.ts`) to match Figma.
- Selection and dialogs live in the URL (`?id=`, `?tab=`, `?suspend=`), so pages stay
  server components and links are shareable.
- Colors come from `@relife/ui/theme.css` (Tailwind tokens); fonts are the same Inter and
  Playfair files the app uses, loaded with `next/font/local`.

## Shared package (`packages/shared/src`)

| Folder / file | Contains now | Grows into |
|---|---|---|
| `constants/` | `USER_ROLE`, order/bag/store/payout/claim statuses, admin statuses and `AUDIT_ACTION` (`admin.ts`) | collection names |
| `money.ts` | `Vnd`, `formatVnd()` ("59.000đ"), `formatVndShort()`, `discountPercent()` | |
| `time.ts` | Vietnam-time formatting (`formatWindow`, `minutesUntil`, `vnTimeOn`, …) | |
| `schemas/` | Zod inputs: phone/OTP/profile, `bagSchema`, `createOrderSchema`, `cancelOrderSchema`, `reviewSchema`, `payoutAccountSchema`, admin decisions (`schemas/admin.ts`), … | |
| `types/` | Document shapes from Notion BE1: `Store`, `Bag`, `Order`, `UserProfile`, `Review`, `Payout`, charity types, admin read models (`types/admin.ts`) | |

## UI package (`packages/ui/src`)

Tokens from the Figma Foundations page (`colors`, `typography`, `spacing`, `radius`,
`shadows`), the Simple Design System icons as `<Icon name="bag" />` (paths exported from
Figma in `icons/paths.ts`) and base components: `Button`, `IconButton`, `Chip`,
`SelectChip`, `StatusBadge`, `TextField`, `CodeInput`, `Toggle`, `Slider`, `Card`,
`ListRow`, `KeyValueRow`, `Price`, `Stepper`, `Avatar`, `SegmentedControl`,
`ProgressBar`, `StepBar`, `PageDots`, `RadioRow`, `CheckboxRow`, `StarRating`,
`Timeline`, `HeroIcon`, `InfoNote`, `SectionHeader`, `Overline`, `StateView`, `LoadingView`,
`Skeleton`, `SkeletonList`, `StatePage`.

## Rules

- `packages/shared` must not import from `apps/`, React Native or the Firebase client SDK.
- Money is an integer number of VND (`Vnd`); show it with `<Price>` / `formatVnd`.
- Time is stored in UTC and shown in Vietnam time.
- No hard-coded colors in screens; use `colors` from `@relife/ui`.
- Validate input with the schemas in `packages/shared` on both the app and the server.
- Add native-compatible packages to the app with `npx expo install`.

## Functions and Firebase

- `functions/` is bundled with tsup so `@relife/shared` is inlined into `lib/`;
  `firebase deploy` uploads only that folder. Export every function from
  `functions/src/index.ts`. All functions run in `asia-southeast1`.
- `.firebaserc` points at `demo-relife`, a demo project that exists only inside the
  Firebase Emulator Suite, so local work needs no real project.
- `firestore.rules` and `storage.rules` deny everything until a feature opens access.
