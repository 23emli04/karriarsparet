# Karriärspåret – Project Overhaul & Suggestions

This document outlines a comprehensive set of improvements for the Karriärspåret education portal. The app is a Swedish education search/filter UI built with React 19, Vite 7, Tailwind CSS 4, and React Router 7.

---

## 1. Architecture & Structure

### 1.1 URL-Searchable State
**Issue:** Filter state (search, providers, regions, page) lives only in React state. Refreshing or sharing a URL loses filters.

**Suggested change:**
- Use React Router’s `useSearchParams` or a dedicated routing lib to sync:
  - `?q=...` for search
  - `?providers=A,B` / `?regions=01,12` for filters
  - `?page=2` for pagination
- Enables shareable links and better browser back/forward behavior.

### 1.2 Centralize Data Fetching
**Issue:** `useEducationProviders` and `useRegions` each do their own `useEffect` + `fetch`, without caching or deduplication.

**Suggested change:**
- Adopt **TanStack Query (React Query)** or **SWR**:
  - Caching and deduplication for providers/regions
  - Stale-while-revalidate
  - Loading/error states
  - Background refetch for educations list
  - Optional prefetch for detail pages

### 1.3 Environment-Based API Base URL
**Issue:** `API_BASE = "http://localhost:8080/api"` is hardcoded.

**Suggested change:**
```ts
// .env.development / .env.production
VITE_API_BASE=http://localhost:8080/api

// api/educations.ts
export const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";
```
- Supports different backends per environment and reverse-proxy setups.

---

## 2. Code Quality & Consistency

### 2.1 File Extensions in Imports
**Issue:** Some imports use `.tsx` (e.g. `from "./App.tsx"`), which is unnecessary in TypeScript and can be inconsistent.

**Suggested change:**
- Remove file extensions from internal imports:
  - `import App from "./App"` instead of `from "./App.tsx"`.

### 2.2 TypeScript Hook Filenames
**Issue:** `useEducations.tsx` and `useFetch.tsx` are `.tsx` but have no JSX.

**Suggested change:**
- Rename to `.ts` for clarity and to avoid confusion.

### 2.3 Extract Shared UI Patterns
**Issue:** `LoadingState`, `ErrorState`, `ProviderSkeleton`, `EducationsSkeleton` are duplicated across pages with similar logic and layout.

**Suggested change:**
- Create shared components in `src/components/ui/`:
  - `PageLoadingSkeleton`
  - `PageErrorState` – with optional back link and retry
  - `EmptyState` – for empty lists
- Reuse in HomePage, EducationDetailPage, ProviderPage, ProvidersListPage.

### 2.4 FilterButton Duplication
**Issue:** `FilterButton` is duplicated in `RegionFilter.tsx` and `ProviderFilter.tsx` with the same implementation.

**Suggested change:**
- Extract to `src/components/ui/FilterButton.tsx` and import in both.

### 2.5 Stricter ESLint
**Issue:** Basic ESLint setup; no type-aware rules.

**Suggested change:**
- Add `tseslint.configs.recommendedTypeChecked` or `strictTypeChecked`.
- Configure `parserOptions.project` for `tsconfig.app.json` and `tsconfig.node.json`.
- Improves type safety and catches more issues early.

---

## 3. Performance & Data Fetching

### 3.1 Caching & Request Deduplication
**Issue:** `useEducationProviders` and `useRegions` always refetch when components mount.

**Suggested change:**
- Use TanStack Query:
  - Providers: `queryKey: ["providers"]`
  - Regions: `queryKey: ["regions"]`
  - Educations: `queryKey: ["educations", query]` with appropriate invalidation.

### 3.2 Search Debouncing
**Issue:** Search runs on submit only; good for UX but not reflected in URL.

**Suggested change:**
- If you add URL-synced search, consider debouncing writes to URL (e.g. 300–500 ms) to avoid too many history entries and re-fetches.

### 3.3 React Compiler (Optional)
**Issue:** README mentions React Compiler but it’s not enabled.

**Suggested change:**
- Consider enabling it for automatic memoization and fewer unnecessary re-renders.

---

## 4. Design System & Theming

### 4.1 Brand Color `blue`
**Issue:** `bg-blue` and `text-blue` are used extensively. Tailwind v4 treats `blue` as the standard Tailwind blue; custom color `#6CE5E8` is defined in `App.css` only for `.bg-blue` and `.main_blue`. `text-blue` therefore uses Tailwind’s default blue, not the brand color.

**Suggested change:**
- Define a custom theme in Tailwind v4 (e.g. in `index.css` or a theme file):
```css
@theme {
  --color-brand: #6CE5E8;
  --color-brand-alt: #4bc2c6;
}
```
- Use `text-brand`, `bg-brand`, etc., or keep `.text-blue` and `.bg-blue` as custom utilities that map to brand colors for consistency.

### 4.2 Design Tokens
**Issue:** Spacing and typography are ad hoc.

**Suggested change:**
- Use CSS variables for:
  - Max content widths (`--max-w-content`, `--max-w-narrow`, etc.)
  - Section padding
  - Border radius scale
- Improves consistency and easier theming.

---

## 5. UX & Accessibility

