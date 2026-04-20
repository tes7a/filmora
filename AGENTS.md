# AGENTS.md for `lakofinance_front`

## Scope

- These rules apply to both frontend applications in this repository: `apps/web` and `apps/admin`.
- They also apply when working in the `lakofinance_front` frontend context.
- Global linting and formatting defaults must be defined at the monorepo level and reused by both React apps.
- App-level overrides are allowed only when a framework-specific difference is required (for example, Next.js-specific rules in `apps/web`).

## Monorepo Lint/Format Policy

- ESLint must be shared through `packages/eslint-config` and consumed by both `apps/web` and `apps/admin`.
- Prettier must be shared through the root `.prettierrc` and root `.prettierignore`.
- Prefer global consistency first; use local exceptions only for real app-specific behavior.
- Do not create parallel ESLint/Prettier rule sets for `apps/web` and `apps/admin` unless there is a proven need.

## VS Code Workspace Policy

- VS Code defaults should be configured at repository root in `.vscode/settings.json`.
- Recommended extensions should be stored in `.vscode/extensions.json`.
- Debug/run presets should be stored in `.vscode/launch.json` and target monorepo scripts (`pnpm dev:web`, `pnpm dev:admin`, etc.).
- Per-app VS Code overrides should be added only when strictly necessary.

## General Working Rules

- All instructions in this file should be interpreted in the context of the current frontend project based on `Next.js`, `React`, `TypeScript`, and `pnpm`.
- If any TypeScript source file under `src/**/*.ts` or `src/**/*.tsx` is changed, always run the following after the change:
  - `pnpm run type-check`
  - `pnpm run lint`
  - `pnpm run lint:fix`
- Use `pnpm` as the default package manager for installing dependencies.
- Before adding any new production dependency to `dependencies`, ask for confirmation.
- Whenever possible, development-only tools should be added to `devDependencies`, not `dependencies`.
- Use `pnpm run format` for automatic formatting.
- Use `pnpm run format:check` in CI, before a PR, or whenever a dedicated formatting check is needed.

## Project Architecture Approach

- No artificial architectural principle should be enforced if it does not match the existing project structure. The base principle is to continue and strengthen the architectural style that already exists in the codebase.
- For `apps/web` and `apps/admin`, use an atomic architecture baseline for UI composition.

The current project structure suggests the following practical approach:

- `src/app`:
  routes, pages, layouts, route handlers, and App Router integration.
- `src/components/atoms`:
  smallest reusable UI units (buttons, labels, icons, inputs).
- `src/components/molecules`:
  combinations of atoms with small local behavior.
- `src/components/organisms`:
  larger composed blocks/sections used by pages and templates.
- `src/components/templates`:
  page-level composition templates without business logic.
- `src/components`:
  top-level folder for atomic UI layers and local presentation logic.
- `src/lib`:
  shared utilities, fetch wrappers, configuration, server helpers, integrations, and shared logic.
- `src/lib/api`:
  API modules, typed request functions, and endpoint-level integration.
- `src/lib/http`:
  HTTP client setup, interceptors, request/response normalization.
- `src/lib/clients`:
  external service client setup and adapters.
- `src/lib/config`:
  runtime/environment configuration and constants tied to infrastructure.
- `src/lib/utils`:
  framework-agnostic helpers and reusable utility functions.
- `src/lib/server`:
  server actions and code that must remain server-side.
- `src/store` and `src/redux`:
  client state, slices, selectors, and store wiring.
- `src/types`:
  shared types and data contracts.

When making changes, follow these boundaries:

- The HTTP layer and Next.js-specific code should remain thin.
- Route handlers and pages should not grow into a business-logic layer if the logic can be moved into `lib`, server helpers, actions, or dedicated modules.
- Shared API interaction logic should stay close to `src/lib/fetch` instead of being duplicated across pages and route handlers.
- API types, DTOs, and contracts should be explicit and reusable.
- UI components should not take on networking or infrastructure responsibilities without a clear reason.
- If the project already has a suitable helper, wrapper, slice, selector, utility, or type, prefer reusing it instead of creating a parallel implementation.

## Practical Architecture Guidelines

- Follow the existing separation between `app`, `components`, `lib`, `store/redux`, and `types`.
- When adding new logic, first determine whether it belongs to:
  - UI/presentation;
  - state management;
  - shared utility;
  - API/fetch integration;
  - server-only logic.
- Then place the code in the appropriate layer instead of the first convenient file.
- Do not mix UI, HTTP logic, data transformation, and side effects in a single module if they can be separated without unnecessary complexity.
- For repeatable API calls, prefer shared typed helpers and a consistent error-handling approach.
- Changes should align with how the project is currently organized, even if the architecture is not perfect yet. Consistency comes first, then targeted improvements.

## Expectations for Code Review / Analysis

When preparing a review of changes, always:

- run `git diff`;
- include committed changes from the current branch using `git log --oneline --decorate -n 30`;
- inspect details with `git show` when needed;
- analyze changed code in the context of the surrounding project code, not in isolation.

Group findings by severity:

- `Critical`
- `High`
- `Medium`
- `Low`

The review must explicitly assess:

- `Architecture Alignment`:
  how well the change fits the current layers, dependencies, and responsibility boundaries of the project.
- `Code Quality`:
  readability, maintainability, API clarity, duplication, naming, and local complexity.
- `Anti-patterns & Risks`:
  potential bugs, regressions, security issues, performance issues, SSR/CSR boundary problems, and typing/data handling issues.

Recommendations must be:

- specific;
- practical;
- tied to concrete files, modules, or code areas.

## Handoff Notes

At the end of a work session, prepare a short Markdown summary for handoff or seamless continuation.

Summary structure:

- `Decisions Made`:
  architectural and implementation decisions that were made.
- `Changes Completed`:
  completed changes, affected files, and finished work.
- `Blockers/Issues`:
  unresolved problems, limitations, unclear areas, or items that need clarification.
- `Pending Work`:
  remaining tasks and the next immediate steps.
