# Mock API

Until Firebase is wired up, every screen reads and writes fake data in memory. The
mock follows the same rules as the real backend (Notion BE1, BE2), so the screens
behave like the final app.

## Where things are

```
apps/mobile/src/lib/mock/
  data/          The fake data files. Edit these to change what the demo shows.
    stores.ts    Fake `stores` (MY_STORE_ID is the store the "store" role manages)
    bags.ts      Fake `bags`, `bagTemplates`, pickup windows, allergens
    orders.ts    Fake `orders` for the demo customer and for the demo store
    users.ts     Demo customer profile and notifications
    storeAdmin.ts Revenue, payouts, staff, reviews, store application
    charity.ts   Charity profile, surplus, claims, intake report
    content.ts   Static copy: FAQ, legal links, onboarding, training cards
  db.ts          In-memory copy of the collections, rebuilt on every app reload
  functions.ts   Fake Cloud Functions: createOrder, createPayment, the payment
                 webhook, cancelOrder, redeemPickup, markNoShow, publishBag, …
  request.ts     mockRequest(): adds latency and returns a copy; ApiError
  config.ts      Latency, demo clock start time, webhook delay
  images.ts      Photo keys → bundled photos exported from Figma
```

Only feature `api.ts` files import `@/lib/mock`. Components and hooks never do.

## Demo accounts

Sign in with a phone number and the OTP `123456` (`DEMO_ACCOUNTS` in `data/users.ts`):

| Role | Phone | Signs in as |
|---|---|---|
| Customer | 0912 345 678 | Hưng Nguyễn |
| Store | 0901 234 567 | Mai, owner of Maison Bơ Sữa |
| Charity | 0933 333 333 | Phạm Thu Hà, Bếp ăn Nhân Ái |

Any other valid number is treated as a new user and goes through profile setup (A07).
To change role, sign out and sign in with another account. Setting `EXPO_PUBLIC_DEV_ROLE`
in `.env.local` still skips sign-in for quick UI work.

## Behaviour worth knowing

- **Demo clock.** `lib/clock.ts` starts at 18:55 Vietnam time (`config.ts`) and then runs
  in real time, so countdowns and pickup windows look like the Figma frames at any hour.
- **Payment.** `createOrder` holds stock for 15 minutes. "Tôi đã chuyển khoản" only reports
  the transfer; about 4 seconds later the fake webhook sets the order to `paid` (or to
  `refunding` if the hold had expired). The app never marks an order paid itself.
- **Idempotency.** Create calls carry an `idempotencyKey`; a retry returns the first result.
- **Pickup.** The customer's QR contains `relife:pickup:<code>`. The store scanner and manual
  entry go through `redeemPickup`, which checks store, window and reuse. Try the demo
  customer's code `K7QM4P` in the store's manual entry, or `USED12` for "Mã đã được dùng".
- **Store application.** Choosing "Tôi có tiệm bánh" in A07 starts a draft application (B01).
  In dev builds, B02 has buttons to simulate approve or reject (there is no admin app yet).

## Replacing the mock with Firebase

Do it one feature at a time, in the sprint that owns it:

1. Rewrite the functions in `features/<name>/api.ts` to call Firestore or `httpsCallable`.
   Keep the same function names, inputs and return types.
2. Delete the matching handlers from `lib/mock/functions.ts` and the data they used.
3. Set `MOCK_CLOCK.enabled = false` in `lib/mock/config.ts` once no feature uses mock times.
4. When nothing imports `@/lib/mock` any more, delete the folder and the photos in
   `assets/images/mock/`.

## Shared states (E03–E08)

`apps/mobile/src/lib/devStates.ts` holds dev switches read by the mock: `offline` makes every
`mockRequest` throw `ApiError("unavailable")`, `maintenance` and `forceUpdate` change what
`features/status/api.ts` returns, `outsideCoverage` and `locationDenied` change what
`lib/location.ts` reports. Toggle them on `/dev-states` (Account → "Trạng thái hệ thống (dev)").
All switches are off on launch.

