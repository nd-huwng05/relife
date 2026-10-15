# Relife architecture

Higher layers may import lower layers, never the reverse.

```
apps/mobile/src/app/        Screens (Expo Router). Thin: compose features, no logic.
apps/mobile/src/features/   One folder per module (FC1, FS2, ...). Most code lives here.
apps/mobile/src/lib/        App-wide setup: firebase, functions, queryClient, storage.
apps/mobile/src/components/ App-level layout pieces (Screen, PlaceholderScreen).
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

```
features/<name>/
├── components/   PascalCase.tsx
├── hooks/        useSomething.ts
├── api.ts        every Firebase / Cloud Function call for this feature
├── store.ts      optional Zustand state shared between screens
└── index.ts      public entry; screens import only from "@/features/<name>"
```

## Shared package (`packages/shared/src`)

| Folder / file | Contains now | Grows into |
|---|---|---|
| `constants/` | `USER_ROLE`, order/bag/store/payout/claim statuses | collection names |
| `money.ts` | `Vnd`, `formatVnd()` ("59.000đ"), `formatVndShort()`, `discountPercent()` | |
| `time.ts` | Vietnam-time formatting (`formatWindow`, `minutesUntil`, `vnTimeOn`, …) | |
| `schemas/` | Zod inputs: phone/OTP/profile, `bagSchema`, `createOrderSchema`, `cancelOrderSchema`, `reviewSchema`, `payoutAccountSchema`, … | |
| `types/` | Document shapes from Notion BE1: `Store`, `Bag`, `Order`, `UserProfile`, `Review`, `Payout`, charity types | |

## UI package (`packages/ui/src`)

Tokens from the Figma Foundations page (`colors`, `typography`, `spacing`, `radius`,
`shadows`), the Simple Design System icons as `<Icon name="bag" />` (paths exported from
Figma in `icons/paths.ts`) and base components: `Button`, `IconButton`, `Chip`,
`SelectChip`, `StatusBadge`, `TextField`, `CodeInput`, `Toggle`, `Slider`, `Card`,
`ListRow`, `KeyValueRow`, `Price`, `Stepper`, `Avatar`, `SegmentedControl`,
`ProgressBar`, `StepBar`, `PageDots`, `RadioRow`, `CheckboxRow`, `StarRating`,
`Timeline`, `HeroIcon`, `InfoNote`, `SectionHeader`, `Overline`, `StateView`, `LoadingView`.

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
