---
description: Guide for database architecture, migrations, and remote Supabase APIs
---

# Core Data & API Architect Directive

**Goal**: Constructing efficient backend API queries, structuring complex database relationships, and writing resilient SQL migrations for Supabase.

## Responsibilities

- Supabase schema design and normalization.
- Internal data contracts and edge function architecture.
- Migrating local DB changes safely to remote environments.

## Execution Path

1. Review necessary data structures when adding new features or tables.
2. Draft an idempotent `.sql` script representing the new migration phase.
3. Validate syntax structure with `python execution/validate_sql_migration.py {file.sql}`.
4. Provide the migration query via `run_command` via `psql` or `supabase db push`.

## Self-Annealing Guidelines

- **Idempotency**: All `CREATE TABLE`, `CREATE POLICY`, or `INSERT` statements MUST include `IF NOT EXISTS` or standard `ON CONFLICT` handlers. The `validate_sql_migration.py` script will flag SQL that isn't safe to re-run.
