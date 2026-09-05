# Klipday — Agent Guidelines

## Documentation Rule (Context7)

Whenever installing a new library/package, upgrading an existing one, or writing code that depends on a library's API, you MUST consult the
latest official documentation via **Context7** before writing any code:

1. Resolve the library's Context7 ID first (`mcp__context7__resolve-library-id`), using the official library name.
2. Query the docs (`mcp__context7__query-docs`) for the specific feature/API you are about to use.
3. Write code against what the current docs say — do not rely on memory or outdated examples.

This applies to any action that requires documentation: new installs, version bumps, unfamiliar APIs, or configuration changes for existing
dependencies.

## Project Structure

Both backend (`backend/src`) and frontend (`frontend/src`) are organized by **feature modules**, not by technical layer:

### Backend Structure

- `src/features/<feature>/` — one folder per feature (e.g. `authentication`, `health`). Everything belonging to a feature lives in its
  folder: routes (`auth.routes.ts`), handlers (`auth.handler.ts`), helpers, validators, etc. Do not create top-level `routes/`,
  `controllers/`, or `services/` folders.
- `src/middleware/` — all middleware, both shared cross-feature (e.g. the centralized `ErrorHandler`) and feature-oriented (e.g.
  `auth.middleware.ts`).
- `src/rate-limiter/` — rate limiters (e.g. `auth.rate-limiter.ts`).
- `src/utils/` — shared utilities (e.g. `api-response.ts`).
- `src/app.ts` wires feature routers into the app; `src/index.ts` starts the server.

### Frontend Structure

- `src/features/<feature>/` — one folder per feature (e.g. `authentication`, `dashboard`, `home`). Everything belonging to a feature lives
  in its folder: `components/`, `hooks/`, `layouts/`, `pages/`, `schemas/`, `utils/`, `api.ts`, and `types.ts`.
- **Do not create top-level `pages/` or `layouts/` folders** in frontend — pages and layouts belong strictly to their feature modules.
- `src/components/ui/` — shared design system primitives from shadcn/ui.
- `src/lib/` — shared client utilities and instances (e.g. `api-client.ts`, `utils.ts`).
- `src/App.tsx` configures routes importing from feature pages and layouts.

## Frontend UI (shadcn)

The frontend uses **shadcn/ui**. For UI consistency, always use the shadcn component from `frontend/src/components/ui/` when one exists for
the element you need (button, input, dialog, etc.) — do not hand-roll custom UI elements or use raw HTML elements with ad-hoc styling
instead. If a needed component does not exist yet, add it via the shadcn CLI rather than building a one-off version.

## Frontend Components (Single Responsibility)

- Every component must follow the **single responsibility principle**: one component does one job. Keep components small and focused — if a
  component grows large or handles multiple concerns, split it into smaller components.
- **Pages and layouts are orchestrators**: they compose components and wire them together (routing, data flow, placement). They must not
  contain detailed UI implementation or complex logic — that belongs in the components they orchestrate.

## Code Style

- **Function names use PascalCase** (e.g. `SendError`, `CreateApp`, `GetCampaignById`). This applies to declared functions and arrow
  functions assigned to variables. Non-function values (router instances, config objects, plain constants) stay in camelCase (e.g.
  `healthRouter`).
- **Every function must have a JSDoc comment** describing what it does, its `@param`s, and its `@returns` where applicable.
- All API responses must use the shared helpers (`SendSuccess` / `SendError` in `backend/src/utils/api-response.ts`) so every response has
  the shape `{ status, data, message }`. Never call `res.json(...)` directly in route handlers.
- Prefer simple, readable code over clever or complex code. Use clear, descriptive names; keep logic flat and easy to follow.
- **Store function results in variables first**: do not call a function inline inside an object literal (e.g.
  `data: BuildCampaignEditFields(input)`); assign the result to a named variable, then reference it.
- Only add comments that explain _why_, and only where the code is non-obvious or tricky. Do not narrate what the code already says.

## Fast-Fail & Single-Query Guards

- **Always return fast** in API handlers: fail with an early `return` the moment a check fails — never defer rejection into nested
  conditionals.
- Resolve permission boundaries before any other work, in this guard order: auth (401) → role from the JWT (403, no DB hit) → ownership
  (404) → body validation (400) → the write.
- Combine "record exists AND belongs to the requester" into a single Prisma query using a relation filter in `where` (e.g.
  `findFirst({ where: { id, brand: { accountId: account.sub } } })`) instead of separate lookups and in-code comparisons. `account.sub` is
  the account id — compare it against `brand.accountId` via the relation filter, never against `campaign.brandId` directly.
- Return a 404 "not found" for ownership mismatches so record existence is never leaked.

## Prisma Conventions

