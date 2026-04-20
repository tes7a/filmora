## Working Agreements

### Workflow & quality gates (TypeScript / React / Vite)

- These instructions apply to the `apps/admin` frontend workspace built with `Vite`, `React`, `TypeScript`, `refine`, and `pnpm`.
- After modifying any TypeScript source file under `src/**/*.ts` or `src/**/*.tsx`, always run:
  - `pnpm run type-check`
  - `pnpm run lint`
  - `pnpm run lint:fix`
- When formatting is needed, use:
  - `pnpm run format`
- For CI, pre-PR verification, or explicit formatting validation, use:
  - `pnpm run format:check`
- Before pushing changes that affect bundling, app bootstrapping, route wiring, aliases, or Vite configuration, also run:
  - `pnpm run build`

### Dependency & tooling conventions

- Prefer `pnpm` for installing dependencies.
- Ask for confirmation before adding any new production dependency to `dependencies`.
- Prefer adding development-only tools to `devDependencies`.
- Reuse the workspace and monorepo tooling already present:
  - local app scripts in `apps/admin/package.json`
  - shared ESLint config from `@repo/eslint-config`
  - shared TypeScript config from `@repo/typescript-config`
- Do not introduce a second parallel tooling stack inside `apps/admin` if the monorepo already provides one.

### Architecture principles (Frontend / Atomic)

- The admin frontend should follow a pragmatic atomic architecture, adapted to the existing project rather than enforced mechanically.
- Keep the dependency direction simple and predictable:
  - `app -> pages -> widgets -> features -> entities -> shared`
- Use these boundaries:
  - `src/app`:
    application bootstrap, router composition, refine wiring, global providers.
  - `src/pages`:
    route-level page composition only; pages should assemble widgets/features, not contain infrastructure logic.
  - `src/widgets`:
    large UI sections composed from features/entities for a single screen area.
  - `src/features`:
    user actions and interaction flows such as filters, forms, moderation actions, CRUD controls.
  - `src/entities`:
    resource-specific presentation and mapping for core domain objects such as films, persons, tags, genres, complaints.
  - `src/components/ui`:
    reusable UI primitives only; no business knowledge or API calls.
  - `src/components/layout`:
    shell, navigation, page scaffolding, cross-page layout composition.
  - `src/providers`:
    refine providers, data providers, auth providers, router adapters, external integrations.
  - `src/lib`:
    shared utilities, helpers, configuration, adapters, formatting helpers, and low-level reusable logic.

### Practical frontend rules

- Keep route and page files thin.
- Do not place fetch logic, data transformation, UI state orchestration, and rendering concerns into a single file when they can be separated cleanly.
- `refine` integration should stay close to `src/providers` and app wiring, not leak into generic UI primitives.
- Shared UI primitives must remain framework-facing, not domain-facing.
- If resource-specific logic starts to grow, move it out of generic pages into `entities` or `features`.
- Prefer explicit types for API contracts, table rows, filters, and form payloads.
- Reuse existing helpers before creating parallel utilities.
- Consistency with the current admin structure is more important than forcing a textbook atomic decomposition too early.

### Code review / analysis expectations

When preparing a review, always:

- run `git diff`;
- inspect committed changes from the current branch with `git log --oneline --decorate -n 30`;
- use `git show` when additional detail is needed;
- analyze changes in the context of surrounding code, not in isolation.

Group findings by severity:

- `Critical`
- `High`
- `Medium`
- `Low`

The review must explicitly assess:

- `Architecture Alignment`:
  whether the change fits the current atomic boundaries, workspace layering, and refine/provider separation.
- `Code Quality`:
  readability, maintainability, naming, local complexity, duplication, API clarity.
- `Anti-patterns & Risks`:
  typing issues, SSR/CSR boundary mistakes, React state issues, data-flow leaks, performance risks, routing mistakes, and UI/infrastructure coupling.

Recommendations must be concrete and tied to specific files or modules.

### Handoff notes

At the end of a work session, prepare a short Markdown handoff summary including:

- `Decisions Made`
- `Changes Completed`
- `Blockers/Issues`
- `Pending Work`

The summary should be short, copy-pastable, and sufficient to continue work in a new session without rebuilding context.
