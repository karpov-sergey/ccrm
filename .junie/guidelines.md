# CCRM – Developer Guidelines

This document captures project-specific knowledge to help you build, test, and extend the app efficiently.

## 1) Build and Configuration

- Tooling
  - Runtime/toolchain: Node.js 20 LTS recommended (project uses ESM: "type": "module").
  - Bundler: Vite 7; Vue 3 + TypeScript; vue-tsc used for type checking at build time.
  - Styling: Tailwind CSS v4 with @tailwindcss/vite plugin and tailwind-merge.
  - State/UX libs: Pinia, @tanstack/vue-table, vee-validate + zod, vue-i18n, vue-router, vue-sonner, draggable libs.

- Install
  - npm ci (preferred for reproducible installs)

- Run
  - Dev server: npm run dev (Vite). Default port is printed on start.
  - Type-safe build: npm run build, which runs vue-tsc -b then vite build. If vue-tsc fails, the build will stop.
  - Preview production build locally: npm run preview

- Configuration files of interest
  - vite.config.ts: Vite + Vue plugin configuration.
  - tsconfig*.json: TS project references for app/node; vue-tsc relies on these.
  - components.json: Component registry/config used by UI scaffolding.
  - .eslintrc.cjs + Prettier: Code style integration; see Additional Development Information.

- Environment/Integrations
  - Supabase: @supabase/supabase-js is present. If you introduce runtime access, keep credentials in environment variables (e.g., VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) and access them via import.meta.env. Do not hardcode secrets.
  - i18n: Locale JSON files live under src/locales (e.g., en.json, pl.json). Make sure to provide keys for all supported locales.

## 2) Testing

There is no dedicated test runner configured in package.json at the time of writing (no vitest/jest scripts). The project’s build uses vue-tsc for type-checking and Vite for bundling, so the following forms of verification are currently practical without adding dependencies:

- Type checks: npm run build (runs vue-tsc -b). This will catch typing errors in .ts and .vue SFCs.
- Linting/formatting: npm run format for Prettier; ESLint is configured via .eslintrc.cjs (no dedicated npm script yet). You can run eslint directly if installed globally or add a script as needed.

Recommended minimal test setup (if you are allowed to add devDeps):
- Use Vitest + @vue/test-utils to test Vue SFCs.
- Example scripts to add in package.json:
  - "test": "vitest run",
  - "test:ui": "vitest",
  - "test:watch": "vitest --watch",
- Minimal configuration usually works out-of-the-box with Vite projects; add a vitest.config.ts if you need custom aliases to mirror Vite.

Temporary example test used during this documentation task:
- Given that no test framework is configured, we validated the project by running the type-check build locally. Steps:
  1) npm ci
  2) npm run build
  - Outcome: Successful type-check/build confirmed the repository compiles.
- If you later introduce Vitest, create a file like src/__tests__/smoke.test.ts with:
  - import { describe, it, expect } from 'vitest'
  - describe('smoke', () => { it('adds', () => { expect(1 + 1).toBe(2) }) })
  - Then run: npm run test

Guidelines for adding tests (once a runner exists):
- Unit tests
  - Co-locate under src/**/__tests__ or alongside components as *.test.ts.
  - For Vue SFCs, prefer shallow/mount from @vue/test-utils. Mock Pinia stores and network calls. Validate emitted events and rendered DOM based on props/state.
- Integration tests
  - Mount views with router/pinia providers. Use MSW (Mock Service Worker) or stubs for Supabase and API modules.
- Data-table patterns
  - For components using @tanstack/vue-table (e.g., DataTable.vue), assert row selection logic, column visibility, and custom cell renderers (phones/email links). Provide stable data-id attributes on interactive elements to make tests resilient.

## 3) Additional Development Information

- Code Style
  - ESLint extends: plugin:vue/vue3-recommended, eslint:recommended, @vue/eslint-config-typescript, @vue/eslint-config-prettier, prettier.
  - Prettier is enforced; end-of-line is auto-configured to avoid cross-OS diffs.
  - If you add an npm script for linting, use: "lint": "eslint --ext .ts,.vue src".

- TypeScript
  - Strictness driven by tsconfig; vue-tsc validates SFC types on build. Keep prop/emit types explicit for reusable components.
  - Prefer zod schemas alongside vee-validate for form constraints so both runtime and compile-time contracts stay in sync.

- Component patterns
  - UI atoms live under src/components/ui (e.g., button, table, link). Favor composition and slots.
  - DataTable.vue specifics:
    - Uses @tanstack/vue-table; row selection state is external; selection checkbox uses modelValue and an onToggle handler.
    - Special-case renderers:
      - phones column renders multiple tel: links with a PhoneOutgoing icon per number.
      - email column renders a mailto: link when value is not empty, using ExternalLink icon.
      - Other cells use a generic renderCell(cell) helper, so complex cells should implement display values there to keep templates succinct.
    - Empty state handled by TableEmpty with i18n key no_results_found and dynamic colspan calculation: table.getAllLeafColumns().length + 2 (selection + actions columns). When adding columns or changing selection/actions, ensure colspan stays correct.

- i18n
  - Keep en.json as the source of truth; update other locales consistently. Prefer t('key') in templates. Validate keys exist to avoid runtime fallbacks.

- API Layer
  - src/api/contacts/index.ts suggests modular API structure. Encapsulate Supabase/HTTP calls per domain. Always sanitize external input (dompurify is already a dependency) for any HTML content.

- Accessibility & UX
  - Link components wrap icons and text; ensure aria-labels are present when using only icons. Maintain keyboard focus styles.

- Performance
  - Use computed and memoized table models where possible. Avoid recreating function props on each render in hot paths.

- Debugging
  - Use Vite devtools and Vue Devtools for component state. For table issues, log table.getRowModel() snapshots. For i18n, log missing keys during development.

- Project Conventions
  - Keep components small and slot-driven. Use clsx/cva for variant styles. Follow folder by domain when adding features (views/, components/, api/, stores/ if introduced later).

## 4) Suggested Next Steps (for maintainers)

- Add Vitest + @vue/test-utils and an npm test script to formalize testing.
- Add an ESLint npm script and CI checks (type-check, lint, build, test).
- Define environment variable schema with zod to fail-fast on misconfiguration.
