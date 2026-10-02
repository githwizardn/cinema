# 

> Cinema network web application — browse movies, book sessions, select seats, buy tickets, and manage your profile.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

---

## 📖 About

 full-featured cinema web application . Users can browse films, filter sessions, select seats on a live hall map, purchase tickets, and manage their bookings.

The project demonstrates a modern React stack with **TypeScript**, **TanStack Query** for server state, **Zustand** for client state, **React Router** for URL state, and **Tailwind CSS v4** for styling.

### What you can do

- 🎥 Browse Now Playing, Coming Soon, and Featured films
- 🎟️ Filter sessions by venue, date, format, language, and time of day
- 💺 Select up to 3 seats on a live hall map
- 💳 Complete checkout with an 8-minute hold timer
- 👤 Manage your profile (personal info, DOB, preferred venue)
- 🎫 View tickets, refund orders, subscribe to upcoming films

---

## 🚀 Live Demo

🔗 https://cinema-7wv0dx79j-githwizardns-projects.vercel.app/

###  Account

 Register a new account and complete your profile before booking.

---


## ✨ Features

### 🏠 Home Page
- Animated Hero carousel with 4 featured films (auto-rotate, pause on hover)
- Recently Viewed section (persisted to `localStorage`)
- Now Playing grid (6 films with age rating, runtime, starting price)
- Coming Soon grid (with "Notify Me" subscription)

### 🎟️ Sessions Page
- Sidebar filters: **Venue**, **Date** (next 7 days), **Format**, **Language**, **Time of Day**
- **Dynamic format filter** — formats narrow based on selected venues
- Sort by showtime, price, or title
- Pagination (10 films per page)
- **Full URL state** — every filter, sort, and page lives in the URL query string
- Skeleton loading states

### 🎥 Movie Detail
- Backdrop hero + overlapping poster
- Synopsis, director, cast, genres, formats, release date
- 7-day date picker (from `availableDates`)
- Sessions grouped by venue
- **Age restriction gate** — 16+ / 18+ films disabled for under-age users

### 🎫 Booking Modal (2-Step)
- **Step 1 — Seats:** Live hall map from API (`sections → rows → seats`), max 3 seats, per-seat ticket type (Adult / Child / Student)
- **Step 2 — Checkout:** 8-minute hold timer, buyer info (prefilled from profile), card payment
- **Confirmation:** Success screen with order reference and ticket details
- **409 Conflict handling** — contested seats removed, rest preserved, map refetched
- **Hold expiry** — auto-reset to Step 1 with warning

### 👤 Profile
- Personal info form (Full Name, Mobile, Date of Birth, Preferred Venue)
- Profile completeness indicator (yellow dot 🔴 / green dot 🟢 in navbar)
- **My Tickets** tabs: Upcoming / Past
- **Refund** button (allowed until 2 hours before session)

### 🔐 Authentication
- Login / Register modals with `onBlur` validation
- Avatar upload with live preview
- **Interrupted Action Pattern** — if a protected action triggers login, that action resumes automatically after auth

---

## 🛠 Tech Stack

