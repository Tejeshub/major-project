
# PlantNest Build Plan

This is a large frontend-only build (~26 routes, rich interactivity). I'll implement it as a single TanStack Start app with localStorage persistence — no backend, no Lovable Cloud. All data is mock/seeded.

## Approach

**Stack additions**
- `leaflet` + `react-leaflet` for Garden Map (CartoDB Voyager tiles)
- `zustand` + `persist` middleware for global state (auth, plants, cart, posts, reminders, detections, consultations, subscription)
- `framer-motion` for transitions, counter animations, micro-interactions
- Fraunces + Plus Jakarta Sans via `<link>` in `__root.tsx`
- SVG hero illustration of terracotta pot (no Three.js — SVG is lighter, equally polished, and animates reliably with CSS/framer-motion)

**Design system** (`src/styles.css`)
- Tokens: `--background: #FAF6F0`, `--primary: #C1532B` (rust), `--accent: #E8A33D` (amber), `--foreground: #20201D` (ink), `--indigo: #2E3A52`, `--sage` for success
- Card warm shadow, 12px radius, eyebrow utility class, button variants (rust pill, ghost-border pill, amber)
- Fraunces for `.font-display`, Plus Jakarta for body

**State stores** (`src/stores/`)
- `auth.ts` — user, role, plan (free/premium/pro/seller), login/signup/logout
- `garden.ts` — plants, reminders, detections
- `shop.ts` — cart, orders, seller products
- `community.ts` — posts, comments, likes
- `experts.ts` — consultations, reviews
- All persisted via zustand/persist

**Routes** (`src/routes/`)
```
__root.tsx            (fonts, query provider, shell)
index.tsx             (landing)
login.tsx
onboarding.tsx        (4-step internal state machine)
_app.tsx              (layout: top nav + mobile bottom tabs, requires auth)
  _app/dashboard.tsx
  _app/plants.$id.tsx
  _app/detect/index.tsx
  _app/detect/history.tsx
  _app/detect/result.$id.tsx
  _app/reminders.tsx
  _app/community/index.tsx     (Feed/Map tabs)
  _app/community/post.$id.tsx
  _app/market/index.tsx
  _app/market/product.$id.tsx
  _app/cart.tsx
  _app/checkout.tsx
  _app/orders/index.tsx
  _app/orders/$id.tsx
  _app/learn/index.tsx
  _app/learn/$slug.tsx
  _app/experts/index.tsx
  _app/experts/$id.tsx
  _app/consultations/index.tsx
  _app/consultations/$id.chat.tsx
  _app/subscription.tsx
  _app/profile.tsx
  _app/seller/index.tsx
  _app/seller/products.tsx
  _app/seller/orders.tsx
```

Auth gate via `_app` `beforeLoad` redirecting to `/login`. Seller role check inside `/seller/*` routes.

**Seed data** (`src/data/seed.ts`)
- 20 products, 8 experts, 12 guides, 15 community posts, 8 map gardeners, 5 nurseries, 3 orders, 2 consultations
- All with Indian context, ₹ pricing, Mumbai locations

**Garden Map**
- Leaflet with CartoDB Voyager tiles
- Custom DivIcon pins: rust pot for user (with avatar), avatar circle for gardeners, amber leaf for nurseries
- Bottom drawer using framer-motion `AnimatePresence`
- Desktop split (30/70), mobile fullscreen with bottom strip

**Feature gates**
- Helper `canScan()`, `canAddPlant()`, `canBookExpert()` reading subscription store
- Gate modal component shared across triggers

**Polish**
- Page transitions via framer-motion in `_app` outlet wrapper
- Skeleton loaders for detect analyse (2.5s)
- Number counter component using `useInView` + spring
- Confetti on order placed (`canvas-confetti`)
- Toasts via existing `sonner`

## Scope notes / pragmatic trade-offs

1. **Hero illustration**: SVG terracotta pot with floating animation, not Three.js. Visually polished, zero runtime cost, no WebGL fragility.
2. **All "photos"**: I'll use Unsplash source URLs (plants) + DiceBear avatars (people/nurseries) so the app looks populated without bundling dozens of images.
3. **Mock "AI" detection**: deterministic cycle through 5 results based on detection count in store.
4. **Mock payments**: pure UI flow, no Stripe.
5. **OAuth**: Google button is decorative (mock — any click signs in), since there's no backend.
6. **PDF export, data export**: client-side blob downloads (JSON for export, simple HTML-to-print for PDF).

## Build order
1. Tokens, fonts, layout primitives, stores, seed data
2. Landing, login, onboarding
3. `_app` shell with nav, dashboard, plants, reminders
4. Detect flow + history
5. Community feed + post + create
6. Garden Map (Leaflet)
7. Marketplace, product, cart, checkout, orders
8. Learn, experts, consultations, chat
9. Subscription + feature gates
10. Profile + settings
11. Seller dashboard
12. Sweep: empty/loading/error states, transitions, micro-interactions

This will land as a large multi-turn build. I'll keep going until all routes work end-to-end.

**Confirm to proceed**, or tell me to trim anything (e.g. skip seller dashboard, simpler map, etc.).