### 5.1 Loading/Error Feedback for Regions & Providers
**Issue:** If `useRegions` or `useEducationProviders` fails, HomePage still shows filters; users may not see why filters are empty or behave oddly.

**Suggested change:**
- Surface region/provider loading/error in the filter UI.
- Optional: small inline retry button if regions/providers fail.

### 5.2 Focus Management
**Issue:** When changing page and scrolling to results anchor, focus is not moved.

**Suggested change:**
- After page change, move focus to the results heading or first result card (`element.focus()`, with `tabIndex={-1}` if needed).
- Helps keyboard and screen reader users.

### 5.3 Semantic Markup
**Issue:** Hero CTA uses `<a href="#programs">` instead of a button that scrolls.

**Suggested change:**
- Use `aria-label` on the scroll target (`#programs`).
- Optionally use `scroll-margin-top` so fixed headers don’t hide the section.

### 5.4 Error Boundaries
**Issue:** No React error boundaries.

**Suggested change:**
- Add a root ErrorBoundary that renders a fallback UI.
- Optionally add page-level boundaries so one page failure doesn’t crash the whole app.

---

## 6. Configuration & Tooling

### 6.1 Path Aliases
**Issue:** Long relative imports like `../../hooks/useSearchFilters`.

**Suggested change:**
- Add path aliases in `vite.config.ts` and `tsconfig.app.json`:
```ts
// e.g. @/ for src/
import { useSearchFilters } from "@/hooks/useSearchFilters";
```

### 6.2 TypeScript
**Issue:** `tsconfig.json` only references other configs; main configs may allow loose `any`.

**Suggested change:**
- In `tsconfig.app.json`, enable:
  - `strict: true`
  - `noUncheckedIndexedAccess: true` (optional but strict)
- Fix resulting type errors.

### 6.3 Tests
**Issue:** No tests.

**Suggested change:**
- Add Vitest.
- Add React Testing Library.
- Start with:
  - Unit tests for `buildEducationsQuery`, `queryBuilder`, `normalizePage`, `fullDataUtils`.
  - Integration tests for key flows (search, filter, navigation).
- Optional: Playwright for E2E tests.

---

## 7. Documentation

### 7.1 README
**Issue:** README is the default Vite template; it doesn’t describe Karriärspåret.

**Suggested change:**
- Add:
  - Project purpose (Swedish education portal).
  - Prerequisites (Node version).
  - Setup and dev instructions.
  - Environment variables.
  - API base URL configuration.
  - Optional: deployment notes.

### 7.2 API Reference
**Issue:** `docs/API_REFERENCE.md` is good; Swagger URL is hardcoded.

**Suggested change:**
- Note how to override the Swagger/base URL per environment.
- Add a short “architecture” section describing routing, data flow, and main components.

---

## 8. Security & Deployment

### 8.1 API Base URL
**Issue:** Hardcoded `localhost:8080` prevents straightforward production use.

**Suggested change:**
- Use `VITE_API_BASE` in production.
- In production, prefer a relative `/api` path behind a reverse proxy.

### 8.2 CSP & Security Headers
**Issue:** No Content-Security-Policy or security headers mentioned.

**Suggested change:**
- Configure CSP and security headers where the app is served (Nginx, Vercel, etc.).
- Restrict script/style sources and external connections as appropriate.

---

## 9. Feature Enhancements

### 9.1 Map Integration (Leaflet)
**Issue:** Leaflet and react-leaflet are in `package.json` but not used.

**Suggested change:**
- Add a map view for educations or providers with location data.
- Or remove the dependency if not planned.

### 9.2 Filters Combine Search
**Issue:** `queryBuilder` uses search OR filter (provider/region); search + filter together only pass `providerTitle: providers[0]`.

**Suggested change:**
- If the API supports it, allow search + multiple providers/regions.
- Otherwise, document the current behavior and consider UX copy to explain it.

### 9.3 Pagination UX
**Issue:** Pagination is functional but minimal.

**Suggested change:**
- Add “Previous”/“Next” labels or icons.
- Optionally show “Page X of Y”.
- Consider URL-synced page for shareable pagination links.

---

## 10. Priority Summary

| Priority | Item | Effort |
|----------|------|--------|
| **High** | Environment-based `API_BASE` | Low |
| **High** | URL-synced search/filter state | Medium |
| **High** | TanStack Query (or SWR) for data fetching | Medium |
| **Medium** | Shared Loading/Error components | Low |
| **Medium** | Extract FilterButton, fix design color consistency | Low |
| **Medium** | Path aliases (`@/`) | Low |
| **Medium** | ESLint type-aware rules | Low |
| **Low** | README update | Low |
| **Low** | Vitest + RTL tests | Medium |
| **Low** | Error boundaries | Low |
| **Optional** | Map feature (Leaflet) or remove dependency | Medium |
| **Optional** | React Compiler | Low |

---

## Next Steps

1. Choose a subset of high-priority items to start with.
2. If you want, I can:
   - Implement environment-based API configuration.
   - Refactor data fetching to use TanStack Query.
   - Add URL-synced search/filter state.
   - Extract shared components and fix color usage.
   - Add path aliases and update imports.

Tell me which changes you want applied first.
