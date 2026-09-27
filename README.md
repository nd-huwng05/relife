# Relife

**Good food should not end up in the bin.** Relife connects bakeries and food shops that have surplus at the end of the day with people nearby who want it at a lower price.

- **Stores** post "surprise bags" or single items a few hours before closing.
- **Customers** find bags on a map, hold one, pay by VietQR and collect it in person with a pickup code.
- **Relife** collects the payment and pays stores in batches.
- **Charities** (phase 2) collect what is still unsold.

Pilot city: TP.HCM. Reference products: Too Good To Go, Karma.

## Status

| Sprint | Goal | State |
|---|---|---|
| S0 | Foundation: monorepo, Expo app, theme, route skeleton, Firebase config | Skeleton done |
| S1 | Login and roles (Google, phone OTP) | Planned |
| S2 | Store posts bags | Planned |
| S3 | Customer discovers bags on map and list | Planned |
| S4 | Hold and pay with VietQR | Planned |
| S5 | Pickup code and store scan | Planned |
| S6 | Admin web core | Planned |
| S7 | Reviews, notifications, insights, payouts | Planned |
| S8 | Hardening, TestFlight pilot | Planned |
| S9 | Charity and growth (phase 2) | Planned |

MVP is S0 to S8. The full plan, screen specs and module pages are in the team's Notion workspace (RELIFE), and the designs are in the Figma file "Relife".

## Tech stack

| Part | Technology |
|---|---|
| Mobile app | Expo SDK 57, React Native, TypeScript, Expo Router |
| Backend | Firebase: Auth, Firestore, Cloud Functions, Storage (region asia-southeast1) |
| Shared code | pnpm workspaces: `@relife/shared` (types, Zod schemas), `@relife/ui` (theme, components) |
| Payments | VietQR gateway (PayOS, SePay or Casso, to be decided) |
| Maps | Google Maps Platform |
| Admin | Next.js web app (from S6) |
| Build and release | EAS Build, EAS Submit, TestFlight, GitHub Actions |

## Repository structure

```
relife/
├── apps/
│   └── mobile/          Expo app for customers, stores and charities
├── packages/
│   ├── shared/          Types, validation schemas, constants, money helpers
│   └── ui/              Colors, fonts, spacing and base components
├── functions/           Cloud Functions (server code)
├── firebase/            Security rules and indexes
├── docs/
│   └── ARCHITECTURE.md  How the code is organised and the rules for each layer
├── firebase.json        Emulator and deploy configuration
└── pnpm-workspace.yaml  Declares the workspaces above
```

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before adding a feature.

## Getting started

### 1. Install tools (once per laptop)

- [Node.js 22 LTS](https://nodejs.org)
- pnpm through Corepack (ships with Node). In an **administrator** PowerShell:
  ```powershell
  corepack enable pnpm
  ```
  Then open a new terminal and check `pnpm -v`.
- [Git](https://git-scm.com)
- VS Code with the ESLint, Prettier and Expo Tools extensions
- **Expo Go** on your iPhone (App Store)
- Later, for the local backend (S1): Java 21 and `npm i -g firebase-tools`
- For builds (from S1): `npm i -g eas-cli`

### 2. Clone and install

```bash
git clone <repo-url> relife
cd relife
pnpm install
```

### 3. Configure the app

```powershell
Copy-Item apps/mobile/.env.example apps/mobile/.env.local
```

Until real sign-in exists, `EXPO_PUBLIC_DEV_ROLE` in `.env.local` decides which part of the app you see: `customer`, `store` or `charity`. Leave it empty to see the sign-in screens.

### 4. Run on your iPhone

```bash
pnpm mobile
```

Scan the QR code with the iPhone camera. The phone and the laptop must be on the same Wi-Fi. If it cannot connect, run `npx expo start --tunnel` inside `apps/mobile`.


## Scripts

| Command | What it does |
|---|---|
| `pnpm mobile` | Start the Expo dev server |
| `pnpm android` / `pnpm ios` | Start and open on an emulator or simulator |
| `pnpm typecheck` | Type-check every workspace |
| `pnpm --filter @relife/mobile lint` | Lint the mobile app |
| `pnpm functions:build` | Bundle Cloud Functions into `functions/lib` |
| `pnpm emulators` | Start the Firebase Emulator Suite (from S1) |

To add a library to the mobile app, run `npx expo install <package>` inside `apps/mobile` so the version matches the Expo SDK.

## Rules everyone follows

- The app never writes money, stock or order status directly; only Cloud Functions do.
- An order is "paid" only after the payment webhook confirms it.
- Money is always an integer number of đồng. Time is stored in UTC and shown in Vietnam time.
- Types and validation schemas live only in `packages/shared`.
- Never commit `.env.local`, service account files or payment keys.

## Contributing

1. Create a branch per task: `feat/fs2-post-bag`, `fix/fs3-scan-timeout`.
2. Commit with Conventional Commits and the module code: `feat(fs2): add bag photo upload`.
3. Run `pnpm typecheck` before pushing.
4. Open a small pull request with a link to the Notion module and a screenshot from an iPhone. One review and green CI are needed to merge.