- **Every Prisma query whose `where` targets a model with the soft-delete `Status` enum** (`Account`, `Brand`, `Creator`, `Campaign`,
  `CampaignMaterial`) **must filter `status: ACTIVE`** so soft-deleted rows are never returned. When a unique lookup needs an extra
  non-unique filter, use `findFirst` instead of `findUnique`.
- On `Campaign`, `status` is the soft-delete `Status` enum (`ACTIVE` / `DELETED`), while `campaignStatus` is the lifecycle enum
  (`CampaignStatus`: `DRAFT`, `IN_REVIEW`, `REVISION`, `REJECTED`, `ACTIVE`, `FINISHED`).
- The register handler maps Prisma error **P2002** to a 409 `Email is already registered` (a soft-deleted account still holds its email via
  the unique index).

## Lessons Learned & Query Helper Patterns

- **Extract step query builders**: Each creation wizard step targeting related models (e.g. `CampaignMaterial`, `CampaignBrief`) must
  encapsulate its query logic in a dedicated helper function (e.g. `BuildCampaignMaterialsUpdate`, `BuildCampaignBriefUpsert`). The
  orchestrating `BuildCampaignEditFields` function simply dispatches to them.
- **Avoid repetitive `if` blocks in relational upserts**: When constructing `create` and `update` payloads for nested relations with shared
  properties, define `createData` and loop over its entries with `SetField` to populate `updateData` for defined values, rather than writing
  repetitive manual `if` checks for each field.
- **Match schema names directly**: Keep request payload properties and Zod validation schemas aligned directly with Prisma model field names
  (e.g. `callToAction` instead of shorthand aliases like `cta`) to eliminate unnecessary normalization layers.
- **Always store query objects in variables before return**: Assign query and upsert objects to a named variable (`const upsert: ...`,
  `const materialsQuery: ...`) before returning or passing them into parent queries.

## Lessons Learned & Frontend Patterns

- **No defensive callback checks for guaranteed props**: Avoid adding unnecessary existence checks
  (`onToggle ? <Button onClick={onToggle}> : null`) for callback props that are always provided by parent orchestrators. Make standard
  callbacks required on component prop interfaces and only branch on actual UI state flags (e.g. `isCollapsed`, `isDrawer`).
- **Centralize API error extraction**: Use `ExtractApiError` from `@/lib/api-client` to decode `{ message }` responses from the backend,
  falling back to Axios network errors, then localized defaults. Never duplicate repetitive `if (axios.isAxiosError)` blocks across feature
  API files.
- **Pure types vs. schema-derived types**: Keep `types.ts` strictly for pure compile-time TypeScript contracts (DTOs, domain interfaces, API
  responses) with zero runtime footprint. Colocate derived types (`z.infer`, `as const` indexed access tuples like
  `(typeof OPTIONS)[number]`) with their runtime schemas or arrays, and re-export them in `types.ts` if a unified import entry point is
  desired.
- **Cache invalidation vs. cache clearing**: Use `queryClient.invalidateQueries` after mutations (login, create, update) to mark specific
  query keys as stale and trigger immediate active background refetches without UI flicker. Use `queryClient.clear()` strictly upon logout
  to purge all cached data and tenant state from browser memory.
- **Colocate component prop interfaces in `types.ts`**: Extract all component and subcomponent prop interfaces (e.g.
  `MaterialFieldGroupProps`, `BasicInfoFormProps`) into the feature module's `types.ts` file rather than defining them locally inside
  component files. This keeps component files focused strictly on UI implementation, maintains clean single-source type exports, and avoids
  circular dependency hazards.
- **Extract form defaults and data mappers to feature `utils/`**: Functions responsible for extracting, mapping, and transforming entity
  data into form default values (e.g. `GetInitialMaterials`) must be placed in the feature's `utils/` directory rather than declared inside
  form component files. This keeps form components focused strictly on rendering and user interaction, while making data extraction and
  transformation logic unit-testable and reusable.
- **Radix `Slot` / `asChild` styling gotcha**: Never pass dynamic functions into `className` (e.g. `className={({ isActive }) => ...}`) on
  components passed into Radix primitives using `asChild` (e.g. `TooltipTrigger asChild` with `Link`). Radix's `SlotClone` serializes the
  function code into the DOM `class` attribute as a string, breaking styles. Instead, precalculate active states with `useLocation()` and
  pass static strings.

## General Rules

- Keep changes minimal and scoped to the task; no speculative abstractions or opportunistic refactors.
- Match the existing code style, naming, and patterns of the file/module you are editing.
- Do not commit, push, or perform other git mutations unless the user explicitly asks.
- Verify changes before reporting completion: run the relevant build/tests/checks and look at the results.
- Product requirements live in `PRD.md` — keep code aligned with it, and update the PRD if scope decisions change.
