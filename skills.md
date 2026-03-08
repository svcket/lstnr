# Skills Registry

This document catalogs the available core skills that the AI agent can execute. All skills here adhere to the 3-layer architecture defined in `AGENTS.md`.

## Available Skills

### 1. Supabase Type Generation

- **Intent Trigger**: When the database schema changes via a new migration phase and the local `src/types/supabase.ts` file needs to reflect those changes.
- **Directive**: `directives/generate_supabase_types.md`
- **Execution**: `python execution/run_generate_supabase_types.py`

### 2. LSTNR Component Scaffolder

- **Intent Trigger**: When the user asks to "create a new component", "build a UI element", or start a new screen requiring a standardized boilerplate that adheres to `theme.ts`.
- **Directive**: `directives/create_lstnr_component.md`
- **Execution**: `python execution/run_create_lstnr_component.py {ComponentName} --dir {src_path}`

### 3. Code Health Check

- **Intent Trigger**: When finalizing a feature, before pushing code, or when verifying the repo has zero outstanding TypeScript or test errors. Can be invoked if user asks for a "sanity check".
- **Directive**: `directives/run_health_check.md`
- **Execution**: `python execution/run_health_check.py`

### 4. UI & Design System Architect

- **Intent Trigger**: User asks to build, modify, or style UI components (buttons, layouts, cards).
- **Directive**: `directives/lstnr_ui_architect.md`
- **Execution**: `python execution/verify_ui_theme.py {path_to_tsx_file}`
- **Responsibilities**: Mobile-responsiveness, pixel-perfect adherence to LSTNR's theme, generic components.

### 5. AI Response Engine Specialist

- **Intent Trigger**: User wants to modify how AI generative blocks are structured, mapped, or displayed (e.g., specific JSON schema patterns).
- **Directive**: `directives/lstnr_response_engine.md`
- **Execution**: `python execution/verify_json_schema.py {path_to_json_mock}`
- **Responsibilities**: AI parsing, structured JSON mappings, fallbacks for missing data, valid Zod definitions.

### 6. State & Architecture Orchestrator

- **Intent Trigger**: Complex state requirements, global state flows across components, or routing interactions.
- **Directive**: `directives/lstnr_state_orchestrator.md`
- **Execution**: `python execution/test_zustand_store.py {path_to_store_ts}`
- **Responsibilities**: Zustand stores, side-effects, safe async cleanups, React Navigation flows, avoiding stale closures.

### 7. Verification & QA Specialist

- **Intent Trigger**: Needs to fix type errors, fix lint errors, or maintain testing pipelines.
- **Directive**: `directives/lstnr_qa_specialist.md`
- **Execution**: `python execution/run_health_check.py`
- **Responsibilities**: TypeScript strictness, ESLint, Jest unit/component tests, Playwright/Detox E2E integration.

### 8. Core Data & API Architect

- **Intent Trigger**: Building backend queries, designing database schemas, or writing Supabase migrations.
- **Directive**: `directives/lstnr_data_architect.md`
- **Execution**: `python execution/validate_sql_migration.py {path_to_sql_file}`
- **Responsibilities**: Database schemas (Supabase), structured SQL logic, RLS table contracts, idempotent server migrations.

### 9. DevOps & Security Guardian

- **Intent Trigger**: Dealing with Auth (RLS policies), deployment configurations, or secure environments (Vercel/EAS).
- **Directive**: `directives/lstnr_devops_security.md`
- **Execution**: `python execution/audit_security_rules.py`
- **Responsibilities**: Row Level Security validation, .env key presence, deployment proxies, overall security posture.

---

## Skill Architecture Reminder

- **Layer 1: Directives**: Instruction sets located in `directives/*.md`
- **Layer 2: Orchestration**: LLM logic triggered by user intent, determining which directive and script to use.
- **Layer 3: Execution**: Deterministic logic located in `execution/*.py`

When a new skill is added, ensure to document its **Intent Trigger**, **Directive**, and **Execution Scripts** here.
