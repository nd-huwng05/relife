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

This is the empty skeleton (sprint S0). Files marked "added from Sx" are filled in
the sprint that needs them, not earlier.

## Routes (`apps/mobile/src/app`)

| Group | Who | Notes |
|---|---|---|
| `(auth)` | Signed out | welcome, login, phone, otp |
| `(customer)` | Customers | `(tabs)`: Discover, Orders, Account; stack: `bag/[id]`, `store/[id]` |
| `(store)` | Store owners | `(tabs)`: Today, Scan, Orders; modal: `bags/new` |
| `(charity)` | Charities | S9 |

The root `_layout.tsx` uses `Stack.Protected` to show only the group for the
current role. Until auth lands (S1), set `EXPO_PUBLIC_DEV_ROLE` in
`apps/mobile/.env.local` to `customer`, `store` or `charity`.

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
| `constants/` | `USER_ROLE` | order, bag and store statuses, collection names |
| `money.ts` | `Vnd`, `formatVnd()`, `isValidVnd()` | |
| `schemas/` | empty | Zod input schemas (e.g. `bagSchema` in S2) |
| `types/` | empty | Firestore document shapes from Notion BE1 |

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
