---
description: Generate TypeScript definitions from Supabase schema
---

# Supabase Type Generation Directive

**Goal**: Automatically generate TypeScript types from the LSTNR Supabase database so the React Native frontend is perfectly synced with the backend schema.

## Inputs

- (Optional) `project_id`: The Supabase project reference ID if running against a remote database. If left blank, it assumes local generation via the `supabase` directory.

## Execution Path

1. Run `execution/run_generate_supabase_types.py`
2. The script will attempt to run `npx supabase gen types typescript --local > src/types/supabase.ts`.
3. If it fails because the local db is not running, it will prompt for OR use the provided `project_id` to run `npx supabase gen types typescript --project-id {project_id} > src/types/supabase.ts`.
4. It will verify the file was created or updated.

## Outputs

- Updated `src/types/supabase.ts` file containing the latest schema types.

## Self-Annealing Guidelines

- **Missing CLI**: If `supabase` CLI is not found via `npx`, install it globally or add it to devDependencies.
- **Port Conflicts**: If the local database is down, the script will throw a specific connection error. Instruct the user to run `npx supabase start` or provide a remote `project_id`. Follow up by running it again.