| Category | Technology | Why |
|---|---|---|
| **UI Library** | React 18 | Component-based, Virtual DOM, hooks |
| **Language** | TypeScript 5 | Static types, compile-time errors |
| **Build Tool** | Vite 8 | Native ESM, instant HMR, Rollup build |
| **Styling** | Tailwind CSS v4 | Utility-first, `@theme` design tokens |
| **Server State** | TanStack Query v5 | Cache, retry, refetch, dedupe |
| **Client State** | Zustand | Lightweight, no boilerplate |
| **Routing** | React Router v6 | URL state, nested routes, protected routes |
| **Forms** | React Hook Form + Zod | Performance, schema validation |
| **HTTP** | Axios | Interceptors, better errors |
| **Fonts** | Archivo (Google Fonts) | Matches Figma design |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 18+ — [download](https://nodejs.org/)
- **npm** 9+ (comes with Node)
- **Git** — [download](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/githwizardn/cinema.git
cd cinema

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Then open `.env` and set:

```env
VITE_API_URL=https://api.kinoxii.redberryinternship.ge/api
```

### Run Locally

```bash
# Start dev server → http://localhost:5173
npm run dev
```

### Build for Production

```bash
# Build → dist/
npm run build

# Preview the production build locally
npm run preview
```

### Troubleshooting

<details>
<summary><strong>PowerShell: "npm" not recognized</strong></summary>

Use `npm.cmd` instead of `npm`:
```powershell
npm.cmd install
npm.cmd run dev
```
</details>

<details>
<summary><strong>Port 5173 already in use</strong></summary>

Vite automatically picks the next free port (5174, 5175, …). Check your terminal output.
</details>

---

## 📁 Project Structure

```
cinema/
├── public/                          # Static assets
│
├── src/
│   ├── api/                         # HTTP layer
│   │   ├── client.ts                # Axios instance + interceptors
│   │   ├── types.ts                 # TypeScript schemas
│   │   ├── auth.ts                  # login, register, me, logout
│   │   ├── catalogue.ts             # movies, search, notify
│   │   ├── sessions.ts              # sessions list
│   │   ├── booking.ts               # holds, orders
│   │   ├── profile.ts               # update profile
│   │   └── tickets.ts               # tickets + refund
│   │
│   ├── components/                  # Reusable UI
│   │   ├── ui/                      # Base components (Modal, Input)
│   │   ├── layout/                  # Layout, Navbar, SearchBar
│   │   ├── movie/                   # HeroCarousel, MovieCard, RecentlyViewed
│   │   ├── session/                 # FilterSidebar, SessionCard, Pagination
│   │   ├── booking/                 # BookingModal, SeatMap, CheckoutForm
│   │   └── profile/                 # TicketCard, RefundModal
│   │
│   ├── pages/                       # Route-level pages
│   │   ├── HomePage.tsx
│   │   ├── SessionsPage.tsx
│   │   ├── MovieDetailPage.tsx
│   │   └── ProfilePage.tsx
│   │
│   ├── features/                    # Domain logic
│   │   ├── auth/                    # authStore, AuthProvider, LoginForm, RegisterForm
│   │   └── booking/                 # bookingStore
│   │
│   ├── hooks/                       # Custom hooks (data + logic)
│   │   ├── useMovies.ts
│   │   ├── useSessions.ts
│   │   ├── useBooking.ts
│   │   ├── useHoldTimer.ts
│   │   ├── useTickets.ts
│   │   ├── useSearch.ts
│   │   ├── useUrlFilters.ts
│   │   └── …
│   │
│   ├── lib/                         # Utilities
│   │   ├── queryClient.ts           # TanStack Query config
│   │   └── storage.ts               # Token storage
│   │
│   ├── App.tsx                      # Routes + providers
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Tailwind + @theme tokens
│
├── .env                             # Local env (gitignored)
├── .env.example                     # Template
├── .gitignore
├── index.html                       # Archivo font
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Architecture Layers

```
┌─────────────────────────────────────┐
│  Pages (HomePage, SessionsPage)     │  Route-level
├─────────────────────────────────────┤
│  Components (HeroCarousel, Card)    │  Reusable UI
├─────────────────────────────────────┤
│  Hooks (useSessions, useBooking)    │  Business logic
├─────────────────────────────────────┤
│  API (client, auth, catalogue)      │  HTTP layer
├─────────────────────────────────────┤
│  Lib (queryClient, storage)         │  Utilities
└─────────────────────────────────────┘
```

---

## 🧠 Tech Deep Dive

> **This section is for anyone wanting to understand *why* each technology was chosen. Skip if you just want to run the project.**

<details>
<summary><strong>⚛️ Why React?</strong></summary>

React is a JavaScript library for building user interfaces. Key reasons for choosing it here:

- **Component-based architecture** — the UI is split into small, independent pieces (`Button`, `Modal`, `MovieCard`) that can be reused and tested in isolation.
- **Virtual DOM** — React only re-renders what actually changed, keeping the UI fast.
- **Hooks** (`useState`, `useEffect`, `useQuery`) — allow stateful logic inside functional components without classes.
- **Ecosystem** — the largest job market, most mature libraries, best TypeScript support.

**In short:** React keeps the UI declarative — you describe *what* you want, not *how* to update the DOM.
</details>

<details>
<summary><strong>🔷 Why TypeScript?</strong></summary>

TypeScript = JavaScript + static types. It catches errors **at compile time**, not at runtime.

**Example:**
```ts
// JavaScript — crashes at runtime if user is null
user.preferredVenue.name

// TypeScript — IDE warns immediately
user.preferredVenue.name       // ❌ Error: 'possibly null'
user.preferredVenue?.name      // ✅ Safe
```

With **20+ API schemas** in this project, TypeScript was essential. Autocomplete, refactoring, and type safety across files would be impossible without it.
</details>

<details>
<summary><strong>⚡ Why Vite (not Webpack / Next.js)?</strong></summary>

**Vite vs Webpack:**
| | Vite | Webpack |
|---|---|---|
| Dev server | Native ESM | Full bundle |
| HMR | ~50 ms | 2–3 s |
| Config | Minimal | Complex |

**Vite vs Next.js:**
- **Vite** = build tool for SPAs — no SSR, no SEO, tiny bundle.
- **Next.js** = full framework — SSR, API routes, image optimization.

This project is a **Single Page Application** (SEO not required, API is external), so Vite is the correct choice. Next.js would add unnecessary complexity.
</details>

<details>
<summary><strong>🎨 Why Tailwind CSS v4?</strong></summary>

Utility-first CSS — instead of writing custom CSS classes, you compose small utilities:

```tsx
<button className="px-4 py-2 bg-primary text-white rounded-input hover:bg-primary-hover">
  Buy Ticket
</button>
```

**Benefits:**
- No context switching between HTML and CSS files
- No naming struggles (`.btn-primary-large-red` → `bg-red-500 px-4 py-2`)
- Only used classes ship in production (tree-shaking)
- Tailwind v4 uses `@theme` in CSS instead of `tailwind.config.js` — cleaner design tokens

**Example `@theme` (design tokens from Figma):**
```css
@theme {
  --color-bg-base: #070C1C;
  --color-primary: #EC3013;
  --text-hero: 40px;
  --radius-card: 12px;
}
```
</details>

<details>
<summary><strong>🔄 Why TanStack Query?</strong></summary>

**The problem:** Server data (movies, sessions, tickets) needs caching, retry, refetch, dedupe, and loading/error states. Doing all this manually takes 20+ lines per query.

**TanStack Query solution:**

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['sessions', filters],
  queryFn: () => getSessions(filters),
  staleTime: 30_000,
})
```

**Free features:**
- ✅ **Cache** — duplicate requests merged
- ✅ **Retry** — configurable (skip 401/404)
- ✅ **Refetch on filter change** — via `queryKey`
- ✅ **Loading / error states** — no manual `useState`
- ✅ **Invalidation** — `queryClient.invalidateQueries(['seats'])` after mutation

**Concept:** TanStack Query manages **Server State**, React's `useState` manages **Client State**. Mixing them (as many beginners do) leads to cache bugs.
</details>

<details>
<summary><strong>🐻 Why Zustand?</strong></summary>

Lightweight client state manager (1 KB vs Redux ~10 KB).

**Three stores in this project:**
1. `useAuthStore` — user, isAuthenticated
2. `useAuthModal` — login/register modal state
3. `useBookingStore` — booking modal steps + cart
4. `usePendingAction` — interrupted action pattern

**Example:**
```ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    tokenStorage.set(token)
    set({ user, isAuthenticated: true })
  },
  clearAuth: () => {
    tokenStorage.clear()
    set({ user: null, isAuthenticated: false })
  },
}))
```

**Why not Redux?** No actions/reducers/dispatch boilerplate for a project this size.
</details>

<details>
<summary><strong>📝 Why React Hook Form + Zod?</strong></summary>

**React Hook Form** — uncontrolled inputs (no re-render per keystroke).

**Zod** — schema validation with TypeScript inference.

**Example:**
```tsx
const { register, formState: { errors, touchedFields } } = useForm({
  mode: 'onBlur',
})

<Input
  label="Email"
  error={errors.email?.message}
  isValid={touchedFields.email && !errors.email}
  {...register('email', {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email',
    },
  })}
/>
```

**`mode: 'onBlur'`** — validates when the user leaves a field.
</details>

<details>
<summary><strong>🚦 Why React Router + URL State?</strong></summary>

Every filter, sort, and page on the Sessions page lives in the **URL query string**:

```
/sessions?venues[]=galleria&formats[]=max&date=2026-11-14&page=2
```

**This gives us:**
- 📎 Copy/paste URL → same view
- 🔄 Refresh → filters preserved
- ⬅️ Back/forward → previous filter state
- 🔗 Share link with a friend

**Critical rule:** when any filter changes → **page resets to 1** (via `updateFilters`). Otherwise, a user on page 4 who adds a filter would see an empty page.
</details>

<details>
<summary><strong>🌐 Why Axios (not fetch)?</strong></summary>

**Axios** gives us interceptors for centralized auth + error handling:

```ts
// Request — auto-attach Bearer token
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response — normalize every error to a single ApiError shape
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(normalizeError(err)),
)
```

The `normalizeError` function converts 401/409/422/500 into a single TypeScript type, so components handle errors consistently.
</details>

---

## 🎯 Key Concepts & Solved Problems

 
### 1. 🔑 Interrupted Action Pattern

**Problem:** An unauthenticated user clicks "Select Seats". Login modal opens. After login, the seat selection should **resume automatically** — the user should not have to click again.

**Solution:** Zustand store holds a pending callback:

```ts
// Store the action
if (!isAuthenticated) {
  setPendingAction(() => () => open(sessionId))
  openLogin()
  return
}
open(sessionId)
```

```ts
// Replay after login success
setAuth(user, token)
closeModal()
runPendingAction()  // → open(sessionId) fires
```

**Where it's used:** session cards, "Notify Me" buttons, "My Tickets", profile navigation.

---

### 2. 🔗 URL State (Sessions)

Every filter → URL query param. Refresh, copy/paste, back/forward all work.

```tsx
const [searchParams, setSearchParams] = useSearchParams()

const filters = {
  venues: searchParams.getAll('venues[]'),
  formats: searchParams.getAll('formats[]'),
  date: searchParams.get('date'),
  sort: searchParams.get('sort') ?? 'time_asc',
  page: parseInt(searchParams.get('page') ?? '1'),
}
```

**Rule:** filter change → `page` resets to 1.

---

### 3. ⚡ Dynamic Format Filter

If the user selects venue "Galleria", only formats that Galleria actually shows should be listed.

```tsx
const availableFormats =
  filters.venues.length > 0
    ? filterOptions.formats.filter(f =>
        filters.venues.some(slug =>
          filterOptions.venues.find(v => v.slug === slug)
            ?.formats.some(vf => vf.slug === f.slug)
        )
      )
    : filterOptions?.formats ?? []
```

A `useEffect` also auto-removes already-selected formats that became invalid.

---

### 4. ⏱ Hold Timer (8 minutes)

The API returns `expiresAt` (absolute timestamp). The timer must count down **from this timestamp**, not from a local counter — otherwise a background tab can drift.

```ts
const tick = () => {
  const ms = new Date(expiresAt).getTime() - Date.now()
  const remaining = Math.max(0, Math.floor(ms / 1000))
  setSecondsLeft(remaining)
  if (remaining === 0) onExpire()
}
```

On expiry: seats clear, modal returns to Step 1, seat map refetches, and a warning appears.

---

### 5. 🔀 409 Conflict (Race Condition)

Two users hold the same seat. One wins, the other gets a **409 with a `contested` array**:

```json
{
  "message": "Some of those seats were just taken.",
  "contested": ["E7", "E8"]
}
```

Handling:
1. Read `contested` codes
2. Remove them from the selection (**keep the rest**)
3. Refetch seat map
4. Show a banner listing the lost seats

**Principle:** never reset the whole selection — preserve what survived.

---

### 6. 📋 422 Dual Shape

The API returns 422 in **two shapes**:

**Shape A — field validation:**
```json
{ "message": "…", "errors": { "mobileNumber": ["…"] } }
```

**Shape B — booking rule:**
```json
{ "message": "Your hold time expired." }
```

Distinguish via helpers:
```ts
export function isFieldError(error: ApiError) {
  return error.status === 422 && !!error.errors
}
export function isBookingRuleError(error: ApiError) {
  return error.status === 422 && !error.errors
}
```

---

### 7. 🎫 Seat Map — API-Driven

Halls have different shapes — 4 halls, no two alike. A hardcoded grid will break. The map comes from the API with this structure:

```
sections[] → rows[] → seats[]
```

Critical rules:
- **`aisleAfter: true`** → insert a spacer to the right (gangway)
- **`state: 'unavailable'`** → empty space, **do not** render a button
- **Row labels** come from the data (Hall D goes `G → J`, skipping `I`)

---

### 8. 🐛 React Hooks Rule (Black Screen Bug)

**Problem:** `useHoldTimer` was called twice — once before an early `if (!isOpen) return null`, once after. React crashed with "Rendered more hooks than during the previous render", producing a blank page.

**Fix:** all hooks at the top, before any conditional `return`.

**Lesson:** hooks count must be identical on every render.

---

### 9. 🎬 Race Between Mutation and Store

**Problem:** after `POST /orders` succeeded, the confirmation screen showed "Finalizing order…" forever — because `useMutation()` was instantiated in **two different components**, and each instance has its own local state.

**Fix:** store the `Order` object in Zustand, not in the mutation's local state.

**Lesson:** global side effects → global state.

---

### 10. 💥 `verbatimModuleSyntax` Errors

**Problem:** TypeScript refused `import { ApiError }` when `ApiError` is only a type.

**Fix:** `import type { ApiError } from './types'`.

**Lesson:** type-only imports are erased at compile time — the compiler must be told explicitly.

---

## 🔌 API Reference

**Base URL:** `https://api.kinoxii.redberryinternship.ge/api`
**Auth:** `Authorization: Bearer <token>`

### Endpoints used

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register new account |
| POST | `/login` | Login → token |
| POST | `/logout` | Revoke token |
| GET | `/me` | Current user (on boot) |
| PUT | `/profile` | Update profile |
| GET | `/filter-options` | Venues, formats, languages (cached once) |
| GET | `/search?q=` | Typeahead (max 6 results) |
| GET | `/movies/now-playing` | Now Playing films |
| GET | `/movies/coming-soon` | Coming Soon films |
| GET | `/movies/featured` | Hero carousel films |
| GET | `/movies/{slug}` | Film detail + available dates |
| GET | `/movies/{slug}/sessions` | Sessions on a date, grouped by venue |
| POST | `/movies/{slug}/notify` | Subscribe to Coming Soon |
| GET | `/sessions` | Sessions list (with filters) |
| GET | `/sessions/{id}/seats` | Hall map |
| POST | `/sessions/{id}/holds` | Hold seats (8 min) |
| DELETE | `/holds/{uuid}` | Release hold |
| POST | `/orders` | Pay & complete order |
| POST | `/orders/{ref}/refund` | Refund order |
| GET | `/tickets` | My tickets |

### Error Codes

| Code | Meaning | Behavior in app |
|---|---|---|
| **401** | Token missing/expired | Clear token, open login modal |
| **403** | Resource belongs to another user | Bug — surface as generic error |
| **404** | Not found | Show "not found" UI |
| **409** | Seats taken / slot busy | Handle `contested`, keep rest, refetch |
| **422** | Validation (with `errors`) | Map errors to fields |
| **422** | Booking rule (message only) | Show `message` as-is |
| **500** | Server fault | Generic error + retry |

---

## 🌐 Deployment

### Vercel (recommended)

https://cinema-7wv0dx79j-githwizardns-projects.vercel.app/

---

## 🚀 Future Improvements


- [ ] **Responsive layout** — mobile and tablet breakpoints (currently desktop-only at 1920×1080)
- [ ] **Dark / Light theme** toggle
- [ ] **Framer Motion** — smoother Hero carousel transitions
- [ ] **Internationalization (i18n)** — Georgian / English toggle
- [ ] **Unit tests** — Vitest + React Testing Library
- [ ] **E2E tests** — Playwright for booking flow
- [ ] **PWA** — offline support, install prompt
- [ ] **Foyer ordering** — snacks and drinks during checkout
- [ ] **Email verification** — after registration
- [ ] **Password reset** flow
- [ ] **Push notifications** — when a Coming Soon film releases

---

## 📚 Resources

- **Figma Design:** [Redberry Bootcamp XII](https://www.figma.com/design/rBonynbM7wSNOmPs4cryxT/Redberry-Bootcamp-XII)
- **API Docs:** [api.kinoxii.redberryinternship.ge/docs](https://api.kinoxii.redberryinternship.ge/docs)
- **React:** [react.dev](https://react.dev/)
- **TanStack Query:** [tanstack.com/query](https://tanstack.com/query/latest)
- **Tailwind CSS v4:** [tailwindcss.com](https://tailwindcss.com/)
- **Vite:** [vitejs.dev](https://vitejs.dev/)

---

## 👤 Author

**Githwizardn**
- GitHub: [@githwizardn](https://github.com/githwizardn)

---

## 🙏 Acknowledgments

- **Redberry** — ❤️
- **Figma designer** — ❤️
- **API team** — ❤️

---

<p align="center">
  <strong>🎬 Kino XII</strong><br>
  Built with React, TypeScript, and ❤️ in Georgia
</p>