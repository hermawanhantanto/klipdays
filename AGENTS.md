# Klipday — Agent Guidelines

## Documentation Rule (Context7)

Whenever installing a new library/package, upgrading an existing one, or writing code that depends on a library's API, you MUST consult the latest official documentation via **Context7** before writing any code:

1. Resolve the library's Context7 ID first (`mcp__context7__resolve-library-id`), using the official library name.
2. Query the docs (`mcp__context7__query-docs`) for the specific feature/API you are about to use.
3. Write code against what the current docs say — do not rely on memory or outdated examples.

This applies to any action that requires documentation: new installs, version bumps, unfamiliar APIs, or configuration changes for existing dependencies.

## Project Structure

The backend (`backend/src`) is organized by **feature modules**, not by technical layer:

- `src/features/<feature>/` — one folder per feature (e.g. `authentication`, `health`). Everything belonging to a feature lives in its folder: routes (`auth.routes.ts`), handlers (`auth.handler.ts`), helpers, validators, feature-specific middleware (e.g. `auth.rate-limiter.ts`), etc. Do not create top-level `routes/`, `controllers/`, or `services/` folders.
- `src/middleware/` — shared, cross-feature middleware only (e.g. the centralized `ErrorHandler`).
- `src/utils/` — shared utilities (e.g. `api-response.ts`).
- `src/app.ts` wires feature routers into the app; `src/index.ts` starts the server.

## Frontend UI (shadcn)

The frontend uses **shadcn/ui**. For UI consistency, always use the shadcn component from `frontend/src/components/ui/` when one exists for the element you need (button, input, dialog, etc.) — do not hand-roll custom UI elements or use raw HTML elements with ad-hoc styling instead. If a needed component does not exist yet, add it via the shadcn CLI rather than building a one-off version.

## Frontend Components (Single Responsibility)

- Every component must follow the **single responsibility principle**: one component does one job. Keep components small and focused — if a component grows large or handles multiple concerns, split it into smaller components.
- **Pages and layouts are orchestrators**: they compose components and wire them together (routing, data flow, placement). They must not contain detailed UI implementation or complex logic — that belongs in the components they orchestrate.

## Code Style

- **Function names use PascalCase** (e.g. `SendError`, `CreateApp`, `GetCampaignById`). This applies to declared functions and arrow functions assigned to variables. Non-function values (router instances, config objects, plain constants) stay in camelCase (e.g. `healthRouter`).
- **Every function must have a JSDoc comment** describing what it does, its `@param`s, and its `@returns` where applicable.
- All API responses must use the shared helpers (`SendSuccess` / `SendError` in `backend/src/utils/api-response.ts`) so every response has the shape `{ status, data, message }`. Never call `res.json(...)` directly in route handlers.
- Prefer simple, readable code over clever or complex code. Use clear, descriptive names; keep logic flat and easy to follow.
- Only add comments that explain *why*, and only where the code is non-obvious or tricky. Do not narrate what the code already says.

## General Rules

- Keep changes minimal and scoped to the task; no speculative abstractions or opportunistic refactors.
- Match the existing code style, naming, and patterns of the file/module you are editing.
- Do not commit, push, or perform other git mutations unless the user explicitly asks.
- Verify changes before reporting completion: run the relevant build/tests/checks and look at the results.
- Product requirements live in `PRD.md` — keep code aligned with it, and update the PRD if scope decisions change.
